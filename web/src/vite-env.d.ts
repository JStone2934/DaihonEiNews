/// <reference types="vite/client" />

declare module '@data/dispatches.json' {
  import type { DispatchesFile } from './types'
  const value: DispatchesFile
  export default value
}
