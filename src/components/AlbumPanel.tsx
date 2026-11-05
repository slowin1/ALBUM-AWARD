import { useEffect, useId, useRef } from 'react'
import type { AlbumDefinition } from '../data/albums'
import { useDemoVote } from '../hooks/useDemoVote'
import './AlbumPanel.css'

export type AlbumPanelProps = {
  album: AlbumDefinition | null
  onClose: () => void
}

/** Non-modal details: the rest of the gallery remains keyboard accessible. */
export function AlbumPanel({ album, onClose }: AlbumPanelProps) {
  const vote = useDemoVote()
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const descriptionId = useId()
  const isOpen = album !== null
  const isChosen = album?.id === vote.albumId

  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement
    const panel = panelRef.current
    closeRef.current?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      // Do not steal focus if the user has already moved to another control.
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        (panel?.contains(document.activeElement) || document.activeElement === document.body)
      ) {
        previousFocus.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  if (!album) return null

  return (
    <section
      className="album-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="album-panel-topline">
        <span className="album-panel-eyebrow" id={descriptionId}>Голосование · Альбом года</span>
        <button
          className="album-panel-close"
          ref={closeRef}
          onClick={onClose}
          aria-label="Закрыть карточку альбома"
          title="Закрыть · Esc"
          type="button"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>

      <div className="album-panel-release">
        <img className="album-panel-cover" src={album.cover} alt="" width="72" height="72" />
        <div className="album-panel-info">
          <h2 className="album-panel-title" id={titleId}>{album.title}</h2>
          <p className="album-panel-artist">{album.artist}</p>
          <span className="album-panel-year">{album.year}</span>
        </div>
      </div>

      <div className="album-panel-actions">
        <button
          className={`album-panel-vote${isChosen ? ' album-panel-vote-chosen' : ''}`}
          type="button"
          onClick={() => void vote.choose(isChosen ? null : album.id)}
          disabled={vote.saving}
          aria-pressed={isChosen}
        >
          {isChosen ? 'Отменить выбор' : vote.albumId ? 'Изменить выбор' : 'Голосовать'}
          <span aria-hidden="true">{isChosen ? '✓' : '↗'}</span>
        </button>
        <a className="album-panel-listen" href={album.sourceUrl} target="_blank" rel="noopener noreferrer">
          Слушать <span aria-hidden="true">↗</span>
          <span className="album-panel-sr-only"> — откроется в новой вкладке</span>
        </a>
      </div>

      <p className="album-panel-status" role="status" aria-live="polite" aria-atomic="true">
        {vote.error
          ? vote.error
          : vote.needsAuth
            ? 'Войди в аккаунт, чтобы проголосовать.'
            : vote.saving
              ? 'Сохраняем голос…'
              : isChosen
                ? 'Твой голос сохранён в аккаунте'
                : vote.albumId
                  ? 'Можно выбрать один альбом. Новый выбор заменит предыдущий.'
                  : vote.choiceCleared
                    ? 'Выбор отменён. Можно выбрать другой альбом.'
                    : 'Один альбом — один голос в аккаунте.'}
      </p>
    </section>
  )
}
