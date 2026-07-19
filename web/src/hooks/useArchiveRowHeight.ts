import { useLayoutEffect, type RefObject } from 'react'

type Options = {
  /** 既往栏占纸面高度下限 */
  minFrac?: number
  /** 既往栏占纸面高度上限（从主栏让出） */
  maxFrac?: number
  /** 主栏至少保留的纸面高度比例 */
  minStoryFrac?: number
}

function anyOverflow(root: HTMLElement, selector: string) {
  const nodes = root.querySelectorAll<HTMLElement>(selector)
  for (const el of nodes) {
    if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
      return true
    }
  }
  return false
}

/**
 * 动态加高既往栏、压矮主栏：竖排正文在矮栏里会变成很多短列，显得挤。
 * 在 [min,max] 内找够用的高度，再配合 useFitScale 调字号。
 */
export function useArchiveRowHeight(
  paperRef: RefObject<HTMLElement | null>,
  archiveRef: RefObject<HTMLElement | null>,
  archiveGridRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
  options: Options = {},
) {
  const { minFrac = 0.28, maxFrac = 0.44, minStoryFrac = 0.36 } = options

  useLayoutEffect(() => {
    const paper = paperRef.current
    const archive = archiveRef.current
    const grid = archiveGridRef.current
    if (!paper || !archive || !grid) {
      paper?.style.removeProperty('--archive-row')
      return
    }

    let frame = 0
    let running = false
    let lastPx = -1

    const apply = (px: number) => {
      const rounded = Math.round(px)
      if (Math.abs(rounded - lastPx) < 2) return
      lastPx = rounded
      paper.style.setProperty('--archive-row', `${rounded}px`)
    }

    const overflowsAt = (px: number) => {
      apply(px)
      // 用基准字号测高度需求，避免与 fit-scale 互相拉扯
      archive.style.setProperty('--fit-scale', '1')
      void grid.offsetHeight
      void grid.scrollWidth
      return anyOverflow(grid, '.cell__v')
    }

    const balance = () => {
      if (running) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        running = true
        try {
          const paperH = paper.clientHeight
          if (paperH < 120) return

          const front = paper.querySelector<HTMLElement>('.cell--frontline')
          const frontH = front?.offsetHeight ?? 0
          const usable = Math.max(0, paperH - frontH)

          const minStory = paperH * minStoryFrac
          const maxArchive = Math.min(paperH * maxFrac, Math.max(0, usable - minStory))
          const minArchive = Math.min(maxArchive, Math.max(paperH * minFrac, usable * 0.32))

          if (maxArchive < 48) {
            apply(maxArchive)
            return
          }

          // 找不溢出的最小高度（竖排：加高 = 列变长 = 列数变少）
          let lo = minArchive
          let hi = maxArchive
          let fitH = maxArchive
          let found = false
          for (let i = 0; i < 12; i++) {
            const mid = (lo + hi) / 2
            if (overflowsAt(mid)) {
              lo = mid
            } else {
              found = true
              fitH = mid
              hi = mid
            }
          }

          // 略留余量，避免贴边裁切；上限仍受 maxArchive 约束（主栏让高）
          const height = found ? Math.min(maxArchive, fitH * 1.08) : maxArchive
          apply(height)
        } finally {
          running = false
        }
      })
    }

    balance()

    const ro = new ResizeObserver(balance)
    ro.observe(paper)
    document.fonts?.ready?.then(balance).catch(() => {})

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
