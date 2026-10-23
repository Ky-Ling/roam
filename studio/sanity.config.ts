import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'roam',

  projectId: 'vjn3nb8q',
  dataset: 'roam-dataset',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
