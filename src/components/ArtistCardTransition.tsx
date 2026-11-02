import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import type { AlbumDefinition } from '../data/albums'
import { calculateAlbumScore, useAlbumRatings } from '../hooks/useAlbumRatings'
import { AlbumRatingCard } from './AlbumRatingCard'
import './ArtistCardTransition.css'

export type ArtistCardSource = {
  left: number
  top: number
  width: number
  height: number
  rotateX: string
  rotateY: string
}

type ArtistCardTransitionProps = {
  album: AlbumDefinition
  index: number
  fromTrack?: boolean
  fromMonthArtist?: boolean
  source: ArtistCardSource | null
  children: ReactNode
  onDone: () => void
}

export function ArtistCardTransition({ album, index, fromTrack = false, fromMonthArtist = false, source, children, onDone }: ArtistCardTransitionProps) {
  const callback = useRef(onDone)
  const rating = useAlbumRatings(album.id)
  const score = rating.saved === null ? null : calculateAlbumScore(rating.saved)
  const viewportWidth = document.documentElement?.clientWidth || innerWidth
  const style = source ? {
    left: source.left,
    top: source.top,
    width: source.width,
    height: source.height,
    '--flight-width': `${viewportWidth}px`,
    '--flight-height': `${innerHeight}px`,
    '--flight-source-width': `${source.width}px`,
    '--flight-source-height': `${source.height}px`,
    '--flight-source-radius': innerWidth <= 600 ? '24px' : '28px',
    '--flight-front-scale': viewportWidth / source.width,
    '--flight-page-scale': source.width / viewportWidth,
    '--flight-rotate-x': source.rotateX,
    '--flight-rotate-y': source.rotateY,
  } as CSSProperties : undefined

  useLayoutEffect(() => { callback.current = onDone })

  useEffect(() => {
    if (!source) return
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      callback.current()
    }
    const finishTimer = window.setTimeout(finish, 760)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => {
      if (!motion.matches) return
      finish()
    }
    window.addEventListener('resize', finish, { passive: true })
    motion.addEventListener('change', updateMotion)
    updateMotion()
    return () => {
      finished = true
      window.clearTimeout(finishTimer)
      window.removeEventListener('resize', finish)
      motion.removeEventListener('change', updateMotion)
    }
  }, [source])

  return (
    <div className={`artist-card-transition${source ? ' is-opening' : ''}`} inert={source !== null} aria-hidden={source ? true : undefined} data-scene-pointer-ignore>
      <div className="artist-card-transition-shade" aria-hidden="true" />
      <div className="artist-card-transition-stage" style={style}>
        <div className="artist-card-transition-turner">
          <div className="artist-card-transition-front" aria-hidden="true" inert>
            {source && <AlbumRatingCard
              album={album}
              index={index}
              kindLabel={fromMonthArtist ? 'Исполнитель' : fromTrack ? 'Трек' : 'Альбом'}
              score={score}
              scoreLabel="Твоя оценка"
              mossModelEnabled={false}
              decorVariant={fromMonthArtist ? 'water' : fromTrack ? 'cloud' : 'moss'}
              scoreCaption={rating.saved === null ? 'Оценка ещё не сохранена' : rating.persistent ? 'Сохранено на этом устройстве' : 'Сохранено до перезагрузки'}
            />}
          </div>
          <div className="artist-card-transition-back">
            <div className="artist-card-transition-page">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
