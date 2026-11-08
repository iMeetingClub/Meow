// meow 生活 — 整点meow活（index）＋Meow传（story）＋与meow星事（stories）＋Meow名大噪（cats）
// v0.8.3：四区改名＋FE-036 插画，正式版版号只留页脚；四个页面共用这份逻辑，
// 按页面上有的元素才运行（没有 .tile 的页面就跳过手风琴）。

declare const __BRANCH__: string;
declare const __COMMIT__: string;
declare const __VERSION__: string;

const year = new Date().getFullYear();

function setFooterYear(): void {
  const footer = document.querySelector('footer p:first-child');
  if (footer && !footer.textContent?.includes(String(year))) {
    footer.textContent = `${footer.textContent} · ${year}`;
  }
}

function smoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(
        (anchor as HTMLAnchorElement).getAttribute('href') ?? '',
      );
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 可点的图：点卡片标题，展开 / 收起对应内容；一次只展开一块。
function setupTiles(): void {
  const tiles = Array.from(document.querySelectorAll<HTMLElement>('.tile'));
  tiles.forEach((tile) => {
    const head = tile.querySelector<HTMLButtonElement>('.tile-head');
    if (!head) return;
    head.addEventListener('click', () => {
      const isOpen = tile.classList.contains('open');
      tiles.forEach((other) => {
        other.classList.remove('open');
        other
          .querySelector<HTMLButtonElement>('.tile-head')
          ?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        tile.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// 版本标识：让人一眼分清这是测试版还是正式版，以及是哪个版号。
// - 正式版（main）：版号只在页脚留一行小字「正式版 · v0.8.3 · main @ 短 SHA」。
//   不在正文阅读区（标题下方）挂徽章。
// - 预览版（其他分支）：页面最顶上挂一条显眼的横幅，写清版号、分支名和提交号。
function showVersionBanner(): void {
  const branch = __BRANCH__;
  const commit = __COMMIT__;
  const version = `v${__VERSION__}`;
  if (branch === 'main') {
    const footer = document.querySelector('footer');
    if (footer) {
      const p = document.createElement('p');
      p.className = 'version';
      p.textContent = `正式版 · ${version} · ${branch} @ ${commit}`;
      footer.appendChild(p);
    }
    return;
  }
  const banner = document.createElement('div');
  banner.className = 'version-banner';
  banner.textContent = `预览版 · ${version} · ${branch} @ ${commit} · 这不是正式站`;
  document.body.prepend(banner);
}

// PWA：注册 service worker（装得上、离线能开）。失败就安静跳过。
function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // 注册失败不影响页面使用。
    });
  });
}

setFooterYear();
smoothScroll();
setupTiles();
showVersionBanner();
registerServiceWorker();
