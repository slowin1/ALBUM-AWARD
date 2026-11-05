import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { getAuthToken } from '../hooks/useAuth'
import type { CustomSoundCloudAlbum, CustomSoundCloudTrack } from './AdminTracksPage'

type SceneSlotLike = { title: string; cover: string }

export type AdminOverviewProps = {
  albums: CustomSoundCloudAlbum[]
  tracks: CustomSoundCloudTrack[]
  artistsCount: number
  sceneWheels: { id: string; label: string; slots: SceneSlotLike[] }[]
  onEditAlbum: (album: CustomSoundCloudAlbum) => void
  onEditTrack: (track: CustomSoundCloudTrack) => void
  onOpenScene: () => void
  onOpenImport: () => void
}

function plural(n: number, forms: [string, string, string]) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1]
  return forms[2]
}

const hasRealCover = (cover?: string) => !!cover && !cover.includes('placeholder')
const isDefaultSlotTitle = (title: string) => /^(Слот|Исполнитель)\s*\d+$/i.test(title.trim())
const isSlotFilled = (slot: SceneSlotLike) => !isDefaultSlotTitle(slot.title) || hasRealCover(slot.cover)

type Release = {
  key: string
  kind: 'album' | 'track'
  title: string
  artist: string
  cover: string
  problems: string[]
  album?: CustomSoundCloudAlbum
  track?: CustomSoundCloudTrack
}

type ServerStats = {
  counts: { albums: number; singles: number; albumTracks: number; artists: number }
  quality: { total: number; withCover: number; withLink: number; withProfile: number }
  attention: { key: string; kind: 'album' | 'track'; id: string; title: string; artist: string; cover: string; problems: string[] }[]
  yearCounts: { year: number; count: number }[]
  leaders: { name: string; count: number }[]
}

function niceScale(max: number) {
  const top = Math.max(1, max)
  const step = top <= 4 ? 1 : top <= 10 ? 2 : Math.ceil(top / 4 / 5) * 5
  const niceTop = Math.ceil(top / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= niceTop; v += step) ticks.push(v)
  return { niceTop, ticks }
}

/* ---------- building blocks ---------- */

type TableData = { head: string[]; rows: (string | number)[][] }

function ChartCard({
  title,
  subtitle,
  table,
  children,
  className = '',
}: {
  title: string
  subtitle: string
  table?: TableData
  children: ReactNode
  className?: string
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  return (
    <section className={`aov-card ${className}`.trim()}>
      <div className="aov-card-head">
        <div>
          <h3 className="aov-card-title">{title}</h3>
          <p className="aov-card-sub">{subtitle}</p>
        </div>
        {table && (
          <div className="aov-toggle" role="group" aria-label="Вид данных">
            <button
              type="button"
              className={view === 'chart' ? 'is-active' : ''}
              aria-pressed={view === 'chart'}
              onClick={() => setView('chart')}
            >
              График
            </button>
            <button
              type="button"
              className={view === 'table' ? 'is-active' : ''}
              aria-pressed={view === 'table'}
              onClick={() => setView('table')}
            >
              Таблица
            </button>
          </div>
        )}
      </div>

      {table && view === 'table' ? (
        <table className="aov-table">
          <thead>
            <tr>
              {table.head.map((h, i) => (
                <th key={h} scope="col" className={i > 0 ? 'is-num' : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td key={i} className={i > 0 ? 'is-num' : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        children
      )}
    </section>
  )
}

function Meter({
  label,
  value,
  total,
  warnBelow = 0.6,
}: {
  label: string
  value: number
  total: number
  warnBelow?: number
}) {
  const ratio = total > 0 ? value / total : 0
  return (
    <div className="aov-meter">
      <div className="aov-meter-row">
        <span className="aov-meter-label">{label}</span>
        <span className="aov-meter-value">
          {value} из {total}
        </span>
      </div>
      <div
        className={`aov-meter-track${ratio < warnBelow ? ' is-warn' : ''}`}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={value}
      >
        <span className="aov-meter-fill" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
    </div>
  )
}

/* ---------- main component ---------- */

export function AdminOverview({
  albums,
  tracks,
  artistsCount,
  sceneWheels,
  onEditAlbum,
  onEditTrack,
  onOpenScene,
  onOpenImport,
}: AdminOverviewProps) {
  // Все подсчёты делает сервер (GET /api/admin/stats) — на клиенте только отрисовка.
  const [server, setServer] = useState<ServerStats | null>(null)
  const refreshKey = `${albums.length}:${tracks.length}:${artistsCount}`

  useEffect(() => {
    let alive = true
    const token = getAuthToken()
    fetch('/api/admin/stats', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (alive && data) setServer(data as ServerStats)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [refreshKey])

  const stats = useMemo(() => {
    const albumById = new Map(albums.map(a => [a.id, a]))
    const trackById = new Map(tracks.map(t => [t.id, t]))
    const attention: Release[] = (server?.attention ?? []).map(r => ({
      key: r.key,
      kind: r.kind,
      title: r.title,
      artist: r.artist,
      cover: r.cover,
      problems: r.problems,
      album: r.kind === 'album' ? albumById.get(r.id) : undefined,
      track: r.kind === 'track' ? trackById.get(r.id) : undefined,
    }))

    const yearCounts = new Map((server?.yearCounts ?? []).map(y => [y.year, y.count]))
    let years = [...yearCounts.keys()].sort((a, b) => a - b)
    if (years.length > 1 && years[years.length - 1] - years[0] <= 11) {
      const filled: number[] = []
      for (let y = years[0]; y <= years[years.length - 1]; y++) filled.push(y)
      years = filled
    } else {
      years = years.slice(-12)
    }
    const yearRows = years.map(year => ({ year, count: yearCounts.get(year) ?? 0 }))

    return {
      total: server?.quality.total ?? 0,
      withCover: server?.quality.withCover ?? 0,
      withLink: server?.quality.withLink ?? 0,
      withProfile: server?.quality.withProfile ?? 0,
      attention,
      yearRows,
      leaders: server?.leaders ?? [],
      albumTracks: server?.counts.albumTracks ?? 0,
    }
  }, [server, albums, tracks])

  const slotTotals = sceneWheels.map(w => ({
    ...w,
    filled: w.slots.filter(isSlotFilled).length,
    total: w.slots.length,
  }))
  const slotsFilled = slotTotals.reduce((s, w) => s + w.filled, 0)
  const slotsTotal = slotTotals.reduce((s, w) => s + w.total, 0)

  const { niceTop, ticks } = niceScale(Math.max(0, ...stats.yearRows.map(r => r.count)))
  const maxYear = stats.yearRows.reduce((best, r) => (r.count > best.count ? r : best), {
    year: 0,
    count: 0,
  })
  const maxLeader = Math.max(1, ...stats.leaders.map(l => l.count))
  const totalSplit = stats.albumTracks + tracks.length
  const splitParts = [
    { id: 'album', label: 'В альбомах', value: stats.albumTracks },
    { id: 'single', label: 'Синглы', value: tracks.length },
  ]

  const hasReleases = stats.total > 0

  return (
    <div className="aov">
      <div className="aov-kpis">
        <div className="aov-kpi">
          <p className="aov-kpi-label">Альбомы</p>
          <p className="aov-kpi-value">{albums.length}</p>
          <p className="aov-kpi-sub">
            {stats.albumTracks} {plural(stats.albumTracks, ['трек', 'трека', 'треков'])} в треклистах
          </p>
        </div>
        <div className="aov-kpi">
          <p className="aov-kpi-label">Синглы</p>
          <p className="aov-kpi-value">{tracks.length}</p>
          <p className="aov-kpi-sub">отдельные релизы в ленте</p>
        </div>
        <div className="aov-kpi">
          <p className="aov-kpi-label">Исполнители</p>
          <p className="aov-kpi-value">{artistsCount}</p>
          <p className="aov-kpi-sub">профилей в базе</p>
        </div>
        <div className="aov-kpi">
          <p className="aov-kpi-label">Слоты 3D-сцены</p>
          <p className="aov-kpi-value">
            {slotsFilled}
            <span className="aov-kpi-of"> / {slotsTotal}</span>
          </p>
          <p className="aov-kpi-sub">заполнено в трёх колёсах</p>
        </div>
      </div>

      {hasReleases ? (
        <>
          <ChartCard
            className="aov-span-7"
            title="Альбомы по годам выхода"
            subtitle={
              stats.yearRows.length > 0
                ? `Больше всего — в ${maxYear.year}: ${maxYear.count} ${plural(maxYear.count, ['альбом', 'альбома', 'альбомов'])}`
                : 'У альбомов не указан год выхода'
            }
            table={{
              head: ['Год', 'Альбомов'],
              rows: stats.yearRows.map(r => [r.year, r.count]),
            }}
          >
            {stats.yearRows.length > 0 ? (
              <div className="aov-plot">
                <div className="aov-yaxis" aria-hidden="true">
                  {[...ticks].reverse().map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="aov-plot-area">
                  <div className="aov-grid" aria-hidden="true">
                    {ticks.map(t => (
                      <span key={t} />
                    ))}
                  </div>
                  <ul
                    className="aov-cols"
                    style={{ gridTemplateColumns: `repeat(${stats.yearRows.length}, minmax(0, 1fr))` }}
                  >
                    {stats.yearRows.map(row => {
                      const word = plural(row.count, ['альбом', 'альбома', 'альбомов'])
                      return (
                        <li
                          key={row.year}
                          className="aov-col"
                          tabIndex={0}
                          aria-label={`${row.year}: ${row.count} ${word}`}
                        >
                          <span
                            className="aov-col-mark"
                            style={{ '--h': `${(row.count / niceTop) * 100}%` } as CSSProperties}
                          >
                            <span className="aov-col-bar" />
                            {row.count === maxYear.count && row.count > 0 && (
                              <span className="aov-col-top">{row.count}</span>
                            )}
                            <span className="aov-tip" role="tooltip">
                              {row.year} · {row.count} {word}
                            </span>
                          </span>
                          <span className="aov-col-x">{row.year}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="aov-muted">Укажите год выхода в карточке альбома, и он появится на графике.</p>
            )}
          </ChartCard>

          <ChartCard
            className="aov-span-5"
            title="Больше всего треков"
            subtitle="Исполнители по числу треков в каталоге"
            table={{
              head: ['Исполнитель', 'Треков'],
              rows: stats.leaders.map(l => [l.name, l.count]),
            }}
          >
            {stats.leaders.length > 0 ? (
              <ol className="aov-rank">
                {stats.leaders.map(l => (
                  <li key={l.name} className="aov-rank-row">
                    <span className="aov-rank-name" title={l.name}>
                      {l.name}
                    </span>
                    <span className="aov-rank-track">
                      <span
                        className="aov-rank-fill"
                        style={{ width: `${(l.count / maxLeader) * 86}%` }}
                      />
                      <span className="aov-rank-val">{l.count}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="aov-muted">Пока нет треков с указанным исполнителем.</p>
            )}
          </ChartCard>

          <section className="aov-card aov-span-7">
            <div className="aov-card-head">
              <div>
                <h3 className="aov-card-title">Качество каталога</h3>
                <p className="aov-card-sub">Что заполнено у альбомов и синглов</p>
              </div>
            </div>

            <div className="aov-meters">
              <Meter label="Загружена обложка" value={stats.withCover} total={stats.total} />
              <Meter label="Есть ссылка на аудио" value={stats.withLink} total={stats.total} />
              <Meter label="Привязан профиль исполнителя" value={stats.withProfile} total={stats.total} />
            </div>

            <div className="aov-attention">
              <h4 className="aov-attention-title">
                {stats.attention.length > 0
                  ? `Стоит поправить: ${stats.attention.length}`
                  : 'Всё заполнено'}
              </h4>
              {stats.attention.length === 0 ? (
                <p className="aov-muted">
                  У каждого релиза есть обложка, ссылка на аудио и профиль исполнителя.
                </p>
              ) : (
                <ul className="aov-attention-list">
                  {stats.attention.slice(0, 4).map(r => (
                    <li key={r.key} className="aov-attention-row">
                      <img
                        src={r.cover || '/covers/placeholder.jpg'}
                        alt=""
                        className="aov-attention-cover"
                        onError={e => {
                          ;(e.target as HTMLImageElement).src = '/covers/placeholder.jpg'
                        }}
                      />
                      <div className="aov-attention-body">
                        <span className="aov-attention-name">{r.title}</span>
                        <span className="aov-attention-meta">
                          {r.kind === 'album' ? 'Альбом' : 'Сингл'} · {r.artist || 'без исполнителя'}
                        </span>
                        <span className="aov-chips">
                          {r.problems.map(p => (
                            <span key={p} className="aov-chip">
                              {p}
                            </span>
                          ))}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="aov-link-btn"
                        onClick={() => {
                          if (r.album) onEditAlbum(r.album)
                          else if (r.track) onEditTrack(r.track)
                        }}
                      >
                        Изменить
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {stats.attention.length > 4 && (
                <p className="aov-muted aov-attention-more">
                  и ещё {stats.attention.length - 4} {plural(stats.attention.length - 4, ['релиз', 'релиза', 'релизов'])}: найдите их в каталоге
                </p>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="aov-card aov-span-12 aov-empty">
          <h3 className="aov-card-title">В каталоге пока пусто</h3>
          <p className="aov-muted">
            Добавьте первый релиз, и здесь появятся графики по годам, исполнителям и качеству данных.
          </p>
          <button type="button" className="admin-submit-btn" onClick={onOpenImport}>
            Импортировать по ссылке
          </button>
        </section>
      )}

      <div className={hasReleases ? 'aov-stack aov-span-5' : 'aov-stack aov-span-12'}>
        <section className="aov-card">
          <div className="aov-card-head">
            <div>
              <h3 className="aov-card-title">3D-сцена</h3>
              <p className="aov-card-sub">Заполненные слоты в колёсах</p>
            </div>
          </div>
          <div className="aov-meters">
            {slotTotals.map(w => (
              <Meter key={w.id} label={w.label} value={w.filled} total={w.total} warnBelow={0.5} />
            ))}
          </div>
          <button type="button" className="aov-link-btn is-wide" onClick={onOpenScene}>
            Настроить слоты
          </button>
        </section>

        {hasReleases && totalSplit > 0 && (
          <section className="aov-card">
            <div className="aov-card-head">
              <div>
                <h3 className="aov-card-title">Состав треков</h3>
                <p className="aov-card-sub">Сколько треков в альбомах и сколько вышло синглами</p>
              </div>
            </div>
            <div
              className="aov-split"
              role="img"
              aria-label={splitParts
                .map(p => `${p.label}: ${p.value} (${Math.round((p.value / totalSplit) * 100)}%)`)
                .join('; ')}
            >
              {splitParts
                .filter(p => p.value > 0)
                .map(p => {
                  const share = Math.round((p.value / totalSplit) * 100)
                  return (
                    <span
                      key={p.id}
                      className={`aov-split-part is-${p.id}`}
                      style={{ flexGrow: p.value }}
                      tabIndex={0}
                    >
                      {share >= 14 && <span className="aov-split-label">{share}%</span>}
                      <span className="aov-tip" role="tooltip">
                        {p.label} · {p.value} · {share}%
                      </span>
                    </span>
                  )
                })}
            </div>
            <ul className="aov-legend">
              {splitParts.map(p => (
                <li key={p.id}>
                  <span className={`aov-legend-dot is-${p.id}`} aria-hidden="true" />
                  {p.label}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
