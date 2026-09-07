# VolMe

VolMe 是一个志愿活动平台，连接活动组织者与志愿者：活动发布、个性化搜索、报名申请、志愿者筛选与活动评价。

本目录是 VolMe 的重写版（v2），基于 [We2-Tech/nextjs-template](https://github.com/We2-Tech/nextjs-template)，通过 `git subtree` 引入。v1 的 CRA 前端与 Express 后端仍保留在仓库的 `../frontend` 和 `../backend`，作为重写期间的参照物，迁移完成后删除。

**不做后向兼容**：v1 的数据库不迁移、账号与 session 不保留。原因见 [`docs/decisions/0001-rewrite-volme-on-this-template.md`](docs/decisions/0001-rewrite-volme-on-this-template.md)。

[English](#english) | 中文

---

## 技术栈

| 分类      | 技术                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------- |
| 框架      | Next.js 16 + TypeScript 5 + React 19                                                              |
| UI 组件库 | Material UI 9 + 暗黑模式（CSS Variables）+ MUI X（DataGrid · Charts · DatePickers · TreeView）    |
| 国际化    | next-intl v4（App Router · 自动语言检测 · 服务端 + 客户端翻译）                                   |
| 认证      | Auth.js v5（无密码：Google OAuth + 邮件魔法链接）                                                 |
| 数据校验  | Zod v4                                                                                            |
| 数据库    | MongoDB + Mongoose（连接封装在 `src/lib/server/db.ts`）                                           |
| 测试      | Vitest + React Testing Library                                                                    |
| 代码规范  | ESLint + Prettier                                                                                 |
| 容器化    | Docker multi-stage build + Node.js standalone + Nginx 反向代理 + MongoDB + 可选 Cloudflare Tunnel |
| CI/CD     | GitHub Actions（semgrep · lint · format · type-check · test · build）                             |
| 依赖更新  | Dependabot（每周一自动 PR）                                                                       |
| 安全扫描  | Semgrep（push/PR + 每周定时）                                                                     |

---

## 快速开始

```bash
# 1. 克隆仓库
git clone git@github.com:We2-Tech/VolMe.git
cd VolMe/app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000（自动重定向到 /en、/de 或 /zh-CN）
```

---

## 目录结构

```
├── messages/
│   ├── en.json              # 英文翻译
│   ├── de.json              # 德文翻译
│   └── zh-CN.json           # 中文翻译
├── src/
│   ├── app/
│   │   ├── [locale]/        # 所有页面放在此目录下
│   │   │   ├── layout.tsx   # 语言级布局（NextIntlClientProvider）
│   │   │   ├── page.tsx     # 首页
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx       # 根布局（MUI ThemeProvider + CssBaseline）
│   │   ├── not-found.tsx    # 根级 404 fallback（无效 locale 路径）
│   │   └── globals.css
│   ├── components/          # 客户端组件
│   │   └── LocaleSwitcher.tsx
│   ├── auth.ts              # Auth.js 配置（adapter + providers，仅服务端）
│   ├── auth.config.ts       # 可在 proxy 中运行的那半份配置（不碰数据库）
│   ├── i18n/
│   │   ├── navigation.ts    # locale-aware 的 Link / useRouter / usePathname
│   │   ├── request.ts       # 服务端 getTranslations 配置
│   │   └── routing.ts       # 支持的 locale 列表与默认 locale
│   ├── lib/
│   │   ├── recurrence.ts    # 重复规则展开（按 IANA 时区算，纯函数）
│   │   ├── events-query.ts  # 列表筛选参数 → MongoDB 查询（纯函数）
│   │   ├── applications-state.ts # 申请状态机（纯函数）
│   │   ├── schemas/         # Zod：领域模型的唯一事实来源，TS 类型由 z.infer 派生
│   │   │   ├── common.ts    # ObjectId · Address · GeoPoint · Pagination · ApiResponse
│   │   │   ├── enums.ts     # 角色 · 活动分类 · 语言 · 申请状态
│   │   │   ├── user.ts      # User · 资料表单 · session 载荷
│   │   │   ├── organization.ts # Organization · Membership · Invitation
│   │   │   ├── series.ts    # EventSeries · 重复规则
│   │   │   ├── event.ts     # Event · Review · 列表筛选参数
│   │   │   └── application.ts  # Application · 留言 · Document
│   │   └── server/
│   │       ├── db.ts        # Mongoose 连接封装（读取 MONGO_URI，跨热重载缓存连接）
│   │       ├── mongo-client.ts # Auth.js adapter 用的原生 MongoClient
│   │       ├── authz.ts     # docs/roles.md 里那些判断的代码实现
│   │       ├── email.ts     # Resend HTTP API + 四封通知模板
│   │       ├── actions/     # Server Actions：UI 唯一的写入口
│   │       ├── services/    # 业务规则与数据访问（权限检查在这一层）
│   │       └── models/      # Mongoose 模型，与 schemas/ 一一对应
│   ├── test/
│   │   └── setup.ts         # Testing Library 全局配置
│   ├── proxy.ts             # next-intl 中间件（自动 locale 检测与重定向）
│   └── theme.ts             # MUI 主题（CSS Variables + light/dark colorSchemes）
├── scripts/
│   └── seed.ts              # 造开发数据（npm run seed）；v1 数据不迁移，用它代替快照
├── next.config.ts           # Next.js 配置（standalone output · next-intl 插件）
└── vitest.config.ts         # Vitest 配置（jsdom · 路径别名）
```

---

## 迁移进度

52 项任务的看板在仓库之外：<https://claude.ai/code/artifact/935dc9ea-94b9-402c-9168-7fc3c6da137d>

任务编号（`p0-1` … `p6-6`）是看板与本仓库之间的共用词汇，请在 commit 和 `docs/todos/` 条目中引用。模板自带的示例代码（`HomeView.tsx`、占位 Zod schema）已在 P1 阶段移除。

## 开发指引

### 配置国际化

**支持的语言**在 `src/i18n/routing.ts` 中定义：

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'de', 'zh-CN'], // 按需增删
  defaultLocale: 'en',
})
```

每种语言对应 `messages/` 下的一个 JSON 文件。新增一门语言（以日语为例）：

1. 在 `routing.ts` 的 `locales` 数组中加入 `'ja'`
2. 新建 `messages/ja.json`，内容结构与 `messages/en.json` 保持一致

**在组件中使用翻译：**

```tsx
// 服务端组件
import { getTranslations } from 'next-intl/server'
const t = await getTranslations()

// 客户端组件（文件顶部加 "use client"）
import { useTranslations } from 'next-intl'
const t = useTranslations()

// JSX 中调用
<h1>{t('home.title')}</h1>
```

### 添加页面

所有页面必须放在 `src/app/[locale]/` 目录下，这样 next-intl 的中间件才能正确处理语言路由：

```
src/app/[locale]/
├── layout.tsx       # 已有，不需要改动
├── page.tsx         # 首页
├── about/
│   └── page.tsx     # → /en/about  ·  /zh-CN/about
└── dashboard/
    └── page.tsx
```

**路由跳转**：始终从 `@/i18n/navigation` 引入 `Link`、`useRouter`、`usePathname`，不要直接用 `next/navigation`，否则会丢失 locale 前缀：

```tsx
import { Link, useRouter } from '@/i18n/navigation'

// 内部链接
;<Link href="/about">关于</Link>

// 编程式跳转
const router = useRouter()
router.push('/dashboard')
```

### 认证

VolMe 没有密码：要么用 Google 登录，要么收一封带一次性链接的邮件（见
[`docs/decisions/0008`](docs/decisions/0008-passwordless-authentication.md)）。

- 配置分两份：`src/auth.ts` 带 adapter 和 providers，只能在服务端用；`src/auth.config.ts`
  不碰数据库，所以 `src/proxy.ts` 也能加载它。往 proxy 能到的地方引入数据库会直接把它拖垮。
- session 用 JWT，不用数据库 session —— 这样 proxy 不查库就能判断有没有登录。adapter
  仍然拥有 `users` / `accounts` / `verification_tokens` 三个 collection，其中 `users`
  和 Mongoose 的 `UserModel` 是同一个。
- 本地开发不配 `AUTH_RESEND_KEY` 时，登录链接会打印在服务端控制台里，不会真的发信。
- 谁能做什么一律以 [`docs/roles.md`](docs/roles.md) 为准，判断逻辑写在
  `src/lib/server/authz.ts`，不要在调用处自己拼查询。

### 定义 Zod Schema

在 `src/lib/schemas/index.ts` 中定义数据结构，用 `z.infer<>` 派生 TypeScript 类型，避免手写重复类型：

```ts
// src/lib/schemas/index.ts
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  publishedAt: z.coerce.date(),
})
export type Article = z.infer<typeof ArticleSchema>
```

在 API 调用处用 `.parse()` 或 `.safeParse()` 验证响应数据：

```ts
const json = await res.json()
const article = ArticleSchema.parse(json) // 类型不符时立刻抛错
```

### 写测试

测试文件放在 `__tests__/` 子目录，或与源文件同级并命名为 `*.test.ts` / `*.test.tsx`：

```bash
npm run test       # 监听模式（开发时使用）
npm run test:run   # 单次运行（CI 用）
```

**测试中 mock next-intl：**

```tsx
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))
```

参考 `src/components/__tests__/LocaleSwitcher.test.tsx` 查看完整示例。

### 配置数据库连接

1. 复制环境变量模板：`cp .env.example .env`
2. 本地开发时启动一个 MongoDB 实例（或使用 `docker compose up -d mongo`），并在 `.env` 中设置 `MONGO_URI`
3. 在 Server Component / Route Handler / Server Action 中按需调用 `connectDB()`：

```ts
import { connectDB } from '@/lib/server/db'

await connectDB()
// 定义 Mongoose model 并查询……
```

`connectDB()` 会跨请求 / 热重载复用同一个连接（见 `src/lib/server/db.ts`），不需要每次手动管理连接池。Model 放在 `src/lib/server/models/` 下，与 `src/lib/schemas/` 中同名的 Zod schema 一一对应 —— 改一边就要在同一个 commit 里改另一边。

compose 的 `mongo` 服务只把端口发布在 `127.0.0.1` 上。如果本机 27017 已被占用，在 `.env` 里改 `MONGO_PORT`（并同步改 `MONGO_URI`）。

有了库之后跑 `npm run seed` 造数据：3 个组织、5 个用户、4 个活动、若干申请与评价。脚本会先清空 VolMe 的 collection，并且拒绝对名字不像开发库的数据库动手。

### 启用 Docker 镜像推送（可选）

CI 的 Docker stage 默认关闭。在 GitHub 仓库的 **Settings → Variables → Actions** 中新建变量即可开启：

```
Name:  ENABLE_DOCKER_PUSH
Value: true
```

开启后，每次 push 到 `main` 分支会自动构建镜像并推送到 GHCR：

- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:sha-xxxxxxx`

### 启用自动部署（可选）

CI 的 deploy stage 默认关闭。因为 self-hosted runner 本身就是部署目标服务器（见下方"CI 流水线"），开启后每次 push 到 `main` 都会在 runner 所在机器上执行 `docker compose up -d --build`，真实启停容器。在 GitHub 仓库的 **Settings → Variables → Actions** 中新建变量即可开启：

```
Name:  ENABLE_DEPLOY
Value: true
```

多个仓库共用同一台 self-hosted runner 时，只给需要自动部署的仓库开启这个变量。

---

## 常用命令

```bash
npm run dev            # 启动开发服务器（http://localhost:3000）
npm run build          # 生产构建
npm run start          # 本地运行生产构建
npm run lint           # ESLint 检查
npm run lint:fix       # ESLint 自动修复
npm run format         # Prettier 格式化全部文件
npm run format:check   # Prettier 格式检查（CI 用）
npm run type-check     # TypeScript 类型检查
npm run test           # 运行测试（监听模式）
npm run test:run       # 运行测试（单次）
npm run test:ui        # Vitest 浏览器 UI
npm run seed           # 清空并重建开发数据（需要 MONGO_URI 指向开发库）
```

---

## Docker 部署

```bash
# 1. 准备环境变量
cp .env.example .env
# 按需修改 .env（本地默认值已指向 compose 内置的 mongo 服务）

# 2. 构建镜像并后台启动（首次约需 1-2 分钟）
docker compose up -d

# 访问 http://localhost:3000
# Nginx 等待 app 健康检查通过后才开始接收流量

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f
```

| 容器     | 基础镜像               | 职责                                         |
| -------- | ---------------------- | -------------------------------------------- |
| `app`    | node:24-alpine         | 运行 Next.js standalone server（端口 3000）  |
| `nginx`  | nginx:1.27-alpine      | 反向代理，永久缓存 `/_next/static/` 静态资源 |
| `mongo`  | mongo:latest           | 数据库，数据持久化在 `mongo-data` volume 中  |
| `tunnel` | cloudflare/cloudflared | 可选：Cloudflare Tunnel，暴露站点到公网      |

Dockerfile 采用三阶段构建（deps → builder → runner）。最终镜像只包含 standalone bundle，无 devDependencies，体积极小。

### 数据库（MongoDB）

`app` 容器默认连接 compose 内置的 `mongo` 服务（`MONGO_URI=mongodb://mongo:27017/volme`），数据持久化在 `mongo-data` volume 中。如需指向外部 MongoDB（如 Atlas），在 `.env` 中覆盖 `MONGO_URI` 即可，`mongo` 服务仍会启动但不会被使用。

### Cloudflare Tunnel（可选）

`tunnel` 服务默认**不会**随 `docker compose up -d`启动 —— 它挂在 `tunnel` compose profile 下，避免未设置 `TUNNEL_TOKEN` 时导致启动失败。启用步骤：

1. 在 Cloudflare Zero Trust 控制台创建一个 tunnel，将其 public hostname 指向 `http://nginx:8080`
2. 复制 tunnel token，写入 `.env` 的 `TUNNEL_TOKEN`
3. 用 profile 显式启动：

```bash
docker compose --profile tunnel up -d
```

---

## 自动化

### CI 流水线

push / PR 到 `main` 时依次执行 semgrep → quality → test → build，任意一个失败即终止后续；`build` 成功后并行触发两个条件 stage：

```
semgrep → quality → test → build ─┬─▶ docker   推送镜像到 GHCR（需开启 ENABLE_DOCKER_PUSH）
                                   └─▶ deploy   自托管 runner 上 docker compose up -d --build（需开启 ENABLE_DEPLOY）
```

| Stage       | 内容                                       | 触发条件                   |
| ----------- | ------------------------------------------ | -------------------------- |
| **semgrep** | Semgrep 安全扫描（GitHub-hosted）          | push + PR                  |
| **quality** | lint · format:check · type-check           | push + PR                  |
| **test**    | Vitest 单测                                | push + PR                  |
| **build**   | 生产构建，产物上传为 Artifact（保留 7 天） | push + PR                  |
| **docker**  | 构建镜像并推送到 GHCR                      | 仅 push main（需开启变量） |
| **deploy**  | 自托管 runner 上原地重建并重启容器         | 仅 push main（需开启变量） |

**跑在哪台机器上**：除 `semgrep`（固定 GitHub-hosted，因为它用 `container:`，自托管 macOS runner 不支持）外，其余 stage 都跑在自托管 runner 上（`ci.yml` 里 `runs-on: [self-hosted, macOS, ARM64]`）。这只在仓库保持**私有**时安全——quality / test / build 由 `pull_request` 触发，会执行 PR 分支里的代码，公开仓库任何人都能 fork 后提 PR 拿到这台机器的任意代码执行权。仓库若要公开，先把这五个 job 的 `runs-on` 改回 `ubuntu-latest`。

**修改 CI 配置**：所有可调参数集中在 `.github/workflows/ci.yml` 顶部的 `env` 块：

```yaml
env:
  NODE_VERSION: '24' # 修改 Node 版本
  REGISTRY: ghcr.io # 换成 docker.io 即切换到 Docker Hub
  IMAGE_NAME: ${{ github.repository }} # 或写死镜像名
```

同一分支有新 push 时，旧的 run 会被自动取消（`concurrency` 配置）。

### Semgrep 安全扫描

| 触发方式     | 时机                              |
| ------------ | --------------------------------- |
| CI 流水线    | 每次 push / PR，作为 Stage 0 门禁 |
| 独立定时扫描 | 每周一 01:00 UTC                  |

在 [semgrep.dev](https://semgrep.dev) 创建免费账号，将 Token 添加为仓库 Secret（名称：`SEMGREP_APP_TOKEN`），可解锁更多规则并在控制台查看历史结果。不配置 Token 时扫描仍以社区规则运行。

### Dependabot

每周一 09:00（Asia/Shanghai）自动检查更新，依赖按功能分组，减少 PR 数量：

| 分组           | 包含的包                                      |
| -------------- | --------------------------------------------- |
| **mui**        | `@mui/*` · `@emotion/*`                       |
| **nextjs**     | `next` · `next-intl`                          |
| **testing**    | `vitest` · `@vitejs/*` · `@testing-library/*` |
| **typescript** | `typescript` · `@types/*`                     |
| GitHub Actions | 工作流中的 actions 版本                       |

---

<a name="english"></a>

# VolMe — English

VolMe is a volunteering platform that connects event organisers with volunteers: event posting, personalised search, applications, volunteer selection, and event reviews.

This directory is the VolMe rewrite (v2), built on [We2-Tech/nextjs-template](https://github.com/We2-Tech/nextjs-template) and vendored via `git subtree`. The v1 CRA frontend and Express backend remain at `../frontend` and `../backend` as a reference during the rewrite, and are deleted once the migration completes.

**No backward compatibility**: the v1 database is not migrated and old accounts and sessions are not preserved. See [`docs/decisions/0001-rewrite-volme-on-this-template.md`](docs/decisions/0001-rewrite-volme-on-this-template.md).

## Tech Stack

| Category           | Technology                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16 + TypeScript 5 + React 19                                                                       |
| UI                 | Material UI 9 + dark mode (CSS Variables) + MUI X (DataGrid · Charts · DatePickers · TreeView)             |
| i18n               | next-intl v4 (App Router · auto locale detection · server + client)                                        |
| Auth               | Auth.js v5 (passwordless: Google OAuth + emailed magic links)                                              |
| Validation         | Zod v4                                                                                                     |
| Database           | MongoDB + Mongoose (connection wrapper in `src/lib/server/db.ts`)                                          |
| Testing            | Vitest + React Testing Library                                                                             |
| Linting            | ESLint + Prettier                                                                                          |
| Container          | Docker multi-stage build + Node.js standalone + Nginx reverse proxy + MongoDB + optional Cloudflare Tunnel |
| CI/CD              | GitHub Actions (semgrep · lint · format · type-check · test · build)                                       |
| Dependency updates | Dependabot (weekly grouped PRs)                                                                            |
| Security           | Semgrep (push/PR + weekly schedule)                                                                        |

---

## Getting Started

```bash
git clone git@github.com:We2-Tech/VolMe.git
cd VolMe/app
npm install
npm run dev
# Visit http://localhost:3000 (auto-redirects to /en, /de or /zh-CN)
```

---

## Migration Progress

The 52-task board lives outside this repository: <https://claude.ai/code/artifact/935dc9ea-94b9-402c-9168-7fc3c6da137d>

Task ids (`p0-1` … `p6-6`) are the shared vocabulary between that board and this repository — reference them in commit messages and `docs/todos/` entries. The template's example code (`HomeView.tsx`, the placeholder Zod schemas) was removed in P1.

## Development Guide

### Configure i18n

Supported locales are defined in `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ['en', 'de', 'zh-CN'], // add or remove as needed
  defaultLocale: 'en',
})
```

Each locale maps to a file in `messages/`. To add a new language (e.g. Japanese):

1. Add `'ja'` to the `locales` array in `routing.ts`
2. Create `messages/ja.json` with the same key structure as `messages/en.json`

**Using translations in components:**

```tsx
// Server Component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations()

// Client Component ("use client" required)
import { useTranslations } from 'next-intl'
const t = useTranslations()

<h1>{t('home.title')}</h1>
```

### Add pages

All pages must live under `src/app/[locale]/` so the next-intl middleware handles locale routing correctly:

```
src/app/[locale]/
├── layout.tsx       # already set up — do not remove
├── page.tsx         # home page
├── about/
│   └── page.tsx     # → /en/about  and  /zh-CN/about
└── dashboard/
    └── page.tsx
```

**Navigation**: always import `Link`, `useRouter`, and `usePathname` from `@/i18n/navigation`, not from `next/navigation`. The wrappers automatically prepend the current locale:

```tsx
import { Link, useRouter } from '@/i18n/navigation'
;<Link href="/about">About</Link>

const router = useRouter()
router.push('/dashboard')
```

### Authentication

VolMe has no passwords: sign in with Google, or with a one-time link sent by email
(see [`docs/decisions/0008`](docs/decisions/0008-passwordless-authentication.md)).

- The config is split. `src/auth.ts` carries the adapter and the providers and is
  server-only; `src/auth.config.ts` touches no database, so `src/proxy.ts` can load
  it. Importing the database into anything the proxy reaches will drag it down.
- Sessions are JWTs rather than database sessions, so the proxy can tell whether a
  request is signed in without a query. The adapter still owns `users`, `accounts`
  and `verification_tokens` — and its `users` is the same collection as Mongoose's
  `UserModel`.
- With no `AUTH_RESEND_KEY` in development, the sign-in link is printed to the server
  console instead of emailed.
- Who may do what is settled by [`docs/roles.md`](docs/roles.md); the checks live in
  `src/lib/server/authz.ts`. Don't hand-roll a membership query at the call site.

### Define Zod schemas

Define all runtime data shapes in `src/lib/schemas/index.ts` and derive TypeScript types with `z.infer<>`:

```ts
export const ArticleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  publishedAt: z.coerce.date(),
})
export type Article = z.infer<typeof ArticleSchema>
```

Parse API responses at the boundary to catch shape mismatches early:

```ts
const json = await res.json()
const article = ArticleSchema.parse(json)
```

### Write tests

Place test files in `__tests__/` subdirectories or alongside source files as `*.test.ts` / `*.test.tsx`:

```bash
npm run test:run   # single run (CI)
npm run test       # watch mode (development)
```

**Mocking next-intl in component tests:**

```tsx
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))
```

See `src/components/__tests__/LocaleSwitcher.test.tsx` for a complete example.

### Configure the database connection

1. Copy the env template: `cp .env.example .env`
2. For local dev, run a MongoDB instance (or `docker compose up -d mongo`) and set `MONGO_URI` in `.env`
3. Call `connectDB()` wherever you need it — Server Components, Route Handlers, Server Actions:

```ts
import { connectDB } from '@/lib/server/db'

await connectDB()
// define Mongoose models and query…
```

`connectDB()` reuses the same connection across requests and hot-reloads (see `src/lib/server/db.ts`) — no manual pool management needed. Models live in `src/lib/server/models/`, one per Zod schema of the same name in `src/lib/schemas/` — change one and change the other in the same commit.

The compose `mongo` service publishes its port on `127.0.0.1` only. If something else already holds 27017 on your machine, set `MONGO_PORT` in `.env` (and match it in `MONGO_URI`).

With a database in place, run `npm run seed`: 3 organizations, 5 users, 4 events, plus applications and a review. It clears VolMe's collections first, and refuses to run against a database whose name doesn't look like a development one.

### Enable Docker image push (optional)

The Docker stage in CI is disabled by default. Enable it by creating an Actions variable in **Settings → Variables → Actions**:

```
Name:  ENABLE_DOCKER_PUSH
Value: true
```

Once enabled, every push to `main` builds and pushes to GHCR:

- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:sha-xxxxxxx`

### Enable automatic deploy (optional)

The deploy stage in CI is disabled by default. The self-hosted runner IS the deploy target (see "CI Pipeline" below), so enabling this makes every push to `main` run `docker compose up -d --build` on the runner's host — real containers, really started/stopped. Enable it by creating an Actions variable in **Settings → Variables → Actions**:

```
Name:  ENABLE_DEPLOY
Value: true
```

If multiple repos share the same self-hosted runner, only turn this on for the ones you actually want auto-deployed.

---

## Scripts

```bash
npm run dev            # start dev server (http://localhost:3000)
npm run build          # production build
npm run start          # run production build locally
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier format all files
npm run format:check   # Prettier check (CI)
npm run type-check     # TypeScript type check
npm run test           # run tests in watch mode
npm run test:run       # run tests once
npm run test:ui        # Vitest browser UI
npm run seed           # wipe and rebuild the development fixture (needs MONGO_URI)
```

---

## Docker

```bash
# 1. Prepare environment variables
cp .env.example .env
# adjust .env as needed (the default already points at the bundled mongo service)

# 2. Build and start in background (first run takes 1–2 minutes)
docker compose up -d

# Visit http://localhost:3000
# Nginx waits for the app health check before accepting traffic

# Check service status
docker compose ps

# Tail logs
docker compose logs -f
```

| Container | Base image             | Role                                                   |
| --------- | ---------------------- | ------------------------------------------------------ |
| `app`     | node:24-alpine         | Runs the Next.js standalone server (port 3000)         |
| `nginx`   | nginx:1.27-alpine      | Reverse proxy; caches `/_next/static/` assets forever  |
| `mongo`   | mongo:latest           | Database; data persisted in the `mongo-data` volume    |
| `tunnel`  | cloudflare/cloudflared | Optional: Cloudflare Tunnel exposing the site publicly |

The Dockerfile uses a three-stage build (deps → builder → runner). The final image contains only the standalone bundle — no devDependencies — keeping the image size minimal.

### Database (MongoDB)

The `app` container connects to the bundled `mongo` service by default (`MONGO_URI=mongodb://mongo:27017/volme`), with data persisted in the `mongo-data` volume. To point at an external MongoDB (e.g. Atlas), override `MONGO_URI` in `.env` — the `mongo` service will still start but go unused.

### Cloudflare Tunnel (optional)

The `tunnel` service does **not** start with a plain `docker compose up -d` — it sits behind the `tunnel` compose profile so a missing `TUNNEL_TOKEN` doesn't break the default startup path. To enable it:

1. Create a tunnel in the Cloudflare Zero Trust dashboard and point its public hostname at `http://nginx:8080`
2. Copy the tunnel token into `TUNNEL_TOKEN` in `.env`
3. Start it explicitly with the profile:

```bash
docker compose --profile tunnel up -d
```

---

## Automation

### CI Pipeline

semgrep → quality → test → build run sequentially on every push and pull request to `main` — any failure stops the rest. Once `build` succeeds, two conditional stages fire in parallel:

```
semgrep → quality → test → build ─┬─▶ docker   push image to GHCR (needs ENABLE_DOCKER_PUSH)
                                   └─▶ deploy   docker compose up -d --build on the self-hosted runner (needs ENABLE_DEPLOY)
```

| Stage       | Steps                                              | Runs on                   |
| ----------- | -------------------------------------------------- | ------------------------- |
| **semgrep** | Semgrep security scan (GitHub-hosted)              | push + PR                 |
| **quality** | lint · format:check · type-check                   | push + PR                 |
| **test**    | Vitest                                             | push + PR                 |
| **build**   | production build, artifact uploaded (7-day retain) | push + PR                 |
| **docker**  | build & push to GHCR                               | push to main (opt-in var) |
| **deploy**  | rebuild & recreate containers in place, on-runner  | push to main (opt-in var) |

**Which machine they run on**: every stage except `semgrep` (pinned to GitHub-hosted — it uses `container:`, which self-hosted macOS runners don't support) runs on a self-hosted runner (`runs-on: [self-hosted, macOS, ARM64]` in `ci.yml`). That's only safe while the repo stays **private** — quality / test / build trigger on `pull_request` and execute the PR branch's code, and on a public repo anyone could fork it and open a PR to get arbitrary code execution on that machine. If this repo ever goes public, switch those five jobs' `runs-on` back to `ubuntu-latest` first.

To customise CI, edit the `env` block at the top of `.github/workflows/ci.yml`:

```yaml
env:
  NODE_VERSION: '24' # change Node version
  REGISTRY: ghcr.io # switch to docker.io for Docker Hub
  IMAGE_NAME: ${{ github.repository }} # or hard-code the image name
```

Concurrent runs on the same branch are automatically cancelled.

### Semgrep

| Trigger        | When                                      |
| -------------- | ----------------------------------------- |
| CI pipeline    | Every push / PR — gates Stage 1 (quality) |
| Scheduled scan | Every Monday at 01:00 UTC                 |

Add a `SEMGREP_APP_TOKEN` repository secret (free at [semgrep.dev](https://semgrep.dev)) to unlock extended rules and the Semgrep dashboard. The scan still runs with community rules without a token.

### Dependabot

Runs every Monday at 09:00 (Asia/Shanghai). Dependencies are grouped to minimise PR noise:

| Group          | Packages                                      |
| -------------- | --------------------------------------------- |
| **mui**        | `@mui/*` · `@emotion/*`                       |
| **nextjs**     | `next` · `next-intl`                          |
| **testing**    | `vitest` · `@vitejs/*` · `@testing-library/*` |
| **typescript** | `typescript` · `@types/*`                     |
| GitHub Actions | action versions in workflow files             |
