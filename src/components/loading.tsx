import { CryptoLoader } from "./crypto-loader"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050B18]/80 backdrop-blur-md">
      <CryptoLoader size="xl" />
    </div>
  )
}
