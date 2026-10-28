import type {SeedPolicy} from '../types'

// Policy answers quote `body` word for word, so write it as the final, guest-facing text.

export const POLICIES: SeedPolicy[] = [
  {
    slug: 'cancellation-flexible',
    title: 'Flexible cancellation',
    category: 'cancellation',
    appliesToAllStays: false,
    fullRefundDaysBefore: 1,
    summary: 'Full refund up to 24 hours before check-in.',
    body: `Cancel at least 24 hours before check-in (3:00 PM local time at the stay unless the house rules say otherwise) for a full refund of the nightly rate, cleaning fee and service fee.

If you cancel less than 24 hours before check-in, the first night and the service fee are non-refundable. Nights after the first are refunded.

If you leave early after check-in, nights not yet stayed are not refunded.`,
  },
  {
    slug: 'cancellation-moderate',
    title: 'Free cancellation',
    category: 'cancellation',
    appliesToAllStays: false,
    fullRefundDaysBefore: 7,
    summary: 'Full refund up to 7 days before check-in.',
    body: `Cancel at least 7 days before check-in for a full refund of the nightly rate, cleaning fee and service fee.

If you cancel between 7 days and 24 hours before check-in, you get a 50% refund of the nightly rate and a full refund of the cleaning fee. The service fee is non-refundable.

If you cancel less than 24 hours before check-in, or leave early, nights are not refunded. The cleaning fee is refunded if you never checked in.`,
  },
  {
    slug: 'cancellation-firm',
    title: 'Firm cancellation',
    category: 'cancellation',
    appliesToAllStays: false,
    fullRefundDaysBefore: 14,
    summary: 'Full refund up to 14 days before check-in.',
    body: `Cancel at least 14 days before check-in for a full refund of the nightly rate, cleaning fee and service fee.

If you cancel between 14 and 7 days before check-in, you get a 50% refund of the nightly rate and a full refund of the cleaning fee.

If you cancel less than 7 days before check-in, nights are not refunded. The cleaning fee is refunded if you never checked in. The service fee is non-refundable after the 14-day window.`,
  },
  {
    slug: 'cancellation-strict',
    title: 'Strict cancellation',
    category: 'cancellation',
    appliesToAllStays: false,
    fullRefundDaysBefore: 30,
    summary: 'Full refund up to 30 days before check-in, then 50%.',
    body: `Cancel at least 30 days before check-in for a full refund of the nightly rate, cleaning fee and service fee.

If you cancel between 30 and 7 days before check-in, you get a 50% refund of the nightly rate and a full refund of the cleaning fee.

If you cancel less than 7 days before check-in, nights and the service fee are not refunded. The cleaning fee is refunded if you never checked in.`,
  },
  {
    slug: 'pet-stays',
    title: 'Pet stays',
    category: 'pets',
    appliesToAllStays: false,
    summary: 'Up to two dogs or cats, with a $75 pet fee per stay.',
    body: `Up to two dogs or cats are welcome. Tell the host how many pets are coming when you book. A pet fee of $75 per stay is added to your total.

Pets must be house-trained and may not be left alone in the stay for more than 4 hours. Keep pets off beds and furniture unless the host's house rules say otherwise.

Pick up after your pet on the property and on walks. Damage or extra cleaning caused by a pet is charged under the damage and incidentals policy.

Service animals are always welcome at every Roam stay, at no extra charge, whether or not the stay allows pets.`,
  },
  {
    slug: 'hot-tub-and-pool-safety',
    title: 'Hot tub and pool safety',
    category: 'safety',
    appliesToAllStays: false,
    summary: 'No lifeguard. Children must be supervised at all times.',
    body: `There is no lifeguard on site. Children must be supervised by an adult whenever they are in or near the hot tub or pool.

No glass near the water. No diving. Hot tubs are not recommended for children under 5 or for anyone who is pregnant; ask your doctor if you're unsure.

Replace the hot tub cover after each use. Hot tub and pool hours follow the stay's quiet hours.`,
  },
  {
    slug: 'long-stays',
    title: 'Long stays',
    category: 'checkIn',
    appliesToAllStays: false,
    summary: '28 nights or more get a monthly rate and mid-stay cleaning.',
    body: `Stays of 28 nights or more are billed in monthly installments: the first month at booking and each later month 7 days before it starts.

A mid-stay cleaning with fresh linens is included every 14 nights. For a long stay, cancellation follows the stay's cancellation policy for the first month; later months can be cancelled for a full refund up to 30 days before they start.`,
  },
  {
    slug: 'payment-and-charges',
    title: 'Payment and charges',
    category: 'payment',
    appliesToAllStays: true,
    summary: 'You pay the full total when you book. Prices are in US dollars.',
    body: `Your total is the nightly rate times the number of nights, plus the stay's cleaning fee and Roam's service fee. Taxes are added where they apply. You see the full total before you pay.

You pay the full total when you book, unless the stay is booked more than 30 days ahead, in which case you can pay half now and half 14 days before check-in.

All prices are in US dollars. Refunds go back to the original payment method within 5–10 business days.`,
  },
  {
    slug: 'damage-and-incidentals',
    title: 'Damage and incidentals',
    category: 'damage',
    appliesToAllStays: true,
    summary: 'Report damage within 24 hours. Guests cover damage they cause.',
    body: `If something breaks during your stay, tell the host through Roam within 24 hours.

Guests are responsible for damage they, their visitors or their pets cause beyond normal wear. The host can request payment through Roam within 14 days of check-out, with photos and receipts. You can respond before any charge is made.

Accidental damage under $50 is not charged.`,
  },
  {
    slug: 'extenuating-circumstances',
    title: 'Extenuating circumstances',
    category: 'cancellation',
    appliesToAllStays: true,
    summary: 'Full refunds when a covered emergency stops the trip.',
    body: `If a covered event stops your trip, you can cancel for a full refund regardless of the stay's cancellation policy.

Covered events are: government travel restrictions or evacuation orders for the stay's area, natural disasters, serious illness or injury of a guest, and the death of a guest or a member of their immediate family.

Contact Roam support before your check-in date with documentation. Expected weather, such as winter snow at a mountain stay, is not covered.`,
  },
  {
    slug: 'community-standards',
    title: 'Community standards',
    category: 'community',
    appliesToAllStays: true,
    summary: 'Respect neighbors, the stay and each other.',
    body: `Only registered guests may stay overnight. The number of guests may not go above the stay's maximum.

Parties and events are not allowed at any Roam stay unless the host approves them in writing first. Keep noise down during quiet hours.

Smoking and vaping are not allowed indoors at any Roam stay.

Roam does not allow discrimination by hosts or guests. Hidden cameras or recording devices inside a stay are never allowed.`,
  },
]
