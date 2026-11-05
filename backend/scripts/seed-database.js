#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function makeSlug(text, fallbackId) {
  if (!text) return fallbackId;
  const translit = text
    .toLowerCase()
    .replace(/[а-яё]/g, char => {
      const map = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
        й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
        у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
        э: 'e', ю: 'yu', я: 'ya',
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return translit || fallbackId;
}

function parseArtists(credit, title) {
  const raw = [credit || ''];
  if (title) {
    const featMatch = String(title).match(/(?:\(|\[)\s*(?:feat\.?|ft\.?|with|при уч\.?)\s+([^)\]]+)(?:\)|\])/i);
    if (featMatch) raw.push(featMatch[1]);
  }
  const result = [];
  for (const chunk of raw) {
    const clean = String(chunk).replace(/(?:\(|\[)?(?:feat\.?|ft\.?|with)\s+/gi, ', ');
    const parts = clean.split(/[,&/×+]/);
    for (const p of parts) {
      const name = p.trim().replace(/^[@#]/, '').trim();
      if (name.length >= 2 && !result.some(r => r.toLowerCase() === name.toLowerCase())) {
        result.push(name);
      }
    }
  }
  return result.length > 0 ? result : [String(credit).trim()];
}

async function ensureArtist(artistName, avatarUrl) {
  const name = (artistName || 'Исполнитель').trim();
  if (!name || name.toLowerCase() === 'исполнитель') return null;

  const slug = makeSlug(name, `art-${Date.now()}`);

  const existing = await prisma.artist.findFirst({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { slug: slug },
      ],
    },
  });
  if (existing) return existing;

  try {
    return await prisma.artist.create({
      data: {
        name,
        slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
        avatar: avatarUrl || '/covers/placeholder.jpg',
      },
    });
  } catch {
    return prisma.artist.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }
}

async function ensureArtistsForCredit(credit, title, avatarUrl) {
  const names = parseArtists(credit, title);
  const artistList = [];
  for (const n of names) {
    const a = await ensureArtist(n, avatarUrl);
    if (a) artistList.push(a);
  }
  return artistList;
}

async function main() {
  console.log('🔄 Синхронизация каталога и артистов в базу данных PostgreSQL...');

  const rootDir = path.resolve(__dirname, '..');
  const customAlbumsPath = path.join(rootDir, 'custom_albums.json');
  const customTracksPath = path.join(rootDir, 'custom_tracks.json');
  const sceneAlbumsPath = path.join(rootDir, 'scene_albums.json');
  const sceneTracksPath = path.join(rootDir, 'scene_tracks.json');

  const customAlbums = fs.existsSync(customAlbumsPath) ? JSON.parse(fs.readFileSync(customAlbumsPath, 'utf8')) : [];
  const customTracks = fs.existsSync(customTracksPath) ? JSON.parse(fs.readFileSync(customTracksPath, 'utf8')) : [];
  const sceneAlbums = fs.existsSync(sceneAlbumsPath) ? JSON.parse(fs.readFileSync(sceneAlbumsPath, 'utf8')) : [];
  const sceneTracks = fs.existsSync(sceneTracksPath) ? JSON.parse(fs.readFileSync(sceneTracksPath, 'utf8')) : [];

  // 1. Объединяем альбомы
  const allAlbumsMap = new Map();
  for (const a of [...customAlbums, ...sceneAlbums]) {
    if (!a || !a.title || a.title.startsWith('Слот ')) continue;
    const key = a.id || a.title;
    if (!allAlbumsMap.has(key)) {
      allAlbumsMap.set(key, a);
    }
  }

  console.log(`📦 Найдено альбомов для сохранения: ${allAlbumsMap.size}`);

  let savedAlbumsCount = 0;
  let savedTracksCount = 0;

  for (const a of allAlbumsMap.values()) {
    const title = a.title.trim();
    const artistName = (a.artist || 'Исполнитель').trim();
    const cover = a.cover || '/covers/in-rainbows.jpg';
    const year = a.year || 2026;
    const id = a.id || `alb-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const albumArtists = await ensureArtistsForCredit(artistName, title, cover);
    const mainArtist = albumArtists[0];

    const slugBase = makeSlug(title, id);
    const slug = `${slugBase}-${id.slice(-6)}`;

    const albumRecord = await prisma.album.upsert({
      where: { id },
      create: {
        id,
        title,
        slug,
        artistDisplay: artistName,
        artistId: mainArtist ? mainArtist.id : null,
        cover,
        year,
        soundcloudUrl: a.soundcloudUrl || null,
        soundcloudPlaylistId: a.soundcloudPlaylistId || null,
      },
      update: {
        title,
        artistDisplay: artistName,
        artistId: mainArtist ? mainArtist.id : undefined,
        cover,
        year,
        soundcloudUrl: a.soundcloudUrl || undefined,
        soundcloudPlaylistId: a.soundcloudPlaylistId || undefined,
      },
    });

    savedAlbumsCount++;

    // Сохраняем треки альбома
    if (Array.isArray(a.tracks) && a.tracks.length > 0) {
      for (let i = 0; i < a.tracks.length; i++) {
        const trk = a.tracks[i];
        if (!trk || !trk.title) continue;
        const trkId = trk.id || `${id}-trk-${i + 1}`;
        const trkTitle = trk.title.trim();
        const trkArtist = (trk.artist || artistName).trim();
        const trkCover = trk.cover || cover;

        const trkArtists = await ensureArtistsForCredit(trkArtist, trkTitle, trkCover);

        await prisma.track.upsert({
          where: { id: trkId },
          create: {
            id: trkId,
            title: trkTitle,
            albumTitle: title,
            albumId: albumRecord.id,
            artistDisplay: trkArtist,
            cover: trkCover,
            duration: trk.duration || '3:30',
            soundcloudUrl: trk.soundcloudUrl || null,
            soundcloudTrackId: trk.soundcloudTrackId ? String(trk.soundcloudTrackId) : null,
            artists: trkArtists.length > 0 ? {
              connect: trkArtists.map(art => ({ id: art.id })),
            } : undefined,
          },
          update: {
            title: trkTitle,
            albumTitle: title,
            albumId: albumRecord.id,
            artistDisplay: trkArtist,
            cover: trkCover,
            duration: trk.duration || undefined,
            soundcloudUrl: trk.soundcloudUrl || undefined,
            soundcloudTrackId: trk.soundcloudTrackId ? String(trk.soundcloudTrackId) : undefined,
            artists: trkArtists.length > 0 ? {
              set: trkArtists.map(art => ({ id: art.id })),
            } : undefined,
          },
        });
        savedTracksCount++;
      }
    }
  }

  // 2. Объединяем отдельные треки (синглы и треки из колеса)
  const allTracksMap = new Map();
  for (const t of [...customTracks, ...sceneTracks]) {
    if (!t || !t.title || t.title.startsWith('Слот ')) continue;
    const key = t.id || t.title;
    if (!allTracksMap.has(key)) {
      allTracksMap.set(key, t);
    }
  }

  console.log(`🎵 Найдено отдельных синглов/треков: ${allTracksMap.size}`);

  for (const t of allTracksMap.values()) {
    const id = t.id || `trk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const title = t.title.trim();
    const artistName = (t.artist || 'Исполнитель').trim();
    const cover = t.cover || '/covers/in-rainbows.jpg';
    const albumTitle = t.albumTitle || 'Сингл';

    const trkArtists = await ensureArtistsForCredit(artistName, title, cover);

    await prisma.track.upsert({
      where: { id },
      create: {
        id,
        title,
        albumTitle,
        artistDisplay: artistName,
        cover,
        duration: t.duration || '3:30',
        audioUrl: t.audioUrl || null,
        soundcloudUrl: t.soundcloudUrl || null,
        soundcloudTrackId: t.soundcloudTrackId ? String(t.soundcloudTrackId) : null,
        artists: trkArtists.length > 0 ? {
          connect: trkArtists.map(art => ({ id: art.id })),
        } : undefined,
      },
      update: {
        title,
        albumTitle,
        artistDisplay: artistName,
        cover,
        duration: t.duration || undefined,
        audioUrl: t.audioUrl || undefined,
        soundcloudUrl: t.soundcloudUrl || undefined,
        soundcloudTrackId: t.soundcloudTrackId ? String(t.soundcloudTrackId) : undefined,
        artists: trkArtists.length > 0 ? {
          set: trkArtists.map(art => ({ id: art.id })),
        } : undefined,
      },
    });
    savedTracksCount++;
  }

  const finalAlbumsCount = await prisma.album.count();
  const finalTracksCount = await prisma.track.count();
  const finalArtistsCount = await prisma.artist.count();

  console.log('\n✅ База данных успешно синхронизирована:');
  console.log(`   - Альбомов в таблице Album: ${finalAlbumsCount}`);
  console.log(`   - Треков в таблице Track: ${finalTracksCount}`);
  console.log(`   - Артистов в таблице Artist: ${finalArtistsCount}`);
}

main()
  .catch(e => {
    console.error('❌ Ошибка заполнения базы:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
