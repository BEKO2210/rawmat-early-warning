import { DEFAULT_MARKETS } from "@/lib/types"

export function generateStaticParams() {
  return DEFAULT_MARKETS.map((market) => ({
    name: market.toLowerCase(),
  }))
}

export { default } from "./market-detail"
