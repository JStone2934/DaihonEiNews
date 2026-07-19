import bulletin from '@data/dispatches.json'
import type { DispatchesFile } from './types'
import { BulletinBoard } from './components/BulletinBoard'

const data = bulletin as DispatchesFile

export default function App() {
  return <BulletinBoard data={data} />
}
