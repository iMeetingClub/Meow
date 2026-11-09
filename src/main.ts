// meow 生活 — 整点meow活（index）＋Meow传（story）＋与meow星事（stories）＋Meow名大噪（cats）
// v0.8.4：整站视觉按定型重做（线条轻、留白多、奶油白纸底）；v0.8.3：四区改名＋FE-036 插画，正式版版号只留页脚；四个页面共用这份逻辑，
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
// - 正式版（main）：版号只在页脚留一行小字「正式版 · v0.8.4 · main @ 短 SHA」。
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

/* ---------- v0.9.0：猫屋季（/season） ---------- */
// 只在页面上有对应元素时才运行，其他页面不受影响。

// 四季状态：筹备中 → 进行中（11/15–18）→ 已结束。
function setupSeasonStatus(): void {
  const el = document.querySelector('[data-season-status-text]');
  if (!el) return;
  const now = new Date();
  const start = new Date('2026-11-15T00:00:00');
  const end = new Date('2026-11-19T00:00:00');
  if (now < start) {
    const days = Math.ceil(
      (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    el.textContent = `筹备中 · 距开工还有 ${days} 天`;
  } else if (now < end) {
    el.textContent = '进行中 · 猫屋搭建的这几天，每天更新';
  } else {
    el.textContent = '这一季已经搭完了 · 回访记录会继续更新';
  }
}

// 剖面图：点页签切换讲解，图上其他部位淡出。
const LAYER_INFO: Record<string, { icon: string; title: string; text: string }> = {
  roof: {
    icon: '☂',
    title: '屋顶先挡雨',
    text: '选结实、无尖角的材料做斜顶，外层加防水覆盖。屋檐伸出一点，让雨水离入口远一些。',
  },
  wall: {
    icon: '▤',
    title: '墙体要稳也要暖',
    text: '木板错缝拼接，缝隙塞进保温材料；所有边角打磨圆润，钉子不外露，猫蹭到也不受伤。',
  },
  door: {
    icon: '⌂',
    title: '门洞背风又朝阳',
    text: '入口避开冬季主导风向，能朝南最好。大小容得下一猫从容进出，又不至于散掉太多热气。',
  },
  floor: {
    icon: '〰',
    title: '垫高一层，干燥一冬',
    text: '整个窝垫高离开地面，垫层用旧毛巾或可清洗软垫，常换常晒，小窝一整冬都干爽。',
  },
};

function setupLayerTabs(): void {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.layer-tab'));
  if (!tabs.length) return;
  const icon = document.querySelector('[data-layer-icon]');
  const title = document.querySelector('[data-layer-title]');
  const text = document.querySelector('[data-layer-text]');
  const parts = Array.from(document.querySelectorAll<SVGElement>('[data-part]'));

  const activate = (layer: string) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.layer === layer;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    const info = LAYER_INFO[layer];
    if (info && icon && title && text) {
      icon.textContent = info.icon;
      title.textContent = info.title;
      text.textContent = info.text;
    }
    parts.forEach((part) => {
      part.classList.toggle('is-dim', part.dataset.part !== layer);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.layer ?? 'roof'));
  });
}

// 一起集物：本地体验计数，localStorage 记住；数字是演示，ribbon 已说明。
function setupGathering(): void {
  const list = document.querySelector('[data-resource-list]');
  if (!list) return;
  const KEY = 'catplanet-gather-v1';
  const saved: Record<string, number> = JSON.parse(
    localStorage.getItem(KEY) ?? '{}',
  ) as Record<string, number>;

  const basket = document.querySelector('[data-basket]');
  const basketMsg = document.querySelector('[data-basket-msg]');
  let total = 0;

  const render = (row: HTMLElement, current: number) => {
    const goal = Number(row.querySelector('[data-goal]')?.textContent ?? 0);
    const shown = Math.min(current, goal);
    const percent = goal ? Math.round((shown / goal) * 100) : 0;
    const cur = row.querySelector('[data-current]');
    const pct = row.querySelector('[data-percent]');
    const bar = row.querySelector<HTMLElement>('[data-bar]');
    const track = row.querySelector<HTMLElement>('.progress-track');
    if (cur) cur.textContent = String(shown);
    if (pct) pct.textContent = `${percent}%`;
    if (bar) bar.style.width = `${percent}%`;
    if (track) track.setAttribute('aria-valuenow', String(shown));
  };

  document.querySelectorAll<HTMLElement>('.resource-row').forEach((row) => {
    const id = row.dataset.resource ?? '';
    if (!(id in saved)) {
      // 没有本地记录时，以页面上的演示数字为准。
      saved[id] = Number(row.querySelector('[data-current]')?.textContent ?? 0);
    }
    total += saved[id];
    render(row, saved[id]);
    row.querySelector('[data-gather]')?.addEventListener('click', () => {
      saved[id] += 1;
      total += 1;
      localStorage.setItem(KEY, JSON.stringify(saved));
      render(row, saved[id]);
      if (basket) basket.textContent = String(total);
      if (basketMsg) {
        basketMsg.textContent =
          saved[id] > Number(row.querySelector('[data-goal]')?.textContent)
            ? '超出目标的部分，是额外的心意。'
            : '每放进一份，进度条就向前一点点。';
      }
    });
  });

  if (basket) basket.textContent = String(total);
}

// 走到哪儿了：按日期自动标状态，点节点看详情。
const MILESTONE_INFO: string[] = [
  '网站已经立起来了。接下来是线上决策会，把开工那几天的分工定下来。',
  '线上会定两件事：开工那几天的分工，和现场要遵守的安全约定。',
  '建设日：孩子、创新老师、木工师傅程家俊和猫一起进场。选址、量尺寸、备料，拍下第一张照片。',
  '搭建日：立柱、上墙体，把猫屋的形状立起来。做多少算多少，不强求完工。',
  '搭建日：盖防雨屋顶、开拱形门洞、装离地垫层。师傅带着孩子们一步步来。',
  '彩绘日：给外墙画上颜色，写门牌，挂铃铛。画成什么样，孩子们说了算。',
  '搭完不是结束：常回来看看，记录哪只猫先住进去，垫层什么时候该换。',
];

function setupMilestones(): void {
  const items = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-milestone]'),
  );
  if (!items.length) return;
  const detail = document.querySelector('[data-milestone-detail]');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  items.forEach((item, index) => {
    const date = item.dataset.date;
    if (date) {
      const day = new Date(`${date}T00:00:00`);
      item.classList.add(day < today ? 'is-done' : day.getTime() === today.getTime() ? 'is-current' : 'is-upcoming');
    } else {
      item.classList.add('is-upcoming');
    }
    item.addEventListener('click', () => {
      items.forEach((other) => other.setAttribute('aria-pressed', 'false'));
      item.setAttribute('aria-pressed', 'true');
      if (detail) detail.textContent = MILESTONE_INFO[index] ?? '';
      items.forEach((other) => other.classList.remove('is-selected'));
      item.classList.add('is-selected');
    });
  });

  // 初始详情：今天的节点；没有就选下一个未到的节点。
  const initial =
    items.find((item) => item.classList.contains('is-current')) ??
    items.find((item) => item.classList.contains('is-upcoming'));
  initial?.dispatchEvent(new Event('click'));
}

setupSeasonStatus();
setupLayerTabs();
setupGathering();
setupMilestones();

/* ---------- oneko：追鼠标的开源像素猫（全站彩蛋） ---------- */
// 原型：adryd325/oneko.js（公有领域）。触屏和减少动态偏好的环境下不运行。
function setupOneko(): void {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cat = document.createElement('div');
  cat.id = 'cursor-cat';
  const sprite = document.createElement('div');
  sprite.className = 'neko-sprite';
  const zzz = document.createElement('span');
  zzz.className = 'neko-zzz';
  zzz.textContent = 'Z z z';
  cat.append(sprite, zzz);
  document.body.appendChild(cat);

  // 精灵图帧表（32px 网格；负坐标靠背景重复回绕到正位）
  const F: Record<string, number[][]> = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };
  const DIRS = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 3;
  let cx = mx;
  let cy = my;
  let frameIdx = 0;
  let lastFrameT = 0;
  let stillSince = performance.now();

  const setFrame = (fr: number[]) => {
    sprite.style.backgroundPosition = `${fr[0] * 32}px ${fr[1] * 32}px`;
  };

  document.addEventListener('mousemove', (event) => {
    mx = event.clientX;
    my = event.clientY;
    stillSince = performance.now();
    if (cat.classList.contains('is-sleeping')) cat.classList.remove('is-sleeping');
  });

  const tick = (now: number) => {
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > 20) {
      cx += dx * 0.08;
      cy += dy * 0.08;
      stillSince = now;
      cat.classList.remove('is-sleeping');
      const di = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
      const frames = F[DIRS[di]];
      if (now - lastFrameT > 140) {
        frameIdx = (frameIdx + 1) % 2;
        lastFrameT = now;
      }
      setFrame(frames[frameIdx]);
    } else {
      const still = now - stillSince;
      if (still > 2600) {
        cat.classList.add('is-sleeping');
        if (now - lastFrameT > 600) {
          frameIdx = (frameIdx + 1) % 2;
          lastFrameT = now;
        }
        setFrame(F.sleeping[frameIdx]);
      } else if (still > 900) {
        setFrame(F.tired[0]);
      } else {
        setFrame(F.idle[0]);
      }
    }
    cat.style.transform = `translate(${cx - 16}px, ${cy - 16}px)`;
    requestAnimationFrame(tick);
  };
  setFrame(F.idle[0]);
  requestAnimationFrame(tick);
}

setupOneko();

/* ---------- v0.9.5：分享 — 实时生成带二维码的分享图 ---------- */
// 点分享按钮：Canvas 上把地图海报＋网址二维码合成一张图，弹窗里预览，
// 点「保存图片」下载 PNG 到手机相册。全程浏览器本地生成，不走服务器。
function setupShare(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-share-open]');
  const modal = document.querySelector<HTMLElement>('[data-share-modal]');
  if (!btn || !modal) return;
  const img = modal.querySelector<HTMLImageElement>('[data-share-img]');
  const saveBtn = modal.querySelector<HTMLAnchorElement>('[data-share-save]');
  const closeBtn = modal.querySelector<HTMLButtonElement>('[data-share-close]');
  const status = modal.querySelector<HTMLElement>('[data-share-status]');

  const POSTER_SRC = '/illustrations/meow-poster-map-20261109-1512.png';
  const QR_SRC = '/meow-qrcode-square-meow.png';

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error(`图片载入失败：${src}`));
      im.src = src;
    });

  const generate = async (): Promise<string> => {
    const [poster, qr] = await Promise.all([
      loadImage(POSTER_SRC),
      loadImage(QR_SRC),
    ]);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1260;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 不可用');
    ctx.drawImage(poster, 0, 0, 1080, 1260);
    // 二维码放在底部中间空地（188px，y1065 起），不盖门口猫的前爪和花。
    ctx.drawImage(qr, 446, 1065, 188, 188);
    return canvas.toDataURL('image/png');
  };

  btn.addEventListener('click', async () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    if (status) status.textContent = '正在生成分享图…';
    try {
      const url = await generate();
      if (img) {
        img.src = url;
        img.alt = 'meow 生活分享图：猫屋地图＋网址二维码';
      }
      if (saveBtn) {
        saveBtn.href = url;
        saveBtn.download = 'meow-生活-分享图.png';
      }
      if (status) status.textContent = '点「保存图片」，存到手机相册。';
    } catch {
      if (status) status.textContent = '生成失败，请检查网络后重试。';
    }
  });

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
}
setupShare();
