// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.{ts,mts,cts}'],
    globals: true, // `describe`, `test`, `expect` などをグローバルに利用可能にする
  }
})