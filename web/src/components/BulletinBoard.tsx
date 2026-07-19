import type { Dispatch, DispatchesFile } from '../types'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

function LeadStory({ item }: { item: Dispatch }) {
  return (
    <article className="lead" aria-labelledby="lead-headline">
      <div className="lead__meta">
        <span className="stamp">{item.irony_tag}</span>
        <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
      </div>
      <h1 id="lead-headline" className="lead__headline">
        {item.headline}
      </h1>
      <p className="lead__lede">{item.lede}</p>
      <aside className="frontline" aria-label="前线实报">
        <p className="frontline__label">前线实报</p>
        <blockquote className="frontline__claim">「{item.source_claim}」</blockquote>
      </aside>
    </article>
  )
}

function ArchiveItem({ item }: { item: Dispatch }) {
  return (
    <li className="archive__item">
      <div className="archive__row">
        <span className="stamp stamp--sm">{item.irony_tag}</span>
        <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
      </div>
      <h2 className="archive__headline">{item.headline}</h2>
      <p className="archive__claim">前线实报：{item.source_claim}</p>
    </li>
  )
}

export function BulletinBoard({ data }: { data: DispatchesFile }) {
  const [lead, ...rest] = data.dispatches

  if (!lead) {
    return (
      <div className="shell">
        <header className="masthead">
          <p className="masthead__brand">FightNews</p>
          <h1 className="masthead__title">大本営発表</h1>
        </header>
        <p className="empty">尚无战报。在 Cursor 中调用 dahon-ei-report skill 出刊。</p>
      </div>
    )
  }

  return (
    <div className="shell">
      <div className="grain" aria-hidden="true" />
      <header className="masthead">
        <div className="masthead__left">
          <p className="masthead__brand">FightNews</p>
          <p className="masthead__issue">第 · 号外</p>
        </div>
        <h1 className="masthead__title">
          <span className="masthead__jp">大本営発表</span>
        </h1>
        <div className="masthead__right">
          <p className="masthead__sub">乐观估计专刊</p>
          <time className="masthead__updated" dateTime={data.updated_at}>
            {formatDate(data.updated_at)}
          </time>
        </div>
      </header>

      <main className="main">
        <LeadStory item={lead} />

        {rest.length > 0 && (
          <section className="archive" aria-labelledby="archive-heading">
            <h2 id="archive-heading" className="archive__title">
              既往发表
            </h2>
            <ol className="archive__list">
              {rest.map((item) => (
                <ArchiveItem key={item.id} item={item} />
              ))}
            </ol>
          </section>
        )}
      </main>

      <footer className="colophon">
        <p>调用 Cursor skill「dahon-ei-report」自当前对话出刊 · 改 data/dispatches.json 后刷新本页</p>
      </footer>
    </div>
  )
}
