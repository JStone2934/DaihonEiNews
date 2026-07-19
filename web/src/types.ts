export type IronyTag =
  | '速胜'
  | '无损'
  | '必然'
  | '万全'
  | '转进'
  | '克复'
  | string

export interface Dispatch {
  id: string
  created_at: string
  headline: string
  lede: string
  source_claim: string
  irony_tag: IronyTag
  conversation_hint?: string
}

export interface DispatchesFile {
  updated_at: string
  dispatches: Dispatch[]
}
