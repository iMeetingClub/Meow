import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// package.json 的 version 就是发布版号（v0.8.1），每次发版时 bump。
// Cloudflare Pages 构建时会注入 CF_PAGES_BRANCH / CF_PAGES_COMMIT_SHA，
// 这里把它們連同版號一起編譯進頁面，讓網站能顯示自己是哪個版本。
// 本地开发没有这两个变量时，显示 local。
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version?: string }

// 多页：整点meow活（index）＋Meow传（story）＋与meow星事（stories）＋Meow名大噪（cats）＋猫屋季（season）。
// 五个页面共用 src/main.ts，里面的逻辑按页面上有的元素才运行。
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story.html'),
        stories: resolve(__dirname, 'stories.html'),
        cats: resolve(__dirname, 'cats.html'),
        season: resolve(__dirname, 'season.html'),
      },
    },
  },
  define: {
    __BRANCH__: JSON.stringify(process.env.CF_PAGES_BRANCH ?? 'local'),
    __COMMIT__: JSON.stringify(
      (process.env.CF_PAGES_COMMIT_SHA ?? 'local').slice(0, 7),
    ),
    __VERSION__: JSON.stringify(pkg.version ?? '0.0.0'),
  },
})
