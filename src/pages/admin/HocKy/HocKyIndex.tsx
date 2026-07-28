import { HocKyProvider } from './HocKyProvider'
import HocKyList from './HocKyList'

const HocKyIndex = () => {
  return (
    <HocKyProvider>
      <HocKyList />
    </HocKyProvider>
  )
}

export default HocKyIndex
