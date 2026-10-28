import { isNil } from "@/lib/utils"

export type SanityImage = {
  url: string
  alt?: string
  hotspot?: { x: number, y: number } | null
}

/** Cropped image URL. The editor's hotspot becomes the crop's focal point. */
export const sanityImageUrl = (image: SanityImage, { width, height }: { width: number, height: number }) => {
  const params = [`w=${width}`, `h=${height}`, "fit=crop", "auto=format", "q=80"]
  
  if (!isNil(image.hotspot)) {
    params.push("crop=focalpoint", `fp-x=${image.hotspot.x.toFixed(3)}`, `fp-y=${image.hotspot.y.toFixed(3)}`)
  }

  return `${image.url}?${params.join("&")}`
}
