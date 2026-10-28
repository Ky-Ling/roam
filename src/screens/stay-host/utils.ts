import type { IconName } from "@/components/ui/icon"
import { RESPONSE_TIME_LABEL } from "@/constants/stays"
import { sanityImageUrl, type StayHost } from "@/lib/sanity"
import { compact, isEmpty, isNil } from "@/lib/utils"

type HostFact = { icon: IconName, label: string }

// Avatar 96pt and stay covers 64pt, requested at 3x
const AVATAR_PX = 288
const COVER_PX = 192

/** Hosting since, response time and languages. A fact with no data is left out. */
const toFacts = (host: StayHost): HostFact[] =>
  compact([
    isNil(host.joinedYear) ? null : { icon: "calendar", label: `Hosting since ${host.joinedYear}` },
    isNil(host.responseTime) ? null : { icon: "message", label: RESPONSE_TIME_LABEL[host.responseTime] },
    isNil(host.languages) || isEmpty(host.languages)
      ? null
      : { icon: "languages", label: `Speaks ${host.languages.join(", ")}` },
  ] satisfies (HostFact | null)[])

/** Everything the host sheet shows, ready to render. Rows with no data are left out. */
export const toHostView = (host: StayHost) => ({
  name: host.name,
  superhost: host.isSuperhost === true,
  photoUrl: isNil(host.photo) ? null : sanityImageUrl(host.photo, { width: AVATAR_PX, height: AVATAR_PX }),
  facts: toFacts(host),
  // Word for word: the host wrote it. Whitespace-only counts as no bio.
  bio: isNil(host.bio) || isEmpty(host.bio.trim()) ? null : host.bio.trim(),
  stays: host.otherStays.map((stay) => ({
    id: stay.id,
    title: stay.title,
    location: `${stay.city}, ${stay.region}`,
    rating: stay.rating.toFixed(1),
    price: `$${stay.pricePerNight.toLocaleString("en-US")}`,
    coverUrl: isNil(stay.cover) ? null : sanityImageUrl(stay.cover, { width: COVER_PX, height: COVER_PX }),
    coverAlt: stay.cover?.alt,
  })),
})

export type HostView = ReturnType<typeof toHostView>
export type HostStayView = HostView["stays"][number]
