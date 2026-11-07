// 喵星计划 / Cat Planet — 活动页
// 第一版：单页海报邀请，往下展开看详情。交互保持最小。

declare const __BRANCH__: string;
declare const __COMMIT__: string;

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

// 版本标识：让人一眼分清这是测试版还是正式版。
// - 正式版（main）：只在页脚留一行小字「正式版 · main @ 短 SHA」。
// - 预览版（其他分支）：页面最顶上挂一条显眼的横幅，写清分支名和提交号。
function showVersionBanner(): void {
  const branch = __BRANCH__;
  const commit = __COMMIT__;
  if (branch === 'main') {
    const footer = document.querySelector('footer');
    if (footer) {
      const p = document.createElement('p');
      p.className = 'version';
      p.textContent = `正式版 · ${branch} @ ${commit}`;
      footer.appendChild(p);
    }
    return;
  }
  const banner = document.createElement('div');
  banner.className = 'version-banner';
  banner.textContent = `预览版 · ${branch} @ ${commit} · 这不是正式站`;
  document.body.prepend(banner);
}

setFooterYear();
smoothScroll();
showVersionBanner();
