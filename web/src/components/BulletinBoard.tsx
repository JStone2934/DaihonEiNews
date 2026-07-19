import { useRef } from 'react'
import type { Dispatch, DispatchesFile } from '../types'
import { useArchiveRowHeight } from '../hooks/useArchiveRowHeight'
import { useFitScale } from '../hooks/useFitScale'

function formatPaperDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const h = d.getHours()
  const min = String(d.getMinutes()).padStart(2, '0')
  const period = h < 12 ? '午前' : '午後'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${y}年${m}月${day}日${period}${h12}時${min}分`
}

function excerpt(text: string, maxChars: number): string {
  const t = text.trim()
  if (t.length <= maxChars) return t
  return `${t.slice(0, maxChars)}……`
}

function Masthead({
  issueNo,
  updatedAt,
}: {
  issueNo?: number
  updatedAt?: string
}) {
  return (
    <header className="masthead" lang="ja">
      <p className="masthead__brand">FightNews</p>
      <h1 className="masthead__title">大本営発表</h1>
      <div className="masthead__meta">
        <p className="masthead__sub">樂觀估計專刊</p>
        {issueNo != null && <p className="masthead__issue">第{issueNo}號</p>}
        {updatedAt && (
          <time className="masthead__date" dateTime={updatedAt}>
            {formatPaperDate(updatedAt)}
          </time>
        )}
      </div>
    </header>
  )
}

function ArchiveBlock({ item, index }: { item: Dispatch; index: number }) {
  return (
    <article className="cell cell--story">
      <div className="cell__v">
        <p className="story__num">第{index}號</p>
        <span className="hanko hanko--sm" aria-hidden="true">
          <span className="hanko__text">{item.irony_tag}</span>
        </span>
        <h3 className="story__headline">{item.headline}</h3>
        <p className="story__lede">{excerpt(item.lede, 68)}</p>
        <p className="story__claim">實報：{item.source_claim}</p>
      </div>
    </article>
  )
}

export function BulletinBoard({ data }: { data: DispatchesFile }) {
  const [lead, ...rest] = data.dispatches
  const total = data.dispatches.length
  const leadIssue = total

  const paperRef = useRef<HTMLElement>(null)
  const storyMainRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLElement>(null)
  const railContentRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLElement>(null)
  const frontContentRef = useRef<HTMLDivElement>(null)
  const archiveRef = useRef<HTMLElement>(null)
  const archiveGridRef = useRef<HTMLDivElement>(null)

  const archiveKey = rest.map((d) => d.id).join(',')

  useArchiveRowHeight(paperRef, archiveRef, archiveGridRef, [archiveKey, lead?.id], {
    minFrac: 0.2,
    maxFrac: 0.28,
    minStoryFrac: 0.48,
  })

  useFitScale(storyMainRef, headlineRef, [lead?.id, lead?.headline, archiveKey], {
    targetFill: 0.92,
    minScale: 0.5,
    maxScale: 1.45,
    cssVar: '--headline-scale',
  })

  useFitScale(storyMainRef, bodyRef, [lead?.id, lead?.lede, lead?.lede_ja, archiveKey], {
    targetFill: 0.86,
    minScale: 0.65,
    maxScale: 1.55,
    cssVar: '--body-scale',
  })

  useFitScale(railRef, railContentRef, [lead?.id, lead?.irony_tag, leadIssue], {
    targetFill: 0.82,
    minScale: 0.55,
    maxScale: 1.15,
  })

  useFitScale(frontRef, frontContentRef, [lead?.id, lead?.source_claim], {
    targetFill: 0.9,
    minScale: 0.75,
    maxScale: 1.35,
  })

  useFitScale(archiveRef, archiveGridRef, [archiveKey], {
    targetFill: 0.82,
    minScale: 0.7,
    maxScale: 1.4,
    measureSelector: '.cell__v',
  })

  if (!lead) {
    return (
      <div className="page">
        <div className="sheet sheet--empty">
          <Masthead />
          <p className="empty">尚無發表。於Cursor中呼叫dahon-ei-report出刊。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <div className="sheet">
        <div className="sheet__grain" aria-hidden="true" />
        <div className="sheet__edge" aria-hidden="true" />

        <div className="banner" aria-hidden="true">
          <span>號外！！</span>
          <span>號外！！</span>
          <span>號外！！</span>
        </div>

        <Masthead issueNo={leadIssue} updatedAt={data.updated_at} />

        <div className="deck-rule" aria-hidden="true" />

        <main className={`paper${rest.length > 0 ? ' paper--has-archive' : ''}`} ref={paperRef}>
          <section className="cell cell--rail" aria-label="发表标记" ref={railRef}>
            <div className="rail__stack" ref={railContentRef}>
              <p className="rail__official">【大本營發表】</p>
              <p className="rail__issue">第{leadIssue}號</p>
              <span className="hanko" aria-hidden="true">
                <span className="hanko__text">{lead.irony_tag}</span>
              </span>
              <span className="rail__extra">號外！！</span>
            </div>
          </section>

          <article
            className="cell cell--story-main"
            aria-labelledby="lead-headline"
            ref={storyMainRef}
          >
            <div className="story-main__layout">
              <h2 id="lead-headline" className="headline__text" ref={headlineRef}>
                {lead.headline}
              </h2>
              <div className="story-main__body" ref={bodyRef}>
                <p className="lede__text">{lead.lede}</p>
                <p className="lede__ja" lang="ja">
                  〔和訳〕{lead.lede_ja}
                </p>
                {lead.conversation_hint ? (
                  <p className="lede__note">【戰況附記】{lead.conversation_hint}</p>
                ) : null}
              </div>
            </div>
          </article>

          <aside className="cell cell--frontline" aria-label="前线实报" ref={frontRef}>
            <div className="frontline__band" ref={frontContentRef}>
              <p className="frontline__mark">實報</p>
              <div className="frontline__copy">
                <p className="frontline__label">前線電・未檢閲原稿對照</p>
                <blockquote className="frontline__claim">「{lead.source_claim}」</blockquote>
              </div>
            </div>
          </aside>

          {rest.length > 0 && (
            <section
              className="cell cell--archive"
              aria-labelledby="archive-heading"
              ref={archiveRef}
            >
              <div className="archive__head">
                <h2 id="archive-heading" className="archive__title">
                  既往發表
                </h2>
              </div>
              <div className="archive__grid" ref={archiveGridRef}>
                {rest.map((item, i) => (
                  <ArchiveBlock key={item.id} item={item} index={total - 1 - i} />
                ))}
              </div>
            </section>
          )}
        </main>

        <footer className="colophon">
          <p>dahon-ei-report · 大本營戰報戲仿出刊</p>
        </footer>
      </div>
    </div>
  )
}
