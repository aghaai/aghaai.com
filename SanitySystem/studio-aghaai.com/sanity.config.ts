import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input' 
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Aghaai.com',

  projectId: 'bwbbv78d',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(), 
  ],

  schema: {
    types: schemaTypes,
  },
})
