import type { Topic } from "./types"

/** Answer topics in reply order. Categories match `POLICY_CATEGORIES` in the Studio schema. */
export const TOPICS: Topic[] = [
  {
    key: "checkIn",
    label: "Check-in",
    chipQuestion: "What are the check-in and check-out times?",
    keywords: [
      "check in", "checkin", "check out", "checkout", "arrive", "arrival", "arriving", "depart", "departure",
      "leave", "leaving", "early", "late", "long stay", "key",
    ],
  },
  {
    key: "cancellation",
    label: "Cancellation",
    chipQuestion: "What's the cancellation policy?",
    keywords: [
      "cancel", "cancelled", "canceled", "cancelling", "canceling", "cancellation", "refund", "refundable",
      "extenuating", "emergency",
    ],
  },
  {
    key: "pets",
    label: "Pets",
    chipQuestion: "Can I bring my pet?",
    keywords: ["pet", "dog", "cat", "animal", "puppy", "puppies"],
  },
  {
    key: "houseRules",
    label: "House rules",
    chipQuestion: "What are the house rules?",
    keywords: [
      "rule", "party", "parties", "smoke", "smoking", "vape", "vaping", "noise", "quiet", "loud", "visitor", "event",
    ],
  },
  {
    key: "payment",
    label: "Payment",
    chipQuestion: "How does payment work?",
    keywords: ["pay", "payment", "paying", "charge", "charged", "fee", "deposit", "cost", "card", "money"],
  },
  {
    key: "safety",
    label: "Safety",
    chipQuestion: "Is there any safety info?",
    keywords: [
      "safety", "safe", "hot tub", "pool", "kayak", "paddleboard", "life jacket", "swim", "swimming", "fire",
    ],
  },
  {
    key: "damage",
    label: "Damage",
    keywords: ["damage", "damaged", "broke", "break", "broken", "incidental"],
  },
  {
    key: "community",
    label: "Community standards",
    keywords: ["discrimination", "community", "standard", "respect", "harassment"],
  },
]
