import {defineField, defineType} from 'sanity'

// Embedded, not referenced: embeddings only see the property document itself.
export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({name: 'city', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'region',
      title: 'Region code',
      type: 'string',
      description: 'Two-letter state or region code, e.g. CA.',
      validation: (rule) => rule.required().regex(/^[A-Z]{2}$/, {name: 'two uppercase letters'}),
    }),
    defineField({
      name: 'regionName',
      title: 'Region name',
      type: 'string',
      description: 'e.g. California.',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'neighborhood', type: 'string'}),
    defineField({
      name: 'coordinates',
      type: 'geopoint',
      description: 'Approximate point for a map. Never the exact address.',
    }),
  ],
})
