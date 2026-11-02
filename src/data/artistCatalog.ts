import type { AlbumDefinition } from './albums'
import type { TrackDefinition } from './tracks'

export type ArtistCatalogEntry = {
  name?: string
  avatar?: string
  albums: AlbumDefinition[]
  tracks: TrackDefinition[]
}

// Verified Apple Music discography for every artist and collaborator in the catalogue.
export const artistCatalog: Record<string, ArtistCatalogEntry> = {
  "radiohead": {
    "name": "Radiohead",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b7/f2/5d/b7f25d91-4320-47c8-146a-6f84d5bc7e78/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "radiohead-alb-1111577743",
        "title": "A Moon Shaped Pool",
        "artist": "Radiohead",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b7/f2/5d/b7f25d91-4320-47c8-146a-6f84d5bc7e78/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/a-moon-shaped-pool/1111577743?uo=4"
      },
      {
        "id": "radiohead-alb-1097861387",
        "title": "OK Computer",
        "artist": "Radiohead",
        "year": 1997,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ok-computer/1097861387?uo=4"
      },
      {
        "id": "radiohead-alb-1109714933",
        "title": "In Rainbows",
        "artist": "Radiohead",
        "year": 2007,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dd/50/c7/dd50c790-99ac-d3d0-5ab8-e3891fb8fd52/634904032463.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/in-rainbows/1109714933?uo=4"
      },
      {
        "id": "radiohead-alb-1097862703",
        "title": "The Bends",
        "artist": "Radiohead",
        "year": 1995,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-bends/1097862703?uo=4"
      },
      {
        "id": "radiohead-alb-1097862870",
        "title": "Kid A",
        "artist": "Radiohead",
        "year": 2000,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/8e/13/bd8e1358-b367-a689-cb84-cebd0b067dc4/634904078263.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/kid-a/1097862870?uo=4"
      },
      {
        "id": "radiohead-alb-1097862062",
        "title": "Pablo Honey",
        "artist": "Radiohead",
        "year": 1993,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/78/a4/ec/78a4ec7b-c6d6-c9c8-441b-660486e56a89/634904077969.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/pablo-honey/1097862062?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "radiohead-trk-1097862231",
        "albumId": "radiohead-alb-1097862062",
        "title": "Creep",
        "albumTitle": "Pablo Honey",
        "artist": "Radiohead",
        "year": 1992,
        "duration": "3:59",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/78/a4/ec/78a4ec7b-c6d6-c9c8-441b-660486e56a89/634904077969.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/creep/1097862062?i=1097862231&uo=4"
      },
      {
        "id": "radiohead-trk-1097861836",
        "albumId": "radiohead-alb-1097861387",
        "title": "Karma Police",
        "albumTitle": "OK Computer",
        "artist": "Radiohead",
        "year": 1997,
        "duration": "4:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/karma-police/1097861387?i=1097861836&uo=4"
      },
      {
        "id": "radiohead-trk-1097862833",
        "albumId": "radiohead-alb-1097862703",
        "title": "High and Dry",
        "albumTitle": "The Bends",
        "artist": "Radiohead",
        "year": 1995,
        "duration": "4:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/high-and-dry/1097862703?i=1097862833&uo=4"
      },
      {
        "id": "radiohead-trk-1097862845",
        "albumId": "radiohead-alb-1097862703",
        "title": "Fake Plastic Trees",
        "albumTitle": "The Bends",
        "artist": "Radiohead",
        "year": 1995,
        "duration": "4:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1b/a9/5c/1ba95cac-b245-d386-63fb-6b857aa9dce8/634904078065.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/fake-plastic-trees/1097862703?i=1097862845&uo=4"
      },
      {
        "id": "radiohead-trk-1097863108",
        "albumId": "radiohead-alb-1097862870",
        "title": "Everything In Its Right Place",
        "albumTitle": "Kid A",
        "artist": "Radiohead",
        "year": 2000,
        "duration": "4:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/8e/13/bd8e1358-b367-a689-cb84-cebd0b067dc4/634904078263.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/everything-in-its-right-place/1097862870?i=1097863108&uo=4"
      },
      {
        "id": "radiohead-trk-1097861842",
        "albumId": "radiohead-alb-1097861387",
        "title": "No Surprises",
        "albumTitle": "OK Computer",
        "artist": "Radiohead",
        "year": 1997,
        "duration": "3:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/no-surprises/1097861387?i=1097861842&uo=4"
      },
      {
        "id": "radiohead-trk-1097861770",
        "albumId": "radiohead-alb-1097861387",
        "title": "Paranoid Android",
        "albumTitle": "OK Computer",
        "artist": "Radiohead",
        "year": 1997,
        "duration": "6:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/paranoid-android/1097861387?i=1097861770&uo=4"
      },
      {
        "id": "radiohead-trk-1110448421",
        "albumId": "radiohead-alb-1110448315",
        "title": "Burn the Witch",
        "albumTitle": "Burn the Witch",
        "artist": "Radiohead",
        "year": 2016,
        "duration": "3:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/e1/1b/87/e11b87d2-b763-65ad-6e2d-f83cd08c7cd7/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/burn-the-witch/1110448315?i=1110448421&uo=4"
      },
      {
        "id": "radiohead-trk-1097861833",
        "albumId": "radiohead-alb-1097861387",
        "title": "Exit Music (For a Film)",
        "albumTitle": "OK Computer",
        "artist": "Radiohead",
        "year": 1997,
        "duration": "4:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/07/60/ba/0760ba0f-148c-b18f-d0ff-169ee96f3af5/634904078164.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/exit-music-for-a-film/1097861387?i=1097861833&uo=4"
      },
      {
        "id": "radiohead-trk-1111577949",
        "albumId": "radiohead-alb-1111577743",
        "title": "Daydreaming",
        "albumTitle": "A Moon Shaped Pool",
        "artist": "Radiohead",
        "year": 2016,
        "duration": "6:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b7/f2/5d/b7f25d91-4320-47c8-146a-6f84d5bc7e78/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/daydreaming/1111577743?i=1111577949&uo=4"
      }
    ]
  },
  "daft-punk": {
    "name": "Daft Punk",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "daft-punk-alb-617154241",
        "title": "Random Access Memories",
        "artist": "Daft Punk",
        "year": 2013,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/random-access-memories/617154241?uo=4"
      },
      {
        "id": "daft-punk-alb-697194953",
        "title": "Discovery",
        "artist": "Daft Punk",
        "year": 2001,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/discovery/697194953?uo=4"
      },
      {
        "id": "daft-punk-alb-717067737",
        "title": "Alive 2007",
        "artist": "Daft Punk",
        "year": 2007,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/15/5f/b7155f62-f93a-2fe7-d98d-cc19240b4bd0/5099951165857_1500x1500_300dpi.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/alive-2007/717067737?uo=4"
      },
      {
        "id": "daft-punk-alb-696884422",
        "title": "Homework",
        "artist": "Daft Punk",
        "year": 1997,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/34/8d/c7/348dc71c-d75e-9baf-671a-994e9e74b018/dj.pimdxdmf.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/homework/696884422?uo=4"
      },
      {
        "id": "daft-punk-alb-693748807",
        "title": "Human After All",
        "artist": "Daft Punk",
        "year": 2005,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4e/03/13/4e03130f-918e-cbd2-e99f-26ed67480411/724386091956.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/human-after-all/693748807?uo=4"
      },
      {
        "id": "daft-punk-alb-1543824814",
        "title": "TRON: Legacy - The Complete Edition (Original Motion Picture Soundtrack)",
        "artist": "Daft Punk",
        "year": 2010,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ad/8c/1c/ad8c1cf2-e8d9-8bdd-13cc-7532736484a3/20UM1IM11916.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/tron-legacy-the-complete-edition-original-motion/1543824814?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "daft-punk-trk-697195462",
        "albumId": "daft-punk-alb-697194953",
        "title": "One More Time",
        "albumTitle": "Discovery",
        "artist": "Daft Punk",
        "year": 2000,
        "duration": "5:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/one-more-time/697194953?i=697195462&uo=4"
      },
      {
        "id": "daft-punk-trk-697195787",
        "albumId": "daft-punk-alb-697194953",
        "title": "Harder Better Faster Stronger",
        "albumTitle": "Discovery",
        "artist": "Daft Punk",
        "year": 2001,
        "duration": "3:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/harder-better-faster-stronger/697194953?i=697195787&uo=4"
      },
      {
        "id": "daft-punk-trk-696886431",
        "albumId": "daft-punk-alb-696884422",
        "title": "Around the World",
        "albumTitle": "Homework",
        "artist": "Daft Punk",
        "year": 1997,
        "duration": "7:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/34/8d/c7/348dc71c-d75e-9baf-671a-994e9e74b018/dj.pimdxdmf.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/around-the-world/696884422?i=696886431&uo=4"
      },
      {
        "id": "daft-punk-trk-617154353",
        "albumId": "daft-punk-alb-617154241",
        "title": "Give Life Back to Music",
        "albumTitle": "Random Access Memories",
        "artist": "Daft Punk",
        "year": 2013,
        "duration": "4:34",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/give-life-back-to-music/617154241?i=617154353&uo=4"
      },
      {
        "id": "daft-punk-trk-693751201",
        "albumId": "daft-punk-alb-693748807",
        "title": "Technologic",
        "albumTitle": "Human After All",
        "artist": "Daft Punk",
        "year": 2005,
        "duration": "4:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4e/03/13/4e03130f-918e-cbd2-e99f-26ed67480411/724386091956.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/technologic/693748807?i=693751201&uo=4"
      },
      {
        "id": "daft-punk-trk-696885792",
        "albumId": "daft-punk-alb-696884422",
        "title": "Da Funk",
        "albumTitle": "Homework",
        "artist": "Daft Punk",
        "year": 1995,
        "duration": "5:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/34/8d/c7/348dc71c-d75e-9baf-671a-994e9e74b018/dj.pimdxdmf.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/da-funk/696884422?i=696885792&uo=4"
      },
      {
        "id": "daft-punk-trk-697195633",
        "albumId": "daft-punk-alb-697194953",
        "title": "Digital Love",
        "albumTitle": "Discovery",
        "artist": "Daft Punk",
        "year": 2001,
        "duration": "5:01",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/digital-love/697194953?i=697195633&uo=4"
      },
      {
        "id": "daft-punk-trk-617154647",
        "albumId": "daft-punk-alb-617154241",
        "title": "Contact",
        "albumTitle": "Random Access Memories",
        "artist": "Daft Punk",
        "year": 2013,
        "duration": "6:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/contact/617154241?i=617154647&uo=4"
      },
      {
        "id": "daft-punk-trk-697195941",
        "albumId": "daft-punk-alb-697194953",
        "title": "Something About Us",
        "albumTitle": "Discovery",
        "artist": "Daft Punk",
        "year": 2001,
        "duration": "3:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fd/4a/77/fd4a77db-0ebc-d043-41a2-f32fa1bb0fb4/dj.qrikkdwj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/something-about-us/697194953?i=697195941&uo=4"
      },
      {
        "id": "daft-punk-trk-617154360",
        "albumId": "daft-punk-alb-617154241",
        "title": "Giorgio by Moroder",
        "albumTitle": "Random Access Memories",
        "artist": "Daft Punk",
        "year": 2013,
        "duration": "9:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e8/43/5f/e8435ffa-b6b9-b171-40ab-4ff3959ab661/886443919266.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/giorgio-by-moroder/617154241?i=617154360&uo=4"
      }
    ]
  },
  "frank-ocean": {
    "name": "Frank Ocean",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "frank-ocean-alb-1146195596",
        "title": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/blonde/1146195596?uo=4"
      },
      {
        "id": "frank-ocean-alb-1440765580",
        "title": "channel ORANGE",
        "artist": "Frank Ocean",
        "year": 2012,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/04/f8/63/04f863fc-2852-604f-c910-a97ac069506b/12UMGIM40339.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/channel-orange/1440765580?uo=4"
      },
      {
        "id": "frank-ocean-alb-1214557444",
        "title": "Chanel",
        "artist": "Frank Ocean",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/13/6f/8e/136f8eb7-34dd-fd32-d103-5528872026eb/spotify_single_art_V2.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/chanel-single/1214557444?uo=4"
      },
      {
        "id": "frank-ocean-alb-1225119790",
        "title": "Biking (feat. JAŸ-Z & Tyler, the Creator)",
        "artist": "Frank Ocean",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/be/fc/22/befc2240-6e5d-5b2c-ea51-d45d6839c9ea/dj.uguwmbno.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/biking-feat-ja%C3%BF-z-tyler-the-creator-single/1225119790?uo=4"
      },
      {
        "id": "frank-ocean-alb-1349524897",
        "title": "Moon River",
        "artist": "Frank Ocean",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/moon-river-single/1349524897?uo=4"
      },
      {
        "id": "frank-ocean-alb-1276055312",
        "title": "Provider",
        "artist": "Frank Ocean",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/35/e3/83/35e383f9-324f-2ce6-09ae-82f98dd3e33c/FOprovider2-1.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/provider-single/1276055312?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "frank-ocean-trk-1146195714",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "Pink + White",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "3:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/pink-white/1146195596?i=1146195714&uo=4"
      },
      {
        "id": "frank-ocean-trk-1214557446",
        "albumId": "frank-ocean-alb-1214557444",
        "title": "Chanel",
        "albumTitle": "Chanel",
        "artist": "Frank Ocean",
        "year": 2017,
        "duration": "3:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/13/6f/8e/136f8eb7-34dd-fd32-d103-5528872026eb/spotify_single_art_V2.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/chanel/1214557444?i=1214557446&uo=4"
      },
      {
        "id": "frank-ocean-trk-1146195713",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "Ivy",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "4:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ivy/1146195596?i=1146195713&uo=4"
      },
      {
        "id": "frank-ocean-trk-1146195720",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "Nights",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "5:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/nights/1146195596?i=1146195720&uo=4"
      },
      {
        "id": "frank-ocean-trk-1349524898",
        "albumId": "frank-ocean-alb-1349524897",
        "title": "Moon River",
        "albumTitle": "Moon River",
        "artist": "Frank Ocean",
        "year": 2018,
        "duration": "3:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/42/62/50/426250f9-7e39-f907-687c-442caa436636/dj.nhptxziz.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/moon-river/1349524897?i=1349524898&uo=4"
      },
      {
        "id": "frank-ocean-trk-1146195727",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "Godspeed",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "2:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/godspeed/1146195596?i=1146195727&uo=4"
      },
      {
        "id": "frank-ocean-trk-1440766784",
        "albumId": "frank-ocean-alb-1440765580",
        "title": "Lost",
        "albumTitle": "channel ORANGE",
        "artist": "Frank Ocean",
        "year": 2012,
        "duration": "3:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/04/f8/63/04f863fc-2852-604f-c910-a97ac069506b/12UMGIM40339.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/lost/1440765580?i=1440766784&uo=4"
      },
      {
        "id": "frank-ocean-trk-1225119941",
        "albumId": "frank-ocean-alb-1225119790",
        "title": "Biking (feat. JAŸ-Z & Tyler, the Creator)",
        "albumTitle": "Biking (feat. JAŸ-Z & Tyler, the Creator)",
        "artist": "Frank Ocean",
        "year": 2017,
        "duration": "4:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/be/fc/22/befc2240-6e5d-5b2c-ea51-d45d6839c9ea/dj.uguwmbno.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/biking-feat-ja%C3%BF-z-tyler-the-creator/1225119790?i=1225119941&uo=4"
      },
      {
        "id": "frank-ocean-trk-1146195725",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "White Ferrari",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "4:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/white-ferrari/1146195596?i=1146195725&uo=4"
      },
      {
        "id": "frank-ocean-trk-1146195718",
        "albumId": "frank-ocean-alb-1146195596",
        "title": "Self Control",
        "albumTitle": "Blonde",
        "artist": "Frank Ocean",
        "year": 2016,
        "duration": "4:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/45/68/bb4568f3-68cd-619d-fbcb-4e179916545d/BlondCover-Final.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/self-control/1146195596?i=1146195718&uo=4"
      }
    ]
  },
  "tyler-the-creator": {
    "name": "Tyler, The Creator",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "tyler-the-creator-alb-600946351",
        "title": "Wolf",
        "artist": "Tyler, The Creator",
        "year": 2013,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/wolf/600946351?uo=4"
      },
      {
        "id": "tyler-the-creator-alb-433409557",
        "title": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2011,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/goblin/433409557?uo=4"
      },
      {
        "id": "tyler-the-creator-alb-983056044",
        "title": "Cherry Bomb",
        "artist": "Tyler, The Creator",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ae/12/af/ae12aff6-912a-1c97-e5e7-db0f10ed4c52/886445172430.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/cherry-bomb/983056044?uo=4"
      },
      {
        "id": "tyler-the-creator-alb-1254572564",
        "title": "Flower Boy",
        "artist": "Tyler, The Creator",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/flower-boy/1254572564?uo=4"
      },
      {
        "id": "tyler-the-creator-alb-1463409338",
        "title": "IGOR",
        "artist": "Tyler, The Creator",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/0c/06/05/0c060581-6242-6a2a-a677-20170f2cf8da/886447710180.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/igor/1463409338?uo=4"
      },
      {
        "id": "tyler-the-creator-alb-1573484415",
        "title": "CALL ME IF YOU GET LOST",
        "artist": "Tyler, The Creator",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/65/47/0a/65470a4c-a70f-4a0b-f77b-3edb39e9097a/886449377039.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/call-me-if-you-get-lost/1573484415?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "tyler-the-creator-trk-433409590",
        "albumId": "tyler-the-creator-alb-433409557",
        "title": "Yonkers",
        "albumTitle": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2011,
        "duration": "4:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/yonkers/433409557?i=433409590&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-433409598",
        "albumId": "tyler-the-creator-alb-433409557",
        "title": "She (feat. Frank Ocean)",
        "albumTitle": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2011,
        "duration": "4:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/she-feat-frank-ocean/433409557?i=433409598&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-600946357",
        "albumId": "tyler-the-creator-alb-600946351",
        "title": "Domo23",
        "albumTitle": "Wolf",
        "artist": "Tyler, The Creator",
        "year": 2013,
        "duration": "2:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/domo23/600946351?i=600946357&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-600946363",
        "albumId": "tyler-the-creator-alb-600946351",
        "title": "IFHY (feat. Pharrell Williams)",
        "albumTitle": "Wolf",
        "artist": "Tyler, The Creator",
        "year": 2013,
        "duration": "5:19",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ifhy-feat-pharrell-williams/600946351?i=600946363&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-433409629",
        "albumId": "tyler-the-creator-alb-433409557",
        "title": "Sandwitches (feat. Hodgy Beats)",
        "albumTitle": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2010,
        "duration": "4:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/sandwitches-feat-hodgy-beats/433409557?i=433409629&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-433409623",
        "albumId": "tyler-the-creator-alb-433409557",
        "title": "Tron Cat",
        "albumTitle": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2011,
        "duration": "4:14",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/tron-cat/433409557?i=433409623&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-600947069",
        "albumId": "tyler-the-creator-alb-600946351",
        "title": "Tamale",
        "albumTitle": "Wolf",
        "artist": "Tyler, The Creator",
        "year": 2013,
        "duration": "2:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/tamale/600946351?i=600947069&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-433409588",
        "albumId": "tyler-the-creator-alb-433409557",
        "title": "Goblin",
        "albumTitle": "Goblin",
        "artist": "Tyler, The Creator",
        "year": 2011,
        "duration": "6:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/f2/c0/39/f2c039d6-a48b-e9ad-2c95-203269a47179/634904052980.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/goblin/433409557?i=433409588&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-1254572572",
        "albumId": "tyler-the-creator-alb-1254572564",
        "title": "See You Again (feat. Kali Uchis)",
        "albumTitle": "Flower Boy",
        "artist": "Tyler, The Creator",
        "year": 2017,
        "duration": "3:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/see-you-again-feat-kali-uchis/1254572564?i=1254572572&uo=4"
      },
      {
        "id": "tyler-the-creator-trk-600946353",
        "albumId": "tyler-the-creator-alb-600946351",
        "title": "Jamba (feat. Hodgy)",
        "albumTitle": "Wolf",
        "artist": "Tyler, The Creator",
        "year": 2013,
        "duration": "3:32",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/36/cb/4136cbae-f6aa-b1fc-5452-6f5e153f28a4/886443853874.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/jamba-feat-hodgy/600946351?i=600946353&uo=4"
      }
    ]
  },
  "lana-del-rey": {
    "name": "Lana Del Rey",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c6/5f/b9/c65fb9eb-da2f-89a9-b640-2fff1fc3a660/19UMGIM61350.rgb.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "lana-del-rey-alb-1474669063",
        "title": "Norman F*****g Rockwell!",
        "artist": "Lana Del Rey",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c6/5f/b9/c65fb9eb-da2f-89a9-b640-2fff1fc3a660/19UMGIM61350.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/norman-f-g-rockwell/1474669063?uo=4"
      },
      {
        "id": "lana-del-rey-alb-1545567745",
        "title": "Chemtrails Over the Country Club",
        "artist": "Lana Del Rey",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/74/79/c5/7479c518-a8ba-2054-b978-c87293194260/20UM1IM09851.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/chemtrails-over-the-country-club/1545567745?uo=4"
      },
      {
        "id": "lana-del-rey-alb-1440811595",
        "title": "Born to Die",
        "artist": "Lana Del Rey",
        "year": 2012,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/d9/63/5fd96387-45fa-6b94-afd8-7b2c4a24a93b/11UMGIM38959.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/born-to-die/1440811595?uo=4"
      },
      {
        "id": "lana-del-rey-alb-1655349115",
        "title": "Did you know that there's a tunnel under Ocean Blvd",
        "artist": "Lana Del Rey",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/7c/c4/e5/7cc4e501-6b09-b379-bb54-a40de4615aa3/22UM1IM33313.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/did-you-know-that-theres-a-tunnel-under-ocean-blvd/1655349115?uo=4"
      },
      {
        "id": "lana-del-rey-alb-1584675130",
        "title": "Blue Banisters",
        "artist": "Lana Del Rey",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d3/d5/34/d3d53432-fa6d-f397-d385-1d9a7cf92710/21UMGIM86965.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/blue-banisters/1584675130?uo=4"
      },
      {
        "id": "lana-del-rey-alb-1440818509",
        "title": "Ultraviolence (Deluxe)",
        "artist": "Lana Del Rey",
        "year": 2014,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/18/3f/ad/183fadf3-0d36-6db2-b733-d8f032654b07/14UMGIM20562.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ultraviolence-deluxe/1440818509?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "lana-del-rey-trk-1440812085",
        "albumId": "lana-del-rey-alb-1440811595",
        "title": "Summertime Sadness",
        "albumTitle": "Born to Die",
        "artist": "Lana Del Rey",
        "year": 2012,
        "duration": "4:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/d9/63/5fd96387-45fa-6b94-afd8-7b2c4a24a93b/11UMGIM38959.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/summertime-sadness/1440811595?i=1440812085&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1474669071",
        "albumId": "lana-del-rey-alb-1474669063",
        "title": "Doin' Time",
        "albumTitle": "Norman Fucking Rockwell!",
        "artist": "Lana Del Rey",
        "year": 2019,
        "duration": "3:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c6/5f/b9/c65fb9eb-da2f-89a9-b640-2fff1fc3a660/19UMGIM61350.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/doin-time/1474669063?i=1474669071&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1440857081",
        "albumId": "lana-del-rey-alb-1440856860",
        "title": "Young and Beautiful",
        "albumTitle": "The Great Gatsby (Music From Baz Luhrmann's Film)",
        "artist": "Lana Del Rey",
        "year": 2013,
        "duration": "3:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/e3/e3/13/e3e31393-abf5-e9b1-edc4-20ede35d0c75/13UMGIM43701.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/young-and-beautiful/1440856860?i=1440857081&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1440811817",
        "albumId": "lana-del-rey-alb-1440811595",
        "title": "Video Games",
        "albumTitle": "Born to Die",
        "artist": "Lana Del Rey",
        "year": 2011,
        "duration": "4:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/d9/63/5fd96387-45fa-6b94-afd8-7b2c4a24a93b/11UMGIM38959.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/video-games/1440811595?i=1440811817&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1475249155",
        "albumId": "lana-del-rey-alb-1475249132",
        "title": "Season of the Witch (From the Motion Picture \"Scary Stories to Tell in the Dark\")",
        "albumTitle": "Season of the Witch (From the Motion Picture \"Scary Stories to Tell in the Dark\")",
        "artist": "Lana Del Rey",
        "year": 2019,
        "duration": "4:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/d2/db/88/d2db88db-eef9-20f9-35b8-71cba39b4f42/19UMGIM71312.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/season-of-the-witch-from-the-motion-picture-scary/1475249132?i=1475249155&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1688315813",
        "albumId": "lana-del-rey-alb-1688315711",
        "title": "Say Yes To Heaven",
        "albumTitle": "Say Yes To Heaven",
        "artist": "Lana Del Rey",
        "year": 2023,
        "duration": "3:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b2/20/8e/b2208e82-df49-5897-139d-39f4cdbc91a9/23UMGIM48049.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/say-yes-to-heaven/1688315711?i=1688315813&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1440811832",
        "albumId": "lana-del-rey-alb-1440811595",
        "title": "Radio",
        "albumTitle": "Born to Die",
        "artist": "Lana Del Rey",
        "year": 2012,
        "duration": "3:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/d9/63/5fd96387-45fa-6b94-afd8-7b2c4a24a93b/11UMGIM38959.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/radio/1440811595?i=1440811832&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1443557799",
        "albumId": "lana-del-rey-alb-1443557332",
        "title": "Once Upon a Dream",
        "albumTitle": "Maleficent (Original Motion Picture Soundtrack)",
        "artist": "Lana Del Rey",
        "year": 2014,
        "duration": "3:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/bd/da/91/bdda915c-d81c-2a0e-14bd-001f8031290b/00050087309565.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/once-upon-a-dream/1443557332?i=1443557799&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1440833218",
        "albumId": "lana-del-rey-alb-1440832062",
        "title": "Young and Beautiful (DH Orchestral Version)",
        "albumTitle": "The Great Gatsby (Music from Baz Luhrmann's Film) [Deluxe Edition]",
        "artist": "Lana Del Rey",
        "year": 2013,
        "duration": "3:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/da/0d/0d/da0d0d4f-f947-d34d-d069-61f6b4824e3f/13UMGIM46510.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/young-and-beautiful-dh-orchestral-version/1440832062?i=1440833218&uo=4"
      },
      {
        "id": "lana-del-rey-trk-1474669074",
        "albumId": "lana-del-rey-alb-1474669063",
        "title": "Cinnamon Girl",
        "albumTitle": "Norman Fucking Rockwell!",
        "artist": "Lana Del Rey",
        "year": 2019,
        "duration": "5:01",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/c6/5f/b9/c65fb9eb-da2f-89a9-b640-2fff1fc3a660/19UMGIM61350.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/cinnamon-girl/1474669063?i=1474669074&uo=4"
      }
    ]
  },
  "tame-impala": {
    "name": "Tame Impala",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "tame-impala-alb-1440838039",
        "title": "Currents",
        "artist": "Tame Impala",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/currents/1440838039?uo=4"
      },
      {
        "id": "tame-impala-alb-1497230760",
        "title": "The Slow Rush",
        "artist": "Tame Impala",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-slow-rush/1497230760?uo=4"
      },
      {
        "id": "tame-impala-alb-1836226516",
        "title": "Deadbeat",
        "artist": "Tame Impala",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/80/54/11/80541122-c1c4-50ad-a673-ff79f4cf8aa7/196873555331.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/deadbeat/1836226516?uo=4"
      },
      {
        "id": "tame-impala-alb-1439752048",
        "title": "InnerSpeaker",
        "artist": "Tame Impala",
        "year": 2010,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/45/28/e2452872-ff3d-a53b-847e-72361827d428/00602577163883.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/innerspeaker/1439752048?uo=4"
      },
      {
        "id": "tame-impala-alb-1440875696",
        "title": "Currents B-Sides & Remixes",
        "artist": "Tame Impala",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/64/48/5c/64485cc9-968c-68cc-764e-9a7c71733def/00602567155454.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/currents-b-sides-remixes-ep/1440875696?uo=4"
      },
      {
        "id": "tame-impala-alb-1588852475",
        "title": "The Slow Rush B-Sides & Remixes",
        "artist": "Tame Impala",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/56/8e/78/568e7844-a0a3-8310-1339-11d1f838aaed/21UMGIM82347.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-slow-rush-b-sides-remixes/1588852475?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "tame-impala-trk-1440838488",
        "albumId": "tame-impala-alb-1440838039",
        "title": "The Less I Know the Better",
        "albumTitle": "Currents",
        "artist": "Tame Impala",
        "year": 2015,
        "duration": "3:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-less-i-know-the-better/1440838039?i=1440838488&uo=4"
      },
      {
        "id": "tame-impala-trk-1497230972",
        "albumId": "tame-impala-alb-1497230760",
        "title": "Borderline",
        "albumTitle": "The Slow Rush",
        "artist": "Tame Impala",
        "year": 2019,
        "duration": "3:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/borderline/1497230760?i=1497230972&uo=4"
      },
      {
        "id": "tame-impala-trk-1497231163",
        "albumId": "tame-impala-alb-1497230760",
        "title": "Lost in Yesterday",
        "albumTitle": "The Slow Rush",
        "artist": "Tame Impala",
        "year": 2020,
        "duration": "4:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/lost-in-yesterday/1497230760?i=1497231163&uo=4"
      },
      {
        "id": "tame-impala-trk-1874125269",
        "albumId": "tame-impala-alb-1874125260",
        "title": "Dracula (with JENNIE)",
        "albumTitle": "Dracula (with JENNIE)",
        "artist": "Tame Impala",
        "year": 2026,
        "duration": "3:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/af/3f/26/af3f2607-c541-a340-b028-7210634cf47b/196874054246.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/dracula-with-jennie/1874125260?i=1874125269&uo=4"
      },
      {
        "id": "tame-impala-trk-1836226730",
        "albumId": "tame-impala-alb-1836226516",
        "title": "Dracula",
        "albumTitle": "Deadbeat",
        "artist": "Tame Impala",
        "year": 2025,
        "duration": "3:25",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/80/54/11/80541122-c1c4-50ad-a673-ff79f4cf8aa7/196873555331.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/dracula/1836226516?i=1836226730&uo=4"
      },
      {
        "id": "tame-impala-trk-1440838060",
        "albumId": "tame-impala-alb-1440838039",
        "title": "Let It Happen",
        "albumTitle": "Currents",
        "artist": "Tame Impala",
        "year": 2015,
        "duration": "7:47",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/let-it-happen/1440838039?i=1440838060&uo=4"
      },
      {
        "id": "tame-impala-trk-1440838708",
        "albumId": "tame-impala-alb-1440838039",
        "title": "New Person, Same Old Mistakes",
        "albumTitle": "Currents",
        "artist": "Tame Impala",
        "year": 2015,
        "duration": "6:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a8/2e/b4/a82eb490-f30a-a321-461a-0383c88fec95/15UMGIM23316.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/new-person-same-old-mistakes/1440838039?i=1440838708&uo=4"
      },
      {
        "id": "tame-impala-trk-1457154574",
        "albumId": "tame-impala-alb-1457154570",
        "title": "Patience",
        "albumTitle": "Patience",
        "artist": "Tame Impala",
        "year": 2019,
        "duration": "4:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/19/f9/f7/19f9f75e-6d5f-15f5-6caa-c532acec9f47/19UMGIM27494.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/patience/1457154570?i=1457154574&uo=4"
      },
      {
        "id": "tame-impala-trk-1497231164",
        "albumId": "tame-impala-alb-1497230760",
        "title": "Is It True",
        "albumTitle": "The Slow Rush",
        "artist": "Tame Impala",
        "year": 2020,
        "duration": "3:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/is-it-true/1497230760?i=1497231164&uo=4"
      },
      {
        "id": "tame-impala-trk-1497231158",
        "albumId": "tame-impala-alb-1497230760",
        "title": "Breathe Deeper",
        "albumTitle": "The Slow Rush",
        "artist": "Tame Impala",
        "year": 2020,
        "duration": "6:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/65/e3/e7/65e3e740-b69f-f5cb-f2e6-7dedb5265ac9/19UMGIM96748.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/breathe-deeper/1497230760?i=1497231158&uo=4"
      }
    ]
  },
  "kendrick-lamar": {
    "name": "Kendrick Lamar",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/72/a1/a9/72a1a9a0-6c42-a37f-aad4-7e8772365c6d/22UMGIM52376.rgb.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "kendrick-lamar-alb-1623854804",
        "title": "Mr. Morale & The Big Steppers",
        "artist": "Kendrick Lamar",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/72/a1/a9/72a1a9a0-6c42-a37f-aad4-7e8772365c6d/22UMGIM52376.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/mr-morale-the-big-steppers/1623854804?uo=4"
      },
      {
        "id": "kendrick-lamar-alb-1781270319",
        "title": "GNX",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/c2/cc/50c2cc95-3658-9417-0d4b-831abde44ba1/24UM1IM28978.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/gnx/1781270319?uo=4"
      },
      {
        "id": "kendrick-lamar-alb-1440881047",
        "title": "DAMN.",
        "artist": "Kendrick Lamar",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/86/c9/bb/86c9bb30-fe3d-442e-33c1-c106c4d23705/17UMGIM88776.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/damn/1440881047?uo=4"
      },
      {
        "id": "kendrick-lamar-alb-1440828886",
        "title": "To Pimp a Butterfly",
        "artist": "Kendrick Lamar",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0d/ae/61/0dae6140-d4af-d0df-eae0-3c92eb392a33/15UMGIM11922.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/to-pimp-a-butterfly/1440828886?uo=4"
      },
      {
        "id": "kendrick-lamar-alb-1440818890",
        "title": "good kid, m.A.A.d city (Deluxe Version)",
        "artist": "Kendrick Lamar",
        "year": 2012,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ca/5b/c0/ca5bc0b3-d81d-cc6c-0d19-54b9eedb6dbd/12UMGIM52990.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/good-kid-m-a-a-d-city-deluxe-version/1440818890?uo=4"
      },
      {
        "id": "kendrick-lamar-alb-1440906927",
        "title": "Black Panther: The Album",
        "artist": "Kendrick Lamar",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0f/7c/f9/0f7cf9a6-651f-53ae-e374-6be14630bfae/18UMGIM00001.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/black-panther-the-album/1440906927?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "kendrick-lamar-trk-1744776167",
        "albumId": "kendrick-lamar-alb-1744776162",
        "title": "Not Like Us",
        "albumTitle": "Not Like Us",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "duration": "4:34",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/ef/b6/d0efb685-73be-fdee-58c9-be655f4cd4fd/24UMGIM51924.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/not-like-us/1744776162?i=1744776167&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1440881684",
        "albumId": "kendrick-lamar-alb-1440881047",
        "title": "HUMBLE.",
        "albumTitle": "DAMN.",
        "artist": "Kendrick Lamar",
        "year": 2017,
        "duration": "2:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/86/c9/bb/86c9bb30-fe3d-442e-33c1-c106c4d23705/17UMGIM88776.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/humble/1440881047?i=1440881684&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1781270323",
        "albumId": "kendrick-lamar-alb-1781270319",
        "title": "luther",
        "albumTitle": "GNX",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "duration": "2:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/c2/cc/50c2cc95-3658-9417-0d4b-831abde44ba1/24UM1IM28978.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/luther/1781270319?i=1781270323&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1440881708",
        "albumId": "kendrick-lamar-alb-1440881047",
        "title": "LOVE. (feat. Zacari)",
        "albumTitle": "DAMN.",
        "artist": "Kendrick Lamar",
        "year": 2017,
        "duration": "3:33",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/86/c9/bb/86c9bb30-fe3d-442e-33c1-c106c4d23705/17UMGIM88776.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/love-feat-zacari/1440881047?i=1440881708&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1781270321",
        "albumId": "kendrick-lamar-alb-1781270319",
        "title": "squabble up",
        "albumTitle": "GNX",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "duration": "2:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/c2/cc/50c2cc95-3658-9417-0d4b-831abde44ba1/24UM1IM28978.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/squabble-up/1781270319?i=1781270321&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1744024751",
        "albumId": "kendrick-lamar-alb-1744024729",
        "title": "euphoria",
        "albumTitle": "euphoria",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "duration": "6:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c5/f5/d8/c5f5d812-ee54-9534-1e4c-bd78877d87ad/24UMGIM50373.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/euphoria/1744024729?i=1744024751&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1781270540",
        "albumId": "kendrick-lamar-alb-1781270319",
        "title": "tv off (feat. Lefty Gunplay)",
        "albumTitle": "GNX",
        "artist": "Kendrick Lamar",
        "year": 2024,
        "duration": "3:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/c2/cc/50c2cc95-3658-9417-0d4b-831abde44ba1/24UM1IM28978.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/tv-off-feat-lefty-gunplay/1781270319?i=1781270540&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1440881357",
        "albumId": "kendrick-lamar-alb-1440881047",
        "title": "DNA.",
        "albumTitle": "DAMN.",
        "artist": "Kendrick Lamar",
        "year": 2017,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/86/c9/bb/86c9bb30-fe3d-442e-33c1-c106c4d23705/17UMGIM88776.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/dna/1440881047?i=1440881357&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1440818969",
        "albumId": "kendrick-lamar-alb-1440818890",
        "title": "Money Trees (feat. Jay Rock)",
        "albumTitle": "good kid, m.A.A.d city (Deluxe Version)",
        "artist": "Kendrick Lamar",
        "year": 2012,
        "duration": "6:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ca/5b/c0/ca5bc0b3-d81d-cc6c-0d19-54b9eedb6dbd/12UMGIM52990.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/money-trees-feat-jay-rock/1440818890?i=1440818969&uo=4"
      },
      {
        "id": "kendrick-lamar-trk-1440818977",
        "albumId": "kendrick-lamar-alb-1440818890",
        "title": "m.A.A.d city (feat. MC Eiht)",
        "albumTitle": "good kid, m.A.A.d city (Deluxe Version)",
        "artist": "Kendrick Lamar",
        "year": 2012,
        "duration": "5:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ca/5b/c0/ca5bc0b3-d81d-cc6c-0d19-54b9eedb6dbd/12UMGIM52990.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/m-a-a-d-city-feat-mc-eiht/1440818890?i=1440818977&uo=4"
      }
    ]
  },
  "massive-attack": {
    "name": "Massive Attack",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "massive-attack-alb-724466069",
        "title": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/mezzanine/724466069?uo=4"
      },
      {
        "id": "massive-attack-alb-715864097",
        "title": "Blue Lines (2012 Mix/Master)",
        "artist": "Massive Attack",
        "year": 1991,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e5/f7/c0/e5f7c07d-2182-e732-8ad6-be03814fe93c/13UABIM04453.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/blue-lines-2012-mix-master/715864097?uo=4"
      },
      {
        "id": "massive-attack-alb-1077820947",
        "title": "Ritual Spirit",
        "artist": "Massive Attack",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/5e/2e/3e5e2e67-7c27-4d18-a21d-a6e91ffb7398/5060454941873.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ritual-spirit-ep/1077820947?uo=4"
      },
      {
        "id": "massive-attack-alb-721294955",
        "title": "Heligoland",
        "artist": "Massive Attack",
        "year": 2010,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/13/89/ea/1389ea43-83fe-6cf2-59df-85216996d80b/05099960946652.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/heligoland/721294955?uo=4"
      },
      {
        "id": "massive-attack-alb-724410562",
        "title": "Protection",
        "artist": "Massive Attack",
        "year": 1994,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/db/2d/65/db2d6579-b267-7283-ee16-a618650ec8d1/00724383988358.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/protection/724410562?uo=4"
      },
      {
        "id": "massive-attack-alb-724338637",
        "title": "Collected (Deluxe Edition)",
        "artist": "Massive Attack",
        "year": 2006,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/5b/4a/83/5b4a833a-c8bd-7078-fb58-eaa6d9c4c97c/00094636006857.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/collected-deluxe-edition/724338637?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "massive-attack-trk-724466700",
        "albumId": "massive-attack-alb-724466069",
        "title": "Teardrop",
        "albumTitle": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "duration": "5:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/teardrop/724466069?i=724466700&uo=4"
      },
      {
        "id": "massive-attack-trk-724466660",
        "albumId": "massive-attack-alb-724466069",
        "title": "Angel",
        "albumTitle": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "duration": "6:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/angel/724466069?i=724466660&uo=4"
      },
      {
        "id": "massive-attack-trk-721294982",
        "albumId": "massive-attack-alb-721294955",
        "title": "Paradise Circus",
        "albumTitle": "Heligoland",
        "artist": "Massive Attack",
        "year": 2010,
        "duration": "4:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/13/89/ea/1389ea43-83fe-6cf2-59df-85216996d80b/05099960946652.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/paradise-circus/721294955?i=721294982&uo=4"
      },
      {
        "id": "massive-attack-trk-475329122",
        "albumId": "massive-attack-alb-475329117",
        "title": "Paradise Circus (Gui Boratto Remix)",
        "albumTitle": "Madrid Fashion Week",
        "artist": "Massive Attack",
        "year": 2011,
        "duration": "7:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/95/69/01/95690168-5db3-d041-56a1-e11a6abf86d8/mzi.nhpdquxy.tif/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/paradise-circus-gui-boratto-remix/475329117?i=475329122&uo=4"
      },
      {
        "id": "massive-attack-trk-724410734",
        "albumId": "massive-attack-alb-724410562",
        "title": "Protection",
        "albumTitle": "Protection",
        "artist": "Massive Attack",
        "year": 1994,
        "duration": "7:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/db/2d/65/db2d6579-b267-7283-ee16-a618650ec8d1/00724383988358.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/protection/724410562?i=724410734&uo=4"
      },
      {
        "id": "massive-attack-trk-715864380",
        "albumId": "massive-attack-alb-715864097",
        "title": "Unfinished Sympathy (feat. Shara Nelson) [2012 Mix/Master]",
        "albumTitle": "Blue Lines (2012 Mix/Master)",
        "artist": "Massive Attack",
        "year": 1991,
        "duration": "5:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e5/f7/c0/e5f7c07d-2182-e732-8ad6-be03814fe93c/13UABIM04453.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/unfinished-sympathy-feat-shara-nelson-2012-mix-master/715864097?i=715864380&uo=4"
      },
      {
        "id": "massive-attack-trk-724466943",
        "albumId": "massive-attack-alb-724466069",
        "title": "Dissolved Girl",
        "albumTitle": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "duration": "6:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/dissolved-girl/724466069?i=724466943&uo=4"
      },
      {
        "id": "massive-attack-trk-724467020",
        "albumId": "massive-attack-alb-724466069",
        "title": "Black Milk",
        "albumTitle": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "duration": "6:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/black-milk/724466069?i=724467020&uo=4"
      },
      {
        "id": "massive-attack-trk-724466834",
        "albumId": "massive-attack-alb-724466069",
        "title": "Inertia Creeps",
        "albumTitle": "Mezzanine",
        "artist": "Massive Attack",
        "year": 1998,
        "duration": "5:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0a/98/55/0a98555b-8d9d-3b46-660a-b91261557d17/00724384559953.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/inertia-creeps/724466069?i=724466834&uo=4"
      },
      {
        "id": "massive-attack-trk-1138300946",
        "albumId": "massive-attack-alb-1138300872",
        "title": "The Spoils (feat. Hope Sandoval)",
        "albumTitle": "The Spoils / Come Near Me",
        "artist": "Massive Attack",
        "year": 2016,
        "duration": "5:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/8b/85/bd8b85a4-1240-0ba4-dea5-6c7908e8a080/5060454945710.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-spoils-feat-hope-sandoval/1138300872?i=1138300946&uo=4"
      }
    ]
  },
  "portishead": {
    "name": "Portishead",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "portishead-alb-1440653096",
        "title": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/dummy/1440653096?uo=4"
      },
      {
        "id": "portishead-alb-1440933279",
        "title": "Portishead",
        "artist": "Portishead",
        "year": 1997,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/20/d1/97/20d1978c-e152-61a0-77cf-119397215d51/06UMGIM15814.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/portishead/1440933279?uo=4"
      },
      {
        "id": "portishead-alb-1440913466",
        "title": "Roseland, NYC Live",
        "artist": "Portishead",
        "year": 1998,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cb/07/1f/cb071fa3-27b0-78af-7ac6-dbe8fc98bf65/00731455942422.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/roseland-nyc-live/1440913466?uo=4"
      },
      {
        "id": "portishead-alb-1440633834",
        "title": "Third",
        "artist": "Portishead",
        "year": 2008,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a3/78/f5/a378f5c8-f3ee-d26d-3181-6cfe160c921b/08UMGIM06817.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/third/1440633834?uo=4"
      },
      {
        "id": "portishead-alb-1712706758",
        "title": "Roseland NYC Live 25 (Remastered 2023)",
        "artist": "Portishead",
        "year": 1998,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/d0/b2/1cd0b26b-0b36-ddb7-191b-1501a8f17930/23UM1IM22187.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/roseland-nyc-live-25-remastered-2023/1712706758?uo=4"
      },
      {
        "id": "portishead-alb-1626390930",
        "title": "Glory Box",
        "artist": "Portishead",
        "year": 1995,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/40/93/c2/4093c2e6-1e52-ac33-44aa-e99c4c0512f3/22UMGIM14463.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/glory-box-ep/1626390930?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "portishead-trk-1440653206",
        "albumId": "portishead-alb-1440653096",
        "title": "Glory Box",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "5:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/glory-box/1440653096?i=1440653206&uo=4"
      },
      {
        "id": "portishead-trk-1440653101",
        "albumId": "portishead-alb-1440653096",
        "title": "Sour Times",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "4:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/sour-times/1440653096?i=1440653101&uo=4"
      },
      {
        "id": "portishead-trk-372120506",
        "albumId": "portishead-alb-372120434",
        "title": "Chase the Tear",
        "albumTitle": "Chase the Tear",
        "artist": "Portishead",
        "year": 2010,
        "duration": "5:15",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3f/55/02/3f55024f-4840-0524-74a1-78a52ec5df2e/mzi.aqhigagn.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/chase-the-tear/372120434?i=372120506&uo=4"
      },
      {
        "id": "portishead-trk-1440653203",
        "albumId": "portishead-alb-1440653096",
        "title": "Roads",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "5:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/roads/1440653096?i=1440653203&uo=4"
      },
      {
        "id": "portishead-trk-1440653108",
        "albumId": "portishead-alb-1440653096",
        "title": "Wandering Star",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "4:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/wandering-star/1440653096?i=1440653108&uo=4"
      },
      {
        "id": "portishead-trk-1440933395",
        "albumId": "portishead-alb-1440933279",
        "title": "Only You",
        "albumTitle": "Portishead",
        "artist": "Portishead",
        "year": 1997,
        "duration": "5:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/20/d1/97/20d1978c-e152-61a0-77cf-119397215d51/06UMGIM15814.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/only-you/1440933279?i=1440933395&uo=4"
      },
      {
        "id": "portishead-trk-1440653098",
        "albumId": "portishead-alb-1440653096",
        "title": "Mysterons",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "5:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/mysterons/1440653096?i=1440653098&uo=4"
      },
      {
        "id": "portishead-trk-1440653107",
        "albumId": "portishead-alb-1440653096",
        "title": "It Could Be Sweet",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "4:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/it-could-be-sweet/1440653096?i=1440653107&uo=4"
      },
      {
        "id": "portishead-trk-1440633844",
        "albumId": "portishead-alb-1440633834",
        "title": "The Rip",
        "albumTitle": "Third",
        "artist": "Portishead",
        "year": 2008,
        "duration": "4:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a3/78/f5/a378f5c8-f3ee-d26d-3181-6cfe160c921b/08UMGIM06817.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-rip/1440633834?i=1440633844&uo=4"
      },
      {
        "id": "portishead-trk-1440653106",
        "albumId": "portishead-alb-1440653096",
        "title": "Strangers",
        "albumTitle": "Dummy",
        "artist": "Portishead",
        "year": 1994,
        "duration": "3:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c1/71/93/c1719342-df7d-e9c5-c87c-53dae5afb289/00042282855329.rgb.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/strangers/1440653096?i=1440653106&uo=4"
      }
    ]
  },
  "aphex-twin": {
    "name": "Aphex Twin",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d5/7f/6e/d57f6e8e-068c-ef83-2a62-663e47d3f002/Syro_digital_packshot_RGB_1400.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "aphex-twin-alb-911319255",
        "title": "Syro",
        "artist": "Aphex Twin",
        "year": 2014,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d5/7f/6e/d57f6e8e-068c-ef83-2a62-663e47d3f002/Syro_digital_packshot_RGB_1400.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/syro/911319255?uo=4"
      },
      {
        "id": "aphex-twin-alb-280649372",
        "title": "Selected Ambient Works, Vol. II",
        "artist": "Aphex Twin",
        "year": 1994,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b4/59/cd/b459cd17-d4cb-6810-074f-2eef4f292430/mzi.obgacqgc.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/selected-ambient-works-vol-ii/280649372?uo=4"
      },
      {
        "id": "aphex-twin-alb-955440196",
        "title": "Computer Controlled Acoustic Instruments, Pt. 2",
        "artist": "Aphex Twin",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/46/c3/7f/46c37fe6-ea94-ef2e-6900-871c49dc8990/WAP375CDD_DigitalPackshot_2400.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/computer-controlled-acoustic-instruments-pt-2/955440196?uo=4"
      },
      {
        "id": "aphex-twin-alb-1418633340",
        "title": "Collapse",
        "artist": "Aphex Twin",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/33/e4/5d/33e45d61-0ec6-f4e0-5ed0-14b338331923/0801061942335.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/collapse-ep/1418633340?uo=4"
      },
      {
        "id": "aphex-twin-alb-1121631291",
        "title": "Cheetah",
        "artist": "Aphex Twin",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f9/1b/eb/f91bebd3-15e8-e09b-1975-fb8e69103572/0801061939137.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/cheetah-ep/1121631291?uo=4"
      },
      {
        "id": "aphex-twin-alb-282559693",
        "title": "Drukqs",
        "artist": "Aphex Twin",
        "year": 2001,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/75/2f/98752fcb-0c8f-1e6e-cca3-2553ac9d46ab/0801061009236.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/drukqs/282559693?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "aphex-twin-trk-282559791",
        "albumId": "aphex-twin-alb-282559693",
        "title": "Avril 14th",
        "albumTitle": "Drukqs",
        "artist": "Aphex Twin",
        "year": 2001,
        "duration": "2:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/75/2f/98752fcb-0c8f-1e6e-cca3-2553ac9d46ab/0801061009236.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/avril-14th/282559693?i=282559791&uo=4"
      },
      {
        "id": "aphex-twin-trk-911319264",
        "albumId": "aphex-twin-alb-911319255",
        "title": "Minipops 67 [120.2] [Source Field Mix]",
        "albumTitle": "Syro",
        "artist": "Aphex Twin",
        "year": 2014,
        "duration": "4:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d5/7f/6e/d57f6e8e-068c-ef83-2a62-663e47d3f002/Syro_digital_packshot_RGB_1400.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/minipops-67-120-2-source-field-mix/911319255?i=911319264&uo=4"
      },
      {
        "id": "aphex-twin-trk-281953327",
        "albumId": "aphex-twin-alb-281953326",
        "title": "Windowlicker",
        "albumTitle": "Windowlicker",
        "artist": "Aphex Twin",
        "year": 1999,
        "duration": "6:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/81/20/73/812073f2-c437-fd1d-636d-6be5a4432747/0801061910532.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/windowlicker/281953326?i=281953327&uo=4"
      },
      {
        "id": "aphex-twin-trk-280649444",
        "albumId": "aphex-twin-alb-280649372",
        "title": "#3",
        "albumTitle": "Selected Ambient Works, Vol. II",
        "artist": "Aphex Twin",
        "year": 1994,
        "duration": "7:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b4/59/cd/b459cd17-d4cb-6810-074f-2eef4f292430/mzi.obgacqgc.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/3/280649372?i=280649444&uo=4"
      },
      {
        "id": "aphex-twin-trk-281830075",
        "albumId": "aphex-twin-alb-281829991",
        "title": "Alberto Balsalm (1994)",
        "albumTitle": "...I Care Because You Do",
        "artist": "Aphex Twin",
        "year": 1995,
        "duration": "5:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/5b/b8/00/5bb80093-db7e-fdb9-c4ce-48f81847f68b/mzi.jwcepubj.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/alberto-balsalm-1994/281829991?i=281830075&uo=4"
      },
      {
        "id": "aphex-twin-trk-911319352",
        "albumId": "aphex-twin-alb-911319255",
        "title": "Aisatsana [102]",
        "albumTitle": "Syro",
        "artist": "Aphex Twin",
        "year": 2014,
        "duration": "5:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/d5/7f/6e/d57f6e8e-068c-ef83-2a62-663e47d3f002/Syro_digital_packshot_RGB_1400.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/aisatsana-102/911319255?i=911319352&uo=4"
      },
      {
        "id": "aphex-twin-trk-282478754",
        "albumId": "aphex-twin-alb-282478739",
        "title": "Flim",
        "albumTitle": "Come to Daddy",
        "artist": "Aphex Twin",
        "year": 1997,
        "duration": "2:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/0b/a5/bf0ba54c-1c9b-d812-2ccf-54d137dc81ae/ticket.qknfmwov.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/flim/282478739?i=282478754&uo=4"
      },
      {
        "id": "aphex-twin-trk-282478753",
        "albumId": "aphex-twin-alb-282478739",
        "title": "Come to Daddy (Pappy Mix)",
        "albumTitle": "Come to Daddy",
        "artist": "Aphex Twin",
        "year": 1997,
        "duration": "4:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/0b/a5/bf0ba54c-1c9b-d812-2ccf-54d137dc81ae/ticket.qknfmwov.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/come-to-daddy-pappy-mix/282478739?i=282478753&uo=4"
      },
      {
        "id": "aphex-twin-trk-282478837",
        "albumId": "aphex-twin-alb-282478739",
        "title": "Iz - Us",
        "albumTitle": "Come to Daddy",
        "artist": "Aphex Twin",
        "year": 1997,
        "duration": "2:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/0b/a5/bf0ba54c-1c9b-d812-2ccf-54d137dc81ae/ticket.qknfmwov.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/iz-us/282478739?i=282478837&uo=4"
      },
      {
        "id": "aphex-twin-trk-1668862649",
        "albumId": "aphex-twin-alb-1668862636",
        "title": "Xtal",
        "albumTitle": "Selected Ambient Works 85-92",
        "artist": "Aphex Twin",
        "year": 1992,
        "duration": "4:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5f/b3/e0/5fb3e08d-c2cd-3da4-6ad7-c5dc61803683/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/xtal/1668862636?i=1668862649&uo=4"
      }
    ]
  },
  "pink-floyd": {
    "name": "Pink Floyd",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "pink-floyd-alb-1065973699",
        "title": "The Dark Side of the Moon",
        "artist": "Pink Floyd",
        "year": 1973,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-dark-side-of-the-moon/1065973699?uo=4"
      },
      {
        "id": "pink-floyd-alb-1065975633",
        "title": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-wall/1065975633?uo=4"
      },
      {
        "id": "pink-floyd-alb-1065973975",
        "title": "Wish You Were Here",
        "artist": "Pink Floyd",
        "year": 1975,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/aa/e0/ab/aae0ab6a-d906-a189-81bf-70b56aa43f7a/886445635843.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/wish-you-were-here/1065973975?uo=4"
      },
      {
        "id": "pink-floyd-alb-919599477",
        "title": "The Endless River (Deluxe Edition)",
        "artist": "Pink Floyd",
        "year": 2014,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/00/ed/8d00ed33-3176-7902-e5e1-df804329509b/886444851466.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/the-endless-river-deluxe-edition/919599477?uo=4"
      },
      {
        "id": "pink-floyd-alb-1065974284",
        "title": "Animals",
        "artist": "Pink Floyd",
        "year": 1977,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ef/03/66/ef036634-5956-38db-ba78-db6200adfdc4/886445635942.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/animals/1065974284?uo=4"
      },
      {
        "id": "pink-floyd-alb-1065973614",
        "title": "Meddle (2016 Remaster)",
        "artist": "Pink Floyd",
        "year": 1971,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/a8/b7/18a8b7ed-365d-ef37-d724-88ce764c3ee7/886445635911.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/meddle-2016-remaster/1065973614?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "pink-floyd-trk-1065973980",
        "albumId": "pink-floyd-alb-1065973975",
        "title": "Wish You Were Here",
        "albumTitle": "Wish You Were Here",
        "artist": "Pink Floyd",
        "year": 1975,
        "duration": "5:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/aa/e0/ab/aae0ab6a-d906-a189-81bf-70b56aa43f7a/886445635843.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/wish-you-were-here/1065973975?i=1065973980&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065976170",
        "albumId": "pink-floyd-alb-1065975633",
        "title": "Comfortably Numb",
        "albumTitle": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "duration": "6:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/comfortably-numb/1065975633?i=1065976170&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065975638",
        "albumId": "pink-floyd-alb-1065975633",
        "title": "Another Brick In the Wall, Pt. 2",
        "albumTitle": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "duration": "3:59",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-2/1065975633?i=1065975638&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065973706",
        "albumId": "pink-floyd-alb-1065973699",
        "title": "Time",
        "albumTitle": "The Dark Side of the Moon",
        "artist": "Pink Floyd",
        "year": 1973,
        "duration": "7:03",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/time/1065973699?i=1065973706&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065973708",
        "albumId": "pink-floyd-alb-1065973699",
        "title": "Money",
        "albumTitle": "The Dark Side of the Moon",
        "artist": "Pink Floyd",
        "year": 1973,
        "duration": "6:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/money/1065973699?i=1065973708&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065976163",
        "albumId": "pink-floyd-alb-1065975633",
        "title": "Hey You",
        "albumTitle": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "duration": "4:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/hey-you/1065975633?i=1065976163&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065975636",
        "albumId": "pink-floyd-alb-1065975633",
        "title": "Another Brick In the Wall, Pt. 1",
        "albumTitle": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "duration": "3:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/another-brick-in-the-wall-pt-1/1065975633?i=1065975636&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065973704",
        "albumId": "pink-floyd-alb-1065973699",
        "title": "Breathe (In the Air)",
        "albumTitle": "The Dark Side of the Moon",
        "artist": "Pink Floyd",
        "year": 1973,
        "duration": "2:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/76/b0/3e76b0e3-762b-2286-a019-8afb19cee541/886445635829.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/breathe-in-the-air/1065973699?i=1065973704&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065974935",
        "albumId": "pink-floyd-alb-1065974932",
        "title": "Learning to Fly",
        "albumTitle": "A Momentary Lapse of Reason",
        "artist": "Pink Floyd",
        "year": 1987,
        "duration": "4:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3e/4f/4a/3e4f4a75-28f2-93e1-33c8-a0918258f048/886445635935.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/learning-to-fly/1065974932?i=1065974935&uo=4"
      },
      {
        "id": "pink-floyd-trk-1065976152",
        "albumId": "pink-floyd-alb-1065975633",
        "title": "Mother",
        "albumTitle": "The Wall",
        "artist": "Pink Floyd",
        "year": 1979,
        "duration": "5:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/mother/1065975633?i=1065976152&uo=4"
      }
    ]
  },
  "deftones": {
    "name": "Deftones",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0f/b0/5a/0fb05adc-3847-4e07-3fe7-3cf9eb898e4d/093624946793.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "deftones-alb-567302377",
        "title": "Koi No Yokan",
        "artist": "Deftones",
        "year": 2012,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0f/b0/5a/0fb05adc-3847-4e07-3fe7-3cf9eb898e4d/093624946793.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/koi-no-yokan/567302377?uo=4"
      },
      {
        "id": "deftones-alb-1078767494",
        "title": "Gore",
        "artist": "Deftones",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e0/e9/89/e0e9890e-19a5-b959-e0b2-2010d4425ad2/093624926467.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/gore/1078767494?uo=4"
      },
      {
        "id": "deftones-alb-1099848709",
        "title": "White Pony",
        "artist": "Deftones",
        "year": 2000,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/white-pony/1099848709?uo=4"
      },
      {
        "id": "deftones-alb-1528075495",
        "title": "Ohms",
        "artist": "Deftones",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b4/b6/1a/b4b61aee-c236-4061-55de-15c8a57ca32a/093624892120.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/ohms/1528075495?uo=4"
      },
      {
        "id": "deftones-alb-1099843198",
        "title": "Around the Fur",
        "artist": "Deftones",
        "year": 1997,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/27/cb/b4/27cbb40e-f8c6-dede-9c69-62089a873fa9/093624919803.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/around-the-fur/1099843198?uo=4"
      },
      {
        "id": "deftones-alb-339542329",
        "title": "B-Sides & Rarities (Bonus Track Version)",
        "artist": "Deftones",
        "year": 2005,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/1c/ae/01/mzi.vqzmnvxr.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/b-sides-rarities-bonus-track-version/339542329?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "deftones-trk-310535250",
        "albumId": "deftones-alb-310535238",
        "title": "Change (In the House of Flies)",
        "albumTitle": "Queen of the Damned (Music from the Motion Picture)",
        "artist": "Deftones",
        "year": 2000,
        "duration": "5:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/05/83/2b/05832b57-fb41-5dad-efb3-f0afdb460b8f/mzi.auicrxmi.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/change-in-the-house-of-flies/310535238?i=310535250&uo=4"
      },
      {
        "id": "deftones-trk-567302384",
        "albumId": "deftones-alb-567302377",
        "title": "Tempest",
        "albumTitle": "Koi No Yokan",
        "artist": "Deftones",
        "year": 2012,
        "duration": "6:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0f/b0/5a/0fb05adc-3847-4e07-3fe7-3cf9eb898e4d/093624946793.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/tempest/567302377?i=567302384&uo=4"
      },
      {
        "id": "deftones-trk-1099843209",
        "albumId": "deftones-alb-1099843198",
        "title": "My Own Summer (Shove It)",
        "albumTitle": "Around the Fur",
        "artist": "Deftones",
        "year": 1997,
        "duration": "3:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/27/cb/b4/27cbb40e-f8c6-dede-9c69-62089a873fa9/093624919803.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/my-own-summer-shove-it/1099843198?i=1099843209&uo=4"
      },
      {
        "id": "deftones-trk-339542541",
        "albumId": "deftones-alb-339542329",
        "title": "Simple Man",
        "albumTitle": "B-Sides & Rarities (Bonus Track Version)",
        "artist": "Deftones",
        "year": 2005,
        "duration": "6:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/1c/ae/01/mzi.vqzmnvxr.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/simple-man/339542329?i=339542541&uo=4"
      },
      {
        "id": "deftones-trk-1099843334",
        "albumId": "deftones-alb-1099843198",
        "title": "Be Quiet and Drive (Far Away)",
        "albumTitle": "Around the Fur",
        "artist": "Deftones",
        "year": 1997,
        "duration": "5:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/27/cb/b4/27cbb40e-f8c6-dede-9c69-62089a873fa9/093624919803.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/be-quiet-and-drive-far-away/1099843198?i=1099843334&uo=4"
      },
      {
        "id": "deftones-trk-1099848810",
        "albumId": "deftones-alb-1099848709",
        "title": "Passenger",
        "albumTitle": "White Pony",
        "artist": "Deftones",
        "year": 2000,
        "duration": "6:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/passenger/1099848709?i=1099848810&uo=4"
      },
      {
        "id": "deftones-trk-567302378",
        "albumId": "deftones-alb-567302377",
        "title": "Swerve City",
        "albumTitle": "Koi No Yokan",
        "artist": "Deftones",
        "year": 2012,
        "duration": "2:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0f/b0/5a/0fb05adc-3847-4e07-3fe7-3cf9eb898e4d/093624946793.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/swerve-city/567302377?i=567302378&uo=4"
      },
      {
        "id": "deftones-trk-567302386",
        "albumId": "deftones-alb-567302377",
        "title": "Rosemary",
        "albumTitle": "Koi No Yokan",
        "artist": "Deftones",
        "year": 2012,
        "duration": "6:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0f/b0/5a/0fb05adc-3847-4e07-3fe7-3cf9eb898e4d/093624946793.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/rosemary/567302377?i=567302386&uo=4"
      },
      {
        "id": "deftones-trk-1099848723",
        "albumId": "deftones-alb-1099848709",
        "title": "Digital Bath",
        "albumTitle": "White Pony",
        "artist": "Deftones",
        "year": 2000,
        "duration": "4:15",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/51/57/96515710-cf91-0663-6f5a-942acf6ea31b/093624919797.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/digital-bath/1099848709?i=1099848723&uo=4"
      },
      {
        "id": "deftones-trk-339542605",
        "albumId": "deftones-alb-339542329",
        "title": "No Ordinary Love",
        "albumTitle": "B-Sides & Rarities (Bonus Track Version)",
        "artist": "Deftones",
        "year": 2005,
        "duration": "5:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/1c/ae/01/mzi.vqzmnvxr.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/us/album/no-ordinary-love/339542329?i=339542605&uo=4"
      }
    ]
  },
  "kai-angel": {
    "name": "Kai Angel",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/ea/7a/dfea7a99-b0e1-805e-0be0-a2e37c8f234d/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "kai-angel-alb-1767963478",
        "title": "Heavy Metal 2",
        "artist": "9mice, Kai Angel",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/ea/7a/dfea7a99-b0e1-805e-0be0-a2e37c8f234d/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/heavy-metal-2/1767963478?uo=4"
      },
      {
        "id": "kai-angel-alb-1736962256",
        "title": "GOD SYSTEM",
        "artist": "Kai Angel",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/70/63/4c70635c-3987-4ca2-158a-99013c13fa41/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/god-system/1736962256?uo=4"
      },
      {
        "id": "kai-angel-alb-1836427637",
        "title": "damage",
        "artist": "Kai Angel",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/06/d3/3d/06d33da3-675a-3e7d-79a4-ef2eb923e4c5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/damage/1836427637?uo=4"
      },
      {
        "id": "kai-angel-alb-1678069965",
        "title": "Marilyn Manson",
        "artist": "Kai Angel",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/6c/73/26/6c732613-9f4d-7d93-53e6-31ef05575b53/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/marilyn-manson/1678069965?uo=4"
      },
      {
        "id": "kai-angel-alb-1696056090",
        "title": "ANGEL MAY CRY",
        "artist": "Kai Angel",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4f/b7/3f/4fb73f6c-74b9-714e-b3ae-e38e4d73b8da/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/angel-may-cry/1696056090?uo=4"
      },
      {
        "id": "kai-angel-alb-1808706264",
        "title": "ANGEL MAY CRY 2",
        "artist": "Kai Angel",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/08/8d/c0/088dc0bc-9f94-4c94-56dc-aaf3ca156122/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/angel-may-cry-2/1808706264?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "kai-angel-trk-6808163353",
        "albumId": "kai-angel-alb-6808162752",
        "title": "andy warhol",
        "albumTitle": "Shh...",
        "artist": "Kai Angel",
        "year": 2026,
        "duration": "2:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/19/3a/c1/193ac1d5-9361-32bc-011e-2bf91ff52254/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/andy-warhol/6808162752?i=6808163353&uo=4"
      },
      {
        "id": "kai-angel-trk-1784463001",
        "albumId": "kai-angel-alb-1784462998",
        "title": "Madam",
        "albumTitle": "Madam",
        "artist": "Kai Angel",
        "year": 2024,
        "duration": "2:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d1/93/82/d19382b3-7edf-ec48-1fdf-ec6e009db7dc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/madam/1784462998?i=1784463001&uo=4"
      },
      {
        "id": "kai-angel-trk-1696056102",
        "albumId": "kai-angel-alb-1696056090",
        "title": "PARIS 2008",
        "albumTitle": "ANGEL MAY CRY",
        "artist": "Kai Angel",
        "year": 2023,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4f/b7/3f/4fb73f6c-74b9-714e-b3ae-e38e4d73b8da/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/paris-2008/1696056090?i=1696056102&uo=4"
      },
      {
        "id": "kai-angel-trk-1836427648",
        "albumId": "kai-angel-alb-1836427637",
        "title": "body double",
        "albumTitle": "damage",
        "artist": "Kai Angel",
        "year": 2025,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/06/d3/3d/06d33da3-675a-3e7d-79a4-ef2eb923e4c5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/body-double/1836427637?i=1836427648&uo=4"
      },
      {
        "id": "kai-angel-trk-1836427643",
        "albumId": "kai-angel-alb-1836427637",
        "title": "are you happy",
        "albumTitle": "damage",
        "artist": "Kai Angel",
        "year": 2025,
        "duration": "3:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/06/d3/3d/06d33da3-675a-3e7d-79a4-ef2eb923e4c5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/are-you-happy/1836427637?i=1836427643&uo=4"
      },
      {
        "id": "kai-angel-trk-1678070298",
        "albumId": "kai-angel-alb-1678069965",
        "title": "Prada Party",
        "albumTitle": "Marilyn Manson",
        "artist": "Kai Angel",
        "year": 2023,
        "duration": "2:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/6c/73/26/6c732613-9f4d-7d93-53e6-31ef05575b53/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/prada-party/1678069965?i=1678070298&uo=4"
      },
      {
        "id": "kai-angel-trk-1736963338",
        "albumId": "kai-angel-alb-1736962256",
        "title": "VICTIM",
        "albumTitle": "GOD SYSTEM",
        "artist": "Kai Angel",
        "year": 2024,
        "duration": "2:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/70/63/4c70635c-3987-4ca2-158a-99013c13fa41/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/victim/1736962256?i=1736963338&uo=4"
      },
      {
        "id": "kai-angel-trk-1696056097",
        "albumId": "kai-angel-alb-1696056090",
        "title": "JUMP!",
        "albumTitle": "ANGEL MAY CRY",
        "artist": "Kai Angel",
        "year": 2023,
        "duration": "2:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4f/b7/3f/4fb73f6c-74b9-714e-b3ae-e38e4d73b8da/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/jump/1696056090?i=1696056097&uo=4"
      },
      {
        "id": "kai-angel-trk-1836428133",
        "albumId": "kai-angel-alb-1836427637",
        "title": "damage",
        "albumTitle": "damage",
        "artist": "Kai Angel",
        "year": 2025,
        "duration": "3:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/06/d3/3d/06d33da3-675a-3e7d-79a4-ef2eb923e4c5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/damage/1836427637?i=1836428133&uo=4"
      },
      {
        "id": "kai-angel-trk-1822589220",
        "albumId": "kai-angel-alb-1822589006",
        "title": "lovesong",
        "albumTitle": "lovesong",
        "artist": "Kai Angel",
        "year": 2025,
        "duration": "1:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/71/98/f7/7198f745-7931-854a-4dce-e7afdd1ed270/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/lovesong/1822589006?i=1822589220&uo=4"
      }
    ]
  },
  "clout": {
    "name": "clout",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/9e/e9/a99ee927-106f-693d-f19e-19931bb00ac8/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "clout-alb-1886883051",
        "title": "ERA OF DARKNESS",
        "artist": "clout",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/9e/e9/a99ee927-106f-693d-f19e-19931bb00ac8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/era-of-darkness-ep/1886883051?uo=4"
      },
      {
        "id": "clout-alb-6799079876",
        "title": "ОКО",
        "artist": "clout",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b3/8d/63/b38d63f5-e98f-44b1-d008-d8da2e432444/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%BA%D0%BE-ep/6799079876?uo=4"
      },
      {
        "id": "clout-alb-1855865225",
        "title": "КАТАРСИС",
        "artist": "clout",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/db/a1/4adba122-2b92-4cdb-0c67-3c9e9e5479ad/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B0%D1%82%D0%B0%D1%80%D1%81%D0%B8%D1%81/1855865225?uo=4"
      },
      {
        "id": "clout-alb-1877121642",
        "title": "КИБЕРПСИХОЗ.ERROR",
        "artist": "clout",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/53/82/dc/5382dc22-4e74-baed-494a-9cd5c74e93fe/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D0%BF%D1%81%D0%B8%D1%85%D0%BE%D0%B7-error-single/1877121642?uo=4"
      },
      {
        "id": "clout-alb-1895124307",
        "title": "КИБЕРПСИХОЗ.MP3",
        "artist": "clout",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c7/48/f2/c748f24a-681a-fce0-5417-4742d5e54619/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D0%BF%D1%81%D0%B8%D1%85%D0%BE%D0%B7-mp3-single/1895124307?uo=4"
      },
      {
        "id": "clout-alb-1825667253",
        "title": "ИНОПЛАНЕТНЫЙ ДВИЖ",
        "artist": "clout",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/c4/2f/7cc42f67-3b38-6c8d-021d-8037a4643436/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B8%D0%BD%D0%BE%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%D0%BD%D1%8B%D0%B9-%D0%B4%D0%B2%D0%B8%D0%B6-single/1825667253?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "clout-trk-1886888375",
        "albumId": "clout-alb-1886888011",
        "title": "пОлЕтАеМ? (n30N k1nG)",
        "albumTitle": "XD",
        "artist": "clout",
        "year": 2024,
        "duration": "1:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a6/c0/bf/a6c0bf74-6b17-dbf8-cce5-178d9acabfa2/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%BB%D0%B5%D1%82%D0%B0%D0%B5%D0%BC-n30n-k1ng/1886888011?i=1886888375&uo=4"
      },
      {
        "id": "clout-trk-1886883056",
        "albumId": "clout-alb-1886883051",
        "title": "FUK YOUR EXES",
        "albumTitle": "ERA OF DARKNESS",
        "artist": "clout",
        "year": 2024,
        "duration": "2:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/9e/e9/a99ee927-106f-693d-f19e-19931bb00ac8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/fuk-your-exes/1886883051?i=1886883056&uo=4"
      },
      {
        "id": "clout-trk-1825667255",
        "albumId": "clout-alb-1825667253",
        "title": "ИНОПЛАНЕТНЫЙ ДВИЖ",
        "albumTitle": "ИНОПЛАНЕТНЫЙ ДВИЖ",
        "artist": "clout",
        "year": 2025,
        "duration": "1:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7c/c4/2f/7cc42f67-3b38-6c8d-021d-8037a4643436/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B8%D0%BD%D0%BE%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%D0%BD%D1%8B%D0%B9-%D0%B4%D0%B2%D0%B8%D0%B6/1825667253?i=1825667255&uo=4"
      },
      {
        "id": "clout-trk-6763020410",
        "albumId": "clout-alb-1895124307",
        "title": "ЭлЕктРоНный",
        "albumTitle": "КИБЕРПСИХОЗ.MP3",
        "artist": "clout",
        "year": 2025,
        "duration": "1:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c7/48/f2/c748f24a-681a-fce0-5417-4742d5e54619/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9/1895124307?i=6763020410&uo=4"
      },
      {
        "id": "clout-trk-1886883054",
        "albumId": "clout-alb-1886883051",
        "title": "MONEY ADDICT",
        "albumTitle": "ERA OF DARKNESS",
        "artist": "clout",
        "year": 2024,
        "duration": "1:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/9e/e9/a99ee927-106f-693d-f19e-19931bb00ac8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/money-addict/1886883051?i=1886883054&uo=4"
      },
      {
        "id": "clout-trk-1855865233",
        "albumId": "clout-alb-1855865225",
        "title": "BURN IN UR EYES…",
        "albumTitle": "КАТАРСИС",
        "artist": "clout",
        "year": 2025,
        "duration": "1:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/db/a1/4adba122-2b92-4cdb-0c67-3c9e9e5479ad/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/burn-in-ur-eyes/1855865225?i=1855865233&uo=4"
      },
      {
        "id": "clout-trk-1886882835",
        "albumId": "clout-alb-1886882833",
        "title": "HBA",
        "albumTitle": "HEADLINER",
        "artist": "clout",
        "year": 2024,
        "duration": "1:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/32/53/98/3253987b-583f-961c-11be-36bd809bb235/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/hba/1886882833?i=1886882835&uo=4"
      },
      {
        "id": "clout-trk-1855865231",
        "albumId": "clout-alb-1855865225",
        "title": "SEX DOLL",
        "albumTitle": "КАТАРСИС",
        "artist": "clout",
        "year": 2025,
        "duration": "1:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/db/a1/4adba122-2b92-4cdb-0c67-3c9e9e5479ad/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sex-doll/1855865225?i=1855865231&uo=4"
      },
      {
        "id": "clout-trk-1855865228",
        "albumId": "clout-alb-1855865225",
        "title": "У ТРУПА",
        "albumTitle": "КАТАРСИС",
        "artist": "clout",
        "year": 2025,
        "duration": "1:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/db/a1/4adba122-2b92-4cdb-0c67-3c9e9e5479ad/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%83-%D1%82%D1%80%D1%83%D0%BF%D0%B0/1855865225?i=1855865228&uo=4"
      },
      {
        "id": "clout-trk-1886883053",
        "albumId": "clout-alb-1886883051",
        "title": "RED",
        "albumTitle": "ERA OF DARKNESS",
        "artist": "clout",
        "year": 2024,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/9e/e9/a99ee927-106f-693d-f19e-19931bb00ac8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/red/1886883051?i=1886883053&uo=4"
      }
    ]
  },
  "temny-princ": {
    "name": "тёмный принц",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "temny-princ-alb-1819152409",
        "title": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D1%80%D0%B0%D1%87%D0%BD%D1%8B%D0%B5-%D1%82%D1%80%D0%B5%D0%B4%D1%8B/1819152409?uo=4"
      },
      {
        "id": "temny-princ-alb-6788463007",
        "title": "MILITANTUM",
        "artist": "тёмный принц",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/23/95/63/23956352-0a55-665e-ebeb-b11ebad7e247/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/militantum/6788463007?uo=4"
      },
      {
        "id": "temny-princ-alb-1781031568",
        "title": "ПАПА",
        "artist": "тёмный принц, tewiq, FORTUNA 812",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7e/c9/46/7ec946d9-4c2f-7586-8d6f-71cfebb65a61/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B0%D0%BF%D0%B0-single/1781031568?uo=4"
      },
      {
        "id": "temny-princ-alb-1801530382",
        "title": "ты че обиделась",
        "artist": "madk1d, тёмный принц",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/25/39/ee/2539ee0a-d2ad-c496-769d-da4e99768ee6/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D1%8B-%D1%87%D0%B5-%D0%BE%D0%B1%D0%B8%D0%B4%D0%B5%D0%BB%D0%B0%D1%81%D1%8C-single/1801530382?uo=4"
      },
      {
        "id": "temny-princ-alb-1889890379",
        "title": "Jealous",
        "artist": "9mice, ЕГОР КРИД, тёмный принц, madk1d",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4e/d8/3f/4ed83fe5-934a-e571-0b23-5261f6143c29/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/jealous-single/1889890379?uo=4"
      },
      {
        "id": "temny-princ-alb-1849976323",
        "title": "скидка",
        "artist": "тёмный принц",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/60/56/28/6056288e-b06a-8d16-6b52-3f8cb7f7b985/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BA%D0%B8%D0%B4%D0%BA%D0%B0-single/1849976323?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "temny-princ-trk-1819152419",
        "albumId": "temny-princ-alb-1819152409",
        "title": "цветы",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%86%D0%B2%D0%B5%D1%82%D1%8B/1819152409?i=1819152419&uo=4"
      },
      {
        "id": "temny-princ-trk-1819152413",
        "albumId": "temny-princ-alb-1819152409",
        "title": "вклубе",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BA%D0%BB%D1%83%D0%B1%D0%B5/1819152409?i=1819152413&uo=4"
      },
      {
        "id": "temny-princ-trk-1816744416",
        "albumId": "temny-princ-alb-1816744415",
        "title": "отвратительный король",
        "albumTitle": "отвратительный король",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a0/d3/2b/a0d32b4e-c184-d638-a04d-01accb4c0375/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%82%D0%B2%D1%80%D0%B0%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-%D0%BA%D0%BE%D1%80%D0%BE%D0%BB%D1%8C/1816744415?i=1816744416&uo=4"
      },
      {
        "id": "temny-princ-trk-1849976330",
        "albumId": "temny-princ-alb-1849976323",
        "title": "скидка",
        "albumTitle": "скидка",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/60/56/28/6056288e-b06a-8d16-6b52-3f8cb7f7b985/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BA%D0%B8%D0%B4%D0%BA%D0%B0/1849976323?i=1849976330&uo=4"
      },
      {
        "id": "temny-princ-trk-1819152416",
        "albumId": "temny-princ-alb-1819152409",
        "title": "автозаправка",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:34",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0/1819152409?i=1819152416&uo=4"
      },
      {
        "id": "temny-princ-trk-1797455847",
        "albumId": "temny-princ-alb-1797455846",
        "title": "гной",
        "albumTitle": "гной",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/98/09/91/98099134-6671-4425-78c3-354f90c1aae1/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%BD%D0%BE%D0%B9/1797455846?i=1797455847&uo=4"
      },
      {
        "id": "temny-princ-trk-1819152411",
        "albumId": "temny-princ-alb-1819152409",
        "title": "pedobear›⩊‹",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/pedobear/1819152409?i=1819152411&uo=4"
      },
      {
        "id": "temny-princ-trk-1819152417",
        "albumId": "temny-princ-alb-1819152409",
        "title": "французы",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%84%D1%80%D0%B0%D0%BD%D1%86%D1%83%D0%B7%D1%8B/1819152409?i=1819152417&uo=4"
      },
      {
        "id": "temny-princ-trk-1819152412",
        "albumId": "temny-princ-alb-1819152409",
        "title": "губы",
        "albumTitle": "мрачные треды",
        "artist": "тёмный принц",
        "year": 2025,
        "duration": "1:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ea/2b/68/ea2b68f7-3631-31e7-83de-91f108051a97/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D1%83%D0%B1%D1%8B/1819152409?i=1819152412&uo=4"
      },
      {
        "id": "temny-princ-trk-6788463253",
        "albumId": "temny-princ-alb-6788463007",
        "title": "after all",
        "albumTitle": "MILITANTUM",
        "artist": "тёмный принц",
        "year": 2026,
        "duration": "1:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/23/95/63/23956352-0a55-665e-ebeb-b11ebad7e247/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/after-all/6788463007?i=6788463253&uo=4"
      }
    ]
  },
  "saluki": {
    "name": "SALUKI",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a3/d6/fd/a3d6fdde-1619-e29d-e859-0c6e67b86dc2/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "saluki-alb-1895728235",
        "title": "На Человека",
        "artist": "SALUKI",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a3/d6/fd/a3d6fdde-1619-e29d-e859-0c6e67b86dc2/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B0-%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0/1895728235?uo=4"
      },
      {
        "id": "saluki-alb-6767533630",
        "title": "Wild Ea$T",
        "artist": "SALUKI",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2f/fa/35/2ffa35f9-5e9e-59ff-6f07-96bffb62d7ac/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/wild-ea%24t/6767533630?uo=4"
      },
      {
        "id": "saluki-alb-6792926489",
        "title": "EUPHORIA",
        "artist": "SALUKI",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7d/f0/c5/7df0c52d-474b-e45c-835c-c4250b3d8b1a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/euphoria/6792926489?uo=4"
      },
      {
        "id": "saluki-alb-1890219606",
        "title": "СТЫД ИЛИ СЛАВА",
        "artist": "SALUKI, 104",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/60/40/b0/6040b003-bec9-e049-b69b-0929a4be2e23/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D1%82%D1%8B%D0%B4-%D0%B8%D0%BB%D0%B8-%D1%81%D0%BB%D0%B0%D0%B2%D0%B0/1890219606?uo=4"
      },
      {
        "id": "saluki-alb-1895828669",
        "title": "BOLSHIE KURTKI",
        "artist": "SALUKI",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/f9/9a/fbf99ac7-7f3f-89f6-5bae-576a31f85a7e/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/bolshie-kurtki/1895828669?uo=4"
      },
      {
        "id": "saluki-alb-1895730414",
        "title": "Улицы, Дома",
        "artist": "SALUKI",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2a/4e/74/2a4e741c-53d3-586d-f9fe-56b4daf93a1a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%83%D0%BB%D0%B8%D1%86%D1%8B-%D0%B4%D0%BE%D0%BC%D0%B0/1895730414?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "saluki-trk-1640248768",
        "albumId": "saluki-alb-1640248762",
        "title": "Огней",
        "albumTitle": "Огней",
        "artist": "SALUKI",
        "year": 2022,
        "duration": "3:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/5b/a2/a7/5ba2a7da-61ed-1a39-4bb9-626dea0142dd/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B3%D0%BD%D0%B5%D0%B9/1640248762?i=1640248768&uo=4"
      },
      {
        "id": "saluki-trk-6767533633",
        "albumId": "saluki-alb-6767533630",
        "title": "Bbbitch! (feat. BATO)",
        "albumTitle": "Wild Ea$T",
        "artist": "SALUKI",
        "year": 2023,
        "duration": "2:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2f/fa/35/2ffa35f9-5e9e-59ff-6f07-96bffb62d7ac/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/bbbitch-feat-bato/6767533630?i=6767533633&uo=4"
      },
      {
        "id": "saluki-trk-6767534171",
        "albumId": "saluki-alb-6767533630",
        "title": "Boy$ (feat. FEDUK & FRIENDLY THUG 52 NGG)",
        "albumTitle": "Wild Ea$T",
        "artist": "SALUKI",
        "year": 2023,
        "duration": "5:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2f/fa/35/2ffa35f9-5e9e-59ff-6f07-96bffb62d7ac/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/boy%24-feat-feduk-friendly-thug-52-ngg/6767533630?i=6767534171&uo=4"
      },
      {
        "id": "saluki-trk-1652941367",
        "albumId": "saluki-alb-1652941366",
        "title": "Sorry I'M Working On the Wild Ea$T",
        "albumTitle": "Sorry I'M Working On the Wild Ea$T",
        "artist": "SALUKI",
        "year": 2022,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3d/02/2b/3d022be6-e8f3-e9fd-5be6-75a7cb0c2ba0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sorry-im-working-on-the-wild-ea%24t/1652941366?i=1652941367&uo=4"
      },
      {
        "id": "saluki-trk-6767533635",
        "albumId": "saluki-alb-6767533630",
        "title": "Wild Ea$T",
        "albumTitle": "Wild Ea$T",
        "artist": "SALUKI",
        "year": 2023,
        "duration": "4:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2f/fa/35/2ffa35f9-5e9e-59ff-6f07-96bffb62d7ac/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/wild-ea%24t/6767533630?i=6767533635&uo=4"
      },
      {
        "id": "saluki-trk-1715458692",
        "albumId": "saluki-alb-1715458688",
        "title": "Alive!",
        "albumTitle": "Alive!",
        "artist": "SALUKI",
        "year": 2023,
        "duration": "2:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/23/2a/36/232a369f-5ebf-19c9-f05b-980dcec64577/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/alive/1715458688?i=1715458692&uo=4"
      },
      {
        "id": "saluki-trk-1885568381",
        "albumId": "saluki-alb-1885568380",
        "title": "CORTISOL",
        "albumTitle": "CORTISOL",
        "artist": "SALUKI",
        "year": 2026,
        "duration": "2:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8a/7a/f0/8a7af01d-f781-a254-62f9-3c513f6865af/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/cortisol/1885568380?i=1885568381&uo=4"
      },
      {
        "id": "saluki-trk-6764318441",
        "albumId": "saluki-alb-1895730414",
        "title": "Как Будто Дома",
        "albumTitle": "Улицы, Дома",
        "artist": "SALUKI",
        "year": 2018,
        "duration": "2:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2a/4e/74/2a4e741c-53d3-586d-f9fe-56b4daf93a1a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B0%D0%BA-%D0%B1%D1%83%D0%B4%D1%82%D0%BE-%D0%B4%D0%BE%D0%BC%D0%B0/1895730414?i=6764318441&uo=4"
      },
      {
        "id": "saluki-trk-6767534181",
        "albumId": "saluki-alb-6767533630",
        "title": "1000 Rad (feat. ANIKV & Markul)",
        "albumTitle": "Wild Ea$T",
        "artist": "SALUKI",
        "year": 2023,
        "duration": "3:36",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2f/fa/35/2ffa35f9-5e9e-59ff-6f07-96bffb62d7ac/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/1000-rad-feat-anikv-markul/6767533630?i=6767534181&uo=4"
      },
      {
        "id": "saluki-trk-6764549358",
        "albumId": "saluki-alb-1895828669",
        "title": "MANSION MUSIK (feat. Big Baby Tape & Aarne)",
        "albumTitle": "BOLSHIE KURTKI",
        "artist": "SALUKI",
        "year": 2024,
        "duration": "3:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/f9/9a/fbf99ac7-7f3f-89f6-5bae-576a31f85a7e/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/mansion-musik-feat-big-baby-tape-aarne/1895828669?i=6764549358&uo=4"
      }
    ]
  },
  "cupsize": {
    "name": "CUPSIZE",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "cupsize-alb-1722062012",
        "title": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B0%D0%BA-%D0%B8%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D1%82%D1%8C-%D0%B2%D0%B5%D1%87%D0%B5%D1%80%D0%B8%D0%BD%D0%BA%D1%83/1722062012?uo=4"
      },
      {
        "id": "cupsize-alb-1709086167",
        "title": "дели на два",
        "artist": "CUPSIZE",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/06/0a/db/060adbe0-23b7-157e-8c32-c63658f82110/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B5%D0%BB%D0%B8-%D0%BD%D0%B0-%D0%B4%D0%B2%D0%B0-ep/1709086167?uo=4"
      },
      {
        "id": "cupsize-alb-1840206697",
        "title": "неуравновешеннолетниепесни Pt.1",
        "artist": "CUPSIZE",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c0/46/d2/c046d211-e7c3-2d08-2e2e-49cd6c511ae9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D1%83%D1%80%D0%B0%D0%B2%D0%BD%D0%BE%D0%B2%D0%B5%D1%88%D0%B5%D0%BD%D0%BD%D0%BE%D0%BB%D0%B5%D1%82%D0%BD%D0%B8%D0%B5%D0%BF%D0%B5%D1%81%D0%BD%D0%B8-pt-1/1840206697?uo=4"
      },
      {
        "id": "cupsize-alb-1808710511",
        "title": "в моих легких выросли цветы",
        "artist": "CUPSIZE",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d9/d4/01/d9d40192-d5dc-4c6a-82d2-1728e0f3876a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D0%BC%D0%BE%D0%B8%D1%85-%D0%BB%D0%B5%D0%B3%D0%BA%D0%B8%D1%85-%D0%B2%D1%8B%D1%80%D0%BE%D1%81%D0%BB%D0%B8-%D1%86%D0%B2%D0%B5%D1%82%D1%8B/1808710511?uo=4"
      },
      {
        "id": "cupsize-alb-1766133157",
        "title": "кажется, в аду прикольно, но меня выгнали б утром",
        "artist": "CUPSIZE",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/29/9f/cb/299fcbd2-d6fe-edb1-f713-fefc79993b0e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B0%D0%B6%D0%B5%D1%82%D1%81%D1%8F-%D0%B2-%D0%B0%D0%B4%D1%83-%D0%BF%D1%80%D0%B8%D0%BA%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE-%D0%BD%D0%BE-%D0%BC%D0%B5%D0%BD%D1%8F-%D0%B2%D1%8B%D0%B3%D0%BD%D0%B0%D0%BB%D0%B8-%D0%B1-%D1%83%D1%82%D1%80%D0%BE%D0%BC/1766133157?uo=4"
      },
      {
        "id": "cupsize-alb-1855522986",
        "title": "психушка",
        "artist": "CUPSIZE, heavens archives",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9b/ef/dd/9befddea-6f33-769f-5d6e-7f8847dde188/8447536748334.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D1%81%D0%B8%D1%85%D1%83%D1%88%D0%BA%D0%B0-ep/1855522986?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "cupsize-trk-1722062013",
        "albumId": "cupsize-alb-1722062012",
        "title": "Юра, Юра",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8E%D1%80%D0%B0-%D1%8E%D1%80%D0%B0/1722062012?i=1722062013&uo=4"
      },
      {
        "id": "cupsize-trk-1709086170",
        "albumId": "cupsize-alb-1709086167",
        "title": "целую тебя",
        "albumTitle": "дели на два",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/06/0a/db/060adbe0-23b7-157e-8c32-c63658f82110/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%86%D0%B5%D0%BB%D1%83%D1%8E-%D1%82%D0%B5%D0%B1%D1%8F/1709086167?i=1709086170&uo=4"
      },
      {
        "id": "cupsize-trk-1709086168",
        "albumId": "cupsize-alb-1709086167",
        "title": "ты любишь танцевать",
        "albumTitle": "дели на два",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/06/0a/db/060adbe0-23b7-157e-8c32-c63658f82110/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D1%8B-%D0%BB%D1%8E%D0%B1%D0%B8%D1%88%D1%8C-%D1%82%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0%D1%82%D1%8C/1709086167?i=1709086168&uo=4"
      },
      {
        "id": "cupsize-trk-1722062021",
        "albumId": "cupsize-alb-1722062012",
        "title": "Клей",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:25",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%BB%D0%B5%D0%B9/1722062012?i=1722062021&uo=4"
      },
      {
        "id": "cupsize-trk-1722062017",
        "albumId": "cupsize-alb-1722062012",
        "title": "Стенки моего подъезда",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D1%82%D0%B5%D0%BD%D0%BA%D0%B8-%D0%BC%D0%BE%D0%B5%D0%B3%D0%BE-%D0%BF%D0%BE%D0%B4%D1%8A%D0%B5%D0%B7%D0%B4%D0%B0/1722062012?i=1722062017&uo=4"
      },
      {
        "id": "cupsize-trk-1766133167",
        "albumId": "cupsize-alb-1766133157",
        "title": "пока-пока",
        "albumTitle": "кажется, в аду прикольно, но меня выгнали б утром",
        "artist": "CUPSIZE",
        "year": 2024,
        "duration": "2:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/29/9f/cb/299fcbd2-d6fe-edb1-f713-fefc79993b0e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%BA%D0%B0-%D0%BF%D0%BE%D0%BA%D0%B0/1766133157?i=1766133167&uo=4"
      },
      {
        "id": "cupsize-trk-1722062151",
        "albumId": "cupsize-alb-1722062012",
        "title": "Я схожу с ума",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "3:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D1%81%D1%85%D0%BE%D0%B6%D1%83-%D1%81-%D1%83%D0%BC%D0%B0/1722062012?i=1722062151&uo=4"
      },
      {
        "id": "cupsize-trk-1722062025",
        "albumId": "cupsize-alb-1722062012",
        "title": "Высокий градус",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:33",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D1%8B%D1%81%D0%BE%D0%BA%D0%B8%D0%B9-%D0%B3%D1%80%D0%B0%D0%B4%D1%83%D1%81/1722062012?i=1722062025&uo=4"
      },
      {
        "id": "cupsize-trk-1722062149",
        "albumId": "cupsize-alb-1722062012",
        "title": "Семнадцатилетняя",
        "albumTitle": "Как испортить вечеринку?",
        "artist": "CUPSIZE",
        "year": 2023,
        "duration": "2:32",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/2b/4a/df2b4a02-92b2-4447-079e-df7305141f4c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B5%D0%BC%D0%BD%D0%B0%D0%B4%D1%86%D0%B0%D1%82%D0%B8%D0%BB%D0%B5%D1%82%D0%BD%D1%8F%D1%8F/1722062012?i=1722062149&uo=4"
      },
      {
        "id": "cupsize-trk-1766133164",
        "albumId": "cupsize-alb-1766133157",
        "title": "маршрутка",
        "albumTitle": "кажется, в аду прикольно, но меня выгнали б утром",
        "artist": "CUPSIZE",
        "year": 2024,
        "duration": "3:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/29/9f/cb/299fcbd2-d6fe-edb1-f713-fefc79993b0e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D1%80%D1%88%D1%80%D1%83%D1%82%D0%BA%D0%B0/1766133157?i=1766133164&uo=4"
      }
    ]
  },
  "9mice": {
    "name": "9mice",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/ea/7a/dfea7a99-b0e1-805e-0be0-a2e37c8f234d/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "9mice-alb-1767963478",
        "title": "Heavy Metal 2",
        "artist": "9mice, Kai Angel",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/ea/7a/dfea7a99-b0e1-805e-0be0-a2e37c8f234d/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/heavy-metal-2/1767963478?uo=4"
      },
      {
        "id": "9mice-alb-1719945440",
        "title": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/orpheus/1719945440?uo=4"
      },
      {
        "id": "9mice-alb-1846155523",
        "title": "9mm",
        "artist": "9mice",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/a0/a7/bfa0a73e-766c-60cc-8588-07d78bcae0a0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/9mm/1846155523?uo=4"
      },
      {
        "id": "9mice-alb-1689253520",
        "title": "ASPHALT",
        "artist": "9mice",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b0/b9/8a/b0b98af3-8f8a-b54f-c95b-8c4c406269e3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/asphalt/1689253520?uo=4"
      },
      {
        "id": "9mice-alb-1694212695",
        "title": "SOLOIST",
        "artist": "9mice",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/63/62/f2/6362f2e4-448b-964b-48d9-574856ba1eb4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/soloist/1694212695?uo=4"
      },
      {
        "id": "9mice-alb-1746458431",
        "title": "Your Love",
        "artist": "9mice",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/b0/4c/4ab04cdf-e899-69ec-fa17-2520edd70027/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/your-love-single/1746458431?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "9mice-trk-1719945783",
        "albumId": "9mice-alb-1719945440",
        "title": "КИНО",
        "albumTitle": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "duration": "1:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B8%D0%BD%D0%BE/1719945440?i=1719945783&uo=4"
      },
      {
        "id": "9mice-trk-1746458437",
        "albumId": "9mice-alb-1746458431",
        "title": "Your Love",
        "albumTitle": "Your Love",
        "artist": "9mice",
        "year": 2024,
        "duration": "2:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/b0/4c/4ab04cdf-e899-69ec-fa17-2520edd70027/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/your-love/1746458431?i=1746458437&uo=4"
      },
      {
        "id": "9mice-trk-1719945444",
        "albumId": "9mice-alb-1719945440",
        "title": "FACE",
        "albumTitle": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/face/1719945440?i=1719945444&uo=4"
      },
      {
        "id": "9mice-trk-1689253524",
        "albumId": "9mice-alb-1689253520",
        "title": "ИМЯ",
        "albumTitle": "ASPHALT",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b0/b9/8a/b0b98af3-8f8a-b54f-c95b-8c4c406269e3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B8%D0%BC%D1%8F/1689253520?i=1689253524&uo=4"
      },
      {
        "id": "9mice-trk-1689253523",
        "albumId": "9mice-alb-1689253520",
        "title": "BELLA",
        "albumTitle": "ASPHALT",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b0/b9/8a/b0b98af3-8f8a-b54f-c95b-8c4c406269e3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/bella/1689253520?i=1689253523&uo=4"
      },
      {
        "id": "9mice-trk-1795755059",
        "albumId": "9mice-alb-1795754926",
        "title": "Anora",
        "albumTitle": "Anora",
        "artist": "9mice",
        "year": 2025,
        "duration": "2:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/de/02/e1/de02e120-9351-7346-c5dd-589588949784/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/anora/1795754926?i=1795755059&uo=4"
      },
      {
        "id": "9mice-trk-1719946499",
        "albumId": "9mice-alb-1719945440",
        "title": "ДЕВОЧКА (feat. glaive)",
        "albumTitle": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "duration": "3:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B5%D0%B2%D0%BE%D1%87%D0%BA%D0%B0-feat-glaive/1719945440?i=1719946499&uo=4"
      },
      {
        "id": "9mice-trk-1689253531",
        "albumId": "9mice-alb-1689253520",
        "title": "ALASKA",
        "albumTitle": "ASPHALT",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b0/b9/8a/b0b98af3-8f8a-b54f-c95b-8c4c406269e3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/alaska/1689253520?i=1689253531&uo=4"
      },
      {
        "id": "9mice-trk-1719946161",
        "albumId": "9mice-alb-1719945440",
        "title": "ELA-ELA (feat. Kai Angel)",
        "albumTitle": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/ela-ela-feat-kai-angel/1719945440?i=1719946161&uo=4"
      },
      {
        "id": "9mice-trk-1719946514",
        "albumId": "9mice-alb-1719945440",
        "title": "РАЗРУШИТЬ",
        "albumTitle": "ORPHEUS",
        "artist": "9mice",
        "year": 2023,
        "duration": "2:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/12/a1/ec12a171-e0a9-98bf-24e2-d587f78eb84c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%80%D0%B0%D0%B7%D1%80%D1%83%D1%88%D0%B8%D1%82%D1%8C/1719945440?i=1719946514&uo=4"
      }
    ]
  },
  "sabu": {
    "name": "SABU",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/70/50/8d7050f0-280d-3e05-4646-1670a0a3781e/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "sabu-alb-1895717098",
        "title": "Sabutage",
        "artist": "SABU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/70/50/8d7050f0-280d-3e05-4646-1670a0a3781e/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sabutage/1895717098?uo=4"
      },
      {
        "id": "sabu-alb-1881948606",
        "title": "агентство насилия™",
        "artist": "gotlibgotlibgotlib, SABU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/69/a7/ed/69a7ed41-1b92-e7f6-51c5-11973c3dca92/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D1%81%D1%82%D0%B2%D0%BE-%D0%BD%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D1%8F-single/1881948606?uo=4"
      },
      {
        "id": "sabu-alb-1895612119",
        "title": "Обстоятельство",
        "artist": "SABU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1a/b4/6e/1ab46ee4-78f0-baea-3929-cfe883800fa8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D1%81%D1%82%D0%BE%D1%8F%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE-single/1895612119?uo=4"
      },
      {
        "id": "sabu-alb-6764305647",
        "title": "Тату",
        "artist": "SABU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/93/48/38934816-5ded-d5c7-da78-79526ea74da6/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D1%82%D1%83-single/6764305647?uo=4"
      },
      {
        "id": "sabu-alb-1895724969",
        "title": "Swag",
        "artist": "SABU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/16/c3/fd/16c3fd85-926d-c6c6-15fb-2495aac285cd/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/swag-single/1895724969?uo=4"
      },
      {
        "id": "sabu-alb-1872905319",
        "title": "обои",
        "artist": "SABU",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/19/51/69/195169be-b8e4-3c7f-334a-5e60cf781c6c/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D0%BE%D0%B8-single/1872905319?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "sabu-trk-6764305915",
        "albumId": "sabu-alb-1895724969",
        "title": "Swag",
        "albumTitle": "Swag",
        "artist": "SABU",
        "year": 2025,
        "duration": "2:18",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/16/c3/fd/16c3fd85-926d-c6c6-15fb-2495aac285cd/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/swag/1895724969?i=6764305915&uo=4"
      },
      {
        "id": "sabu-trk-1872905321",
        "albumId": "sabu-alb-1872905319",
        "title": "обои",
        "albumTitle": "обои",
        "artist": "SABU",
        "year": 2024,
        "duration": "1:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/19/51/69/195169be-b8e4-3c7f-334a-5e60cf781c6c/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D0%BE%D0%B8/1872905319?i=1872905321&uo=4"
      },
      {
        "id": "sabu-trk-1646628123",
        "albumId": "sabu-alb-1646628122",
        "title": "Моряк",
        "albumTitle": "Моряк",
        "artist": "SABU",
        "year": 2022,
        "duration": "2:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ce/ca/59/ceca5962-0b51-9fd6-7edc-00188df707fd/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D1%80%D1%8F%D0%BA/1646628122?i=1646628123&uo=4"
      },
      {
        "id": "sabu-trk-6764286933",
        "albumId": "sabu-alb-1895717098",
        "title": "Обстоятельство",
        "albumTitle": "Sabutage",
        "artist": "SABU",
        "year": 2025,
        "duration": "2:34",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/70/50/8d7050f0-280d-3e05-4646-1670a0a3781e/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D1%81%D1%82%D0%BE%D1%8F%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE/1895717098?i=6764286933&uo=4"
      },
      {
        "id": "sabu-trk-6764287095",
        "albumId": "sabu-alb-1895717098",
        "title": "Locked (feat. SALUKI)",
        "albumTitle": "Sabutage",
        "artist": "SABU",
        "year": 2025,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8d/70/50/8d7050f0-280d-3e05-4646-1670a0a3781e/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/locked-feat-saluki/1895717098?i=6764287095&uo=4"
      },
      {
        "id": "sabu-trk-1625577370",
        "albumId": "sabu-alb-1625577368",
        "title": "Плакала",
        "albumTitle": "Плакала",
        "artist": "SABU",
        "year": 2022,
        "duration": "2:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/aa/f9/71/aaf971e3-cc59-4cd3-fe20-55b560b1607b/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BB%D0%B0%D0%BA%D0%B0%D0%BB%D0%B0/1625577368?i=1625577370&uo=4"
      },
      {
        "id": "sabu-trk-1613834341",
        "albumId": "sabu-alb-1613833948",
        "title": "Немая",
        "albumTitle": "Немая",
        "artist": "SABU",
        "year": 2019,
        "duration": "3:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/5e/15/85/5e15852b-d974-e8fa-d6ae-6a5ba4887031/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D0%BC%D0%B0%D1%8F/1613833948?i=1613834341&uo=4"
      },
      {
        "id": "sabu-trk-6764305463",
        "albumId": "sabu-alb-1895724884",
        "title": "Nnn",
        "albumTitle": "Nnn",
        "artist": "SABU",
        "year": 2025,
        "duration": "2:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bd/9e/31/bd9e31c9-8ee9-c9e5-5da5-126f23bd01f4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/nnn/1895724884?i=6764305463&uo=4"
      },
      {
        "id": "sabu-trk-6764305648",
        "albumId": "sabu-alb-6764305647",
        "title": "Тату",
        "albumTitle": "Тату",
        "artist": "SABU",
        "year": 2025,
        "duration": "2:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/38/93/48/38934816-5ded-d5c7-da78-79526ea74da6/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D1%82%D1%83/6764305647?i=6764305648&uo=4"
      },
      {
        "id": "sabu-trk-1873203970",
        "albumId": "sabu-alb-1873203969",
        "title": "вода",
        "albumTitle": "вода",
        "artist": "SABU",
        "year": 2024,
        "duration": "1:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/49/00/86/49008688-ea2f-7462-696b-6868747595bd/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BE%D0%B4%D0%B0/1873203969?i=1873203970&uo=4"
      }
    ]
  },
  "maladoy-prince": {
    "name": "Maladoy Prince",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "maladoy-prince-alb-1888460314",
        "title": "Provincial",
        "artist": "Maladoy Prince",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/provincial/1888460314?uo=4"
      },
      {
        "id": "maladoy-prince-alb-1679914388",
        "title": "Archival Prince",
        "artist": "Maladoy Prince",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e2/50/f6/e250f612-2028-53dd-e78f-2fab294e078c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/archival-prince/1679914388?uo=4"
      },
      {
        "id": "maladoy-prince-alb-1891876531",
        "title": "ДИЗАЙНЕР",
        "artist": "Maladoy Prince",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/ed/1a/eced1a9c-6795-ff47-e0e1-d88bb7d17bbf/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80/1891876531?uo=4"
      },
      {
        "id": "maladoy-prince-alb-1882228024",
        "title": "Delicates",
        "artist": "Maladoy Prince",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b7/55/fe/b755fe57-1cc3-1389-2ba2-899822dfe976/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/delicates/1882228024?uo=4"
      },
      {
        "id": "maladoy-prince-alb-1646414508",
        "title": "В клубе",
        "artist": "Trap Get Illuminator, Maladoy Prince",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/bd/3e/3b/bd3e3b94-67be-bfc8-debe-223fe8a30969/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D0%BA%D0%BB%D1%83%D0%B1%D0%B5-single/1646414508?uo=4"
      },
      {
        "id": "maladoy-prince-alb-1683562414",
        "title": "Repeat",
        "artist": "er1taga, d1proo, Maladoy Prince",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ff/ac/da/ffacda5d-ce56-d43c-5789-19583ba88440/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/repeat-single/1683562414?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "maladoy-prince-trk-1891876532",
        "albumId": "maladoy-prince-alb-1891876531",
        "title": "Сасавот",
        "albumTitle": "ДИЗАЙНЕР",
        "artist": "Maladoy Prince",
        "year": 2026,
        "duration": "1:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/ed/1a/eced1a9c-6795-ff47-e0e1-d88bb7d17bbf/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D1%81%D0%B0%D0%B2%D0%BE%D1%82/1891876531?i=1891876532&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1891876786",
        "albumId": "maladoy-prince-alb-1891876531",
        "title": "Медитация",
        "albumTitle": "ДИЗАЙНЕР",
        "artist": "Maladoy Prince",
        "year": 2026,
        "duration": "2:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/ed/1a/eced1a9c-6795-ff47-e0e1-d88bb7d17bbf/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B5%D0%B4%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F/1891876531?i=1891876786&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1888460321",
        "albumId": "maladoy-prince-alb-1888460314",
        "title": "Дискотека",
        "albumTitle": "Provincial",
        "artist": "Maladoy Prince",
        "year": 2025,
        "duration": "2:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B8%D1%81%D0%BA%D0%BE%D1%82%D0%B5%D0%BA%D0%B0/1888460314?i=1888460321&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1888460319",
        "albumId": "maladoy-prince-alb-1888460314",
        "title": "Не Вотсап",
        "albumTitle": "Provincial",
        "artist": "Maladoy Prince",
        "year": 2025,
        "duration": "2:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5-%D0%B2%D0%BE%D1%82%D1%81%D0%B0%D0%BF/1888460314?i=1888460319&uo=4"
      },
      {
        "id": "maladoy-prince-trk-6788711225",
        "albumId": "maladoy-prince-alb-6788711224",
        "title": "Большое Шоу (Приглашение на концерты)",
        "albumTitle": "Большое Шоу (Приглашение на концерты)",
        "artist": "Maladoy Prince",
        "year": 2026,
        "duration": "1:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d2/0f/03/d20f03b6-a6cf-3704-3cb5-6087b522bf61/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B5-%D1%88%D0%BE%D1%83-%D0%BF%D1%80%D0%B8%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0-%D0%BA%D0%BE%D0%BD%D1%86%D0%B5%D1%80%D1%82%D1%8B/6788711224?i=6788711225&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1891876777",
        "albumId": "maladoy-prince-alb-1891876531",
        "title": "Паша Воля",
        "albumTitle": "ДИЗАЙНЕР",
        "artist": "Maladoy Prince",
        "year": 2026,
        "duration": "1:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ec/ed/1a/eced1a9c-6795-ff47-e0e1-d88bb7d17bbf/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B0%D1%88%D0%B0-%D0%B2%D0%BE%D0%BB%D1%8F/1891876531?i=1891876777&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1679914850",
        "albumId": "maladoy-prince-alb-1679914388",
        "title": "Work",
        "albumTitle": "Archival Prince",
        "artist": "Maladoy Prince",
        "year": 2023,
        "duration": "2:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e2/50/f6/e250f612-2028-53dd-e78f-2fab294e078c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/work/1679914388?i=1679914850&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1882228031",
        "albumId": "maladoy-prince-alb-1882228024",
        "title": "Диджей",
        "albumTitle": "Delicates",
        "artist": "Maladoy Prince",
        "year": 2024,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b7/55/fe/b755fe57-1cc3-1389-2ba2-899822dfe976/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B8%D0%B4%D0%B6%D0%B5%D0%B9/1882228024?i=1882228031&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1888460328",
        "albumId": "maladoy-prince-alb-1888460314",
        "title": "В Честной Акустике",
        "albumTitle": "Provincial",
        "artist": "Maladoy Prince",
        "year": 2025,
        "duration": "2:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D1%87%D0%B5%D1%81%D1%82%D0%BD%D0%BE%D0%B9-%D0%B0%D0%BA%D1%83%D1%81%D1%82%D0%B8%D0%BA%D0%B5/1888460314?i=1888460328&uo=4"
      },
      {
        "id": "maladoy-prince-trk-1888460324",
        "albumId": "maladoy-prince-alb-1888460314",
        "title": "Принадлежала",
        "albumTitle": "Provincial",
        "artist": "Maladoy Prince",
        "year": 2025,
        "duration": "2:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/09/52/40/095240b6-394b-b2bf-e3c2-68ed3551a61a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D1%80%D0%B8%D0%BD%D0%B0%D0%B4%D0%BB%D0%B5%D0%B6%D0%B0%D0%BB%D0%B0/1888460314?i=1888460324&uo=4"
      }
    ]
  },
  "big-baby-tape": {
    "name": "Big Baby Tape",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "big-baby-tape-alb-1442022364",
        "title": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dragonborn/1442022364?uo=4"
      },
      {
        "id": "big-baby-tape-alb-1462202918",
        "title": "ARGUMENTS & FACTS",
        "artist": "Big Baby Tape",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/cf/d3/25cfd3fe-d0fc-ae3a-fef9-b6239a020b37/190295464769.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/arguments-facts-ep/1462202918?uo=4"
      },
      {
        "id": "big-baby-tape-alb-1443606022",
        "title": "Hoodrich Tales",
        "artist": "Big Baby Tape",
        "year": 2018,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/50/91/dc/5091dcd3-acc8-4276-e2d5-0a3d999a07d9/190296893544.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/hoodrich-tales/1443606022?uo=4"
      },
      {
        "id": "big-baby-tape-alb-1752831350",
        "title": "PEEKABOO",
        "artist": "Big Baby Tape, Aarne",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3d/68/c7/3d68c740-a0d2-e3ec-1598-e7796fe66085/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/peekaboo/1752831350?uo=4"
      },
      {
        "id": "big-baby-tape-alb-1717089122",
        "title": "Varskva",
        "artist": "Big Baby Tape",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/29/9d/35/299d35de-3ab5-218b-a7cd-05fd53cc5007/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/varskva/1717089122?uo=4"
      },
      {
        "id": "big-baby-tape-alb-1884898864",
        "title": "MIXTAPE",
        "artist": "Big Baby Tape",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/cc/01/2bcc0132-348a-98de-6a7b-d46f67e4ada4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/mixtape/1884898864?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "big-baby-tape-trk-1442023047",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "Gimme the Loot",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "2:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/gimme-the-loot/1442022364?i=1442023047&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1485874569",
        "albumId": "big-baby-tape-alb-1485874568",
        "title": "Trap Luv",
        "albumTitle": "Trap Luv",
        "artist": "Big Baby Tape",
        "year": 2019,
        "duration": "2:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3d/3e/af/3d3eaf9b-0bdb-befd-5be3-b01d5ad26bb1/190295390846.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/trap-luv/1485874568?i=1485874569&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1462202927",
        "albumId": "big-baby-tape-alb-1462202918",
        "title": "Surname (Prod. DJ Tape & Aarne)",
        "albumTitle": "ARGUMENTS & FACTS",
        "artist": "Big Baby Tape",
        "year": 2019,
        "duration": "2:37",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/cf/d3/25cfd3fe-d0fc-ae3a-fef9-b6239a020b37/190295464769.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/surname-prod-dj-tape-aarne/1462202918?i=1462202927&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1543409448",
        "albumId": "big-baby-tape-alb-1543409445",
        "title": "KARI",
        "albumTitle": "KARI",
        "artist": "Big Baby Tape",
        "year": 2020,
        "duration": "2:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c2/eb/48/c2eb481f-e1ab-9b62-d6e6-2925b95a12ba/190295055394.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/kari/1543409445?i=1543409448&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022791",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "Hokage",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "2:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/hokage/1442022364?i=1442022791&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022995",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "MILF",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "2:47",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/milf/1442022364?i=1442022995&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022540",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "Dragonborn",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "3:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dragonborn/1442022364?i=1442022540&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022613",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "Wasabi",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2017,
        "duration": "2:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/wasabi/1442022364?i=1442022613&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022546",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "ACAB",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "2:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/acab/1442022364?i=1442022546&uo=4"
      },
      {
        "id": "big-baby-tape-trk-1442022810",
        "albumId": "big-baby-tape-alb-1442022364",
        "title": "98 Flow (feat. Хаски)",
        "albumTitle": "Dragonborn",
        "artist": "Big Baby Tape",
        "year": 2018,
        "duration": "3:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/25/1e/61/251e61e2-07e5-18ea-c571-8ba767dade30/190296893414.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/98-flow-feat-%D1%85%D0%B0%D1%81%D0%BA%D0%B8/1442022364?i=1442022810&uo=4"
      }
    ]
  },
  "heronwater": {
    "name": "Heronwater",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/af/c2/bbafc2ad-b8eb-fad3-9a15-b23ab132dbb4/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "heronwater-alb-1855888932",
        "title": "1000 BARS",
        "artist": "Heronwater",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bb/af/c2/bbafc2ad-b8eb-fad3-9a15-b23ab132dbb4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/1000-bars/1855888932?uo=4"
      },
      {
        "id": "heronwater-alb-1708194357",
        "title": "DREAMS MONEY CAN BUY",
        "artist": "Heronwater",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/bd/87/f9bd8702-c73a-7f5d-4885-dae6f6b1bc29/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dreams-money-can-buy/1708194357?uo=4"
      },
      {
        "id": "heronwater-alb-1656709970",
        "title": "NO COMMERCIAL LYRICS",
        "artist": "Heronwater",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/38/21/00382156-6383-73a7-9611-fbac42a475a4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/no-commercial-lyrics/1656709970?uo=4"
      },
      {
        "id": "heronwater-alb-1779264443",
        "title": "ODYSSEY",
        "artist": "Heronwater",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1c/7a/1a/1c7a1a7c-aecc-5668-d066-3b1aa7bc7896/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/odyssey/1779264443?uo=4"
      },
      {
        "id": "heronwater-alb-1650556368",
        "title": "2 DAYS NO LEAN",
        "artist": "Heronwater",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/be/61/49/be6149ad-e746-7db3-1606-45aa323976f2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/2-days-no-lean/1650556368?uo=4"
      },
      {
        "id": "heronwater-alb-1692313910",
        "title": "ДАЙ МНЕ ПОСМОТРЕТЬ </3 ДЭНС ДЭНС",
        "artist": "Heronwater, BUSHIDO ZHO",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e3/b2/1e/e3b21e9f-e808-2e59-0273-10afc716ccb7/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B0%D0%B9-%D0%BC%D0%BD%D0%B5-%D0%BF%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C-3-%D0%B4%D1%8D%D0%BD%D1%81-%D0%B4%D1%8D%D0%BD%D1%81-single/1692313910?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "heronwater-trk-1708194527",
        "albumId": "heronwater-alb-1708194357",
        "title": "Любить буду",
        "albumTitle": "DREAMS MONEY CAN BUY",
        "artist": "Heronwater",
        "year": 2023,
        "duration": "1:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/bd/87/f9bd8702-c73a-7f5d-4885-dae6f6b1bc29/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D1%8E%D0%B1%D0%B8%D1%82%D1%8C-%D0%B1%D1%83%D0%B4%D1%83/1708194357?i=1708194527&uo=4"
      },
      {
        "id": "heronwater-trk-1708194533",
        "albumId": "heronwater-alb-1708194357",
        "title": "2 часа ночи",
        "albumTitle": "DREAMS MONEY CAN BUY",
        "artist": "Heronwater",
        "year": 2023,
        "duration": "2:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/bd/87/f9bd8702-c73a-7f5d-4885-dae6f6b1bc29/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/2-%D1%87%D0%B0%D1%81%D0%B0-%D0%BD%D0%BE%D1%87%D0%B8/1708194357?i=1708194533&uo=4"
      },
      {
        "id": "heronwater-trk-1706801426",
        "albumId": "heronwater-alb-1706801424",
        "title": "Зависим",
        "albumTitle": "Зависим",
        "artist": "Heronwater",
        "year": 2023,
        "duration": "2:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2e/76/37/2e7637b6-7475-e3e2-fd3b-d594fa755060/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%B2%D0%B8%D1%81%D0%B8%D0%BC/1706801424?i=1706801426&uo=4"
      },
      {
        "id": "heronwater-trk-1656709981",
        "albumId": "heronwater-alb-1656709970",
        "title": "Одаривает",
        "albumTitle": "NO COMMERCIAL LYRICS",
        "artist": "Heronwater",
        "year": 2022,
        "duration": "2:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/38/21/00382156-6383-73a7-9611-fbac42a475a4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B4%D0%B0%D1%80%D0%B8%D0%B2%D0%B0%D0%B5%D1%82/1656709970?i=1656709981&uo=4"
      },
      {
        "id": "heronwater-trk-1656709979",
        "albumId": "heronwater-alb-1656709970",
        "title": "Симп",
        "albumTitle": "NO COMMERCIAL LYRICS",
        "artist": "Heronwater",
        "year": 2022,
        "duration": "2:03",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/38/21/00382156-6383-73a7-9611-fbac42a475a4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B8%D0%BC%D0%BF/1656709970?i=1656709979&uo=4"
      },
      {
        "id": "heronwater-trk-1675881342",
        "albumId": "heronwater-alb-1675881341",
        "title": "2033",
        "albumTitle": "2033",
        "artist": "Heronwater",
        "year": 2023,
        "duration": "1:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d7/da/36/d7da36e2-615a-7275-672f-0d1262e96da8/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/2033/1675881341?i=1675881342&uo=4"
      },
      {
        "id": "heronwater-trk-1656709972",
        "albumId": "heronwater-alb-1656709970",
        "title": "В миноре",
        "albumTitle": "NO COMMERCIAL LYRICS",
        "artist": "Heronwater",
        "year": 2022,
        "duration": "2:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/38/21/00382156-6383-73a7-9611-fbac42a475a4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D0%BC%D0%B8%D0%BD%D0%BE%D1%80%D0%B5/1656709970?i=1656709972&uo=4"
      },
      {
        "id": "heronwater-trk-1656709975",
        "albumId": "heronwater-alb-1656709970",
        "title": "PROJECT X",
        "albumTitle": "NO COMMERCIAL LYRICS",
        "artist": "Heronwater",
        "year": 2022,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/38/21/00382156-6383-73a7-9611-fbac42a475a4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/project-x/1656709970?i=1656709975&uo=4"
      },
      {
        "id": "heronwater-trk-1708194365",
        "albumId": "heronwater-alb-1708194357",
        "title": "Мяу",
        "albumTitle": "DREAMS MONEY CAN BUY",
        "artist": "Heronwater",
        "year": 2023,
        "duration": "2:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f9/bd/87/f9bd8702-c73a-7f5d-4885-dae6f6b1bc29/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D1%8F%D1%83/1708194357?i=1708194365&uo=4"
      },
      {
        "id": "heronwater-trk-1840906480",
        "albumId": "heronwater-alb-1840906479",
        "title": "ТАХО",
        "albumTitle": "ТАХО",
        "artist": "Heronwater",
        "year": 2025,
        "duration": "1:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5f/2c/4a/5f2c4a19-1c68-19a0-529b-14874541d7d3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D1%85%D0%BE/1840906479?i=1840906480&uo=4"
      }
    ]
  },
  "trinadtsat-karat": {
    "name": "тринадцать карат",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/bb/50/1c/bb501c74-99f7-8af7-c6cc-7327765c8407/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "trinadtsat-karat-alb-1709651678",
        "title": "13 причин почему",
        "artist": "тринадцать карат",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/bb/50/1c/bb501c74-99f7-8af7-c6cc-7327765c8407/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/13-%D0%BF%D1%80%D0%B8%D1%87%D0%B8%D0%BD-%D0%BF%D0%BE%D1%87%D0%B5%D0%BC%D1%83/1709651678?uo=4"
      },
      {
        "id": "trinadtsat-karat-alb-1715996461",
        "title": "ещё одна ночь",
        "artist": "тринадцать карат",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d6/82/3a/d6823ab7-fe58-ba3c-1d90-d9f98640819a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B5%D1%89%D1%91-%D0%BE%D0%B4%D0%BD%D0%B0-%D0%BD%D0%BE%D1%87%D1%8C/1715996461?uo=4"
      },
      {
        "id": "trinadtsat-karat-alb-1768978233",
        "title": "VK Акустика",
        "artist": "тринадцать карат",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6d/20/c3/6d20c379-0a69-5e65-6d30-07e41162f9dd/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/vk-%D0%B0%D0%BA%D1%83%D1%81%D1%82%D0%B8%D0%BA%D0%B0/1768978233?uo=4"
      },
      {
        "id": "trinadtsat-karat-alb-1840363633",
        "title": "вопреки",
        "artist": "тринадцать карат",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/7f/d6/4d7fd6d3-32a7-26b3-3d9a-65c30b819d73/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BE%D0%BF%D1%80%D0%B5%D0%BA%D0%B8-single/1840363633?uo=4"
      },
      {
        "id": "trinadtsat-karat-alb-1736757850",
        "title": "Саша, останься со мной",
        "artist": "тринадцать карат",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/28/53/3f285345-1ac6-88a7-af3b-909e6e46776a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D1%88%D0%B0-%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D1%8C%D1%81%D1%8F-%D1%81%D0%BE-%D0%BC%D0%BD%D0%BE%D0%B9-single/1736757850?uo=4"
      },
      {
        "id": "trinadtsat-karat-alb-1707168161",
        "title": "останови меня",
        "artist": "тринадцать карат",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e2/49/5e/e2495ea9-6e96-4f91-885c-9e5b9fa5b44d/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8-%D0%BC%D0%B5%D0%BD%D1%8F-single/1707168161?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "trinadtsat-karat-trk-1709651839",
        "albumId": "trinadtsat-karat-alb-1709651678",
        "title": "больше не буду (feat. Три дня дождя)",
        "albumTitle": "13 причин почему",
        "artist": "тринадцать карат",
        "year": 2022,
        "duration": "2:19",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/bb/50/1c/bb501c74-99f7-8af7-c6cc-7327765c8407/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%B5-%D0%BD%D0%B5-%D0%B1%D1%83%D0%B4%D1%83-feat-%D1%82%D1%80%D0%B8-%D0%B4%D0%BD%D1%8F-%D0%B4%D0%BE%D0%B6%D0%B4%D1%8F/1709651678?i=1709651839&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1736757856",
        "albumId": "trinadtsat-karat-alb-1736757850",
        "title": "Саша, останься со мной",
        "albumTitle": "Саша, останься со мной",
        "artist": "тринадцать карат",
        "year": 2024,
        "duration": "2:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/28/53/3f285345-1ac6-88a7-af3b-909e6e46776a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D1%88%D0%B0-%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D1%8C%D1%81%D1%8F-%D1%81%D0%BE-%D0%BC%D0%BD%D0%BE%D0%B9/1736757850?i=1736757856&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1715996463",
        "albumId": "trinadtsat-karat-alb-1715996461",
        "title": "запутанный мир",
        "albumTitle": "ещё одна ночь",
        "artist": "тринадцать карат",
        "year": 2023,
        "duration": "2:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d6/82/3a/d6823ab7-fe58-ba3c-1d90-d9f98640819a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%BF%D1%83%D1%82%D0%B0%D0%BD%D0%BD%D1%8B%D0%B9-%D0%BC%D0%B8%D1%80/1715996461?i=1715996463&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1840363634",
        "albumId": "trinadtsat-karat-alb-1840363633",
        "title": "вопреки",
        "albumTitle": "вопреки",
        "artist": "тринадцать карат",
        "year": 2025,
        "duration": "2:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/7f/d6/4d7fd6d3-32a7-26b3-3d9a-65c30b819d73/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BE%D0%BF%D1%80%D0%B5%D0%BA%D0%B8/1840363633?i=1840363634&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1709651681",
        "albumId": "trinadtsat-karat-alb-1709651678",
        "title": "во снах",
        "albumTitle": "13 причин почему",
        "artist": "тринадцать карат",
        "year": 2022,
        "duration": "2:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/bb/50/1c/bb501c74-99f7-8af7-c6cc-7327765c8407/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BE-%D1%81%D0%BD%D0%B0%D1%85/1709651678?i=1709651681&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1709649661",
        "albumId": "trinadtsat-karat-alb-1709649660",
        "title": "поменяет местами",
        "albumTitle": "поменяет местами",
        "artist": "тринадцать карат",
        "year": 2023,
        "duration": "2:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/25/63/4b/25634b47-420b-6346-84d8-a39a052d7bc9/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%BC%D0%B5%D0%BD%D1%8F%D0%B5%D1%82-%D0%BC%D0%B5%D1%81%D1%82%D0%B0%D0%BC%D0%B8/1709649660?i=1709649661&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1709646978",
        "albumId": "trinadtsat-karat-alb-1709646977",
        "title": "обними обнимаю",
        "albumTitle": "обними обнимаю",
        "artist": "тринадцать карат",
        "year": 2021,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e3/58/6e/e3586eac-6940-f8eb-011f-4832e3e3bceb/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D0%BD%D0%B8%D0%BC%D0%B8-%D0%BE%D0%B1%D0%BD%D0%B8%D0%BC%D0%B0%D1%8E/1709646977?i=1709646978&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1707168163",
        "albumId": "trinadtsat-karat-alb-1707168161",
        "title": "останови меня",
        "albumTitle": "останови меня",
        "artist": "тринадцать карат",
        "year": 2023,
        "duration": "2:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e2/49/5e/e2495ea9-6e96-4f91-885c-9e5b9fa5b44d/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8-%D0%BC%D0%B5%D0%BD%D1%8F/1707168161?i=1707168163&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1709649755",
        "albumId": "trinadtsat-karat-alb-1709649753",
        "title": "только ты никогда не узнаешь",
        "albumTitle": "только ты никогда не узнаешь",
        "artist": "тринадцать карат",
        "year": 2023,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a2/57/30/a25730bb-85a1-3286-1bd0-c47bafad6856/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE-%D1%82%D1%8B-%D0%BD%D0%B8%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0-%D0%BD%D0%B5-%D1%83%D0%B7%D0%BD%D0%B0%D0%B5%D1%88%D1%8C/1709649753?i=1709649755&uo=4"
      },
      {
        "id": "trinadtsat-karat-trk-1715996469",
        "albumId": "trinadtsat-karat-alb-1715996461",
        "title": "жвачка",
        "albumTitle": "ещё одна ночь",
        "artist": "тринадцать карат",
        "year": 2023,
        "duration": "1:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d6/82/3a/d6823ab7-fe58-ba3c-1d90-d9f98640819a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B6%D0%B2%D0%B0%D1%87%D0%BA%D0%B0/1715996461?i=1715996469&uo=4"
      }
    ]
  },
  "sqwoz-bab": {
    "name": "SQWOZ BAB",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/50/69/92/5069920a-8cc3-3538-b2ab-336a8193c1db/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "sqwoz-bab-alb-1512800192",
        "title": "BODY LANGUAGE",
        "artist": "SQWOZ BAB",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/50/69/92/5069920a-8cc3-3538-b2ab-336a8193c1db/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/body-language/1512800192?uo=4"
      },
      {
        "id": "sqwoz-bab-alb-1883012941",
        "title": "WOMANIZER",
        "artist": "SQWOZ BAB",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c0/be/ac/c0beace4-9d07-c1fb-a045-c793d54ca515/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/womanizer/1883012941?uo=4"
      },
      {
        "id": "sqwoz-bab-alb-1709943924",
        "title": "OUT OF BOUNDS",
        "artist": "SQWOZ BAB",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/78/97/be/7897be25-199c-0578-06ab-4bb673a61a92/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/out-of-bounds/1709943924?uo=4"
      },
      {
        "id": "sqwoz-bab-alb-1656054013",
        "title": "2 BOYZ NO CAP",
        "artist": "Джарахов, SQWOZ BAB",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/02/0c/1a/020c1ab7-8de3-4604-f6f0-3e04f6137531/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/2-boyz-no-cap/1656054013?uo=4"
      },
      {
        "id": "sqwoz-bab-alb-1655154027",
        "title": "FLOWJOB",
        "artist": "SQWOZ BAB",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/5b/df/a1/5bdfa1aa-03a8-ca22-51f8-58d875a4900d/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/flowjob/1655154027?uo=4"
      },
      {
        "id": "sqwoz-bab-alb-1620582502",
        "title": "ЗАПИСКИ О ЛЮБВИ",
        "artist": "SQWOZ BAB",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/19/7e/ad/197ead18-3651-88b6-0d76-47c1f121a9ce/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D0%BA%D0%B8-%D0%BE-%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8-ep/1620582502?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "sqwoz-bab-trk-1512750998",
        "albumId": "sqwoz-bab-alb-1512750755",
        "title": "ОЙ",
        "albumTitle": "ОЙ",
        "artist": "SQWOZ BAB",
        "year": 2020,
        "duration": "2:37",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/de/d2/52/ded252be-7b3a-0cb9-5f52-3ef1f392cc27/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B9/1512750755?i=1512750998&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1454363957",
        "albumId": "sqwoz-bab-alb-1454363948",
        "title": "Татарский богатырь",
        "albumTitle": "Татарский богатырь",
        "artist": "SQWOZ BAB",
        "year": 2019,
        "duration": "2:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/2e/2a/0b/2e2a0b4d-1ed7-3876-e962-2c6e153c29e1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D1%82%D0%B0%D1%80%D1%81%D0%BA%D0%B8%D0%B9-%D0%B1%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%80%D1%8C/1454363948?i=1454363957&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1797153456",
        "albumId": "sqwoz-bab-alb-1797153454",
        "title": "TOKYO",
        "albumTitle": "TOKYO",
        "artist": "SQWOZ BAB",
        "year": 2026,
        "duration": "2:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ea/58/6d/ea586d8f-b239-63c3-09ae-86e7602ab33d/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/tokyo/1797153454?i=1797153456&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1862853758",
        "albumId": "sqwoz-bab-alb-1862853756",
        "title": "КУПЕР",
        "albumTitle": "КУПЕР",
        "artist": "SQWOZ BAB",
        "year": 2025,
        "duration": "1:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e5/ff/19/e5ff194d-5f9b-f4a3-835e-6484b50579cf/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%83%D0%BF%D0%B5%D1%80/1862853756?i=1862853758&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1743407268",
        "albumId": "sqwoz-bab-alb-1743407177",
        "title": "ОЗЕРО В ЛЕСУ",
        "albumTitle": "ОЗЕРО В ЛЕСУ",
        "artist": "SQWOZ BAB",
        "year": 2024,
        "duration": "2:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/45/02/6f/45026f77-51b6-5527-2b4f-6cee60959c59/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B7%D0%B5%D1%80%D0%BE-%D0%B2-%D0%BB%D0%B5%D1%81%D1%83/1743407177?i=1743407268&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1484946492",
        "albumId": "sqwoz-bab-alb-1484946488",
        "title": "Кусь",
        "albumTitle": "Кусь",
        "artist": "SQWOZ BAB",
        "year": 2019,
        "duration": "2:19",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/54/33/8f/54338f45-9aa0-63da-5495-67a22a95dc06/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%83%D1%81%D1%8C/1484946488?i=1484946492&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1446442613",
        "albumId": "sqwoz-bab-alb-1446441663",
        "title": "ЕБЕНЯ",
        "albumTitle": "ЕБЕНЯ",
        "artist": "SQWOZ BAB",
        "year": 2018,
        "duration": "4:09",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/ab/eb/1d/abeb1d99-9703-bd5a-7899-2b98049bbae9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B5%D0%B1%D0%B5%D0%BD%D1%8F/1446441663?i=1446442613&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1839936092",
        "albumId": "sqwoz-bab-alb-1839936091",
        "title": "ROMANTIC",
        "albumTitle": "ROMANTIC",
        "artist": "SQWOZ BAB",
        "year": 2025,
        "duration": "2:36",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/96/09/6c/96096ca2-371d-5364-ccb5-36f1b677fa94/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/romantic/1839936091?i=1839936092&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1512800921",
        "albumId": "sqwoz-bab-alb-1512800192",
        "title": "СБЕРБАНК",
        "albumTitle": "BODY LANGUAGE",
        "artist": "SQWOZ BAB",
        "year": 2020,
        "duration": "2:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/50/69/92/5069920a-8cc3-3538-b2ab-336a8193c1db/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B1%D0%B5%D1%80%D0%B1%D0%B0%D0%BD%D0%BA/1512800192?i=1512800921&uo=4"
      },
      {
        "id": "sqwoz-bab-trk-1553250368",
        "albumId": "sqwoz-bab-alb-1553250033",
        "title": "СЛУ4АЙ",
        "albumTitle": "СЛУ4АЙ",
        "artist": "SQWOZ BAB",
        "year": 2021,
        "duration": "3:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/69/76/2a/69762a44-e803-c623-4677-a4b71cf89e51/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BB%D1%834%D0%B0%D0%B9/1553250033?i=1553250368&uo=4"
      }
    ]
  },
  "villian": {
    "name": "VILLIAN",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "villian-alb-6793617802",
        "title": "Красивое Зло",
        "artist": "VILLIAN",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D0%B0%D1%81%D0%B8%D0%B2%D0%BE%D0%B5-%D0%B7%D0%BB%D0%BE/6793617802?uo=4"
      },
      {
        "id": "villian-alb-1876651874",
        "title": "8 миля",
        "artist": "madk1d, VILLIAN",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1f/7e/30/1f7e3068-4538-8d0a-31eb-ff3f93e13ad3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/8-%D0%BC%D0%B8%D0%BB%D1%8F-single/1876651874?uo=4"
      },
      {
        "id": "villian-alb-1818375140",
        "title": "Курение Вредит Вашему Здоровью",
        "artist": "VILLIAN",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a8/e7/bb/a8e7bb2b-9b20-f02b-d028-0c255623b8ff/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2%D1%80%D0%B5%D0%B4%D0%B8%D1%82-%D0%B2%D0%B0%D1%88%D0%B5%D0%BC%D1%83-%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D1%8E-single/1818375140?uo=4"
      },
      {
        "id": "villian-alb-6790490405",
        "title": "Общество Мертвых Поэтов",
        "artist": "VILLIAN, Aarne",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/18/4e/73/184e73d6-99e7-ae24-9905-02615743c4f1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%BE-%D0%BC%D0%B5%D1%80%D1%82%D0%B2%D1%8B%D1%85-%D0%BF%D0%BE%D1%8D%D1%82%D0%BE%D0%B2-single/6790490405?uo=4"
      },
      {
        "id": "villian-alb-1835711769",
        "title": "Случайно Наступил На Шприц",
        "artist": "VILLIAN",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1b/b1/db/1bb1db28-4b9a-aa63-8394-094ae3d493e9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D0%BE-%D0%BD%D0%B0%D1%81%D1%82%D1%83%D0%BF%D0%B8%D0%BB-%D0%BD%D0%B0-%D1%88%D0%BF%D1%80%D0%B8%D1%86-single/1835711769?uo=4"
      },
      {
        "id": "villian-alb-1840221677",
        "title": "Яд В Шее",
        "artist": "VILLIAN",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/45/a3/6b/45a36b70-19a0-2508-2b49-12b0448601ac/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F%D0%B4-%D0%B2-%D1%88%D0%B5%D0%B5-single/1840221677?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "villian-trk-1835712027",
        "albumId": "villian-alb-1835711769",
        "title": "Случайно Наступил На Шприц",
        "albumTitle": "Случайно Наступил На Шприц",
        "artist": "VILLIAN",
        "year": 2025,
        "duration": "1:34",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1b/b1/db/1bb1db28-4b9a-aa63-8394-094ae3d493e9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D0%BE-%D0%BD%D0%B0%D1%81%D1%82%D1%83%D0%BF%D0%B8%D0%BB-%D0%BD%D0%B0-%D1%88%D0%BF%D1%80%D0%B8%D1%86/1835711769?i=1835712027&uo=4"
      },
      {
        "id": "villian-trk-1818375295",
        "albumId": "villian-alb-1818375140",
        "title": "Курение Вредит Вашему Здоровью",
        "albumTitle": "Курение Вредит Вашему Здоровью",
        "artist": "VILLIAN",
        "year": 2025,
        "duration": "1:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a8/e7/bb/a8e7bb2b-9b20-f02b-d028-0c255623b8ff/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%83%D1%80%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B2%D1%80%D0%B5%D0%B4%D0%B8%D1%82-%D0%B2%D0%B0%D1%88%D0%B5%D0%BC%D1%83-%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D1%8E/1818375140?i=1818375295&uo=4"
      },
      {
        "id": "villian-trk-6793620666",
        "albumId": "villian-alb-6793617802",
        "title": "Оторву Руки",
        "albumTitle": "Красивое Зло",
        "artist": "VILLIAN",
        "year": 2026,
        "duration": "1:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%82%D0%BE%D1%80%D0%B2%D1%83-%D1%80%D1%83%D0%BA%D0%B8/6793617802?i=6793620666&uo=4"
      },
      {
        "id": "villian-trk-1842444988",
        "albumId": "villian-alb-1842444588",
        "title": "TOO GREEDY",
        "albumTitle": "RANSOM RIDDIM",
        "artist": "VILLIAN",
        "year": 2025,
        "duration": "3:29",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/15/6f/dc/156fdc3a-89d2-fb41-8e97-833b106ed4e4/195375834067_cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/too-greedy/1842444588?i=1842444988&uo=4"
      },
      {
        "id": "villian-trk-6793620677",
        "albumId": "villian-alb-6793617802",
        "title": "Чувство Собственной Важности",
        "albumTitle": "Красивое Зло",
        "artist": "VILLIAN",
        "year": 2026,
        "duration": "1:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%87%D1%83%D0%B2%D1%81%D1%82%D0%B2%D0%BE-%D1%81%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9-%D0%B2%D0%B0%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D0%B8/6793617802?i=6793620677&uo=4"
      },
      {
        "id": "villian-trk-1840221684",
        "albumId": "villian-alb-1840221677",
        "title": "Яд В Шее",
        "albumTitle": "Яд В Шее",
        "artist": "VILLIAN",
        "year": 2025,
        "duration": "2:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/45/a3/6b/45a36b70-19a0-2508-2b49-12b0448601ac/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F%D0%B4-%D0%B2-%D1%88%D0%B5%D0%B5/1840221677?i=1840221684&uo=4"
      },
      {
        "id": "villian-trk-1856035136",
        "albumId": "villian-alb-1856035133",
        "title": "Нехватка Виденья",
        "albumTitle": "Нехватка Виденья",
        "artist": "VILLIAN",
        "year": 2025,
        "duration": "1:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/1d/cc/a91dcc88-844e-4b1a-4463-986c7999746f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D1%85%D0%B2%D0%B0%D1%82%D0%BA%D0%B0-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BD%D1%8C%D1%8F/1856035133?i=1856035136&uo=4"
      },
      {
        "id": "villian-trk-6793620669",
        "albumId": "villian-alb-6793617802",
        "title": "Лифт Упал",
        "albumTitle": "Красивое Зло",
        "artist": "VILLIAN",
        "year": 2026,
        "duration": "1:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B8%D1%84%D1%82-%D1%83%D0%BF%D0%B0%D0%BB/6793617802?i=6793620669&uo=4"
      },
      {
        "id": "villian-trk-6793620683",
        "albumId": "villian-alb-6793617802",
        "title": "Мешают Спать",
        "albumTitle": "Красивое Зло",
        "artist": "VILLIAN",
        "year": 2026,
        "duration": "1:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1f/72/90/1f729078-0a21-ede0-5246-f501f51a7339/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B5%D1%88%D0%B0%D1%8E%D1%82-%D1%81%D0%BF%D0%B0%D1%82%D1%8C/6793617802?i=6793620683&uo=4"
      },
      {
        "id": "villian-trk-6767705165",
        "albumId": "villian-alb-6767704813",
        "title": "SATIVA",
        "albumTitle": "ON TAPP RIDDIM",
        "artist": "VILLIAN",
        "year": 2026,
        "duration": "3:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d1/05/4d/d1054d84-74e3-2733-43ef-90b74f736740/199890103554_cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sativa/6767704813?i=6767705165&uo=4"
      }
    ]
  },
  "mayot": {
    "name": "MAYOT",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "mayot-alb-1528172398",
        "title": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/ghetto-garden/1528172398?uo=4"
      },
      {
        "id": "mayot-alb-1543861481",
        "title": "ЗАПРАВКА КИД",
        "artist": "MAYOT",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9d/3e/53/9d3e5366-ebba-0b95-373d-037813e419ed/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BA%D0%B8%D0%B4/1543861481?uo=4"
      },
      {
        "id": "mayot-alb-1558162787",
        "title": "ЗАПРАВКА КИД 2",
        "artist": "MAYOT",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/41/07/eb/4107eb1b-ab56-6dff-baca-7ef8895f899f/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0-%D0%BA%D0%B8%D0%B4-2/1558162787?uo=4"
      },
      {
        "id": "mayot-alb-1698975492",
        "title": "ОБА",
        "artist": "MAYOT",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/00/8f/03/008f03b5-42ef-91af-7188-3099bad658ed/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%B1%D0%B0/1698975492?uo=4"
      },
      {
        "id": "mayot-alb-1744382514",
        "title": "З4ПРАВК4 КИД",
        "artist": "MAYOT",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/46/f9/d1/46f9d1a0-6e62-b3c2-363d-b790f5715051/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B74%D0%BF%D1%80%D0%B0%D0%B2%D0%BA4-%D0%BA%D0%B8%D0%B4/1744382514?uo=4"
      },
      {
        "id": "mayot-alb-1631104900",
        "title": "SCUM OFF THE POT 2",
        "artist": "MAYOT, SEEMEE",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/4a/b8/794ab81c-eda6-7963-4bd2-bc1a32450b25/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/scum-off-the-pot-2/1631104900?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "mayot-trk-1528172890",
        "albumId": "mayot-alb-1528172398",
        "title": "Море (feat. FEDUK) [Remix]",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "3:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D1%80%D0%B5-feat-feduk-remix/1528172398?i=1528172890&uo=4"
      },
      {
        "id": "mayot-trk-1528172910",
        "albumId": "mayot-alb-1528172398",
        "title": "Снег",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2019,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BD%D0%B5%D0%B3/1528172398?i=1528172910&uo=4"
      },
      {
        "id": "mayot-trk-1528172403",
        "albumId": "mayot-alb-1528172398",
        "title": "Ауди (feat. BUSHIDO ZHO & SEEMEE)",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "2:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B0%D1%83%D0%B4%D0%B8-feat-bushido-zho-seemee/1528172398?i=1528172403&uo=4"
      },
      {
        "id": "mayot-trk-1574928429",
        "albumId": "mayot-alb-1574928428",
        "title": "В моих мыслях",
        "albumTitle": "В моих мыслях",
        "artist": "MAYOT",
        "year": 2021,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0d/54/93/0d549353-16b2-9ad3-b10a-066c2b951ed1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D0%BC%D0%BE%D0%B8%D1%85-%D0%BC%D1%8B%D1%81%D0%BB%D1%8F%D1%85/1574928428?i=1574928429&uo=4"
      },
      {
        "id": "mayot-trk-1528172902",
        "albumId": "mayot-alb-1528172398",
        "title": "Звезда упала",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "3:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%B0-%D1%83%D0%BF%D0%B0%D0%BB%D0%B0/1528172398?i=1528172902&uo=4"
      },
      {
        "id": "mayot-trk-1528172903",
        "albumId": "mayot-alb-1528172398",
        "title": "Джинсы (feat. OG Buda)",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "3:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B6%D0%B8%D0%BD%D1%81%D1%8B-feat-og-buda/1528172398?i=1528172903&uo=4"
      },
      {
        "id": "mayot-trk-1528172892",
        "albumId": "mayot-alb-1528172398",
        "title": "Лилия",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "1:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B8%D0%BB%D0%B8%D1%8F/1528172398?i=1528172892&uo=4"
      },
      {
        "id": "mayot-trk-1698975725",
        "albumId": "mayot-alb-1698975492",
        "title": "до сих пор",
        "albumTitle": "ОБА",
        "artist": "MAYOT",
        "year": 2023,
        "duration": "3:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/00/8f/03/008f03b5-42ef-91af-7188-3099bad658ed/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BE-%D1%81%D0%B8%D1%85-%D0%BF%D0%BE%D1%80/1698975492?i=1698975725&uo=4"
      },
      {
        "id": "mayot-trk-1558162805",
        "albumId": "mayot-alb-1558162787",
        "title": "Киллер",
        "albumTitle": "ЗАПРАВКА КИД 2",
        "artist": "MAYOT",
        "year": 2021,
        "duration": "1:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/41/07/eb/4107eb1b-ab56-6dff-baca-7ef8895f899f/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B8%D0%BB%D0%BB%D0%B5%D1%80/1558162787?i=1558162805&uo=4"
      },
      {
        "id": "mayot-trk-1528172913",
        "albumId": "mayot-alb-1528172398",
        "title": "Впадлу (feat. SEEMEE & 163ONMYNECK) [Slow]",
        "albumTitle": "GHETTO GARDEN",
        "artist": "MAYOT",
        "year": 2020,
        "duration": "3:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3b/ae/7d/3bae7da6-8b46-2f08-cd60-57d9edfb7240/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%BF%D0%B0%D0%B4%D0%BB%D1%83-feat-seemee-163onmyneck-slow/1528172398?i=1528172913&uo=4"
      }
    ]
  },
  "basta": {
    "name": "Баста",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "basta-alb-1104558583",
        "title": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D1%81%D1%82%D0%B0-5-%D1%87%D0%B0%D1%81%D1%82%D1%8C-1/1104558583?uo=4"
      },
      {
        "id": "basta-alb-1112971476",
        "title": "Баста 5, Часть 2",
        "artist": "Баста",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/12/96/fd129611-14ab-fef9-3867-ae335d088d46/B5_2_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D1%81%D1%82%D0%B0-5-%D1%87%D0%B0%D1%81%D1%82%D1%8C-2/1112971476?uo=4"
      },
      {
        "id": "basta-alb-1492995507",
        "title": "Так и живьём. Дорожный альбом (Live)",
        "artist": "Баста",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/76/7c/dd/767cdde3-a9ba-c2c2-61cc-b4aa203b7160/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D0%BA-%D0%B8-%D0%B6%D0%B8%D0%B2%D1%8C%D1%91%D0%BC-%D0%B4%D0%BE%D1%80%D0%BE%D0%B6%D0%BD%D1%8B%D0%B9-%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC-live/1492995507?uo=4"
      },
      {
        "id": "basta-alb-1893417528",
        "title": "Баста/Гуф 2026",
        "artist": "Баста, GUF",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/58/d4/ef/58d4efaa-ae02-03c0-1dd6-41dfc7a6075c/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D1%81%D1%82%D0%B0-%D0%B3%D1%83%D1%84-2026/1893417528?uo=4"
      },
      {
        "id": "basta-alb-6792740553",
        "title": "Баста / Гуф",
        "artist": "Баста, GUF",
        "year": 2010,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f8/af/c5/f8afc5f2-98b0-caf1-437a-a6b957c9162b/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D1%81%D1%82%D0%B0-%D0%B3%D1%83%D1%84/6792740553?uo=4"
      },
      {
        "id": "basta-alb-1750512043",
        "title": "Акустика",
        "artist": "Баста",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/87/a5/a987a5cc-376c-fd28-9bdb-05539610b1eb/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B0%D0%BA%D1%83%D1%81%D1%82%D0%B8%D0%BA%D0%B0/1750512043?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "basta-trk-1112971495",
        "albumId": "basta-alb-1112971476",
        "title": "Выпускной (Медлячок)",
        "albumTitle": "Баста 5, Часть 2",
        "artist": "Баста",
        "year": 2016,
        "duration": "5:35",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/12/96/fd129611-14ab-fef9-3867-ae335d088d46/B5_2_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA%D0%BD%D0%BE%D0%B9-%D0%BC%D0%B5%D0%B4%D0%BB%D1%8F%D1%87%D0%BE%D0%BA/1112971476?i=1112971495&uo=4"
      },
      {
        "id": "basta-trk-1112971607",
        "albumId": "basta-alb-1112971476",
        "title": "Я поднимаюсь над землёй (feat. Алёна Омаргалиева)",
        "albumTitle": "Баста 5, Часть 2",
        "artist": "Баста",
        "year": 2016,
        "duration": "3:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/12/96/fd129611-14ab-fef9-3867-ae335d088d46/B5_2_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D0%BF%D0%BE%D0%B4%D0%BD%D0%B8%D0%BC%D0%B0%D1%8E%D1%81%D1%8C-%D0%BD%D0%B0%D0%B4-%D0%B7%D0%B5%D0%BC%D0%BB%D1%91%D0%B9-feat-%D0%B0%D0%BB%D1%91%D0%BD%D0%B0-%D0%BE%D0%BC%D0%B0%D1%80%D0%B3%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0/1112971476?i=1112971607&uo=4"
      },
      {
        "id": "basta-trk-1112971500",
        "albumId": "basta-alb-1112971476",
        "title": "Мои разбитые мечты",
        "albumTitle": "Баста 5, Часть 2",
        "artist": "Баста",
        "year": 2016,
        "duration": "3:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/12/96/fd129611-14ab-fef9-3867-ae335d088d46/B5_2_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D0%B8-%D1%80%D0%B0%D0%B7%D0%B1%D0%B8%D1%82%D1%8B%D0%B5-%D0%BC%D0%B5%D1%87%D1%82%D1%8B/1112971476?i=1112971500&uo=4"
      },
      {
        "id": "basta-trk-1104558646",
        "albumId": "basta-alb-1104558583",
        "title": "Там, где нас нет",
        "albumTitle": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2015,
        "duration": "4:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D0%BC-%D0%B3%D0%B4%D0%B5-%D0%BD%D0%B0%D1%81-%D0%BD%D0%B5%D1%82/1104558583?i=1104558646&uo=4"
      },
      {
        "id": "basta-trk-1104558610",
        "albumId": "basta-alb-1104558583",
        "title": "Я смотрю на небо",
        "albumTitle": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2016,
        "duration": "4:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D1%81%D0%BC%D0%BE%D1%82%D1%80%D1%8E-%D0%BD%D0%B0-%D0%BD%D0%B5%D0%B1%D0%BE/1104558583?i=1104558610&uo=4"
      },
      {
        "id": "basta-trk-1112971581",
        "albumId": "basta-alb-1112971476",
        "title": "Я почти погиб",
        "albumTitle": "Баста 5, Часть 2",
        "artist": "Баста",
        "year": 2016,
        "duration": "5:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/12/96/fd129611-14ab-fef9-3867-ae335d088d46/B5_2_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D0%BF%D0%BE%D1%87%D1%82%D0%B8-%D0%BF%D0%BE%D0%B3%D0%B8%D0%B1/1112971476?i=1112971581&uo=4"
      },
      {
        "id": "basta-trk-1104558643",
        "albumId": "basta-alb-1104558583",
        "title": "Хочу к тебе",
        "albumTitle": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2015,
        "duration": "3:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%85%D0%BE%D1%87%D1%83-%D0%BA-%D1%82%D0%B5%D0%B1%D0%B5/1104558583?i=1104558643&uo=4"
      },
      {
        "id": "basta-trk-1104558644",
        "albumId": "basta-alb-1104558583",
        "title": "Буду",
        "albumTitle": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2016,
        "duration": "5:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D1%83%D0%B4%D1%83/1104558583?i=1104558644&uo=4"
      },
      {
        "id": "basta-trk-850464940",
        "albumId": "basta-alb-850463784",
        "title": "ЧК (Чистый кайф)",
        "albumTitle": "ЧК (Чистый кайф)",
        "artist": "Баста",
        "year": 2013,
        "duration": "6:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/01/3a/2a/013a2ade-48a8-0401-2e96-0bfdeae64e3b/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%87%D0%BA-%D1%87%D0%B8%D1%81%D1%82%D1%8B%D0%B9-%D0%BA%D0%B0%D0%B9%D1%84/850463784?i=850464940&uo=4"
      },
      {
        "id": "basta-trk-1104558641",
        "albumId": "basta-alb-1104558583",
        "title": "Партизан",
        "albumTitle": "Баста 5, Часть 1",
        "artist": "Баста",
        "year": 2016,
        "duration": "2:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/0e/e3/ed/0ee3eda2-dc16-8420-13ff-d37e35d27630/BASTA-5_part1_iTunes.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B0%D1%80%D1%82%D0%B8%D0%B7%D0%B0%D0%BD/1104558583?i=1104558641&uo=4"
      }
    ]
  },
  "guf": {
    "name": "GUF",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/8a/31/44/8a3144c6-8bd0-5f34-7d65-5fd8674c619c/825646494842.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "guf-alb-1052191917",
        "title": "Ещё",
        "artist": "GUF",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/8a/31/44/8a3144c6-8bd0-5f34-7d65-5fd8674c619c/825646494842.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B5%D1%89%D1%91/1052191917?uo=4"
      },
      {
        "id": "guf-alb-910516190",
        "title": "420",
        "artist": "GUF, Rigos",
        "year": 2014,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0e/33/0b/0e330b73-49c8-336b-7b01-97d4d91dbae5/825646496693.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/420/910516190?uo=4"
      },
      {
        "id": "guf-alb-830247975",
        "title": "Сам и…",
        "artist": "GUF",
        "year": 2013,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/64/d5/0e/64d50e44-8d1e-e5dd-aa75-67a1e39a0fa4/825646498628.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D0%BC-%D0%B8/830247975?uo=4"
      },
      {
        "id": "guf-alb-830239805",
        "title": "Дома",
        "artist": "GUF",
        "year": 2009,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/c5/44/2dc5446a-d19e-9506-9321-358411ff21fc/825646498635.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BE%D0%BC%D0%B0/830239805?uo=4"
      },
      {
        "id": "guf-alb-1509005010",
        "title": "Дом, который построил Алик",
        "artist": "GUF, Murovei",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/40/53/04/40530434-60ec-963e-bb19-2c37c882b05a/190295290450.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BE%D0%BC-%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B9-%D0%BF%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B8%D0%BB-%D0%B0%D0%BB%D0%B8%D0%BA/1509005010?uo=4"
      },
      {
        "id": "guf-alb-1718275339",
        "title": "Zапретное Место",
        "artist": "GUF",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/16/ec/4c/16ec4c50-5985-4eaf-19e3-40d2074a68e4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/z%D0%B0%D0%BF%D1%80%D0%B5%D1%82%D0%BD%D0%BE%D0%B5-%D0%BC%D0%B5%D1%81%D1%82%D0%BE/1718275339?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "guf-trk-830239818",
        "albumId": "guf-alb-830239805",
        "title": "Ice Baby",
        "albumTitle": "Дома",
        "artist": "GUF",
        "year": 2009,
        "duration": "4:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/c5/44/2dc5446a-d19e-9506-9321-358411ff21fc/825646498635.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/ice-baby/830239805?i=830239818&uo=4"
      },
      {
        "id": "guf-trk-830248017",
        "albumId": "guf-alb-830247975",
        "title": "Письмо домой",
        "albumTitle": "Сам и…",
        "artist": "GUF",
        "year": 2013,
        "duration": "4:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/64/d5/0e/64d50e44-8d1e-e5dd-aa75-67a1e39a0fa4/825646498628.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B8%D1%81%D1%8C%D0%BC%D0%BE-%D0%B4%D0%BE%D0%BC%D0%BE%D0%B9/830247975?i=830248017&uo=4"
      },
      {
        "id": "guf-trk-983954677",
        "albumId": "guf-alb-983954676",
        "title": "Плохо или хорошо",
        "albumTitle": "Плохо или хорошо",
        "artist": "GUF",
        "year": 2015,
        "duration": "3:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/31/23/01/3123019e-2ea3-236b-83dc-2b6344956b34/825646495450.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BB%D0%BE%D1%85%D0%BE-%D0%B8%D0%BB%D0%B8-%D1%85%D0%BE%D1%80%D0%BE%D1%88%D0%BE/983954676?i=983954677&uo=4"
      },
      {
        "id": "guf-trk-1052192233",
        "albumId": "guf-alb-1052191917",
        "title": "Вживую (feat. Rigos)",
        "albumTitle": "Ещё",
        "artist": "GUF",
        "year": 2015,
        "duration": "4:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/8a/31/44/8a3144c6-8bd0-5f34-7d65-5fd8674c619c/825646494842.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%B6%D0%B8%D0%B2%D1%83%D1%8E-feat-rigos/1052191917?i=1052192233&uo=4"
      },
      {
        "id": "guf-trk-1320061711",
        "albumId": "guf-alb-1320061703",
        "title": "Маугли II",
        "albumTitle": "Маугли II",
        "artist": "GUF",
        "year": 2017,
        "duration": "3:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/8a/03/35/8a03354f-a8be-20c8-e7f8-39292a2fe501/190295813253.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D1%83%D0%B3%D0%BB%D0%B8-ii/1320061703?i=1320061711&uo=4"
      },
      {
        "id": "guf-trk-1188684653",
        "albumId": "guf-alb-1188684648",
        "title": "Про лето",
        "albumTitle": "Про лето",
        "artist": "GUF",
        "year": 2016,
        "duration": "4:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music91/v4/ac/51/78/ac517873-a3d2-76c6-e02e-bf2597897985/190295980900.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D1%80%D0%BE-%D0%BB%D0%B5%D1%82%D0%BE/1188684648?i=1188684653&uo=4"
      },
      {
        "id": "guf-trk-1052192232",
        "albumId": "guf-alb-1052191917",
        "title": "Хочу ещё",
        "albumTitle": "Ещё",
        "artist": "GUF",
        "year": 2015,
        "duration": "3:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/8a/31/44/8a3144c6-8bd0-5f34-7d65-5fd8674c619c/825646494842.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%85%D0%BE%D1%87%D1%83-%D0%B5%D1%89%D1%91/1052191917?i=1052192232&uo=4"
      },
      {
        "id": "guf-trk-830239814",
        "albumId": "guf-alb-830239805",
        "title": "Для неё",
        "albumTitle": "Дома",
        "artist": "GUF",
        "year": 2009,
        "duration": "3:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/c5/44/2dc5446a-d19e-9506-9321-358411ff21fc/825646498635.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BB%D1%8F-%D0%BD%D0%B5%D1%91/830239805?i=830239814&uo=4"
      },
      {
        "id": "guf-trk-1052191921",
        "albumId": "guf-alb-1052191917",
        "title": "Выдох-вдох",
        "albumTitle": "Ещё",
        "artist": "GUF",
        "year": 2014,
        "duration": "1:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/8a/31/44/8a3144c6-8bd0-5f34-7d65-5fd8674c619c/825646494842.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D1%8B%D0%B4%D0%BE%D1%85-%D0%B2%D0%B4%D0%BE%D1%85/1052191917?i=1052191921&uo=4"
      },
      {
        "id": "guf-trk-830239828",
        "albumId": "guf-alb-830239805",
        "title": "200 строк",
        "albumTitle": "Дома",
        "artist": "GUF",
        "year": 2014,
        "duration": "10:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/2d/c5/44/2dc5446a-d19e-9506-9321-358411ff21fc/825646498635.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/200-%D1%81%D1%82%D1%80%D0%BE%D0%BA/830239805?i=830239828&uo=4"
      }
    ]
  },
  "lida": {
    "name": "Lida",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/da/af/99/daaf9900-c445-0df9-3049-cfa58e5da6d1/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "lida-alb-1694504038",
        "title": "Дак Теилс 3",
        "artist": "Lida",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/da/af/99/daaf9900-c445-0df9-3049-cfa58e5da6d1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B0%D0%BA-%D1%82%D0%B5%D0%B8%D0%BB%D1%81-3/1694504038?uo=4"
      },
      {
        "id": "lida-alb-1620916936",
        "title": "Легкий способ бросить долги",
        "artist": "Lida",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/d2/51/d9d25183-f584-7d00-a6a8-15b56a482e2a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B5%D0%B3%D0%BA%D0%B8%D0%B9-%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1-%D0%B1%D1%80%D0%BE%D1%81%D0%B8%D1%82%D1%8C-%D0%B4%D0%BE%D0%BB%D0%B3%D0%B8-ep/1620916936?uo=4"
      },
      {
        "id": "lida-alb-1616488587",
        "title": "Музло из гаражей",
        "artist": "Lida",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ee/7c/bf/ee7cbfe2-8dde-829f-fd6d-4a318cb3ecc8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D1%83%D0%B7%D0%BB%D0%BE-%D0%B8%D0%B7-%D0%B3%D0%B0%D1%80%D0%B0%D0%B6%D0%B5%D0%B9/1616488587?uo=4"
      },
      {
        "id": "lida-alb-1616602507",
        "title": "МОЕ ИМЯ ЛИДА",
        "artist": "Lida",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/85/e4/50/85e450ee-2e93-ea51-c064-9e7bd5098a67/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D0%B5-%D0%B8%D0%BC%D1%8F-%D0%BB%D0%B8%D0%B4%D0%B0/1616602507?uo=4"
      },
      {
        "id": "lida-alb-1845426840",
        "title": "SAPSAN",
        "artist": "Lida",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/72/db/80/72db80bc-3c33-21e7-cd46-aa14e2ae297a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sapsan/1845426840?uo=4"
      },
      {
        "id": "lida-alb-1721340260",
        "title": "Жабы атаковали планету Земля",
        "artist": "Lida",
        "year": 2019,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/0c/46/4b/0c464b0d-ab10-d9e1-1a57-3d1b7da5b651/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B6%D0%B0%D0%B1%D1%8B-%D0%B0%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B0%D0%BB%D0%B8-%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%D1%83-%D0%B7%D0%B5%D0%BC%D0%BB%D1%8F/1721340260?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "lida-trk-1713123037",
        "albumId": "lida-alb-1713123036",
        "title": "Секс",
        "albumTitle": "Секс",
        "artist": "Lida",
        "year": 2023,
        "duration": "2:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c4/db/0f/c4db0f78-7a31-9b84-090d-694f6ff67474/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B5%D0%BA%D1%81/1713123036?i=1713123037&uo=4"
      },
      {
        "id": "lida-trk-1771650772",
        "albumId": "lida-alb-1771650769",
        "title": "Фото со звездой",
        "albumTitle": "Фото со звездой",
        "artist": "Lida",
        "year": 2024,
        "duration": "2:03",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ef/f7/29/eff729d7-4133-57bf-a087-e6950f231fd0/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%84%D0%BE%D1%82%D0%BE-%D1%81%D0%BE-%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D0%BE%D0%B9/1771650769?i=1771650772&uo=4"
      },
      {
        "id": "lida-trk-1742197941",
        "albumId": "lida-alb-1742197940",
        "title": "ЛАДА ТУРБО СПЕЙС",
        "albumTitle": "ЛАДА ТУРБО СПЕЙС",
        "artist": "Lida",
        "year": 2024,
        "duration": "2:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/01/26/340126f9-4f1d-5f2e-88a8-d5fe14c82032/dj.dvfoangv.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B0%D0%B4%D0%B0-%D1%82%D1%83%D1%80%D0%B1%D0%BE-%D1%81%D0%BF%D0%B5%D0%B9%D1%81/1742197940?i=1742197941&uo=4"
      },
      {
        "id": "lida-trk-1694504045",
        "albumId": "lida-alb-1694504038",
        "title": "Танцуй или умри",
        "albumTitle": "Дак Теилс 3",
        "artist": "Lida",
        "year": 2023,
        "duration": "2:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/da/af/99/daaf9900-c445-0df9-3049-cfa58e5da6d1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D0%BD%D1%86%D1%83%D0%B9-%D0%B8%D0%BB%D0%B8-%D1%83%D0%BC%D1%80%D0%B8/1694504038?i=1694504045&uo=4"
      },
      {
        "id": "lida-trk-1721340273",
        "albumId": "lida-alb-1721340260",
        "title": "Гэнг бэнг",
        "albumTitle": "Жабы атаковали планету Земля",
        "artist": "Lida",
        "year": 2019,
        "duration": "2:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/0c/46/4b/0c464b0d-ab10-d9e1-1a57-3d1b7da5b651/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D1%8D%D0%BD%D0%B3-%D0%B1%D1%8D%D0%BD%D0%B3/1721340260?i=1721340273&uo=4"
      },
      {
        "id": "lida-trk-1721340270",
        "albumId": "lida-alb-1721340260",
        "title": "Грустный реп (feat. Tenderlybae)",
        "albumTitle": "Жабы атаковали планету Земля",
        "artist": "Lida",
        "year": 2019,
        "duration": "2:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/0c/46/4b/0c464b0d-ab10-d9e1-1a57-3d1b7da5b651/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D1%80%D1%83%D1%81%D1%82%D0%BD%D1%8B%D0%B9-%D1%80%D0%B5%D0%BF-feat-tenderlybae/1721340260?i=1721340270&uo=4"
      },
      {
        "id": "lida-trk-1719140848",
        "albumId": "lida-alb-1719140845",
        "title": "Секс (Speed Up)",
        "albumTitle": "Секс (Speed Up)",
        "artist": "Lida",
        "year": 2023,
        "duration": "2:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a5/db/00/a5db00b0-681a-7cdd-1be3-a702ed5c416e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B5%D0%BA%D1%81-speed-up/1719140845?i=1719140848&uo=4"
      },
      {
        "id": "lida-trk-1721340284",
        "albumId": "lida-alb-1721340260",
        "title": "Жужжание пчелы",
        "albumTitle": "Жабы атаковали планету Земля",
        "artist": "Lida",
        "year": 2019,
        "duration": "1:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/0c/46/4b/0c464b0d-ab10-d9e1-1a57-3d1b7da5b651/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B6%D1%83%D0%B6%D0%B6%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D1%87%D0%B5%D0%BB%D1%8B/1721340260?i=1721340284&uo=4"
      },
      {
        "id": "lida-trk-1620916948",
        "albumId": "lida-alb-1620916936",
        "title": "Шерстяное худи (feat. Слава КПСС, DK & ЗАМАЙ)",
        "albumTitle": "Легкий способ бросить долги",
        "artist": "Lida",
        "year": 2022,
        "duration": "3:18",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/d2/51/d9d25183-f584-7d00-a6a8-15b56a482e2a/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%88%D0%B5%D1%80%D1%81%D1%82%D1%8F%D0%BD%D0%BE%D0%B5-%D1%85%D1%83%D0%B4%D0%B8-feat-%D1%81%D0%BB%D0%B0%D0%B2%D0%B0-%D0%BA%D0%BF%D1%81%D1%81-dk-%D0%B7%D0%B0%D0%BC%D0%B0%D0%B9/1620916936?i=1620916948&uo=4"
      },
      {
        "id": "lida-trk-1616602509",
        "albumId": "lida-alb-1616602507",
        "title": "Лиза",
        "albumTitle": "МОЕ ИМЯ ЛИДА",
        "artist": "Lida",
        "year": 2021,
        "duration": "2:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/85/e4/50/85e450ee-2e93-ea51-c064-9e7bd5098a67/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B8%D0%B7%D0%B0/1616602507?i=1616602509&uo=4"
      }
    ]
  },
  "elyaplugg": {
    "name": "elyaplugg!",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/47/9a/e4/479ae4f9-ab3e-0f59-ddaf-3d4fc607b74a/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "elyaplugg-alb-1782308862",
        "title": "ELYA VIRAL SEASON!!!",
        "artist": "elyaplugg!",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/47/9a/e4/479ae4f9-ab3e-0f59-ddaf-3d4fc607b74a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/elya-viral-season/1782308862?uo=4"
      },
      {
        "id": "elyaplugg-alb-1721568112",
        "title": "rizz music",
        "artist": "elyaplugg!",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/34/e7/b1/34e7b104-b419-6c2a-977f-fd63626f26a9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/rizz-music-ep/1721568112?uo=4"
      },
      {
        "id": "elyaplugg-alb-1850319697",
        "title": "days before NIKITA ZVEREV",
        "artist": "elyaplugg!",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a9/58/e1/a958e18e-f516-0fc8-e359-090dcfaddb4f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/days-before-nikita-zverev/1850319697?uo=4"
      },
      {
        "id": "elyaplugg-alb-1691754245",
        "title": "DONT MAKE IT VIRAL!!!",
        "artist": "elyaplugg!",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7b/c7/e3/7bc7e38a-a4e5-f57c-583b-77b0554a997a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dont-make-it-viral/1691754245?uo=4"
      },
      {
        "id": "elyaplugg-alb-1870634879",
        "title": "#spittinbars",
        "artist": "elyaplugg!",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/66/43/cc/6643cc3f-5a9f-c2d7-6ba9-0dea7072565e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/spittinbars/1870634879?uo=4"
      },
      {
        "id": "elyaplugg-alb-1715459572",
        "title": "EVERYBODY HATES ELYAPLUGG!",
        "artist": "elyaplugg!",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ae/ac/58/aeac583b-01ec-e7a5-158b-c3045dfa07a2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/everybody-hates-elyaplugg-ep/1715459572?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "elyaplugg-trk-1650751795",
        "albumId": "elyaplugg-alb-1650751719",
        "title": "тишка влон",
        "albumTitle": "тишка влон",
        "artist": "elyaplugg!",
        "year": 2022,
        "duration": "2:16",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/44/4c/b1/444cb163-cfcd-04fb-dbda-0572538d3ec7/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B8%D1%88%D0%BA%D0%B0-%D0%B2%D0%BB%D0%BE%D0%BD/1650751719?i=1650751795&uo=4"
      },
      {
        "id": "elyaplugg-trk-1755812107",
        "albumId": "elyaplugg-alb-1755812090",
        "title": "dab!!!",
        "albumTitle": "dab!!!",
        "artist": "elyaplugg!",
        "year": 2024,
        "duration": "1:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5b/23/91/5b239190-cb52-24e1-b363-37c433618bda/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dab/1755812090?i=1755812107&uo=4"
      },
      {
        "id": "elyaplugg-trk-1691754250",
        "albumId": "elyaplugg-alb-1691754245",
        "title": "приготовил это!",
        "albumTitle": "DONT MAKE IT VIRAL!!!",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "1:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7b/c7/e3/7bc7e38a-a4e5-f57c-583b-77b0554a997a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D1%80%D0%B8%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B8%D0%BB-%D1%8D%D1%82%D0%BE/1691754245?i=1691754250&uo=4"
      },
      {
        "id": "elyaplugg-trk-1641738382",
        "albumId": "elyaplugg-alb-1641738378",
        "title": "кэшдаймне (feat. Geekid8)",
        "albumTitle": "кэшдаймне (feat. Geekid8)",
        "artist": "elyaplugg!",
        "year": 2022,
        "duration": "1:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/df/5b/0f/df5b0ff3-48f2-d994-8814-69200d149c00/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%8D%D1%88%D0%B4%D0%B0%D0%B9%D0%BC%D0%BD%D0%B5-feat-geekid8/1641738378?i=1641738382&uo=4"
      },
      {
        "id": "elyaplugg-trk-1746771722",
        "albumId": "elyaplugg-alb-1746771616",
        "title": "mad!!!",
        "albumTitle": "mad!!!",
        "artist": "elyaplugg!",
        "year": 2024,
        "duration": "1:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/98/c7/bd/98c7bd2b-4aac-3175-79a1-6c4a23d3c090/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/mad/1746771616?i=1746771722&uo=4"
      },
      {
        "id": "elyaplugg-trk-1691754923",
        "albumId": "elyaplugg-alb-1691754245",
        "title": "купид",
        "albumTitle": "DONT MAKE IT VIRAL!!!",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "1:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7b/c7/e3/7bc7e38a-a4e5-f57c-583b-77b0554a997a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%83%D0%BF%D0%B8%D0%B4/1691754245?i=1691754923&uo=4"
      },
      {
        "id": "elyaplugg-trk-1691754825",
        "albumId": "elyaplugg-alb-1691754245",
        "title": "разруш одиночество",
        "albumTitle": "DONT MAKE IT VIRAL!!!",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "1:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7b/c7/e3/7bc7e38a-a4e5-f57c-583b-77b0554a997a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%80%D0%B0%D0%B7%D1%80%D1%83%D1%88-%D0%BE%D0%B4%D0%B8%D0%BD%D0%BE%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE/1691754245?i=1691754825&uo=4"
      },
      {
        "id": "elyaplugg-trk-1675854395",
        "albumId": "elyaplugg-alb-1675854388",
        "title": "ялюблютебятоже^",
        "albumTitle": "*happyWday:3",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "2:18",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/79/57/85/795785ce-b01c-4dec-530b-02afe228a9a5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F%D0%BB%D1%8E%D0%B1%D0%BB%D1%8E%D1%82%D0%B5%D0%B1%D1%8F%D1%82%D0%BE%D0%B6%D0%B5/1675854388?i=1675854395&uo=4"
      },
      {
        "id": "elyaplugg-trk-1691754513",
        "albumId": "elyaplugg-alb-1691754245",
        "title": "гоууу",
        "albumTitle": "DONT MAKE IT VIRAL!!!",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "2:05",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7b/c7/e3/7bc7e38a-a4e5-f57c-583b-77b0554a997a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%BE%D1%83%D1%83%D1%83/1691754245?i=1691754513&uo=4"
      },
      {
        "id": "elyaplugg-trk-1715459904",
        "albumId": "elyaplugg-alb-1715459572",
        "title": "ARCH!VE",
        "albumTitle": "EVERYBODY HATES ELYAPLUGG!",
        "artist": "elyaplugg!",
        "year": 2023,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ae/ac/58/aeac583b-01ec-e7a5-158b-c3045dfa07a2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/arch-ve/1715459572?i=1715459904&uo=4"
      }
    ]
  },
  "gotlibgotlibgotlib": {
    "name": "gotlibgotlibgotlib",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8d/06/75/8d067563-5ecd-1949-42ca-4092dec9aff3/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "gotlibgotlibgotlib-alb-1831996927",
        "title": "аромат",
        "artist": "gotlibgotlibgotlib",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8d/06/75/8d067563-5ecd-1949-42ca-4092dec9aff3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B0%D1%80%D0%BE%D0%BC%D0%B0%D1%82-single/1831996927?uo=4"
      },
      {
        "id": "gotlibgotlibgotlib-alb-1843616371",
        "title": "все хотят меня",
        "artist": "gotlibgotlibgotlib",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/71/9d/52719dfc-3c4c-4864-452c-ba77086b1ff5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B2%D1%81%D0%B5-%D1%85%D0%BE%D1%82%D1%8F%D1%82-%D0%BC%D0%B5%D0%BD%D1%8F-single/1843616371?uo=4"
      },
      {
        "id": "gotlibgotlibgotlib-alb-1881948606",
        "title": "агентство насилия™",
        "artist": "gotlibgotlibgotlib, SABU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/69/a7/ed/69a7ed41-1b92-e7f6-51c5-11973c3dca92/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D1%81%D1%82%D0%B2%D0%BE-%D0%BD%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D1%8F-single/1881948606?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "gotlibgotlibgotlib-trk-1831996931",
        "albumId": "gotlibgotlibgotlib-alb-1831996927",
        "title": "аромат",
        "albumTitle": "аромат",
        "artist": "gotlibgotlibgotlib",
        "year": 2025,
        "duration": "1:20",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8d/06/75/8d067563-5ecd-1949-42ca-4092dec9aff3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B0%D1%80%D0%BE%D0%BC%D0%B0%D1%82/1831996927?i=1831996931&uo=4"
      },
      {
        "id": "gotlibgotlibgotlib-trk-1843616372",
        "albumId": "gotlibgotlibgotlib-alb-1843616371",
        "title": "все хотят меня",
        "albumTitle": "все хотят меня",
        "artist": "gotlibgotlibgotlib",
        "year": 2025,
        "duration": "1:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/71/9d/52719dfc-3c4c-4864-452c-ba77086b1ff5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B2%D1%81%D0%B5-%D1%85%D0%BE%D1%82%D1%8F%D1%82-%D0%BC%D0%B5%D0%BD%D1%8F/1843616371?i=1843616372&uo=4"
      },
      {
        "id": "gotlibgotlibgotlib-trk-1881948607",
        "albumId": "gotlibgotlibgotlib-alb-1881948606",
        "title": "агентство насилия™",
        "albumTitle": "агентство насилия™",
        "artist": "gotlibgotlibgotlib, SABU",
        "year": 2026,
        "duration": "2:15",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/69/a7/ed/69a7ed41-1b92-e7f6-51c5-11973c3dca92/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/fi/album/%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D1%81%D1%82%D0%B2%D0%BE-%D0%BD%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D1%8F/1881948606?i=1881948607&uo=4"
      }
    ]
  },
  "egor-kreed": {
    "name": "ЕГОР КРИД",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/dd/ec/3eddec31-df1a-b2ae-52d2-0811e1721fcb/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "egor-kreed-alb-973437517",
        "title": "Холостяк",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/dd/ec/3eddec31-df1a-b2ae-52d2-0811e1721fcb/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%85%D0%BE%D0%BB%D0%BE%D1%81%D1%82%D1%8F%D0%BA/973437517?uo=4"
      },
      {
        "id": "egor-kreed-alb-1572988142",
        "title": "P***Y BOY",
        "artist": "ЕГОР КРИД",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b7/18/1f/b7181f5f-7c87-6156-3715-dec3befbe614/190296606182.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/p-y-boy/1572988142?uo=4"
      },
      {
        "id": "egor-kreed-alb-1780544338",
        "title": "Меньше чем три",
        "artist": "ЕГОР КРИД",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/51/d0/10/51d010ee-5c97-259e-f975-332c81006767/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B5%D0%BD%D1%8C%D1%88%D0%B5-%D1%87%D0%B5%D0%BC-%D1%82%D1%80%D0%B8/1780544338?uo=4"
      },
      {
        "id": "egor-kreed-alb-1737215690",
        "title": "Что они знают?",
        "artist": "ЕГОР КРИД",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1c/ec/df/1cecdf13-75f5-947d-cba7-da4fa5c27c51/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%87%D1%82%D0%BE-%D0%BE%D0%BD%D0%B8-%D0%B7%D0%BD%D0%B0%D1%8E%D1%82/1737215690?uo=4"
      },
      {
        "id": "egor-kreed-alb-917537590",
        "title": "Самая самая",
        "artist": "ЕГОР КРИД",
        "year": 2014,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/97/56/0a/97560a61-009a-e9d8-2b95-718b90c6e940/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D0%BC%D0%B0%D1%8F-%D1%81%D0%B0%D0%BC%D0%B0%D1%8F-single/917537590?uo=4"
      },
      {
        "id": "egor-kreed-alb-1062887292",
        "title": "Будильник",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/5e/3b/fd/5e3bfdc2-34f8-4f6b-7768-e9b5eaa7faeb/contsched.ztynmvss.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D1%83%D0%B4%D0%B8%D0%BB%D1%8C%D0%BD%D0%B8%D0%BA-single/1062887292?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "egor-kreed-trk-917537591",
        "albumId": "egor-kreed-alb-917537590",
        "title": "Самая самая",
        "albumTitle": "Самая самая",
        "artist": "ЕГОР КРИД",
        "year": 2014,
        "duration": "3:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/97/56/0a/97560a61-009a-e9d8-2b95-718b90c6e940/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D0%BC%D0%B0%D1%8F-%D1%81%D0%B0%D0%BC%D0%B0%D1%8F/917537590?i=917537591&uo=4"
      },
      {
        "id": "egor-kreed-trk-1363161648",
        "albumId": "egor-kreed-alb-1363160856",
        "title": "Миллион алых роз",
        "albumTitle": "Миллион алых роз",
        "artist": "ЕГОР КРИД",
        "year": 2018,
        "duration": "3:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/7f/18/8a/7f188a95-4c62-9a66-6004-e3dc649316ca/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD-%D0%B0%D0%BB%D1%8B%D1%85-%D1%80%D0%BE%D0%B7/1363160856?i=1363161648&uo=4"
      },
      {
        "id": "egor-kreed-trk-1062887294",
        "albumId": "egor-kreed-alb-1062887292",
        "title": "Будильник",
        "albumTitle": "Будильник",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "duration": "3:24",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/5e/3b/fd/5e3bfdc2-34f8-4f6b-7768-e9b5eaa7faeb/contsched.ztynmvss.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D1%83%D0%B4%D0%B8%D0%BB%D1%8C%D0%BD%D0%B8%D0%BA/1062887292?i=1062887294&uo=4"
      },
      {
        "id": "egor-kreed-trk-973437535",
        "albumId": "egor-kreed-alb-973437517",
        "title": "Невеста",
        "albumTitle": "Холостяк",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "duration": "3:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/dd/ec/3eddec31-df1a-b2ae-52d2-0811e1721fcb/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D0%B2%D0%B5%D1%81%D1%82%D0%B0/973437517?i=973437535&uo=4"
      },
      {
        "id": "egor-kreed-trk-1435498577",
        "albumId": "egor-kreed-alb-1435498328",
        "title": "Цвет настроения чёрный (feat. Филипп Киркоров)",
        "albumTitle": "Цвет настроения чёрный (feat. Филипп Киркоров)",
        "artist": "ЕГОР КРИД",
        "year": 2018,
        "duration": "3:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/8d/b8/da/8db8dadb-246d-c1d2-7243-b43fe194f277/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%86%D0%B2%D0%B5%D1%82-%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BD%D0%B8%D1%8F-%D1%87%D1%91%D1%80%D0%BD%D1%8B%D0%B9-feat-%D1%84%D0%B8%D0%BB%D0%B8%D0%BF%D0%BF-%D0%BA%D0%B8%D1%80%D0%BA%D0%BE%D1%80%D0%BE%D0%B2/1435498328?i=1435498577&uo=4"
      },
      {
        "id": "egor-kreed-trk-973437539",
        "albumId": "egor-kreed-alb-973437517",
        "title": "Берегу",
        "albumTitle": "Холостяк",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "duration": "3:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/dd/ec/3eddec31-df1a-b2ae-52d2-0811e1721fcb/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B5%D1%80%D0%B5%D0%B3%D1%83/973437517?i=973437539&uo=4"
      },
      {
        "id": "egor-kreed-trk-973437540",
        "albumId": "egor-kreed-alb-973437517",
        "title": "Папина дочка",
        "albumTitle": "Холостяк",
        "artist": "ЕГОР КРИД",
        "year": 2015,
        "duration": "2:41",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3e/dd/ec/3eddec31-df1a-b2ae-52d2-0811e1721fcb/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B0%D0%BF%D0%B8%D0%BD%D0%B0-%D0%B4%D0%BE%D1%87%D0%BA%D0%B0/973437517?i=973437540&uo=4"
      },
      {
        "id": "egor-kreed-trk-1124470325",
        "albumId": "egor-kreed-alb-1124470125",
        "title": "Мне нравится",
        "albumTitle": "Мне нравится",
        "artist": "ЕГОР КРИД",
        "year": 2016,
        "duration": "3:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music18/v4/1e/e1/b4/1ee1b4f0-8c7d-34ad-1747-eaa013d9e9cf/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BD%D0%B5-%D0%BD%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D1%81%D1%8F/1124470125?i=1124470325&uo=4"
      },
      {
        "id": "egor-kreed-trk-1182959297",
        "albumId": "egor-kreed-alb-1182959291",
        "title": "Мало так мало",
        "albumTitle": "Мало так мало",
        "artist": "ЕГОР КРИД",
        "year": 2016,
        "duration": "3:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music62/v4/92/6c/e7/926ce75b-5420-23d1-568c-993f1852323a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D0%BB%D0%BE-%D1%82%D0%B0%D0%BA-%D0%BC%D0%B0%D0%BB%D0%BE/1182959291?i=1182959297&uo=4"
      },
      {
        "id": "egor-kreed-trk-1328420623",
        "albumId": "egor-kreed-alb-1328419945",
        "title": "Слеза",
        "albumTitle": "Слеза",
        "artist": "ЕГОР КРИД",
        "year": 2017,
        "duration": "3:32",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/32/82/da/3282da6b-1066-19ea-2665-840190d5ea2d/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BB%D0%B5%D0%B7%D0%B0/1328419945?i=1328420623&uo=4"
      }
    ]
  },
  "madk1d": {
    "name": "madk1d",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "madk1d-alb-1802942624",
        "title": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sexyswag/1802942624?uo=4"
      },
      {
        "id": "madk1d-alb-1786242909",
        "title": "Он сказал поехали!",
        "artist": "madk1d",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/0f/d1/d30fd149-6546-e71e-f5e7-45a50a56cbb0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%BD-%D1%81%D0%BA%D0%B0%D0%B7%D0%B0%D0%BB-%D0%BF%D0%BE%D0%B5%D1%85%D0%B0%D0%BB%D0%B8/1786242909?uo=4"
      },
      {
        "id": "madk1d-alb-1632200500",
        "title": "Толпы",
        "artist": "madk1d",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/f7/e0/00f7e0f5-f38c-0c6c-bd50-55b83524e3ec/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%BE%D0%BB%D0%BF%D1%8B-single/1632200500?uo=4"
      },
      {
        "id": "madk1d-alb-1798815763",
        "title": "распять",
        "artist": "greyrock, tewiq, madk1d",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cf/20/dc/cf20dc6a-a2e5-7236-f7d3-002c7011ebaa/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%80%D0%B0%D1%81%D0%BF%D1%8F%D1%82%D1%8C-single/1798815763?uo=4"
      },
      {
        "id": "madk1d-alb-1876651874",
        "title": "8 миля",
        "artist": "madk1d, VILLIAN",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1f/7e/30/1f7e3068-4538-8d0a-31eb-ff3f93e13ad3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/8-%D0%BC%D0%B8%D0%BB%D1%8F-single/1876651874?uo=4"
      },
      {
        "id": "madk1d-alb-1843172762",
        "title": "MARTINE ROSE",
        "artist": "madk1d, greyrock, tewiq",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/f2/74/f0f27419-a554-ed55-4838-c2ce5616ed0a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/martine-rose-single/1843172762?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "madk1d-trk-1802942825",
        "albumId": "madk1d-alb-1802942624",
        "title": "так п***й",
        "albumTitle": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "duration": "1:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B0%D0%BA-%D0%BF-%D0%B9/1802942624?i=1802942825&uo=4"
      },
      {
        "id": "madk1d-trk-1632200502",
        "albumId": "madk1d-alb-1632200500",
        "title": "Толпы",
        "albumTitle": "Толпы",
        "artist": "madk1d",
        "year": 2022,
        "duration": "1:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/00/f7/e0/00f7e0f5-f38c-0c6c-bd50-55b83524e3ec/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%BE%D0%BB%D0%BF%D1%8B/1632200500?i=1632200502&uo=4"
      },
      {
        "id": "madk1d-trk-1802943146",
        "albumId": "madk1d-alb-1802942624",
        "title": "засосы",
        "albumTitle": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "duration": "1:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D1%81%D0%BE%D1%81%D1%8B/1802942624?i=1802943146&uo=4"
      },
      {
        "id": "madk1d-trk-1802943017",
        "albumId": "madk1d-alb-1802942624",
        "title": "супермаркет",
        "albumTitle": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "duration": "1:59",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D1%83%D0%BF%D0%B5%D1%80%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82/1802942624?i=1802943017&uo=4"
      },
      {
        "id": "madk1d-trk-1802943153",
        "albumId": "madk1d-alb-1802942624",
        "title": "sexyswag2010",
        "albumTitle": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "duration": "1:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sexyswag2010/1802942624?i=1802943153&uo=4"
      },
      {
        "id": "madk1d-trk-1838903527",
        "albumId": "madk1d-alb-1838903524",
        "title": "дырки в штанах",
        "albumTitle": "дырки в штанах",
        "artist": "madk1d",
        "year": 2025,
        "duration": "1:47",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/76/38/91/763891cc-4e60-64f6-c5d2-6278a272b863/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D1%8B%D1%80%D0%BA%D0%B8-%D0%B2-%D1%88%D1%82%D0%B0%D0%BD%D0%B0%D1%85/1838903524?i=1838903527&uo=4"
      },
      {
        "id": "madk1d-trk-1756348791",
        "albumId": "madk1d-alb-1756348679",
        "title": "Барыга",
        "albumTitle": "Барыга",
        "artist": "madk1d",
        "year": 2023,
        "duration": "1:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6d/24/fa/6d24fafc-31df-46c8-ebda-931390117e08/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D1%80%D1%8B%D0%B3%D0%B0/1756348679?i=1756348791&uo=4"
      },
      {
        "id": "madk1d-trk-1745309962",
        "albumId": "madk1d-alb-1745309565",
        "title": "питер паркер",
        "albumTitle": "питер паркер",
        "artist": "madk1d",
        "year": 2024,
        "duration": "1:59",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6a/e6/7a/6ae67ab4-e390-376b-ea1e-4603dac0d823/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B8%D1%82%D0%B5%D1%80-%D0%BF%D0%B0%D1%80%D0%BA%D0%B5%D1%80/1745309565?i=1745309962&uo=4"
      },
      {
        "id": "madk1d-trk-1802943156",
        "albumId": "madk1d-alb-1802942624",
        "title": "сдвг",
        "albumTitle": "sexyswag",
        "artist": "madk1d",
        "year": 2025,
        "duration": "2:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c8/3a/b2/c83ab2d9-4ce5-d9d0-e8ef-3eb44fd6e4df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B4%D0%B2%D0%B3/1802942624?i=1802943156&uo=4"
      },
      {
        "id": "madk1d-trk-1688195992",
        "albumId": "madk1d-alb-1688195987",
        "title": "Толпы (Speed Up)",
        "albumTitle": "Толпы (Speed Up)",
        "artist": "madk1d",
        "year": 2023,
        "duration": "1:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a2/ab/87/a2ab8730-d756-de66-7284-125406777188/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%BE%D0%BB%D0%BF%D1%8B-speed-up/1688195987?i=1688195992&uo=4"
      }
    ]
  },
  "gorilla-glu": {
    "name": "GORILLA GLU",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "gorilla-glu-alb-1886007297",
        "title": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/russian-trap-house/1886007297?uo=4"
      },
      {
        "id": "gorilla-glu-alb-1847321595",
        "title": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D1%8C-%D0%B8%D0%BB%D0%B8-%D1%83%D0%BC%D1%80%D0%B8-single/1847321595?uo=4"
      },
      {
        "id": "gorilla-glu-alb-6781836382",
        "title": "CHICKEN TRAP",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/40/55/4e/40554e5a-a94e-d9b5-6066-fd71195597dc/075679569455.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/chicken-trap-single/6781836382?uo=4"
      },
      {
        "id": "gorilla-glu-alb-1722919730",
        "title": "СВЭГ НАРОДНЫЙ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/04/f1/22/04f1224f-5aa9-cbee-06bc-c2c7546f83a1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%81%D0%B2%D1%8D%D0%B3-%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9-single/1722919730?uo=4"
      },
      {
        "id": "gorilla-glu-alb-1804356108",
        "title": "Браги два бидона",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/85/77/6c8577b1-179e-e96c-476b-23c1de5630d5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D1%80%D0%B0%D0%B3%D0%B8-%D0%B4%D0%B2%D0%B0-%D0%B1%D0%B8%D0%B4%D0%BE%D0%BD%D0%B0-single/1804356108?uo=4"
      },
      {
        "id": "gorilla-glu-alb-6787913107",
        "title": "TEREMOK",
        "artist": "GORILLA GLU, LIL NAKU, Lil Gnar",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/56/10/df561024-9d5a-d68f-1a31-98232576ace3/cover_4062851323277.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/teremok-single/6787913107?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "gorilla-glu-trk-1847321605",
        "albumId": "gorilla-glu-alb-1847321595",
        "title": "Зомби Апокалипсис",
        "albumTitle": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "duration": "2:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B7%D0%BE%D0%BC%D0%B1%D0%B8-%D0%B0%D0%BF%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%BF%D1%81%D0%B8%D1%81/1847321595?i=1847321605&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1886007311",
        "albumId": "gorilla-glu-alb-1886007297",
        "title": "На конях",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BD%D0%B0-%D0%BA%D0%BE%D0%BD%D1%8F%D1%85/1886007297?i=1886007311&uo=4"
      },
      {
        "id": "gorilla-glu-trk-6820448599",
        "albumId": "gorilla-glu-alb-6820448588",
        "title": "Оп Давай Давай",
        "albumTitle": "Оп Давай Давай",
        "artist": "Police in Paris, GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/15/7c/a7157c11-45ca-93df-08d5-b7011614eff2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BE%D0%BF-%D0%B4%D0%B0%D0%B2%D0%B0%D0%B9-%D0%B4%D0%B0%D0%B2%D0%B0%D0%B9/6820448588?i=6820448599&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1804356417",
        "albumId": "gorilla-glu-alb-1804356108",
        "title": "Браги два бидона",
        "albumTitle": "Браги два бидона",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2025,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/85/77/6c8577b1-179e-e96c-476b-23c1de5630d5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D1%80%D0%B0%D0%B3%D0%B8-%D0%B4%D0%B2%D0%B0-%D0%B1%D0%B8%D0%B4%D0%BE%D0%BD%D0%B0/1804356108?i=1804356417&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1886007309",
        "albumId": "gorilla-glu-alb-1886007297",
        "title": "Трэпчик Народный",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D1%87%D0%B8%D0%BA-%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9/1886007297?i=1886007309&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1886007306",
        "albumId": "gorilla-glu-alb-1886007297",
        "title": "Играй Гармошка",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B8%D0%B3%D1%80%D0%B0%D0%B9-%D0%B3%D0%B0%D1%80%D0%BC%D0%BE%D1%88%D0%BA%D0%B0/1886007297?i=1886007306&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1847321602",
        "albumId": "gorilla-glu-alb-1847321595",
        "title": "Трэпим Утром",
        "albumTitle": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "duration": "3:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D0%B8%D0%BC-%D1%83%D1%82%D1%80%D0%BE%D0%BC/1847321595?i=1847321602&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1891430405",
        "albumId": "gorilla-glu-alb-1891430402",
        "title": "Country Boy",
        "albumTitle": "Country Boy",
        "artist": "GORILLA GLU, LIL NAKU, Vitya AK",
        "year": 2026,
        "duration": "2:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/2b/60/bd2b6073-8fb3-98a4-6d83-a6773822f4f6/810129959598.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/country-boy/1891430402?i=1891430405&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1881520010",
        "albumId": "gorilla-glu-alb-1881519998",
        "title": "Пузо",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "1:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4b/e8/b5/4be8b526-4411-bd0a-d9a1-19e6b36a94e9/cover_4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BF%D1%83%D0%B7%D0%BE/1881519998?i=1881520010&uo=4"
      },
      {
        "id": "gorilla-glu-trk-1886007303",
        "albumId": "gorilla-glu-alb-1886007297",
        "title": "Баня (feat. FLOCKAA)",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D0%B0%D0%BD%D1%8F-feat-flockaa/1886007297?i=1886007303&uo=4"
      }
    ]
  },
  "lil-naku": {
    "name": "LIL NAKU",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "lil-naku-alb-1886007297",
        "title": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/russian-trap-house/1886007297?uo=4"
      },
      {
        "id": "lil-naku-alb-1847321595",
        "title": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D1%8C-%D0%B8%D0%BB%D0%B8-%D1%83%D0%BC%D1%80%D0%B8-single/1847321595?uo=4"
      },
      {
        "id": "lil-naku-alb-6781836382",
        "title": "CHICKEN TRAP",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/40/55/4e/40554e5a-a94e-d9b5-6066-fd71195597dc/075679569455.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/chicken-trap-single/6781836382?uo=4"
      },
      {
        "id": "lil-naku-alb-1722919730",
        "title": "СВЭГ НАРОДНЫЙ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/04/f1/22/04f1224f-5aa9-cbee-06bc-c2c7546f83a1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%81%D0%B2%D1%8D%D0%B3-%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9-single/1722919730?uo=4"
      },
      {
        "id": "lil-naku-alb-1804356108",
        "title": "Браги два бидона",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/85/77/6c8577b1-179e-e96c-476b-23c1de5630d5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D1%80%D0%B0%D0%B3%D0%B8-%D0%B4%D0%B2%D0%B0-%D0%B1%D0%B8%D0%B4%D0%BE%D0%BD%D0%B0-single/1804356108?uo=4"
      },
      {
        "id": "lil-naku-alb-6787913107",
        "title": "TEREMOK",
        "artist": "GORILLA GLU, LIL NAKU, Lil Gnar",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/df/56/10/df561024-9d5a-d68f-1a31-98232576ace3/cover_4062851323277.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/teremok-single/6787913107?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "lil-naku-trk-1847321605",
        "albumId": "lil-naku-alb-1847321595",
        "title": "Зомби Апокалипсис",
        "albumTitle": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "duration": "2:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B7%D0%BE%D0%BC%D0%B1%D0%B8-%D0%B0%D0%BF%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%BF%D1%81%D0%B8%D1%81/1847321595?i=1847321605&uo=4"
      },
      {
        "id": "lil-naku-trk-1886007311",
        "albumId": "lil-naku-alb-1886007297",
        "title": "На конях",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BD%D0%B0-%D0%BA%D0%BE%D0%BD%D1%8F%D1%85/1886007297?i=1886007311&uo=4"
      },
      {
        "id": "lil-naku-trk-6820448599",
        "albumId": "lil-naku-alb-6820448588",
        "title": "Оп Давай Давай",
        "albumTitle": "Оп Давай Давай",
        "artist": "Police in Paris, GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/15/7c/a7157c11-45ca-93df-08d5-b7011614eff2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BE%D0%BF-%D0%B4%D0%B0%D0%B2%D0%B0%D0%B9-%D0%B4%D0%B0%D0%B2%D0%B0%D0%B9/6820448588?i=6820448599&uo=4"
      },
      {
        "id": "lil-naku-trk-1804356417",
        "albumId": "lil-naku-alb-1804356108",
        "title": "Браги два бидона",
        "albumTitle": "Браги два бидона",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2025,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6c/85/77/6c8577b1-179e-e96c-476b-23c1de5630d5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D1%80%D0%B0%D0%B3%D0%B8-%D0%B4%D0%B2%D0%B0-%D0%B1%D0%B8%D0%B4%D0%BE%D0%BD%D0%B0/1804356108?i=1804356417&uo=4"
      },
      {
        "id": "lil-naku-trk-1886007309",
        "albumId": "lil-naku-alb-1886007297",
        "title": "Трэпчик Народный",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:48",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D1%87%D0%B8%D0%BA-%D0%BD%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9/1886007297?i=1886007309&uo=4"
      },
      {
        "id": "lil-naku-trk-1886007306",
        "albumId": "lil-naku-alb-1886007297",
        "title": "Играй Гармошка",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B8%D0%B3%D1%80%D0%B0%D0%B9-%D0%B3%D0%B0%D1%80%D0%BC%D0%BE%D1%88%D0%BA%D0%B0/1886007297?i=1886007306&uo=4"
      },
      {
        "id": "lil-naku-trk-1847321602",
        "albumId": "lil-naku-alb-1847321595",
        "title": "Трэпим Утром",
        "albumTitle": "ТРЭПЬ ИЛИ УМРИ",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2024,
        "duration": "3:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/59/9d/79599d66-1f38-ff44-4931-6f5d09ea339a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D1%82%D1%80%D1%8D%D0%BF%D0%B8%D0%BC-%D1%83%D1%82%D1%80%D0%BE%D0%BC/1847321595?i=1847321602&uo=4"
      },
      {
        "id": "lil-naku-trk-1891430405",
        "albumId": "lil-naku-alb-1891430402",
        "title": "Country Boy",
        "albumTitle": "Country Boy",
        "artist": "GORILLA GLU, LIL NAKU, Vitya AK",
        "year": 2026,
        "duration": "2:50",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/2b/60/bd2b6073-8fb3-98a4-6d83-a6773822f4f6/810129959598.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/country-boy/1891430402?i=1891430405&uo=4"
      },
      {
        "id": "lil-naku-trk-1881520010",
        "albumId": "lil-naku-alb-1881519998",
        "title": "Пузо",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "1:45",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4b/e8/b5/4be8b526-4411-bd0a-d9a1-19e6b36a94e9/cover_4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%BF%D1%83%D0%B7%D0%BE/1881519998?i=1881520010&uo=4"
      },
      {
        "id": "lil-naku-trk-1886007303",
        "albumId": "lil-naku-alb-1886007297",
        "title": "Баня (feat. FLOCKAA)",
        "albumTitle": "RUSSIAN TRAP HOUSE",
        "artist": "GORILLA GLU, LIL NAKU",
        "year": 2026,
        "duration": "2:28",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/98/69/88/98698851-cb0a-2739-540c-53a33d9e641e/4062851262408.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/mz/album/%D0%B1%D0%B0%D0%BD%D1%8F-feat-flockaa/1886007297?i=1886007303&uo=4"
      }
    ]
  },
  "martin": {
    "name": "мартин",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/51/a4/3c51a4cc-bfa7-f99b-1652-3c9895242a42/0.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "martin-alb-1778354898",
        "title": "ещё один день",
        "artist": "мартин",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/51/a4/3c51a4cc-bfa7-f99b-1652-3c9895242a42/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B5%D1%89%D1%91-%D0%BE%D0%B4%D0%B8%D0%BD-%D0%B4%D0%B5%D0%BD%D1%8C-ep/1778354898?uo=4"
      },
      {
        "id": "martin-alb-6825854464",
        "title": "не прощаюсь",
        "artist": "мартин",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fa/a9/36/faa936fd-540a-3e5e-059a-4f3e1668f43a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5-%D0%BF%D1%80%D0%BE%D1%89%D0%B0%D1%8E%D1%81%D1%8C/6825854464?uo=4"
      },
      {
        "id": "martin-alb-1814386593",
        "title": "пока лето не кончилось",
        "artist": "мартин",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3b/09/72/3b0972c0-09c2-16b2-79e7-ed00cdba0fb4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%BA%D0%B0-%D0%BB%D0%B5%D1%82%D0%BE-%D0%BD%D0%B5-%D0%BA%D0%BE%D0%BD%D1%87%D0%B8%D0%BB%D0%BE%D1%81%D1%8C-ep/1814386593?uo=4"
      },
      {
        "id": "martin-alb-1861034409",
        "title": "с новым годом, не звони мне",
        "artist": "мартин",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9e/a9/b6/9ea9b695-8842-3147-0b8c-1f91fddf4b1c/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81-%D0%BD%D0%BE%D0%B2%D1%8B%D0%BC-%D0%B3%D0%BE%D0%B4%D0%BE%D0%BC-%D0%BD%D0%B5-%D0%B7%D0%B2%D0%BE%D0%BD%D0%B8-%D0%BC%D0%BD%D0%B5-ep/1861034409?uo=4"
      },
      {
        "id": "martin-alb-1701614150",
        "title": "позову звезды смотреть на тебя",
        "artist": "мартин",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f0/39/24/f03924a9-b96c-cf54-70ac-cba40a1f49ef/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%B7%D0%BE%D0%B2%D1%83-%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D1%8B-%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C-%D0%BD%D0%B0-%D1%82%D0%B5%D0%B1%D1%8F-single/1701614150?uo=4"
      },
      {
        "id": "martin-alb-1797516468",
        "title": "жду тебя",
        "artist": "мартин",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/c7/b9/d3c7b9a6-548e-2584-341f-0d5201fcd31f/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B6%D0%B4%D1%83-%D1%82%D0%B5%D0%B1%D1%8F-single/1797516468?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "martin-trk-1701614152",
        "albumId": "martin-alb-1701614150",
        "title": "позову звезды смотреть на тебя",
        "albumTitle": "позову звезды смотреть на тебя",
        "artist": "мартин",
        "year": 2023,
        "duration": "3:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f0/39/24/f03924a9-b96c-cf54-70ac-cba40a1f49ef/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D0%B7%D0%BE%D0%B2%D1%83-%D0%B7%D0%B2%D0%B5%D0%B7%D0%B4%D1%8B-%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C-%D0%BD%D0%B0-%D1%82%D0%B5%D0%B1%D1%8F/1701614150?i=1701614152&uo=4"
      },
      {
        "id": "martin-trk-1797516559",
        "albumId": "martin-alb-1797516468",
        "title": "жду тебя",
        "albumTitle": "жду тебя",
        "artist": "мартин",
        "year": 2025,
        "duration": "2:44",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d3/c7/b9/d3c7b9a6-548e-2584-341f-0d5201fcd31f/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B6%D0%B4%D1%83-%D1%82%D0%B5%D0%B1%D1%8F/1797516468?i=1797516559&uo=4"
      },
      {
        "id": "martin-trk-1814386752",
        "albumId": "martin-alb-1814386593",
        "title": "ты случилась",
        "albumTitle": "пока лето не кончилось",
        "artist": "мартин",
        "year": 2025,
        "duration": "2:21",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3b/09/72/3b0972c0-09c2-16b2-79e7-ed00cdba0fb4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D1%8B-%D1%81%D0%BB%D1%83%D1%87%D0%B8%D0%BB%D0%B0%D1%81%D1%8C/1814386593?i=1814386752&uo=4"
      },
      {
        "id": "martin-trk-1696098287",
        "albumId": "martin-alb-1696098165",
        "title": "целый мир",
        "albumTitle": "целый мир",
        "artist": "мартин",
        "year": 2023,
        "duration": "2:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4b/af/ec/4bafec03-1ad2-c904-9416-37da7b88eb76/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%86%D0%B5%D0%BB%D1%8B%D0%B9-%D0%BC%D0%B8%D1%80/1696098165?i=1696098287&uo=4"
      },
      {
        "id": "martin-trk-1778355261",
        "albumId": "martin-alb-1778354898",
        "title": "фоткаю на глаза",
        "albumTitle": "ещё один день",
        "artist": "мартин",
        "year": 2024,
        "duration": "2:42",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/51/a4/3c51a4cc-bfa7-f99b-1652-3c9895242a42/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%84%D0%BE%D1%82%D0%BA%D0%B0%D1%8E-%D0%BD%D0%B0-%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0/1778354898?i=1778355261&uo=4"
      },
      {
        "id": "martin-trk-1753102942",
        "albumId": "martin-alb-1753102941",
        "title": "салют",
        "albumTitle": "салют",
        "artist": "мартин",
        "year": 2024,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/80/0c/b7/800cb72f-4eed-600b-a758-4c4be1dd5366/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B0%D0%BB%D1%8E%D1%82/1753102941?i=1753102942&uo=4"
      },
      {
        "id": "martin-trk-1769764843",
        "albumId": "martin-alb-1769764842",
        "title": "в который раз",
        "albumTitle": "в который раз",
        "artist": "мартин",
        "year": 2024,
        "duration": "3:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/89/d1/b8/89d1b864-d608-3803-0a8f-c733b1e775b4/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D1%8B%D0%B9-%D1%80%D0%B0%D0%B7/1769764842?i=1769764843&uo=4"
      },
      {
        "id": "martin-trk-1747356552",
        "albumId": "martin-alb-1747356551",
        "title": "моя любовь",
        "albumTitle": "моя любовь",
        "artist": "мартин",
        "year": 2024,
        "duration": "2:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/23/80/4f/23804fff-ccd1-b88f-f018-34384070be58/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D1%8F-%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D1%8C/1747356551?i=1747356552&uo=4"
      },
      {
        "id": "martin-trk-1714274585",
        "albumId": "martin-alb-1714274584",
        "title": "город",
        "albumTitle": "город",
        "artist": "мартин",
        "year": 2023,
        "duration": "2:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d1/a4/50/d1a45078-414e-a233-9dac-8caaea9357f8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%BE%D1%80%D0%BE%D0%B4/1714274584?i=1714274585&uo=4"
      },
      {
        "id": "martin-trk-1778355259",
        "albumId": "martin-alb-1778354898",
        "title": "ещё один день",
        "albumTitle": "ещё один день",
        "artist": "мартин",
        "year": 2024,
        "duration": "3:08",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3c/51/a4/3c51a4cc-bfa7-f99b-1652-3c9895242a42/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B5%D1%89%D1%91-%D0%BE%D0%B4%D0%B8%D0%BD-%D0%B4%D0%B5%D0%BD%D1%8C/1778354898?i=1778355259&uo=4"
      }
    ]
  },
  "og-buda": {
    "name": "OG Buda",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "og-buda-alb-1683141447",
        "title": "Cкучаю, Но Работаю",
        "artist": "OG Buda",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/c%D0%BA%D1%83%D1%87%D0%B0%D1%8E-%D0%BD%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D1%8E/1683141447?uo=4"
      },
      {
        "id": "og-buda-alb-1715998752",
        "title": "POX VAWË 0.5",
        "artist": "OG Buda",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/15/ee/8b/15ee8b27-f3b8-2ea9-3738-036c7f23cf89/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/pox-vaw%C3%AB-0-5/1715998752?uo=4"
      },
      {
        "id": "og-buda-alb-1719085214",
        "title": "POX VAWË",
        "artist": "OG Buda",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/93/19/91/931991d7-87c1-93b2-6b8b-d50d481ee898/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/pox-vaw%C3%AB/1719085214?uo=4"
      },
      {
        "id": "og-buda-alb-1856246393",
        "title": "Скучаю, Но Ещё Работаю",
        "artist": "OG Buda",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ed/3f/48/ed3f4878-54ba-946f-69e6-351fa0a792c6/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BA%D1%83%D1%87%D0%B0%D1%8E-%D0%BD%D0%BE-%D0%B5%D1%89%D1%91-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D1%8E/1856246393?uo=4"
      },
      {
        "id": "og-buda-alb-1773299281",
        "title": "FREERIO 3",
        "artist": "OG Buda",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/fe/29/14/fe291448-3590-6455-8577-1462e4e89610/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/freerio-3/1773299281?uo=4"
      },
      {
        "id": "og-buda-alb-1789541218",
        "title": "SZN",
        "artist": "OG Buda",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ed/18/ee/ed18ee33-8aaf-d8b3-2562-0adf76ad0be3/cover.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/szn/1789541218?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "og-buda-trk-1719085261",
        "albumId": "og-buda-alb-1719085214",
        "title": "Крит (feat. Toxi$)",
        "albumTitle": "POX VAWË",
        "artist": "OG Buda",
        "year": 2023,
        "duration": "2:38",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/93/19/91/931991d7-87c1-93b2-6b8b-d50d481ee898/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D0%B8%D1%82-feat-toxi%24/1719085214?i=1719085261&uo=4"
      },
      {
        "id": "og-buda-trk-1683141464",
        "albumId": "og-buda-alb-1683141447",
        "title": "6AM в Будапеште",
        "albumTitle": "Cкучаю, Но Работаю",
        "artist": "OG Buda",
        "year": 2023,
        "duration": "3:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/6am-%D0%B2-%D0%B1%D1%83%D0%B4%D0%B0%D0%BF%D0%B5%D1%88%D1%82%D0%B5/1683141447?i=1683141464&uo=4"
      },
      {
        "id": "og-buda-trk-1683141449",
        "albumId": "og-buda-alb-1683141447",
        "title": "Для Тебя (Пусто)",
        "albumTitle": "Cкучаю, Но Работаю",
        "artist": "OG Buda",
        "year": 2023,
        "duration": "2:16",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BB%D1%8F-%D1%82%D0%B5%D0%B1%D1%8F-%D0%BF%D1%83%D1%81%D1%82%D0%BE/1683141447?i=1683141449&uo=4"
      },
      {
        "id": "og-buda-trk-1652721906",
        "albumId": "og-buda-alb-1652721898",
        "title": "Вина (feat. 17 SEVENTEEN & MAYOT)",
        "albumTitle": "Вина (feat. 17 SEVENTEEN & MAYOT)",
        "artist": "OG Buda",
        "year": 2021,
        "duration": "2:47",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/fa/af/a2/faafa261-3b99-ec7f-755e-a6a7b2c68a1e/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%B8%D0%BD%D0%B0-feat-17-seventeen-mayot/1652721898?i=1652721906&uo=4"
      },
      {
        "id": "og-buda-trk-1456442410",
        "albumId": "og-buda-alb-1456442409",
        "title": "Лариса (feat. lil Krystalll)",
        "albumTitle": "Лариса (feat. lil Krystalll)",
        "artist": "OG Buda",
        "year": 2019,
        "duration": "2:26",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/e7/cf/cd/e7cfcd57-dcfa-5eba-6af4-26d13891e969/628810216383.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%B0%D1%80%D0%B8%D1%81%D0%B0-feat-lil-krystalll/1456442409?i=1456442410&uo=4"
      },
      {
        "id": "og-buda-trk-1683141452",
        "albumId": "og-buda-alb-1683141447",
        "title": "Сердце </3 Время",
        "albumTitle": "Cкучаю, Но Работаю",
        "artist": "OG Buda",
        "year": 2023,
        "duration": "3:01",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%B5%D1%80%D0%B4%D1%86%D0%B5-3-%D0%B2%D1%80%D0%B5%D0%BC%D1%8F/1683141447?i=1683141452&uo=4"
      },
      {
        "id": "og-buda-trk-1423542692",
        "albumId": "og-buda-alb-1423542684",
        "title": "Lil Hoe (feat. Lil krystalll)",
        "albumTitle": "Lil Hoe (feat. Lil krystalll)",
        "artist": "OG Buda",
        "year": 2018,
        "duration": "3:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/68/87/8b/68878b83-d6b7-455f-4a12-3358d2b82a0f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/lil-hoe-feat-lil-krystalll/1423542684?i=1423542692&uo=4"
      },
      {
        "id": "og-buda-trk-1459867672",
        "albumId": "og-buda-alb-1459867662",
        "title": "Картинки из снов (feat. Yanix)",
        "albumTitle": "Картинки из снов (feat. Yanix)",
        "artist": "OG Buda",
        "year": 2019,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/58/c6/12/58c61247-320d-815a-8edd-35e756b60463/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D0%B8-%D0%B8%D0%B7-%D1%81%D0%BD%D0%BE%D0%B2-feat-yanix/1459867662?i=1459867672&uo=4"
      },
      {
        "id": "og-buda-trk-1683141463",
        "albumId": "og-buda-alb-1683141447",
        "title": "Строчки о Бывших",
        "albumTitle": "Cкучаю, Но Работаю",
        "artist": "OG Buda",
        "year": 2023,
        "duration": "3:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/64/ac/1a64ac23-02e6-72e9-2774-e64f09047a6f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D1%82%D1%80%D0%BE%D1%87%D0%BA%D0%B8-%D0%BE-%D0%B1%D1%8B%D0%B2%D1%88%D0%B8%D1%85/1683141447?i=1683141463&uo=4"
      },
      {
        "id": "og-buda-trk-1382321704",
        "albumId": "og-buda-alb-1382321682",
        "title": "8:40",
        "albumTitle": "8:40",
        "artist": "OG Buda",
        "year": 2018,
        "duration": "2:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/16/10/4b/16104b69-c3cc-8e0e-095e-83032ef1037c/859726662241_cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/8-40/1382321682?i=1382321704&uo=4"
      }
    ]
  },
  "feduk": {
    "name": "FEDUK",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/97/c5/27/97c527e3-b28c-b36a-4098-ff1f3ba47459/190295091569.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "feduk-alb-1537585784",
        "title": "ЙАЙ",
        "artist": "FEDUK",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/97/c5/27/97c527e3-b28c-b36a-4098-ff1f3ba47459/190295091569.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B9%D0%B0%D0%B9/1537585784?uo=4"
      },
      {
        "id": "feduk-alb-1583269299",
        "title": "заново",
        "artist": "FEDUK",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5b/a4/54/5ba45491-66fb-72c0-bfb5-c96abcb12827/190296466342.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0%D0%BD%D0%BE%D0%B2%D0%BE-ep/1583269299?uo=4"
      },
      {
        "id": "feduk-alb-1646983871",
        "title": "В тон улицам",
        "artist": "FEDUK",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ee/03/0c/ee030c62-80a1-5414-a46b-d6134efa54c8/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2-%D1%82%D0%BE%D0%BD-%D1%83%D0%BB%D0%B8%D1%86%D0%B0%D0%BC/1646983871?uo=4"
      },
      {
        "id": "feduk-alb-1520189413",
        "title": "F&Q",
        "artist": "FEDUK",
        "year": 2017,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/89/03/69/8903696d-06af-2495-2061-7f8a735408cf/3614975930285.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/f-q/1520189413?uo=4"
      },
      {
        "id": "feduk-alb-1849184425",
        "title": "Весёлая музыка",
        "artist": "FEDUK",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/28/3f/d8/283fd8e5-bf81-322d-b257-180e24194b51/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%B5%D1%81%D1%91%D0%BB%D0%B0%D1%8F-%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B0/1849184425?uo=4"
      },
      {
        "id": "feduk-alb-1519820520",
        "title": "Фри",
        "artist": "FEDUK",
        "year": 2016,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/0c/ac/2a/0cac2a7d-092f-119f-47ae-c18e88770a6d/3614976002370.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%84%D1%80%D0%B8/1519820520?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "feduk-trk-1537586407",
        "albumId": "feduk-alb-1537585784",
        "title": "Бэнгер",
        "albumTitle": "ЙАЙ",
        "artist": "FEDUK",
        "year": 2020,
        "duration": "3:04",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/97/c5/27/97c527e3-b28c-b36a-4098-ff1f3ba47459/190295091569.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D1%8D%D0%BD%D0%B3%D0%B5%D1%80/1537585784?i=1537586407&uo=4"
      },
      {
        "id": "feduk-trk-1528968269",
        "albumId": "feduk-alb-1528968268",
        "title": "Краски",
        "albumTitle": "Краски",
        "artist": "FEDUK",
        "year": 2020,
        "duration": "3:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/bd/81/f8/bd81f8bd-8863-ce53-47bb-69ab3af709b6/190295158309.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D0%B0%D1%81%D0%BA%D0%B8/1528968268?i=1528968269&uo=4"
      },
      {
        "id": "feduk-trk-1519061271",
        "albumId": "feduk-alb-1519060921",
        "title": "Останься (feat. BMB SpaceKid)",
        "albumTitle": "Останься",
        "artist": "FEDUK",
        "year": 2020,
        "duration": "3:06",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/55/9d/09/559d0902-dd59-bfff-ca3a-8f55f5bbca6c/190295191788.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%81%D1%82%D0%B0%D0%BD%D1%8C%D1%81%D1%8F-feat-bmb-spacekid/1519060921?i=1519061271&uo=4"
      },
      {
        "id": "feduk-trk-1519821058",
        "albumId": "feduk-alb-1519820520",
        "title": "Последний день лета (feat. Лия)",
        "albumTitle": "Фри",
        "artist": "FEDUK",
        "year": 2016,
        "duration": "3:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/0c/ac/2a/0cac2a7d-092f-119f-47ae-c18e88770a6d/3614976002370.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9-%D0%B4%D0%B5%D0%BD%D1%8C-%D0%BB%D0%B5%D1%82%D0%B0-feat-%D0%BB%D0%B8%D1%8F/1519820520?i=1519821058&uo=4"
      },
      {
        "id": "feduk-trk-1661709880",
        "albumId": "feduk-alb-1661709879",
        "title": "Хлопья летят наверх",
        "albumTitle": "Хлопья летят наверх",
        "artist": "FEDUK",
        "year": 2018,
        "duration": "4:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/fc/31/a0/fc31a076-281f-c9b6-f14f-ded87600ff47/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%85%D0%BB%D0%BE%D0%BF%D1%8C%D1%8F-%D0%BB%D0%B5%D1%82%D1%8F%D1%82-%D0%BD%D0%B0%D0%B2%D0%B5%D1%80%D1%85/1661709879?i=1661709880&uo=4"
      },
      {
        "id": "feduk-trk-1521571989",
        "albumId": "feduk-alb-1521571439",
        "title": "Околофутбола",
        "albumTitle": "Околофутбола",
        "artist": "FEDUK",
        "year": 2013,
        "duration": "3:33",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/b8/eb/ef/b8ebef91-4a18-bece-2bcd-1fcd95166e49/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D0%BA%D0%BE%D0%BB%D0%BE%D1%84%D1%83%D1%82%D0%B1%D0%BE%D0%BB%D0%B0/1521571439?i=1521571989&uo=4"
      },
      {
        "id": "feduk-trk-1521532386",
        "albumId": "feduk-alb-1521532145",
        "title": "Моряк",
        "albumTitle": "Моряк",
        "artist": "FEDUK",
        "year": 2017,
        "duration": "2:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/cb/e1/aa/cbe1aad6-5d47-f5e6-b33b-09383c4bc751/3614979090954.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%BE%D1%80%D1%8F%D0%BA/1521532145?i=1521532386&uo=4"
      },
      {
        "id": "feduk-trk-1569065763",
        "albumId": "feduk-alb-1569065761",
        "title": "Песня про лето",
        "albumTitle": "2 песни про лето",
        "artist": "FEDUK",
        "year": 2021,
        "duration": "2:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/88/e7/75/88e7753c-4a62-dde5-af56-00a19bf4f667/190296648892.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B5%D1%81%D0%BD%D1%8F-%D0%BF%D1%80%D0%BE-%D0%BB%D0%B5%D1%82%D0%BE/1569065761?i=1569065763&uo=4"
      },
      {
        "id": "feduk-trk-1537585798",
        "albumId": "feduk-alb-1537585784",
        "title": "Маяк",
        "albumTitle": "ЙАЙ",
        "artist": "FEDUK",
        "year": 2020,
        "duration": "3:31",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/97/c5/27/97c527e3-b28c-b36a-4098-ff1f3ba47459/190295091569.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D1%8F%D0%BA/1537585784?i=1537585798&uo=4"
      },
      {
        "id": "feduk-trk-1519820794",
        "albumId": "feduk-alb-1519820520",
        "title": "Tour de France",
        "albumTitle": "Фри",
        "artist": "FEDUK",
        "year": 2016,
        "duration": "4:36",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/0c/ac/2a/0cac2a7d-092f-119f-47ae-c18e88770a6d/3614976002370.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/tour-de-france/1519820520?i=1519820794&uo=4"
      }
    ]
  },
  "friendly-thug-52-ngg": {
    "name": "FRIENDLY THUG 52 NGG",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/cruiser-aurora/1616205418?uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-alb-1883084764",
        "title": "Cristoforo Colombo",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d6/ef/9b/d6ef9b6c-723c-eaa3-c3c0-72648505dd7c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/cristoforo-colombo/1883084764?uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-alb-1883086601",
        "title": "Graf Monte-Cristo / Most Valuable Pirate",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/27/f5/cf/27f5cf6c-75fc-5fbc-84ae-a57b69bc2d44/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/graf-monte-cristo-most-valuable-pirate/1883086601?uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-alb-1882069362",
        "title": "COW",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/09/6a/b9096a62-bd46-e482-8612-b37a561e6008/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/cow-single/1882069362?uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-alb-1595625742",
        "title": "DreamKeeperc",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/23/9d/6a/239d6ade-6837-a8d8-485f-b6af9727afaa/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dreamkeeperc-single/1595625742?uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-alb-1687471243",
        "title": "Дом С Привидениями",
        "artist": "OBLADAET, FRIENDLY THUG 52 NGG",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b4/ae/4a/b4ae4a7b-666f-6b0b-bfa0-9c9713021b25/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%BE%D0%BC-%D1%81-%D0%BF%D1%80%D0%B8%D0%B2%D0%B8%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC%D0%B8-single/1687471243?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "friendly-thug-52-ngg-trk-1595625748",
        "albumId": "friendly-thug-52-ngg-alb-1595625742",
        "title": "DreamKeeperc",
        "albumTitle": "DreamKeeperc",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2021,
        "duration": "2:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/23/9d/6a/239d6ade-6837-a8d8-485f-b6af9727afaa/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/dreamkeeperc/1595625742?i=1595625748&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206149",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Two Thousand Nineteen",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2021,
        "duration": "1:46",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/two-thousand-nineteen/1616205418?i=1616206149&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206154",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Calmer",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2022,
        "duration": "1:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/calmer/1616205418?i=1616206154&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206165",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Loyalty Above Money",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2021,
        "duration": "1:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/loyalty-above-money/1616205418?i=1616206165&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206592",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Earth Walker 100",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2022,
        "duration": "3:01",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/earth-walker-100/1616205418?i=1616206592&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1882069378",
        "albumId": "friendly-thug-52-ngg-alb-1882069362",
        "title": "COW",
        "albumTitle": "COW",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2026,
        "duration": "2:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/09/6a/b9096a62-bd46-e482-8612-b37a561e6008/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/cow/1882069362?i=1882069378&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206152",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Heart On The Corner",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2022,
        "duration": "2:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/heart-on-the-corner/1616205418?i=1616206152&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1616206170",
        "albumId": "friendly-thug-52-ngg-alb-1616205418",
        "title": "Victor (feat. White Punk)",
        "albumTitle": "Cruiser Aurora",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2022,
        "duration": "2:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/fb/70/ee/fb70ee9a-db93-a867-f69d-f8ab99e91de4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/victor-feat-white-punk/1616205418?i=1616206170&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1883086608",
        "albumId": "friendly-thug-52-ngg-alb-1883086601",
        "title": "No Gletcher Gang 2",
        "albumTitle": "Graf Monte-Cristo / Most Valuable Pirate",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2025,
        "duration": "1:56",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/27/f5/cf/27f5cf6c-75fc-5fbc-84ae-a57b69bc2d44/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/no-gletcher-gang-2/1883086601?i=1883086608&uo=4"
      },
      {
        "id": "friendly-thug-52-ngg-trk-1883085033",
        "albumId": "friendly-thug-52-ngg-alb-1883084764",
        "title": "Lost Angeles",
        "albumTitle": "Cristoforo Colombo",
        "artist": "FRIENDLY THUG 52 NGG",
        "year": 2023,
        "duration": "1:54",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d6/ef/9b/d6ef9b6c-723c-eaa3-c3c0-72648505dd7c/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/lost-angeles/1883084764?i=1883085033&uo=4"
      }
    ]
  },
  "bushido-zho": {
    "name": "BUSHIDO ZHO",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6a/dd/dc/6adddc59-2b24-2c72-b756-52f51809ac4f/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "bushido-zho-alb-1760536119",
        "title": "WE LIVE ONLY ONCE",
        "artist": "Aarne, BUSHIDO ZHO",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/6a/dd/dc/6adddc59-2b24-2c72-b756-52f51809ac4f/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/we-live-only-once/1760536119?uo=4"
      },
      {
        "id": "bushido-zho-alb-1614618565",
        "title": "NO BANG! HOLD ON!",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/05/88/430588e8-8aa2-4818-7a02-e6c06d3c0598/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/no-bang-hold-on/1614618565?uo=4"
      },
      {
        "id": "bushido-zho-alb-1718895949",
        "title": "WESTGOTHS",
        "artist": "BUSHIDO ZHO",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d2/b1/58/d2b15869-a033-d0b7-0f36-028084cab7a3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/westgoths/1718895949?uo=4"
      },
      {
        "id": "bushido-zho-alb-1887800492",
        "title": "sweet and tearz",
        "artist": "BUSHIDO ZHO, Wex",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bc/1b/89/bc1b89e7-a41c-f9e0-b85c-5e05fb3df813/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/sweet-and-tearz/1887800492?uo=4"
      },
      {
        "id": "bushido-zho-alb-1637126240",
        "title": "Тесно",
        "artist": "ANIKV, Aarne, BUSHIDO ZHO",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c9/9d/88/c99d88c1-8c02-1270-7557-61a097e095b8/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%82%D0%B5%D1%81%D0%BD%D0%BE-single/1637126240?uo=4"
      },
      {
        "id": "bushido-zho-alb-1692313910",
        "title": "ДАЙ МНЕ ПОСМОТРЕТЬ </3 ДЭНС ДЭНС",
        "artist": "Heronwater, BUSHIDO ZHO",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e3/b2/1e/e3b21e9f-e808-2e59-0273-10afc716ccb7/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B0%D0%B9-%D0%BC%D0%BD%D0%B5-%D0%BF%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C-3-%D0%B4%D1%8D%D0%BD%D1%81-%D0%B4%D1%8D%D0%BD%D1%81-single/1692313910?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "bushido-zho-trk-1743548184",
        "albumId": "bushido-zho-alb-1743547722",
        "title": "далеко (большой Бушизм)",
        "albumTitle": "далеко (большой Бушизм)",
        "artist": "BUSHIDO ZHO",
        "year": 2024,
        "duration": "1:47",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d4/23/96/d423963a-1fed-739b-3a58-04afe1d5b3f6/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B0%D0%BB%D0%B5%D0%BA%D0%BE-%D0%B1%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B9-%D0%B1%D1%83%D1%88%D0%B8%D0%B7%D0%BC/1743547722?i=1743548184&uo=4"
      },
      {
        "id": "bushido-zho-trk-1631995648",
        "albumId": "bushido-zho-alb-1631995647",
        "title": "vodila",
        "albumTitle": "vodila",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "duration": "1:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d1/a1/ac/d1a1acc8-72b8-5d92-34ee-1c053240c020/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/vodila/1631995647?i=1631995648&uo=4"
      },
      {
        "id": "bushido-zho-trk-1531757198",
        "albumId": "bushido-zho-alb-1531756895",
        "title": "PAIN VIBES (feat. blago white)",
        "albumTitle": "PAIN VIBES (feat. Blago White)",
        "artist": "BUSHIDO ZHO",
        "year": 2020,
        "duration": "2:10",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ee/b9/a9/eeb9a9f4-992b-c013-2148-f594bc4809e0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/pain-vibes-feat-blago-white/1531756895?i=1531757198&uo=4"
      },
      {
        "id": "bushido-zho-trk-1650750531",
        "albumId": "bushido-zho-alb-1650750530",
        "title": "Halloween",
        "albumTitle": "Halloween",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "duration": "2:00",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/69/e9/d5/69e9d5f2-89ce-95a4-04ff-2ac38750c1b9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/halloween/1650750530?i=1650750531&uo=4"
      },
      {
        "id": "bushido-zho-trk-1614618568",
        "albumId": "bushido-zho-alb-1614618565",
        "title": "Нет денег у сонных (Pleasure)",
        "albumTitle": "NO BANG! HOLD ON!",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "duration": "2:13",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/05/88/430588e8-8aa2-4818-7a02-e6c06d3c0598/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D1%82-%D0%B4%D0%B5%D0%BD%D0%B5%D0%B3-%D1%83-%D1%81%D0%BE%D0%BD%D0%BD%D1%8B%D1%85-pleasure/1614618565?i=1614618568&uo=4"
      },
      {
        "id": "bushido-zho-trk-1606729916",
        "albumId": "bushido-zho-alb-1606729914",
        "title": "макинтош бизнес онли",
        "albumTitle": "макинтош бизнес онли",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "duration": "1:53",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/46/b1/a3/46b1a3cb-c139-8d08-fb62-9ee8a2334d64/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D0%BA%D0%B8%D0%BD%D1%82%D0%BE%D1%88-%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D0%BE%D0%BD%D0%BB%D0%B8/1606729914?i=1606729916&uo=4"
      },
      {
        "id": "bushido-zho-trk-1614618756",
        "albumId": "bushido-zho-alb-1614618565",
        "title": "Ребром",
        "albumTitle": "NO BANG! HOLD ON!",
        "artist": "BUSHIDO ZHO",
        "year": 2022,
        "duration": "2:19",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/43/05/88/430588e8-8aa2-4818-7a02-e6c06d3c0598/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%80%D0%B5%D0%B1%D1%80%D0%BE%D0%BC/1614618565?i=1614618756&uo=4"
      },
      {
        "id": "bushido-zho-trk-1513007225",
        "albumId": "bushido-zho-alb-1513007222",
        "title": "AMATERASU (feat. SEEMEE & 163ONMYNECK)",
        "albumTitle": "AMATERASU (feat. SEEMEE & 163ONMYNECK)",
        "artist": "BUSHIDO ZHO",
        "year": 2020,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/97/5e/f6/975ef634-a258-dea4-7bc5-fedbb1aff24a/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/amaterasu-feat-seemee-163onmyneck/1513007222?i=1513007225&uo=4"
      },
      {
        "id": "bushido-zho-trk-1600933389",
        "albumId": "bushido-zho-alb-1600933388",
        "title": "KLIKI (feat. DooMee)",
        "albumTitle": "NIGHTMARE BEFORE XMAS",
        "artist": "BUSHIDO ZHO",
        "year": 2021,
        "duration": "2:18",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2b/b8/01/2bb801f5-0cd7-104e-93de-ac8dd3d1df20/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/kliki-feat-doomee/1600933388?i=1600933389&uo=4"
      },
      {
        "id": "bushido-zho-trk-1718896068",
        "albumId": "bushido-zho-alb-1718895949",
        "title": "Романтик и Вандал",
        "albumTitle": "WESTGOTHS",
        "artist": "BUSHIDO ZHO",
        "year": 2023,
        "duration": "1:55",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/d2/b1/58/d2b15869-a033-d0b7-0f36-028084cab7a3/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%80%D0%BE%D0%BC%D0%B0%D0%BD%D1%82%D0%B8%D0%BA-%D0%B8-%D0%B2%D0%B0%D0%BD%D0%B4%D0%B0%D0%BB/1718895949?i=1718896068&uo=4"
      }
    ]
  },
  "seemee": {
    "name": "SEEMEE",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "seemee-alb-1571994008",
        "title": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/txc/1571994008?uo=4"
      },
      {
        "id": "seemee-alb-1631104900",
        "title": "SCUM OFF THE POT 2",
        "artist": "MAYOT, SEEMEE",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/4a/b8/794ab81c-eda6-7963-4bd2-bc1a32450b25/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/scum-off-the-pot-2/1631104900?uo=4"
      },
      {
        "id": "seemee-alb-1524301670",
        "title": "Magic",
        "artist": "SEEMEE, YUNGWAY",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/23/79/5f/23795f30-ea5f-af46-7865-e3e7a5c8d5b4/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/magic-ep/1524301670?uo=4"
      },
      {
        "id": "seemee-alb-1683810017",
        "title": "HOLOD72",
        "artist": "SEEMEE",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/66/6e/7c/666e7c64-6124-e0e1-a529-4b9a1746e7df/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/holod72/1683810017?uo=4"
      },
      {
        "id": "seemee-alb-6783346698",
        "title": "TXC 2",
        "artist": "SEEMEE",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/60/dc/27/60dc27e9-a929-557f-5b87-a1ea5d28d92b/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/txc-2/6783346698?uo=4"
      },
      {
        "id": "seemee-alb-1874282765",
        "title": "HD Electronic Mixtape",
        "artist": "SEEMEE",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/69/83/73/69837301-ff0b-07c8-f721-928f41f24be3/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/hd-electronic-mixtape/1874282765?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "seemee-trk-1529895237",
        "albumId": "seemee-alb-1529895236",
        "title": "Голодный пёс (feat. SODA LUV)",
        "albumTitle": "Голодный пёс (feat. SODA LUV)",
        "artist": "SEEMEE",
        "year": 2020,
        "duration": "2:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/9f/07/44/9f074471-a108-6db4-6fd3-80fced6fdc50/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%BE%D0%BB%D0%BE%D0%B4%D0%BD%D1%8B%D0%B9-%D0%BF%D1%91%D1%81-feat-soda-luv/1529895236?i=1529895237&uo=4"
      },
      {
        "id": "seemee-trk-1571994011",
        "albumId": "seemee-alb-1571994008",
        "title": "WINDOWS (feat. MAYOT)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "1:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/windows-feat-mayot/1571994008?i=1571994011&uo=4"
      },
      {
        "id": "seemee-trk-1453413571",
        "albumId": "seemee-alb-1453413568",
        "title": "Бандиты (feat. OG BUDA & TELLY GRAVE)",
        "albumTitle": "Бандиты (feat. OG BUDA & TELLY GRAVE)",
        "artist": "SEEMEE",
        "year": 2019,
        "duration": "4:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/6b/e4/fa/6be4fa3e-cefc-15ab-0bb1-34f52588eb76/628810116744.png/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D0%BD%D0%B4%D0%B8%D1%82%D1%8B-feat-og-buda-telly-grave/1453413568?i=1453413571&uo=4"
      },
      {
        "id": "seemee-trk-1571994023",
        "albumId": "seemee-alb-1571994008",
        "title": "Hot Wheels (feat. 163ONMYNECK & Scally Milano)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "2:30",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/hot-wheels-feat-163onmyneck-scally-milano/1571994008?i=1571994023&uo=4"
      },
      {
        "id": "seemee-trk-1571994024",
        "albumId": "seemee-alb-1571994008",
        "title": "Битбокс (feat. OG Buda)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "2:07",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B8%D1%82%D0%B1%D0%BE%D0%BA%D1%81-feat-og-buda/1571994008?i=1571994024&uo=4"
      },
      {
        "id": "seemee-trk-1571994013",
        "albumId": "seemee-alb-1571994008",
        "title": "МИКРО (feat. MAYOT)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "2:19",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B8%D0%BA%D1%80%D0%BE-feat-mayot/1571994008?i=1571994013&uo=4"
      },
      {
        "id": "seemee-trk-1571994019",
        "albumId": "seemee-alb-1571994008",
        "title": "Кроссики (feat. LOVV66)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "2:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D0%BE%D1%81%D1%81%D0%B8%D0%BA%D0%B8-feat-lovv66/1571994008?i=1571994019&uo=4"
      },
      {
        "id": "seemee-trk-1571994015",
        "albumId": "seemee-alb-1571994008",
        "title": "Д****о",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4-%D0%BE/1571994008?i=1571994015&uo=4"
      },
      {
        "id": "seemee-trk-1571994012",
        "albumId": "seemee-alb-1571994008",
        "title": "PUFFchick",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "1:58",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/puffchick/1571994008?i=1571994012&uo=4"
      },
      {
        "id": "seemee-trk-1571994031",
        "albumId": "seemee-alb-1571994008",
        "title": "Я болен (feat. YUNGWAY)",
        "albumTitle": "TXC",
        "artist": "SEEMEE",
        "year": 2021,
        "duration": "2:40",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/0c/aa/040caa71-896c-2439-89e7-cb1a382c12fc/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D0%B1%D0%BE%D0%BB%D0%B5%D0%BD-feat-yungway/1571994008?i=1571994031&uo=4"
      }
    ]
  },
  "tri-dnya-dozhdya": {
    "name": "Три дня дождя",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/55/b1/62/55b162ba-a690-50bf-1486-fb382c3bc6ac/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "tri-dnya-dozhdya-alb-1712676700",
        "title": "melancholia",
        "artist": "Три дня дождя",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/55/b1/62/55b162ba-a690-50bf-1486-fb382c3bc6ac/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/melancholia/1712676700?uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-alb-1652091830",
        "title": "Байполар",
        "artist": "Три дня дождя",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d1/36/f8/d136f8d5-fe1a-dcca-a92a-5b2fdd5ff73b/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%B0%D0%B9%D0%BF%D0%BE%D0%BB%D0%B0%D1%80/1652091830?uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-alb-1567864054",
        "title": "Когда ты откроешь глаза",
        "artist": "Три дня дождя",
        "year": 2021,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e7/5b/38/e75b38f6-fcf0-eb94-619a-dc7a94dc36d2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0-%D1%82%D1%8B-%D0%BE%D1%82%D0%BA%D1%80%D0%BE%D0%B5%D1%88%D1%8C-%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0/1567864054?uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-alb-1808953655",
        "title": "Висхолдинг",
        "artist": "Три дня дождя",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e0/7d/e4/e07de42b-d6dd-baca-b7eb-c6c60079dd94/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%B8%D1%81%D1%85%D0%BE%D0%BB%D0%B4%D0%B8%D0%BD%D0%B3/1808953655?uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-alb-6812820983",
        "title": "У ЧАСТЬ ПЕРВАЯ",
        "artist": "Три дня дождя",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ae/41/82/ae418266-1a71-434b-1e42-52ffc55aadf5/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%83-%D1%87%D0%B0%D1%81%D1%82%D1%8C-%D0%BF%D0%B5%D1%80%D0%B2%D0%B0%D1%8F/6812820983?uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-alb-6820105047",
        "title": "У ЧАСТЬ ВТОРАЯ",
        "artist": "Три дня дождя",
        "year": 2026,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9c/3b/44/9c3b440f-2b6b-eba9-368d-b6fc469e1fa9/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%83-%D1%87%D0%B0%D1%81%D1%82%D1%8C-%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D1%8F/6820105047?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "tri-dnya-dozhdya-trk-1620003651",
        "albumId": "tri-dnya-dozhdya-alb-1620003458",
        "title": "Отпускай",
        "albumTitle": "Отпускай",
        "artist": "Три дня дождя",
        "year": 2022,
        "duration": "3:27",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/49/1b/6c/491b6c77-b982-fae0-4711-b91d0fa0f8c1/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BE%D1%82%D0%BF%D1%83%D1%81%D0%BA%D0%B0%D0%B9/1620003458?i=1620003651&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1567864451",
        "albumId": "tri-dnya-dozhdya-alb-1567864054",
        "title": "Перезаряжай",
        "albumTitle": "Когда ты откроешь глаза",
        "artist": "Три дня дождя",
        "year": 2021,
        "duration": "3:11",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e7/5b/38/e75b38f6-fcf0-eb94-619a-dc7a94dc36d2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B5%D1%80%D0%B5%D0%B7%D0%B0%D1%80%D1%8F%D0%B6%D0%B0%D0%B9/1567864054?i=1567864451&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1555504211",
        "albumId": "tri-dnya-dozhdya-alb-1555503895",
        "title": "Где ты",
        "albumTitle": "Где ты",
        "artist": "Три дня дождя",
        "year": 2021,
        "duration": "2:23",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/3a/33/17/3a3317c5-d8ad-8973-b729-7292f1c06c34/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%B4%D0%B5-%D1%82%D1%8B/1555503895?i=1555504211&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1635136379",
        "albumId": "tri-dnya-dozhdya-alb-1635136140",
        "title": "Я и одиночество",
        "albumTitle": "Я и одиночество",
        "artist": "Три дня дождя",
        "year": 2022,
        "duration": "3:49",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/5b/66/40/5b6640cf-2dc2-fe24-a1b1-64547ab61acb/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D0%B8-%D0%BE%D0%B4%D0%B8%D0%BD%D0%BE%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE/1635136140?i=1635136379&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1682956916",
        "albumId": "tri-dnya-dozhdya-alb-1682956915",
        "title": "За край",
        "albumTitle": "За край",
        "artist": "Три дня дождя",
        "year": 2023,
        "duration": "3:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/32/d6/db/32d6dba7-176c-82fc-5ad7-1b3b8ebe3199/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B7%D0%B0-%D0%BA%D1%80%D0%B0%D0%B9/1682956915?i=1682956916&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1672965907",
        "albumId": "tri-dnya-dozhdya-alb-1672965904",
        "title": "Красота",
        "albumTitle": "Красота",
        "artist": "Три дня дождя",
        "year": 2019,
        "duration": "2:57",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/53/f7/18/53f7181a-1257-db29-69ae-ab080935c0d7/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D0%B0%D1%81%D0%BE%D1%82%D0%B0/1672965904?i=1672965907&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1567864468",
        "albumId": "tri-dnya-dozhdya-alb-1567864054",
        "title": "Всё из-за тебя",
        "albumTitle": "Когда ты откроешь глаза",
        "artist": "Три дня дождя",
        "year": 2021,
        "duration": "2:51",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e7/5b/38/e75b38f6-fcf0-eb94-619a-dc7a94dc36d2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D1%81%D1%91-%D0%B8%D0%B7-%D0%B7%D0%B0-%D1%82%D0%B5%D0%B1%D1%8F/1567864054?i=1567864468&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1567864446",
        "albumId": "tri-dnya-dozhdya-alb-1567864054",
        "title": "Когда ты откроешь глаза",
        "albumTitle": "Когда ты откроешь глаза",
        "artist": "Три дня дождя",
        "year": 2021,
        "duration": "2:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e7/5b/38/e75b38f6-fcf0-eb94-619a-dc7a94dc36d2/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%BE%D0%B3%D0%B4%D0%B0-%D1%82%D1%8B-%D0%BE%D1%82%D0%BA%D1%80%D0%BE%D0%B5%D1%88%D1%8C-%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0/1567864054?i=1567864446&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1712676893",
        "albumId": "tri-dnya-dozhdya-alb-1712676700",
        "title": "Вдох",
        "albumTitle": "melancholia",
        "artist": "Три дня дождя",
        "year": 2023,
        "duration": "3:43",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/55/b1/62/55b162ba-a690-50bf-1486-fb382c3bc6ac/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B2%D0%B4%D0%BE%D1%85/1712676700?i=1712676893&uo=4"
      },
      {
        "id": "tri-dnya-dozhdya-trk-1652091842",
        "albumId": "tri-dnya-dozhdya-alb-1652091830",
        "title": "Не виноваты планеты",
        "albumTitle": "Байполар",
        "artist": "Три дня дождя",
        "year": 2022,
        "duration": "3:01",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d1/36/f8/d136f8d5-fe1a-dcca-a92a-5b2fdd5ff73b/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5-%D0%B2%D0%B8%D0%BD%D0%BE%D0%B2%D0%B0%D1%82%D1%8B-%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%D1%8B/1652091830?i=1652091842&uo=4"
      }
    ]
  },
  "tenderlybae": {
    "name": "Tenderlybae",
    "avatar": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
    "albums": [
      {
        "id": "tenderlybae-alb-1506576279",
        "title": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8E%D0%BD%D0%BE%D1%81%D1%82%D1%8C/1506576279?uo=4"
      },
      {
        "id": "tenderlybae-alb-1667911705",
        "title": "Ломай",
        "artist": "Tenderlybae",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7d/dd/87/7ddd87fb-35d5-d0c8-d946-4edff2c20acf/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%BE%D0%BC%D0%B0%D0%B9-single/1667911705?uo=4"
      },
      {
        "id": "tenderlybae-alb-1608154509",
        "title": "Игрушка",
        "artist": "Tenderlybae",
        "year": 2022,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/58/0e/79/580e795a-56ac-116e-d3ab-5c179c604f82/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B8%D0%B3%D1%80%D1%83%D1%88%D0%BA%D0%B0-single/1608154509?uo=4"
      },
      {
        "id": "tenderlybae-alb-1813466268",
        "title": "СПЛЕТНИ",
        "artist": "Tenderlybae",
        "year": 2025,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/85/7c/ba/857cbaf7-2646-0e1c-f8c8-1f0441d1e310/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BF%D0%BB%D0%B5%D1%82%D0%BD%D0%B8-single/1813466268?uo=4"
      },
      {
        "id": "tenderlybae-alb-1759884704",
        "title": "Несовместимы",
        "artist": "Tenderlybae",
        "year": 2024,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/dc/f5/31/dcf5317c-ac2c-9da3-58be-60f7b9847553/0.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BD%D0%B5%D1%81%D0%BE%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D0%BC%D1%8B-single/1759884704?uo=4"
      },
      {
        "id": "tenderlybae-alb-1720934100",
        "title": "Пацанский FONK",
        "artist": "ЕГОР КРИД, Tenderlybae, Егорик",
        "year": 2023,
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/49/88/80/4988804d-0af0-e56c-13fb-a95050100016/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9-fonk-single/1720934100?uo=4"
      }
    ],
    "tracks": [
      {
        "id": "tenderlybae-trk-1506576297",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Я урод",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "1:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%8F-%D1%83%D1%80%D0%BE%D0%B4/1506576279?i=1506576297&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576302",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Котопёс",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:52",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D0%BE%D1%82%D0%BE%D0%BF%D1%91%D1%81/1506576279?i=1506576302&uo=4"
      },
      {
        "id": "tenderlybae-trk-1608154524",
        "albumId": "tenderlybae-alb-1608154509",
        "title": "Игрушка",
        "albumTitle": "Игрушка",
        "artist": "Tenderlybae",
        "year": 2022,
        "duration": "2:02",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/58/0e/79/580e795a-56ac-116e-d3ab-5c179c604f82/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B8%D0%B3%D1%80%D1%83%D1%88%D0%BA%D0%B0/1608154509?i=1608154524&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576283",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Мама спалила",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:33",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BC%D0%B0%D0%BC%D0%B0-%D1%81%D0%BF%D0%B0%D0%BB%D0%B8%D0%BB%D0%B0/1506576279?i=1506576283&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576286",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Болит",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:15",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B1%D0%BE%D0%BB%D0%B8%D1%82/1506576279?i=1506576286&uo=4"
      },
      {
        "id": "tenderlybae-trk-1667911939",
        "albumId": "tenderlybae-alb-1667911705",
        "title": "Ломай",
        "albumTitle": "Ломай",
        "artist": "Tenderlybae",
        "year": 2023,
        "duration": "2:12",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7d/dd/87/7ddd87fb-35d5-d0c8-d946-4edff2c20acf/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BB%D0%BE%D0%BC%D0%B0%D0%B9/1667911705?i=1667911939&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576290",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "День рождения",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:17",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B4%D0%B5%D0%BD%D1%8C-%D1%80%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F/1506576279?i=1506576290&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576292",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Где твоя любовь",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:33",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%B3%D0%B4%D0%B5-%D1%82%D0%B2%D0%BE%D1%8F-%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D1%8C/1506576279?i=1506576292&uo=4"
      },
      {
        "id": "tenderlybae-trk-1813466456",
        "albumId": "tenderlybae-alb-1813466268",
        "title": "СПЛЕТНИ",
        "albumTitle": "СПЛЕТНИ",
        "artist": "Tenderlybae",
        "year": 2025,
        "duration": "2:22",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/85/7c/ba/857cbaf7-2646-0e1c-f8c8-1f0441d1e310/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D1%81%D0%BF%D0%BB%D0%B5%D1%82%D0%BD%D0%B8/1813466268?i=1813466456&uo=4"
      },
      {
        "id": "tenderlybae-trk-1506576288",
        "albumId": "tenderlybae-alb-1506576279",
        "title": "Кружатся",
        "albumTitle": "Юность",
        "artist": "Tenderlybae",
        "year": 2020,
        "duration": "2:39",
        "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/63/c9/0b/63c90bea-47f8-931b-48d5-d6eb6a3d8ef0/cover.jpg/600x600bb.jpg",
        "sourceUrl": "https://music.apple.com/ru/album/%D0%BA%D1%80%D1%83%D0%B6%D0%B0%D1%82%D1%81%D1%8F/1506576279?i=1506576288&uo=4"
      }
    ]
  }
}
