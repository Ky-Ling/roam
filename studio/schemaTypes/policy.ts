import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType, type SanityDocument} from 'sanity'

import {POLICY_CATEGORIES} from './constants'

const isStayCancellation = (document?: SanityDocument) =>
  document?.category === 'cancellation' && document.appliesToAllStays !== true

export const policy = defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'e.g. Free cancellation, Pet stays.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {list: [...POLICY_CATEGORIES], layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'appliesToAllStays',
      title: 'Applies to all stays',
      type: 'boolean',
      description: 'Roam-wide policy. Stays never reference it; queries add it for every stay.',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      type: 'string',
      description: 'The one line shown on cards.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 8,
      description: 'Exact wording that answers quote. Separate paragraphs with a blank line.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fullRefundDaysBefore',
      title: 'Full refund up to (days before check-in)',
      type: 'number',
      description: 'Guests can filter on this, e.g. "free cancellation".',
      // Only a stay's own cancellation policy has a refund window; Roam-wide ones don't.
      hidden: ({document}) => !isStayCancellation(document),
      validation: (rule) =>
        rule
          .integer()
          .min(0)
          .custom((value, {document}) =>
            isStayCancellation(document) && value === undefined
              ? 'Required for stay cancellation policies'
              : true,
          ),
    }),
  ],
  preview: {
    select: {title: 'title', category: 'category', appliesToAllStays: 'appliesToAllStays'},
    prepare: ({title, category, appliesToAllStays}) => ({
      title,
      subtitle: [category, appliesToAllStays ? 'all stays' : undefined].filter(Boolean).join(' · '),
    }),
  },
})
