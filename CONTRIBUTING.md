# 怎么参与这个网站（贡献指南）

> 如果你是先读到这篇 CONTRIBUTING，请记得回头去读源头的 [README](README.md)。README 有项目的愿景与背景，CONTRIBUTING 是规则；首选顺序是先读 README，再读这篇。

meow 生活的网站是大家一起做的。欢迎提内容、改错字、加照片、补记录。

## 1. IP 分支命名：`ip-xxx`

要合进 `dev` 的改动，都以一个 **Improvement Proposal（IP，改进提案）**分支来做。分支名格式是 `ip-` 加小写字母、数字或连字符，例如：

- `ip-home-map`（首页改大地图）
- `ip-poster`（海报相关）
- `ip-story`（故事页相关）

`main` 与 `dev` 是常驻分支，不受这条命名规则限制。

这条命名是团队约定，不是系统强制：GitHub 的分支名限制功能只对 Enterprise 组织开放，iMeetingClub 不是 Enterprise 组织，所以系统拦不住不符合命名的新分支。请大家自觉遵守。

## 2. main／dev／URL 工作流

- **main**：正式站，对应 https://meow.imeeting.club。受 Ruleset `protect-main` 保护，任何人（包括维护者、包括 FC）都不能直接推 `main`，一律走 PR。
- **dev**：工作分支，长期存在。所有改动先合到 `dev`，在 dev 预览站确认没问题，再开 PR 从 `dev` 合到 `main`。
- **功能分支**：每次改东西新开一个 `ip-xxx` 分支，提 PR 合到 `dev`，合完就可以删了。

流程：

1. 从 `dev` 切一个 `ip-xxx` 分支，在上面改。
2. 开 PR 合到 `dev`，写清楚改了什么、为什么改。
3. 先看预览（见第 3 节），确认没问题再合并到 `dev`。
4. `dev` 上的内容在 dev 预览站（https://dev.meow.imeeting.club）验证过后，再从 `dev` 开 PR 合到 `main`，正式站才更新。

**不要直接推 `main` 或 `dev`。** `main` 受保护推不上去；`dev` 虽然没保护，但直接推会跳过预览与审核，请一律走 PR。

## 3. 预览 URL 机制

每次推分支、开 PR，Cloudflare Pages 会自动部署，给出预览网址：

- **同库分支**：分支别名 `<分支名>.meow-7ls.pages.dev`，例如 `ip-home-map.meow-7ls.pages.dev`；每次部署还有一个 deployment hash URL（与 commit hash 无关，永久保留）。
- **fork 的 PR**：没有自动预览（Cloudflare 不给 fork 的分支建预览）。fork 贡献者请在本地 build 验证，或请维护者帮忙看。
- **dev 预览**：https://dev.meow.imeeting.club
- **正式站**：https://meow.imeeting.club

也就是说：正式上线之前，每一版都能先在预览网址上看过、验证过。不用怕改坏正式站。

### 一眼分辨测试版和正式版（版本横幅）

网站会显示自己是哪个 Git 版本，不用猜：

- **正式版（main）**：页脚有一行小字「正式版 · 版号 · main @ 短 SHA」。
- **预览版（其他分支）**：页面最顶上挂一条橘色横幅「预览版 · 版号 · 分支名 @ 短 SHA · 这不是正式站」。

看到橘色横幅，就知道这不是正式站。

## 4. 如何参与

### 方式一：提 PR（会用 GitHub 的朋友）

1. Fork 这个仓库（点右上角 Fork），或在仓库里新开一个 `ip-xxx` 分支。
2. 在分支里改内容（改页面的文字，或加照片到 `public/`）。
3. 提交一个 Pull Request（PR）到 `dev`，写清楚改了什么、为什么改。
4. 等维护者审核、合并。你不用自己合并，提交 PR 就行。

### 方式二：提 Issue（不会用 GitHub 也没关系）

不会用 PR 的朋友，直接在仓库里开一个 Issue，写清楚：

- 想改哪一段（贴原文）
- 想改成什么样（贴新内容）
- 或者直接贴照片、贴文字

维护者会帮你把内容放进网站。

### 常参与：可以成为协作者

经常参与的朋友，可以请维护者 FC 把你加为仓库协作者（Collaborator）：仓库 Settings → Collaborators and teams → Add people，角色选 Write。协作者可以直接在仓库里开分支，分支推上去就有自动预览，不用再走 fork。

## 内容规则

- **只写真实的事**：猫的名字、人的名字、时间、地点，都以实际发生的为准。不知道的就写「待补充」，不要编。
- **语气**：温暖、真诚、口语化，像一个人在跟邻居讲这件事。不要写成官方通告，不要堆砌口号。
- **面向成年人**：这份宣传主要面向家长和成年人，不是写给孩子看的。
- **不要过度承诺**：活动是轻规划、先攒局、细节共创。不要把还没定的事写成已经定好的样子。

## 谁来合并 PR

- PR 由维护者审核和合并，贡献者不用自己操作合并。
- 内容方向上的决定（比如要不要加某个板块、改某段文案）由 FC 定。
- 技术上的问题（构建失败、格式不对）由维护者处理。

## 网站是怎么跑的

- 技术：TypeScript + Vite 多页静态站，部署在 Cloudflare Pages。
- 正式站：https://meow.imeeting.club
- `main` 分支受 Ruleset `protect-main` 保护，直接推送会被挡住；合并 PR 进 `main` 就会自动重新部署。
- 每个同库分支都有独立的 Cloudflare 预览网址，先验证再合并。
