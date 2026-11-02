import { useEffect, useRef, type MouseEvent } from 'react'
import type { AlbumDefinition } from '../data/albums'
import { AlbumCardMoss } from './AlbumCardMoss'
import './AlbumRatingCard.css'

export type AlbumRatingCardProps = {
  album: AlbumDefinition
  index: number
  kindLabel?: string
  metaRight?: string | number
  score?: number | null
  scoreLabel?: string
  scoreCaption?: string
  artistHref?: string
  onArtistOpen?: (event: MouseEvent<HTMLAnchorElement>) => void
  mossModelEnabled?: boolean
  decorVariant?: 'moss' | 'cloud' | 'water'
}

const scoreFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

function useCardTilt(albumId: string) {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const pointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let bounds: DOMRect | null = null
    let animationFrame = 0
    let x = .5
    let y = .5

    function reset() {
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      bounds = null
      frame!.removeAttribute('data-tilting')
      frame!.style.setProperty('--card-rotate-x', '0deg')
      frame!.style.setProperty('--card-rotate-y', '0deg')
    }

    function paint() {
      animationFrame = 0
      const style = frame!.style
      style.setProperty('--card-rotate-x', `${((.5 - y) * 12).toFixed(3)}deg`)
      style.setProperty('--card-rotate-y', `${((x - .5) * 16).toFixed(3)}deg`)
      style.setProperty('--card-glare-x', `${(x * 100).toFixed(2)}%`)
      style.setProperty('--card-glare-y', `${(y * 100).toFixed(2)}%`)
      style.setProperty('--card-glare-angle', `${120 + (x - .5) * 25 + (y - .5) * 10}deg`)
      frame!.setAttribute('data-tilting', '')
    }

    function move(event: PointerEvent) {
      if (!pointer.matches || reducedMotion.matches || document.hidden || event.pointerType !== 'mouse' || event.isPrimary === false) {
        reset()
        return
      }
      // Measure the stationary wrapper so the tilt never changes its own input.
      bounds ??= frame!.getBoundingClientRect()
      if (bounds.width === 0 || bounds.height === 0) return
      x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
      y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
      if (!animationFrame) animationFrame = requestAnimationFrame(paint)
    }

    frame.addEventListener('pointerenter', move, { passive: true })
    frame.addEventListener('pointermove', move, { passive: true })
    frame.addEventListener('pointerleave', reset)
    frame.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('resize', reset, { passive: true })
    window.addEventListener('scroll', reset, { passive: true, capture: true })
    document.addEventListener('visibilitychange', reset)
    pointer.addEventListener('change', reset)
    reducedMotion.addEventListener('change', reset)

    return () => {
      frame.removeEventListener('pointerenter', move)
      frame.removeEventListener('pointermove', move)
      frame.removeEventListener('pointerleave', reset)
      frame.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('resize', reset)
      window.removeEventListener('scroll', reset, true)
      document.removeEventListener('visibilitychange', reset)
      pointer.removeEventListener('change', reset)
      reducedMotion.removeEventListener('change', reset)
      reset()
    }
  }, [albumId])

  return frameRef
}

export function AlbumRatingCard({ album, index, kindLabel = 'Альбом', metaRight, score, scoreLabel = 'Оценка альбома', scoreCaption, artistHref, onArtistOpen, mossModelEnabled = true, decorVariant = 'moss' }: AlbumRatingCardProps) {
  const frameRef = useCardTilt(album.id)
  const rating = typeof score === 'number' && Number.isFinite(score)
    ? Math.round(Math.min(100, Math.max(0, score)) * 10) / 10
    : null
  const scoreText = rating === null ? '—' : scoreFormat.format(rating)
  const isCloud = decorVariant === 'cloud'
  const isWater = decorVariant === 'water'

  return (
    <div className="album-rating-card-frame" ref={frameRef} data-scene-pointer-ignore>
      <article className={`album-rating-card${isCloud ? ' album-rating-card--cloud' : ''}${isWater ? ' album-rating-card--water' : ''}`} aria-label={`${album.title} — ${album.artist}`}>
        <div className="album-rating-card-surface">
        <div className="album-rating-card-content">
          <div className="album-rating-card-meta">
            <span>{kindLabel} {String(index + 1).padStart(2, '0')}</span>
            <span>{metaRight ?? album.year}</span>
          </div>

          <div className="album-rating-card-artwork">
            <img src={album.cover} alt={`Обложка альбома «${album.title}»`} width="640" height="640" loading="lazy" decoding="async" />
          </div>

          <div className="album-rating-card-release">
            <p className="album-rating-card-artist">{album.artist}{artistHref && <span className="album-rating-card-artist-arrow" aria-hidden="true">↗</span>}</p>
            <h3 className="album-rating-card-title">{album.title}</h3>
          </div>

          <div className="album-rating-card-rating">
            <div className="album-rating-card-rating-heading">
              <span className="album-rating-card-rating-label">{scoreLabel}</span>
              <span className="album-rating-card-score" aria-hidden="true">
                <strong>{scoreText}</strong><span>/ 100</span>
              </span>
            </div>

            {rating === null ? (
              <div className="album-rating-card-scale" aria-hidden="true">
                <div className="album-rating-card-track" />
                <div className="album-rating-card-scale-labels"><span>0</span><span>100</span></div>
              </div>
            ) : (
              <div className="album-rating-card-scale" role="meter" aria-label={scoreLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={rating} aria-valuetext={`${scoreText} из 100`}>
                <div className="album-rating-card-track" aria-hidden="true">
                  <span className="album-rating-card-fill" style={{ width: `${rating}%` }} />
                </div>
                <div className="album-rating-card-scale-labels" aria-hidden="true"><span>0</span><span>100</span></div>
              </div>
            )}

            <p className="album-rating-card-rating-caption">
              {scoreCaption ?? (rating === null ? 'Пока нет оценок' : 'По шкале от 0 до 100')}
            </p>
          </div>
        </div>
        </div>
        {isCloud ? (
          <img
            className="album-rating-card-cloud"
            src="/textures/card-cloud-frame.png?v=2"
            alt=""
            aria-hidden="true"
            width="702"
            height="715"
            decoding="async"
            draggable={false}
          />
        ) : isWater ? (
          <img
            className="album-rating-card-water"
            src="/textures/card-water-frame.png?v=5"
            alt=""
            aria-hidden="true"
            width="768"
            height="965"
            decoding="async"
            draggable={false}
          />
        ) : (
          <>
            <img
              className="album-rating-card-moss"
              src="/textures/hanging-ivy-fallback.png?v=3"
              alt=""
              aria-hidden="true"
              width="875"
              height="1000"
              decoding="async"
              draggable={false}
            />
            <AlbumCardMoss enabled={mossModelEnabled} />
          </>
        )}
      </article>
      {artistHref && (
        <a className="album-rating-card-link" href={artistHref} onClick={onArtistOpen} aria-label={`Открыть страницу исполнителя ${album.artist}`}>
          <span className="album-page-sr-only">Об исполнителе {album.artist}</span>
        </a>
      )}
    </div>
  )
}
