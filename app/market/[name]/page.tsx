import { DEFAULT_MARKETS } from "@/lib/types"
import MarketDetail from "./market-detail"

export function generateStaticParams() {
  return DEFAULT_MARKETS.map((market) => ({
    name: market.toLowerCase(),
  }))
}

export default function MarketPage({ params }: { params: { name: string } }) {
  return <MarketDetail />
}
