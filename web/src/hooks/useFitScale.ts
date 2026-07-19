import { useLayoutEffect, type RefObject } from 'react'

type FitOptions = {
  /** 目标占满比例（竖排优先看 scrollWidth） */
  targetFill?: number
  minScale?: number
  maxScale?: number
  /**
   * 额外测量的子选择器（如既往栏内各 .cell__v）。
   * 子元素若自带 overflow:hidden，只量外层会漏检溢出。
   */
  measureSelector?: string
  /** 写入的 CSS 变量名 */
  cssVar?: string
}

function readOverflow(el: HTMLElement) {
  return el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2
}

/** 竖排：列数占宽；横排：行高占高 —— 取更吃空间的轴 */
function readFill(el: HTMLElement) {
  const w = el.clientWidth > 0 ? el.scrollWidth / el.clientWidth : 0
  const h = el.clientHeight > 0 ? el.scrollHeight / el.clientHeight : 0
  return Math.max(w, h)
}

function collectTargets(root: HTMLElement, selector?: string): HTMLElement[] {
  if (!selector) return [root]
  const nested = Array.from(root.querySelectorAll<HTMLElement>(selector))
  return nested.length > 0 ? nested : [root]
}

/**
 * 按容器动态调节 --fit-scale：先消溢出，再尽量贴近 targetFill，避免空白与遮盖。
 * container 上写 CSS 变量；content 用于测量（可与 container 相同）。
 */
export function useFitScale(
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
  options: FitOptions = {},
) {
  const {
    targetFill = 0.78,
    minScale = 0.55,
    maxScale = 1.55,
    measureSelector,
    cssVar = '--fit-scale',
  } = options

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    let frame = 0
    let running = false

    const apply = (scale: number) => {
      container.style.setProperty(cssVar, scale.toFixed(3))
    }

    const measureAt = (scale: number) => {
      apply(scale)
      void content.offsetWidth
      void content.scrollWidth
      const targets = collectTargets(content, measureSelector)
      let overflow = false
      let fill = 0
      for (const el of targets) {
        if (readOverflow(el)) overflow = true
        fill = Math.max(fill, readFill(el))
      }
      return { overflow, fill }
    }

    const fit = () => {
      if (running) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        running = true
        try {
          if (content.clientWidth < 8 || content.clientHeight < 8) {
            apply(1)
            return
          }

          // 1) 二分：不溢出的最大 scale
          let lo = minScale
          let hi = maxScale
          let best = minScale
          for (let i = 0; i < 14; i++) {
            const mid = (lo + hi) / 2
            const { overflow } = measureAt(mid)
            if (overflow) {
              hi = mid
            } else {
              best = mid
              lo = mid
            }
          }

          // 2) 欠填则在不溢出前提下略增
          let scale = best
          const { fill } = measureAt(scale)
          if (fill < targetFill - 0.04 && scale < maxScale) {
            lo = scale
            hi = Math.min(maxScale, scale * 1.4)
            for (let i = 0; i < 10; i++) {
              const mid = (lo + hi) / 2
              const m = measureAt(mid)
              if (m.overflow) {
                hi = mid
              } else {
                scale = mid
                lo = mid
                if (m.fill >= targetFill) break
              }
            }
          }

          apply(scale)
        } finally {
          running = false
        }
      })
    }

    fit()

    const ro = new ResizeObserver(fit)
    ro.observe(container)
    if (content !== container) ro.observe(content)

    document.fonts?.ready?.then(fit).catch(() => {})

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
