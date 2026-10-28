import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {RESPONSE_TIMES} from './constants'

export const host = defineType({
  name: 'host',
  title: 'Host',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'First name only, as in "Hosted by Alex".',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', validation: (rule) => rule.required()})],
    }),
    defineField({name: 'isSuperhost', title: 'Superhost', type: 'boolean', initialValue: false}),
    defineField({name: 'bio', type: 'text', rows: 4}),
    defineField({
      name: 'joinedYear',
      type: 'number',
      validation: (rule) => rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'responseTime',
      type: 'string',
      options: {list: [...RESPONSE_TIMES], layout: 'radio'},
    }),
    defineField({
      name: 'languages',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
  ],
  preview: {
    select: {title: 'name', isSuperhost: 'isSuperhost', media: 'photo'},
    prepare: ({title, isSuperhost, media}) => ({
      title,
      subtitle: isSuperhost ? 'Superhost' : undefined,
      media,
    }),
  },
})
