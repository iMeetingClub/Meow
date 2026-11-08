import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

// package.json 的 version 就是发布版号（v0.7.0），每次发版时 bump。
// Cloudflare Pages 构建时会注入 CF_PAGES_BRANCH / CF_PAGES_COMMIT_SHA，
// 这里把它們連同版號一起編譯進頁面，讓網站能顯示自己是哪個版本。
// 本地开发没有这两个变量时，显示 local。
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version?: string }

export default defineConfig({
  base: './',
  define: {
    __BRANCH__: JSON.stringify(process.env.CF_PAGES_BRANCH ?? 'local'),
    __COMMIT__: JSON.stringify(
      (process.env.CF_PAGES_COMMIT_SHA ?? 'local').slice(0, 7),
    ),
    __VERSION__: JSON.stringify(pkg.version ?? '0.0.0'),
  },
})
