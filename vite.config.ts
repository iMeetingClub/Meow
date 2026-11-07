import { defineConfig } from 'vite'

// Cloudflare Pages 构建时会注入 CF_PAGES_BRANCH / CF_PAGES_COMMIT_SHA，
// 这里把它們編譯進頁面，讓網站能顯示自己是哪個 Git 版本。
// 本地开发没有这两个变量时，显示 local。
export default defineConfig({
  base: './',
  define: {
    __BRANCH__: JSON.stringify(process.env.CF_PAGES_BRANCH ?? 'local'),
    __COMMIT__: JSON.stringify(
      (process.env.CF_PAGES_COMMIT_SHA ?? 'local').slice(0, 7),
    ),
  },
})
