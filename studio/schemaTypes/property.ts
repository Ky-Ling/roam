import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {AMENITIES, STAY_TYPES, VIBES} from './constants'

// Guests filter on every typed field here (GROQ with params). Soft intent ("quiet", "cozy")
// comes from vibes, summary and description through embeddings.
export const property = defineType({
  name: 'property',
  title: 'Stay',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'location', title: 'Location'},
    {name: 'pricing', title: 'Pricing & capacity'},
    {name: 'amenities', title: 'Amenities'},
    {name: 'photos', title: 'Photos'},
    {name: 'hostPolicies', title: 'Host & policies'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'basics',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stayType',
      title: 'Type',
      type: 'string',
      group: 'basics',
      options: {list: [...STAY_TYPES], layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'vibes',
      type: 'array',
      group: 'basics',
      description: 'How the stay feels. The only source for atmosphere words in generated copy.',
      of: [defineArrayMember({type: 'string'})],
      options: {list: [...VIBES], layout: 'grid'},
      validation: (rule) => rule.required().min(1).max(4).unique(),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      group: 'basics',
      description: 'One descriptive line: the setting and how it feels.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 6,
      group: 'basics',
      description: 'Two or three short paragraphs. Search ranks on this text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      type: 'number',
      group: 'basics',
      description: 'Stored average until reviews exist.',
      validation: (rule) => rule.required().min(0).max(5).precision(1),
    }),
    defineField({
      name: 'reviewCount',
      type: 'number',
      group: 'basics',
      description: 'Stored count until reviews exist.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'location',
      type: 'location',
      group: 'location',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Price per night (USD)',
      type: 'number',
      group: 'pricing',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'cleaningFee',
      title: 'Cleaning fee (USD)',
      type: 'number',
      group: 'pricing',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'minNights',
      title: 'Minimum nights',
      type: 'number',
      group: 'pricing',
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'maxGuests',
      type: 'number',
      group: 'pricing',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'bedrooms',
      type: 'number',
      group: 'pricing',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'beds',
      type: 'number',
      group: 'pricing',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'bathrooms',
      type: 'number',
      group: 'pricing',
      validation: (rule) =>
        rule
          .required()
          .min(0.5)
          .custom((value) =>
            value === undefined || Number.isInteger(value * 2) ? true : 'Use steps of 0.5',
          ),
    }),
    defineField({
      name: 'petsAllowed',
      title: 'Pets allowed',
      type: 'boolean',
      group: 'amenities',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'amenities',
      type: 'array',
      group: 'amenities',
      description: 'Order matters: details shows the first few.',
      of: [defineArrayMember({type: 'string'})],
      options: {list: [...AMENITIES], layout: 'grid'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'photos',
      type: 'array',
      group: 'photos',
      description: 'The first photo is the cover.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', validation: (rule) => rule.required()}),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1).max(24),
    }),
    defineField({
      name: 'host',
      type: 'reference',
      group: 'hostPolicies',
      to: [{type: 'host'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cancellationPolicy',
      type: 'reference',
      group: 'hostPolicies',
      to: [{type: 'policy'}],
      options: {filter: 'category == "cancellation" && appliesToAllStays != true'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'policies',
      title: 'Stay-specific policies',
      type: 'array',
      group: 'hostPolicies',
      description:
        'Roam-wide policies apply automatically; add only the ones specific to this stay.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'policy'}],
          options: {filter: 'category != "cancellation" && appliesToAllStays != true'},
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'houseRules',
      type: 'houseRules',
      group: 'hostPolicies',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      city: 'location.city',
      region: 'location.region',
      price: 'pricePerNight',
      media: 'photos.0',
    },
    prepare: ({title, city, region, price, media}) => ({
      title,
      subtitle: `${city}, ${region} · $${price}`,
      media,
    }),
  },
})
