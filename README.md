# Next.js Template

一个开箱即用的 Next.js 生产级蓝图，内置 App Router、服务端渲染、国际化、MUI 组件库与完整工具链配置。

[English](#english) | 中文

---

## 技术栈

| 分类      | 技术                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------- |
| 框架      | Next.js 16 + TypeScript 5 + React 19                                                              |
| UI 组件库 | Material UI 9 + 暗黑模式（CSS Variables）+ MUI X（DataGrid · Charts · DatePickers · TreeView）    |
| 国际化    | next-intl v4（App Router · 自动语言检测 · 服务端 + 客户端翻译）                                   |
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
git clone <your-repo-url> my-app
cd my-app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000（自动重定向到 /en 或 /zh-CN）
```

---

## 目录结构

```
├── messages/
│   ├── en.json              # 英文翻译
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
│   │   ├── HomeView.tsx     # 首页示例（删除或替换）
│   │   └── LocaleSwitcher.tsx
│   ├── i18n/
│   │   ├── navigation.ts    # locale-aware 的 Link / useRouter / usePathname
│   │   ├── request.ts       # 服务端 getTranslations 配置
│   │   └── routing.ts       # 支持的 locale 列表与默认 locale
│   ├── lib/
│   │   ├── schemas/
│   │   │   └── index.ts     # Zod schemas（User · LoginForm · Pagination 等）
│   │   └── server/
│   │       └── db.ts        # Mongoose 连接封装（读取 MONGO_URI，跨热重载缓存连接）
│   ├── test/
│   │   └── setup.ts         # Testing Library 全局配置
│   ├── proxy.ts             # next-intl 中间件（自动 locale 检测与重定向）
│   └── theme.ts             # MUI 主题（CSS Variables + light/dark colorSchemes）
├── next.config.ts           # Next.js 配置（standalone output · next-intl 插件）
└── vitest.config.ts         # Vitest 配置（jsdom · 路径别名）
```

---

## 用此模板创建新项目（分步指引）

### 第一步：替换项目信息

1. 修改 `package.json` 中的 `name` 字段为你的项目名
2. 修改 `messages/en.json` 和 `messages/zh-CN.json` 中的 `nav.appTitle` 为你的应用标题

### 第二步：删除示例代码

首页示例内容集中在 `src/components/HomeView.tsx`，直接替换为你自己的业务组件：

```bash
rm src/components/HomeView.tsx
```

然后打开 `src/app/[locale]/page.tsx`，删除 `HomeView` 的 import 和 JSX，换成你自己的首页内容。

### 第三步：配置国际化

**支持的语言**在 `src/i18n/routing.ts` 中定义：

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'zh-CN'], // 按需增删
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

### 第四步：添加页面

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

### 第五步：定义 Zod Schema

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

### 第六步：写测试

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

### 第七步：配置数据库连接

1. 复制环境变量模板：`cp .env.example .env`
2. 本地开发时启动一个 MongoDB 实例（或使用 `docker compose up -d mongo`），并在 `.env` 中设置 `MONGO_URI`
3. 在 Server Component / Route Handler / Server Action 中按需调用 `connectDB()`：

```ts
import { connectDB } from '@/lib/server/db'

await connectDB()
// 定义 Mongoose model 并查询……
```

`connectDB()` 会跨请求 / 热重载复用同一个连接（见 `src/lib/server/db.ts`），不需要每次手动管理连接池。Model 建议放在 `src/lib/server/models/` 下（新建该目录）。

### 第八步：启用 Docker 镜像推送（可选）

CI 的 Docker stage 默认关闭。在 GitHub 仓库的 **Settings → Variables → Actions** 中新建变量即可开启：

```
Name:  ENABLE_DOCKER_PUSH
Value: true
```

开启后，每次 push 到 `main` 分支会自动构建镜像并推送到 GHCR：

- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:sha-xxxxxxx`

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
| `app`    | node:22-alpine         | 运行 Next.js standalone server（端口 3000）  |
| `nginx`  | nginx:1.27-alpine      | 反向代理，永久缓存 `/_next/static/` 静态资源 |
| `mongo`  | mongo:latest           | 数据库，数据持久化在 `mongo-data` volume 中  |
| `tunnel` | cloudflare/cloudflared | 可选：Cloudflare Tunnel，暴露站点到公网      |

Dockerfile 采用三阶段构建（deps → builder → runner）。最终镜像只包含 standalone bundle，无 devDependencies，体积极小。

### 数据库（MongoDB）

`app` 容器默认连接 compose 内置的 `mongo` 服务（`MONGO_URI=mongodb://mongo:27017/nextjs-template`），数据持久化在 `mongo-data` volume 中。如需指向外部 MongoDB（如 Atlas），在 `.env` 中覆盖 `MONGO_URI` 即可，`mongo` 服务仍会启动但不会被使用。

### Cloudflare Tunnel（可选）

`tunnel` 服务默认**不会**随 `docker compose up -d`启动 —— 它挂在 `tunnel` compose profile 下，避免未设置 `TUNNEL_TOKEN` 时导致启动失败（见 [docs/decisions/0001](docs/decisions/0001-cloudflare-tunnel-is-behind-a-compose-profile.md)）。启用步骤：

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
                                   └─▶ deploy   自托管 runner 上 docker compose up -d --build
```

| Stage       | 内容                                       | 触发条件                     |
| ----------- | ------------------------------------------ | ---------------------------- |
| **semgrep** | Semgrep 安全扫描（GitHub-hosted）          | push + PR                    |
| **quality** | lint · format:check · type-check           | push + PR                    |
| **test**    | Vitest 单测                                | push + PR                    |
| **build**   | 生产构建，产物上传为 Artifact（保留 7 天） | push + PR                    |
| **docker**  | 构建镜像并推送到 GHCR                      | 仅 push main（需开启变量）   |
| **deploy**  | 自托管 runner 上原地重建并重启容器         | 仅 push main（常开，无开关） |

**修改 CI 配置**：所有可调参数集中在 `.github/workflows/ci.yml` 顶部的 `env` 块：

```yaml
env:
  NODE_VERSION: '22' # 修改 Node 版本
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

---

<a name="english"></a>

# Next.js Template — English

A production-ready Next.js blueprint with App Router, SSR, i18n, MUI, and a fully configured toolchain.

## Tech Stack

| Category           | Technology                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16 + TypeScript 5 + React 19                                                                       |
| UI                 | Material UI 9 + dark mode (CSS Variables) + MUI X (DataGrid · Charts · DatePickers · TreeView)             |
| i18n               | next-intl v4 (App Router · auto locale detection · server + client)                                        |
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
git clone <your-repo-url> my-app
cd my-app
npm install
npm run dev
# Visit http://localhost:3000 (auto-redirects to /en or /zh-CN)
```

---

## How to Use This Template (Step by Step)

### Step 1 — Update project metadata

1. Change `name` in `package.json` to your project name
2. Update `nav.appTitle` in `messages/en.json` and `messages/zh-CN.json` to your app title

### Step 2 — Remove example code

The example content lives in `src/components/HomeView.tsx`. Replace it with your own components:

```bash
rm src/components/HomeView.tsx
# Then open src/app/[locale]/page.tsx and remove the HomeView import and JSX
```

### Step 3 — Configure i18n

Supported locales are defined in `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ['en', 'zh-CN'], // add or remove as needed
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

### Step 4 — Add pages

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

### Step 5 — Define Zod schemas

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

### Step 6 — Write tests

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

### Step 7 — Configure the database connection

1. Copy the env template: `cp .env.example .env`
2. For local dev, run a MongoDB instance (or `docker compose up -d mongo`) and set `MONGO_URI` in `.env`
3. Call `connectDB()` wherever you need it — Server Components, Route Handlers, Server Actions:

```ts
import { connectDB } from '@/lib/server/db'

await connectDB()
// define Mongoose models and query…
```

`connectDB()` reuses the same connection across requests and hot-reloads (see `src/lib/server/db.ts`) — no manual pool management needed. Put models under `src/lib/server/models/` (create that directory).

### Step 8 — Enable Docker image push (optional)

The Docker stage in CI is disabled by default. Enable it by creating an Actions variable in **Settings → Variables → Actions**:

```
Name:  ENABLE_DOCKER_PUSH
Value: true
```

Once enabled, every push to `main` builds and pushes to GHCR:

- `ghcr.io/<owner>/<repo>:latest`
- `ghcr.io/<owner>/<repo>:sha-xxxxxxx`

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
| `app`     | node:22-alpine         | Runs the Next.js standalone server (port 3000)         |
| `nginx`   | nginx:1.27-alpine      | Reverse proxy; caches `/_next/static/` assets forever  |
| `mongo`   | mongo:latest           | Database; data persisted in the `mongo-data` volume    |
| `tunnel`  | cloudflare/cloudflared | Optional: Cloudflare Tunnel exposing the site publicly |

The Dockerfile uses a three-stage build (deps → builder → runner). The final image contains only the standalone bundle — no devDependencies — keeping the image size minimal.

### Database (MongoDB)

The `app` container connects to the bundled `mongo` service by default (`MONGO_URI=mongodb://mongo:27017/nextjs-template`), with data persisted in the `mongo-data` volume. To point at an external MongoDB (e.g. Atlas), override `MONGO_URI` in `.env` — the `mongo` service will still start but go unused.

### Cloudflare Tunnel (optional)

The `tunnel` service does **not** start with a plain `docker compose up -d` — it sits behind the `tunnel` compose profile so a missing `TUNNEL_TOKEN` doesn't break the default startup path (see [docs/decisions/0001](docs/decisions/0001-cloudflare-tunnel-is-behind-a-compose-profile.md)). To enable it:

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
                                   └─▶ deploy   docker compose up -d --build on the self-hosted runner
```

| Stage       | Steps                                              | Runs on                          |
| ----------- | -------------------------------------------------- | -------------------------------- |
| **semgrep** | Semgrep security scan (GitHub-hosted)              | push + PR                        |
| **quality** | lint · format:check · type-check                   | push + PR                        |
| **test**    | Vitest                                             | push + PR                        |
| **build**   | production build, artifact uploaded (7-day retain) | push + PR                        |
| **docker**  | build & push to GHCR                               | push to main (opt-in var)        |
| **deploy**  | rebuild & recreate containers in place, on-runner  | push to main (always, no toggle) |

To customise CI, edit the `env` block at the top of `.github/workflows/ci.yml`:

```yaml
env:
  NODE_VERSION: '22' # change Node version
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
