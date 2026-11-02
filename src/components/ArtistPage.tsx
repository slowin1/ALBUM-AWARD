import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { albums, type AlbumDefinition } from '../data/albums'
import { tracks, type TrackDefinition } from '../data/tracks'
import { allAlbums, allTracks, artists, getReleaseArtists, type ArtistDefinition } from '../data/artists'
import { calculateAlbumScore, useAlbumRatings } from '../hooks/useAlbumRatings'
import { FluidBackground } from './FluidBackground'
import './ArtistPage.css'

export type ArtistPageProps = {
  artist: ArtistDefinition
  album: AlbumDefinition
  track?: TrackDefinition
  fromTrack?: boolean
  fromMonthArtist?: boolean
  onBack: () => void
  onOpenAlbum: (index: number) => void
  onOpenTrack?: (index: number) => void
  onOpenArtist?: (artistIndex: number) => void
  opening?: boolean
  backHref?: string
  backLabel?: string
}

function isLocalNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function ArtistAvatar({ artist }: { artist: ArtistDefinition }) {
  const [unavailable, setUnavailable] = useState(false)
  const initials = artist.name.split(/[\s,]+/).slice(0, 2).map(word => word[0]).join('')

  return (
    <figure className="artist-page-avatar">
      <div className="artist-page-avatar-image">
        {unavailable ? (
          <span className="artist-page-avatar-initials" role="img" aria-label={artist.name}>{initials}</span>
        ) : (
          <img
            src={artist.avatar}
            alt={`Аватар исполнителя ${artist.name}`}
            width="600"
            height="600"
            onError={() => setUnavailable(true)}
          />
        )}
      </div>
    </figure>
  )
}

function ArtistReleaseRating({ id, title, isTrack, awardMonth }: { id: string; title: string; isTrack: boolean; awardMonth?: string }) {
  const { saved } = useAlbumRatings(id)
  const score = saved === null ? null : calculateAlbumScore(saved)

  if (awardMonth && score === null) {
    return (
      <div className="artist-page-stat artist-page-personal-rating">
        <dt>Album Awards</dt>
        <dd>
          <strong>#1</strong>
          <span className="artist-page-stat-unit">Артист месяца</span>
        </dd>
        <dd className="artist-page-stat-caption">{awardMonth}</dd>
      </div>
    )
  }

  return (
    <div className="artist-page-stat artist-page-personal-rating">
      <dt>{isTrack ? 'Твоя оценка трека' : 'Твоя оценка альбома'}</dt>
      <dd>
        <strong>{score ?? '—'}</strong>
        {score !== null && <span className="artist-page-stat-unit">/ 100</span>}
      </dd>
      <dd className="artist-page-stat-caption">{title}{score === null && ' · Пока без оценки'}</dd>
    </div>
  )
}

function ReleaseCollaborators({
  currentArtistId,
  artistCredit,
  releaseTitle,
  onSelectArtist,
}: {
  currentArtistId: string
  artistCredit: string
  releaseTitle: string
  onSelectArtist?: (event: MouseEvent<HTMLAnchorElement>, artist: ArtistDefinition) => void
}) {
  const releaseArtists = getReleaseArtists(artistCredit, releaseTitle)
  const coArtists = releaseArtists.filter(candidate => candidate.id !== currentArtistId)
  if (coArtists.length === 0) return null

  return (
    <div className="artist-page-collabs" aria-label="Совместно с исполнителями">
      <span className="artist-page-collabs-label">Совместно:</span>
      {coArtists.map(coArtist => (
        <a
          key={coArtist.id}
          className="artist-page-collab-link"
          href={`/artist/${coArtist.id}`}
          onClick={event => onSelectArtist?.(event, coArtist)}
        >
          {coArtist.name} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  )
}

function ArtistReleaseCard({
  album,
  currentArtistId,
  onOpen,
  onSelectArtist,
}: {
  album: AlbumDefinition
  currentArtistId: string
  onOpen: (event: MouseEvent<HTMLAnchorElement>, album: AlbumDefinition) => void
  onSelectArtist?: (event: MouseEvent<HTMLAnchorElement>, artist: ArtistDefinition) => void
}) {
  const { saved, savedReviewTitle, savedReview } = useAlbumRatings(album.id)
  const score = saved === null ? null : calculateAlbumScore(saved)
  const scoreClass = score === null ? '' : score > 85 ? ' is-high-score' : score > 70 ? ' is-mid-score' : ' is-low-score'
  const isWheelAlbum = albums.some(candidate => candidate.id === album.id)

  return (
    <article className="artist-page-release">
      <img className="artist-page-release-cover" src={album.cover} alt="" width="168" height="168" loading="lazy" decoding="async" />
      <div className="artist-page-release-description">
        <div className="artist-page-release-topline">
          <span className="artist-page-release-type">{isWheelAlbum ? 'Альбом · Номинант' : 'Альбом'}</span>
          <span className={`artist-page-release-score${scoreClass}`}>
            <span>{score === null ? 'Оценить' : 'Твоя оценка'}</span>
            {score !== null && <strong>{score}<span className="artist-page-sr-only"> из 100</span></strong>}
          </span>
        </div>
        <h3>
          <a className="artist-page-release-main" href={`/album/${album.id}#vote`} onClick={event => onOpen(event, album)}>
            {album.title}
            <span className="artist-page-sr-only"> — открыть голосование</span>
          </a>
        </h3>
        <p className="artist-page-release-artist">{album.artist}</p>
        {savedReview && (
          <p className="artist-page-release-review">
            {savedReviewTitle && <strong>{savedReviewTitle}: </strong>}
            «{savedReview}»
          </p>
        )}
        <ReleaseCollaborators
          currentArtistId={currentArtistId}
          artistCredit={album.artist}
          releaseTitle={album.title}
          onSelectArtist={onSelectArtist}
        />
        <div className="artist-page-release-meta">
          <time dateTime={String(album.year)}>{album.year}</time>
          <a className="artist-page-listen" href={album.sourceUrl} target="_blank" rel="noopener noreferrer">
            Слушать <span aria-hidden="true">↗</span>
            <span className="artist-page-sr-only"> альбом {album.title} — откроется в новой вкладке</span>
          </a>
        </div>
      </div>
    </article>
  )
}

function ArtistTrackReleaseCard({
  track,
  currentArtistId,
  onOpen,
  onSelectArtist,
}: {
  track: TrackDefinition
  currentArtistId: string
  onOpen: (event: MouseEvent<HTMLAnchorElement>, track: TrackDefinition) => void
  onSelectArtist?: (event: MouseEvent<HTMLAnchorElement>, artist: ArtistDefinition) => void
}) {
  const { saved, savedReviewTitle, savedReview } = useAlbumRatings(`track:${track.id}`)
  const score = saved === null ? null : calculateAlbumScore(saved)
  const scoreClass = score === null ? '' : score > 85 ? ' is-high-score' : score > 70 ? ' is-mid-score' : ' is-low-score'
  const isWheelTrack = tracks.some(candidate => candidate.id === track.id)

  return (
    <article className="artist-page-release">
      <img className="artist-page-release-cover" src={track.cover} alt="" width="168" height="168" loading="lazy" decoding="async" />
      <div className="artist-page-release-description">
        <div className="artist-page-release-topline">
          <span className="artist-page-release-type">{isWheelTrack ? 'Трек месяца' : 'Трек'}</span>
          <span className={`artist-page-release-score${scoreClass}`}>
            <span>{score === null ? 'Оценить' : 'Твоя оценка'}</span>
            {score !== null && <strong>{score}<span className="artist-page-sr-only"> из 100</span></strong>}
          </span>
        </div>
        <h3>
          <a className="artist-page-release-main" href={`/track/${track.id}#vote`} onClick={event => onOpen(event, track)}>
            {track.title}
            <span className="artist-page-sr-only"> — открыть голосование</span>
          </a>
        </h3>
        <p className="artist-page-release-artist">{track.albumTitle}</p>
        {savedReview && (
          <p className="artist-page-release-review">
            {savedReviewTitle && <strong>{savedReviewTitle}: </strong>}
            «{savedReview}»
          </p>
        )}
        <ReleaseCollaborators
          currentArtistId={currentArtistId}
          artistCredit={track.artist}
          releaseTitle={track.title}
          onSelectArtist={onSelectArtist}
        />
        <div className="artist-page-release-meta">
          <time dateTime={String(track.year)}>{track.duration} · {track.year}</time>
          <a className="artist-page-listen" href={track.sourceUrl} target="_blank" rel="noopener noreferrer">
            Слушать <span aria-hidden="true">↗</span>
            <span className="artist-page-sr-only"> трек {track.title} — откроется в новой вкладке</span>
          </a>
        </div>
      </div>
    </article>
  )
}

function releaseCountLabel(count: number) {
  const lastTwo = count % 100
  if (lastTwo >= 11 && lastTwo <= 14) return 'релизов'
  if (count % 10 === 1) return 'релиз'
  if (count % 10 >= 2 && count % 10 <= 4) return 'релиза'
  return 'релизов'
}

export function ArtistPage({
  artist,
  album,
  fromTrack = false,
  fromMonthArtist = false,
  onBack,
  onOpenAlbum,
  onOpenTrack,
  onOpenArtist,
  opening = false,
  backHref: backHrefOverride,
  backLabel,
}: ArtistPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const totalCount = artist.albums.length + artist.tracks.length
  const awardMonth = artist.monthAwards[0]?.month

  useEffect(() => {
    if (!opening) headingRef.current?.focus({ preventScroll: true })
  }, [artist.id, opening])

  function returnToSource(event: MouseEvent<HTMLAnchorElement>) {
    if (!isLocalNavigation(event)) return
    event.preventDefault()
    onBack()
  }

  function openAlbum(event: MouseEvent<HTMLAnchorElement>, selectedAlbum: AlbumDefinition) {
    const albumIdx = allAlbums.findIndex(candidate => candidate.id === selectedAlbum.id)
    if (albumIdx < 0 || !isLocalNavigation(event)) return
    event.preventDefault()
    onOpenAlbum(albumIdx)
  }

  function openTrack(event: MouseEvent<HTMLAnchorElement>, selectedTrack: TrackDefinition) {
    const trackIndex = allTracks.findIndex(candidate => candidate.id === selectedTrack.id)
    if (trackIndex < 0 || !onOpenTrack || !isLocalNavigation(event)) return
    event.preventDefault()
    onOpenTrack(trackIndex)
  }

  function selectCollaborator(event: MouseEvent<HTMLAnchorElement>, targetArtist: ArtistDefinition) {
    const artistIdx = artists.findIndex(candidate => candidate.id === targetArtist.id)
    if (artistIdx < 0 || !onOpenArtist || !isLocalNavigation(event)) return
    event.preventDefault()
    onOpenArtist(artistIdx)
  }

  const backHref = backHrefOverride ?? (fromMonthArtist
    ? `/month-artist/${album.id.replace(/^month-artist:/, '')}#vote`
    : fromTrack
      ? `/track/${album.id.replace(/^track:/, '')}#vote`
      : `/album/${album.id}#vote`)

  return (
    <main className="artist-page" data-artist={artist.id}>
      <div className="artist-page-inner">
        <div className="artist-page-top">
          <a className="artist-page-back" href={backHref} onClick={returnToSource}>
            <span aria-hidden="true">←</span> {backLabel ?? (fromMonthArtist ? 'К оценке исполнителя' : fromTrack ? 'К треку' : 'К альбому')}
          </a>
          <span className="artist-page-eyebrow">{awardMonth ? `Исполнитель месяца · ${awardMonth}` : 'Исполнитель'}</span>
        </div>

        <section className="artist-page-hero" aria-labelledby="artist-page-title">
          <ArtistAvatar key={artist.id} artist={artist} />

          <div className="artist-page-intro">
            <FluidBackground animated={!opening} />
            <div className="artist-page-identity">
              <p className="artist-page-eyebrow">{awardMonth ? `Исполнитель месяца · ${awardMonth}` : 'Исполнитель'}</p>
              <h1 id="artist-page-title" ref={headingRef} tabIndex={-1}>{artist.name}</h1>
              <a className="artist-page-collection-link" href="#artist-releases">
                Альбомы и треки в коллекции <span aria-hidden="true">↗</span>
              </a>
            </div>

            <dl className="artist-page-stats">
              <div className="artist-page-stat">
                <dt>В коллекции</dt>
                <dd>
                  <strong>{String(totalCount).padStart(2, '0')}</strong>
                  <span className="artist-page-stat-unit">{releaseCountLabel(totalCount)}</span>
                </dd>
                <dd className="artist-page-stat-caption">
                  {artist.albums.length} альб. · {artist.tracks.length} тр.
                </dd>
              </div>
              <ArtistReleaseRating id={album.id} title={album.title} isTrack={fromTrack} awardMonth={fromMonthArtist ? awardMonth : undefined} />
            </dl>
          </div>
        </section>

        {artist.albums.length > 0 && (
          <section className="artist-page-releases" id="artist-releases" aria-labelledby="artist-page-albums-title">
            <div className="artist-page-releases-heading">
              <h2 id="artist-page-albums-title">Альбомы исполнителя</h2>
              <span className="artist-page-eyebrow" aria-label={`Альбомов в коллекции: ${artist.albums.length}`}>
                {String(artist.albums.length).padStart(2, '0')}
              </span>
            </div>

            <div className="artist-page-release-list">
              {artist.albums.map(release => (
                <ArtistReleaseCard
                  key={release.id}
                  album={release}
                  currentArtistId={artist.id}
                  onOpen={openAlbum}
                  onSelectArtist={selectCollaborator}
                />
              ))}
            </div>
          </section>
        )}

        {artist.tracks.length > 0 && (
          <section className="artist-page-releases artist-page-releases--tracks" id={artist.albums.length === 0 ? 'artist-releases' : 'artist-tracks'} aria-labelledby="artist-page-tracks-title">
            <div className="artist-page-releases-heading">
              <h2 id="artist-page-tracks-title">Треки исполнителя</h2>
              <span className="artist-page-eyebrow" aria-label={`Треков в коллекции: ${artist.tracks.length}`}>
                {String(artist.tracks.length).padStart(2, '0')}
              </span>
            </div>

            <div className="artist-page-release-list">
              {artist.tracks.map(release => (
                <ArtistTrackReleaseCard
                  key={release.id}
                  track={release}
                  currentArtistId={artist.id}
                  onOpen={openTrack}
                  onSelectArtist={selectCollaborator}
                />
              ))}
            </div>
          </section>
        )}

        <footer className="artist-page-footer"><span>ALBUM AWARDS</span><span>{artist.name}</span></footer>
      </div>
    </main>
  )
}
