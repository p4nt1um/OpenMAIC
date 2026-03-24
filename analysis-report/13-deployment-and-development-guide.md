# 13. 二次开发与上线部署准备指南

## 📋 概述

本文档为 OpenMAIC 项目的二次开发和生产环境部署提供详细的准备指南，包括环境配置、安全加固、性能优化和监控策略。

---

## 🚀 生产环境部署准备

### 1.1 环境要求清单

#### 基础环境
| 组件 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| Node.js | 20.9.0 | 22.x LTS | 运行时环境 |
| pnpm | 10.x | 10.28.0 | 包管理器 |
| Docker | 24.x | 最新稳定版 | 容器化部署 |
| 操作系统 | Linux/Windows/macOS | Linux (Ubuntu 22.04) | 生产推荐 Linux |

#### 硬件资源
| 规模 | CPU | 内存 | 存储 | 适用场景 |
|------|-----|------|------|----------|
| 开发测试 | 2 核 | 4GB | 20GB | 本地开发 |
| 小型生产 | 4 核 | 8GB | 50GB | 100 并发用户 |
| 中型生产 | 8 核 | 16GB | 100GB | 500 并发用户 |
| 大型生产 | 16+ 核 | 32GB+ | 200GB+ | 1000+ 并发用户 |

### 1.2 API Key 准备

#### 必需配置（至少选择一个）
```bash
# OpenAI (推荐用于海外部署)
OPENAI_API_KEY=sk-your-key

# Anthropic (高质量输出)
ANTHROPIC_API_KEY=sk-ant-your-key

# Google Gemini (推荐 - 性价比最佳)
GOOGLE_API_KEY=your-google-key
DEFAULT_MODEL=google:gemini-3-flash-preview

# DeepSeek (国内推荐)
DEEPSEEK_API_KEY=your-deepseek-key
```

#### 可选配置
```bash
# TTS 服务
TTS_OPENAI_API_KEY=your-tts-key
TTS_AZURE_API_KEY=your-azure-key

# ASR 服务
ASR_OPENAI_API_KEY=your-whisper-key

# PDF 增强解析
PDF_MINERU_API_KEY=your-mineru-key
PDF_MINERU_BASE_URL=https://api.mineru.com

# Web 搜索
TAVILY_API_KEY=your-tavily-key
```

### 1.3 安全配置清单

#### 环境变量安全
- [ ] 所有 API Key 存储在环境变量中
- [ ] 使用 `.env.local` 而非 `.env`
- [ ] 确保 `.env.local` 在 `.gitignore` 中
- [ ] 生产环境使用密钥管理服务（AWS Secrets Manager、GCP Secret Manager）

#### 网络安全
- [ ] 配置 HTTPS/SSL 证书
- [ ] 设置防火墙规则，仅开放必要端口（80, 443, 3000）
- [ ] 配置反向代理（Nginx/Caddy）
- [ ] 启用 DDoS 防护（Cloudflare）

#### 应用安全
```bash
# 推荐的安全 Headers (nginx.conf)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;
```

---

## 🐳 Docker 部署最佳实践

### 2.1 生产级 Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  openmaic:
    image: openmaic:latest
    container_name: openmaic-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
    env_file:
      - .env.production
    volumes:
      - ./server-providers.yml:/app/server-providers.yml:ro
      - openmaic-data:/app/data
      - /etc/localtime:/etc/localtime:ro
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - openmaic-network

  nginx:
    image: nginx:alpine
    container_name: openmaic-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      openmaic:
        condition: service_healthy
    networks:
      - openmaic-network

networks:
  openmaic-network:
    driver: bridge

volumes:
  openmaic-data:
    driver: local
```

### 2.2 Nginx 反向代理配置

```nginx
# nginx/conf.d/openmaic.conf
upstream openmaic_backend {
    least_conn;
    server openmaic:3000;
    # 如需水平扩展，添加更多实例
    # server openmaic-2:3000;
    # server openmaic-3:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 安全 Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 日志配置
    access_log /var/log/nginx/openmaic.access.log;
    error_log /var/log/nginx/openmaic.error.log;

    # 客户端限制
    client_max_body_size 200M;

    # 代理配置
    location / {
        proxy_pass http://openmaic_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # SSE 支持
        proxy_buffering off;
        proxy_read_timeout 86400s;
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://openmaic_backend;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 健康检查
    location /api/health {
        proxy_pass http://openmaic_backend;
        access_log off;
    }
}
```

---

## ☁️ 云平台部署指南

### 3.1 AWS 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS Cloud                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │ CloudFront  │    │     ALB     │    │   Route 53      │ │
│  │    (CDN)    │────│(Load Balance)│────│   (DNS)         │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                            │                                 │
│                     ┌──────┴───────┐                        │
│                     │  ECS Cluster │                        │
│                     │              │                        │
│                     │ ┌──────────┐ │                        │
│                     │ │ Service  │ │                        │
│                     │ │ (3 tasks)│ │                        │
│                     │ └──────────┘ │                        │
│                     └──────────────┘                        │
│                            │                                 │
│                     ┌──────┴───────┐                        │
│                     │  Secrets     │                        │
│                     │  Manager     │                        │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

#### ECS Task Definition 示例
```json
{
  "family": "openmaic",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "openmaic",
      "image": "your-ecr-repo/openmaic:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:openmaic/openai-key"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/openmaic",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3.2 GCP Cloud Run 部署

```bash
# 构建并推送到 Artifact Registry
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT-ID/openmaic/app

# 部署到 Cloud Run
gcloud run deploy openmaic \
  --image us-central1-docker.pkg.dev/PROJECT-ID/openmaic/app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "OPENAI_API_KEY=openai-key:latest"
```

### 3.3 Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod

# 配置环境变量
vercel env add OPENAI_API_KEY production
vercel env add ANTHROPIC_API_KEY production
```

---

## 🔧 二次开发准备

### 4.1 开发环境配置

```bash
# 1. 克隆仓库
git clone https://github.com/p4nt1um/OpenMAIC.git
cd OpenMAIC

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 API Keys

# 4. 启动开发服务器
pnpm dev

# 5. 访问 http://localhost:3000
```

### 4.2 项目结构速查

```
OpenMAIC/
├── app/                        # Next.js App Router
│   ├── api/                    # API 路由 (24 个端点)
│   ├── classroom/              # 课堂回放页面
│   └── page.tsx                # 首页
│
├── lib/                        # 核心业务逻辑
│   ├── generation/             # 两阶段生成流水线
│   ├── orchestration/          # LangGraph 多智能体编排
│   ├── playback/               # 回放状态机
│   ├── action/                 # 动作执行引擎
│   ├── ai/                     # LLM 提供商抽象层
│   ├── store/                  # Zustand 状态管理
│   └── types/                  # TypeScript 类型定义
│
├── components/                 # React UI 组件
│   ├── slide-renderer/         # 幻灯片编辑器
│   ├── scene-renderers/        # 场景渲染器
│   ├── chat/                   # 聊天组件
│   └── ui/                     # 基础 UI 组件
│
├── packages/                   # 工作区子包
│   ├── pptxgenjs/              # PowerPoint 生成
│   └── mathml2omml/            # MathML 转换
│
└── configs/                    # 共享常量配置
```

### 4.3 常见二开场景

#### 场景 1: 添加新的 LLM 提供商

```typescript
// lib/ai/providers.ts
export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  // 现有提供商...
  
  'my-custom-llm': {
    id: 'my-custom-llm',
    name: 'My Custom LLM',
    type: 'openai', // 兼容 OpenAI API
    defaultBaseUrl: 'https://api.my-custom-llm.com/v1',
    requiresApiKey: true,
    icon: '/logos/my-custom-llm.svg',
    models: [
      {
        id: 'custom-model-v1',
        name: 'Custom Model V1',
        contextWindow: 128000,
        outputWindow: 4096,
        capabilities: {
          streaming: true,
          tools: true,
          vision: false,
        },
      },
    ],
  },
};
```

#### 场景 2: 添加新的场景类型

```typescript
// 1. 定义类型 (lib/types/stage.ts)
export interface MyCustomContent {
  type: 'my-custom';
  data: {
    // 自定义字段
  };
}

// 2. 创建渲染器 (components/scene-renderers/my-custom.tsx)
export function MyCustomRenderer({ scene }: { scene: Scene }) {
  const content = scene.content as MyCustomContent;
  return <div>{/* 渲染逻辑 */}</div>;
}

// 3. 注册渲染器 (components/scene-renderers/index.ts)
export const SCENE_RENDERERS = {
  // 现有渲染器...
  'my-custom': MyCustomRenderer,
};
```

#### 场景 3: 添加新的动作类型

```typescript
// 1. 定义动作类型 (lib/types/action.ts)
export interface MyCustomAction extends ActionBase {
  type: 'my_custom_action';
  targetId: string;
  params: Record<string, unknown>;
}

// 2. 实现执行逻辑 (lib/action/engine.ts)
case 'my_custom_action':
  return this.executeMyCustomAction(action as MyCustomAction);

private async executeMyCustomAction(action: MyCustomAction): Promise<void> {
  // 执行逻辑
}
```

### 4.4 代码规范

#### TypeScript 规范
```typescript
// ✅ 使用接口定义类型
interface UserProfile {
  id: string;
  name: string;
}

// ✅ 使用类型别名定义联合类型
type Theme = 'light' | 'dark';

// ✅ 使用枚举定义常量
enum SceneType {
  Slide = 'slide',
  Quiz = 'quiz',
  Interactive = 'interactive',
  PBL = 'pbl',
}

// ✅ 使用泛型提高复用性
function createStore<T>(initialState: T): Store<T> {
  // 实现
}
```

#### 组件规范
```tsx
// ✅ 使用函数组件和 TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  onClick,
  children 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## 📊 监控与日志

### 5.1 应用监控

#### 健康检查端点
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version,
  };

  return Response.json(checks);
}
```

#### 推荐监控工具
- **应用性能**: Sentry, New Relic, Datadog
- **基础设施**: Prometheus + Grafana
- **日志管理**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **错误追踪**: Sentry

### 5.2 日志配置

```typescript
// lib/logger.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

---

## 🔄 CI/CD 配置

### 6.1 GitHub Actions 示例

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

---

## 📝 上线检查清单

### 部署前检查
- [ ] 所有 API Key 已配置
- [ ] 环境变量已设置 (`NODE_ENV=production`)
- [ ] HTTPS 已启用
- [ ] 安全 Headers 已配置
- [ ] 健康检查端点正常
- [ ] 日志配置正确
- [ ] 备份策略已制定

### 性能检查
- [ ] 首屏加载时间 < 3 秒
- [ ] API 响应时间 < 500ms
- [ ] 内存使用稳定
- [ ] 无内存泄漏

### 安全检查
- [ ] API Key 未暴露在前端
- [ ] CORS 配置正确
- [ ] 输入验证已启用
- [ ] 速率限制已配置（如需要）

### 功能检查
- [ ] 课堂生成功能正常
- [ ] 多智能体讨论正常
- [ ] TTS/ASR 功能正常
- [ ] 导出功能正常

---

## 🆘 故障排查

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存
pnpm clean
rm -rf node_modules .next
pnpm install
pnpm build
```

#### 2. API Key 错误
```bash
# 检查环境变量
echo $OPENAI_API_KEY
# 确保在 .env.local 中配置
```

#### 3. 内存不足
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## 📚 参考资源

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Docker 最佳实践](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Vercel 部署指南](https://vercel.com/docs)
- [AWS ECS 文档](https://docs.aws.amazon.com/ecs/)
- [GCP Cloud Run 文档](https://cloud.google.com/run/docs)

---

## 🔗 OpenClaw 与 OpenMAIC 共存部署

### 8.1 架构关系

```
┌─────────────────────────────────────────────────────────────┐
│                     消息平台用户                              │
│        (飞书 / Slack / Discord / Telegram / ...)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw 服务                             │
│                 (AI 助手 + 消息路由)                          │
│                    默认端口: 3001                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP API 调用
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenMAIC 服务                              │
│                (课堂生成 + 多智能体)                          │
│                    默认端口: 3000                            │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 端口配置

两个服务使用不同端口，**无冲突**：

| 服务 | 默认端口 | 说明 |
|------|---------|------|
| OpenMAIC | 3000 | Next.js 应用 |
| OpenClaw | 3001 | AI 助手平台 |

如需修改端口：

```bash
# OpenMAIC 端口
PORT=3000 pnpm start

# OpenClaw 端口（在 OpenClaw 配置中设置）
OPENCLAW_PORT=3001
```

### 8.3 推荐部署方式

#### 方式 1：同一主机，不同端口（推荐）

**优点**：
- 配置简单
- 延迟最低（本地 API 调用）
- 资源共享

**配置步骤**：

```bash
# 1. 启动 OpenMAIC (端口 3000)
cd /path/to/OpenMAIC
pnpm build && pnpm start

# 2. 启动 OpenClaw (端口 3001)
# 在 OpenClaw 配置中指定 OpenMAIC 地址
```

**OpenClaw 配置** (`~/.openclaw/openclaw.json`)：
```jsonc
{
  "skills": {
    "entries": {
      "openmaic": {
        "enabled": true,
        "config": {
          "repoDir": "/path/to/OpenMAIC",
          "url": "http://localhost:3000"
        }
      }
    }
  }
}
```

#### 方式 2：Docker Compose 多服务部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  openmaic:
    image: openmaic:latest
    container_name: openmaic
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    networks:
      - app-network

  openclaw:
    image: openclaw:latest
    container_name: openclaw
    ports:
      - "3001:3001"
    environment:
      - OPENMAIC_URL=http://openmaic:3000
    volumes:
      - ~/.openclaw:/root/.openclaw
    depends_on:
      - openmaic
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

#### 方式 3：反向代理统一入口

```nginx
# nginx.conf
upstream openmaic {
    server 127.0.0.1:3000;
}

upstream openclaw {
    server 127.0.0.1:3001;
}

server {
    listen 443 ssl;
    server_name openmaic.example.com;

    # OpenMAIC 主应用
    location / {
        proxy_pass http://openmaic;
    }

    # OpenClaw API
    location /openclaw/ {
        proxy_pass http://openclaw/;
    }
}
```

### 8.4 资源需求估算

| 规模 | CPU | 内存 | 说明 |
|------|-----|------|------|
| 开发测试 | 4 核 | 8GB | 两个服务各 2 核/4GB |
| 小型生产 | 8 核 | 16GB | OpenMAIC 4核/8GB, OpenClaw 4核/8GB |
| 中型生产 | 16 核 | 32GB | 可考虑分离部署 |

### 8.5 注意事项

1. **API Key 共享**：两个服务需要各自配置 API Key
   - OpenMAIC: `.env.local` 或 `server-providers.yml`
   - OpenClaw: `~/.openclaw/openclaw.json`

2. **网络通信**：确保 OpenClaw 可以访问 OpenMAIC 的 API
   - 本地部署：`http://localhost:3000`
   - Docker 部署：使用容器网络名称 `http://openmaic:3000`

3. **健康检查**：两个服务独立健康检查
   - OpenMAIC: `GET /api/health`
   - OpenClaw: 参考其文档

4. **日志分离**：建议分别配置日志目录
   ```bash
   # OpenMAIC 日志
   /var/log/openmaic/
   
   # OpenClaw 日志
   /var/log/openclaw/
   ```

### 8.6 托管模式（无需本地部署 OpenMAIC）

如果使用 OpenClaw 的托管模式，只需部署 OpenClaw：

```jsonc
// ~/.openclaw/openclaw.json
{
  "skills": {
    "entries": {
      "openmaic": {
        "enabled": true,
        "config": {
          "accessCode": "sk-xxx"  // 从 open.maic.chat 获取
        }
      }
    }
  }
}
```

此模式下 OpenClaw 直接调用云端 OpenMAIC 服务，无需本地部署。

---

*本文档最后更新: 2026-03-21*
*适用于 OpenMAIC v0.1.0*
