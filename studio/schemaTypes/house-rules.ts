import {defineArrayMember, defineField, defineType} from 'sanity'

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

// Per-stay rules. Policy answers quote `rules` word for word.
export const houseRules = defineType({
  name: 'houseRules',
  title: 'House rules',
  type: 'object',
  fields: [
    defineField({
      name: 'checkInFrom',
      title: 'Check-in from',
      type: 'string',
      description: '24-hour time, e.g. 15:00.',
      validation: (rule) => rule.required().regex(TIME, {name: 'HH:mm'}),
    }),
    defineField({
      name: 'checkOutBy',
      title: 'Check-out by',
      type: 'string',
      description: '24-hour time, e.g. 11:00.',
      validation: (rule) => rule.required().regex(TIME, {name: 'HH:mm'}),
    }),
    defineField({
      name: 'quietHours',
      type: 'string',
      description: 'e.g. 10pm–8am.',
    }),
    defineField({
      name: 'rules',
      type: 'array',
      description: 'One rule per line, written exactly as guests should read it.',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
})
