import { defineConfig } from 'vite'
import gitVersion from './src/index'

export default defineConfig({
  plugins: [
    gitVersion({
      defaultVersion: '1.0.0',
      commitHashLength: 7
    })
  ]
})
