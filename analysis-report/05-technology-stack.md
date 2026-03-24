# Technology Stack Analysis

## Executive Summary

OpenMAIC is built on a modern, full-stack TypeScript architecture leveraging the latest web technologies. The project uses **Next.js 16.1.2** with **React 19.2.3** as the foundation, combined with advanced AI/ML frameworks including **Vercel AI SDK**, **LangChain**, and **LangGraph** for multi-agent orchestration. The technology stack emphasizes type safety, developer experience, and cutting-edge AI capabilities while maintaining a performant, scalable architecture.

---

## 1. Programming Languages

### TypeScript (Primary Language)

**Version:** 5.x (ES2017 target)

OpenMAIC is written entirely in TypeScript, providing strong type safety and excellent developer experience.

**Compiler Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "incremental": true
  }
}
```

**Key TypeScript Features Used:**
- **Strict mode** enabled for maximum type safety
- **Path aliases** (`@/*`) for clean imports
- **Incremental compilation** for faster builds
- **ES2017 target** for modern JavaScript features
- **React JSX transform** for React 19 compatibility

### JavaScript Usage

JavaScript is used primarily in:
- Configuration files (PostCSS, Rollup, ESLint)
- Package scripts and build tooling
- Legacy dependencies that don't provide TypeScript definitions

**Node.js Requirement:** `>=20.9.0`

---

## 2. Frontend Stack

### Core Framework

#### Next.js 16.1.2
- **Architecture:** App Router (modern Next.js routing)
- **Rendering:** Server-Side Rendering (SSR) + Client Components
- **API Routes:** Built-in API endpoints for backend functionality
- **Configuration:** TypeScript-based (`next.config.ts`)

**Key Next.js Features:**
```typescript
const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  transpilePackages: ['mathml2omml', 'pptxgenjs'],
  serverExternalPackages: [],
  experimental: {
    proxyClientMaxBodySize: '200mb',
  },
};
```

#### React 19.2.3
- Latest React version with enhanced concurrent features
- Server Components support
- ImprovedSuspense and streaming capabilities

**Related Dependencies:**
- `react-dom`: 19.2.3
- `@types/react`: ^19
- `@types/react-dom`: ^19

### UI Component Libraries

#### Shadcn/ui + Radix UI
**Radix UI Components:**
```json
{
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-slider": "^1.3.6",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-use-controllable-state": "^1.2.2",
  "radix-ui": "^1.4.3"
}
```

**Base UI:**
- `@base-ui/react`: ^1.1.0 (Headless component primitives)

**Shadcn:**
- `shadcn`: ^3.6.3 (UI component system)
- `cmdk`: ^1.1.1 (Command menu component)
- `sonner`: ^2.0.7 (Toast notifications)

### Styling & Design

#### Tailwind CSS 4
**Version:** ^4 (latest major version)

**Configuration:**
```javascript
// postcss.config.mjs
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Styling Utilities:**
- `tailwind-merge`: ^3.4.0 (Merge Tailwind classes)
- `clsx`: ^2.1.1 (Conditional className utility)
- `class-variance-authority`: ^0.7.1 (Component variants)
- `tw-animate-css`: ^1.4.0 (Animation extensions)

#### Typography & Fonts
- `geist`: ^1.7.0 (Geist font family)
- `@fontsource-variable/inter`: ^5.2.8 (Inter variable font)

### Animations & Visual Effects

#### Motion (Framer Motion successor)
```json
{
  "motion": "^12.27.5"
}
```

**Additional Animation Libraries:**
- `animate.css`: ^4.1.1 (CSS animation library)
- `embla-carousel-react`: ^8.6.0 (Carousel component)

### Icons
- `lucide-react`: ^0.562.0 (Icon library with 1000+ icons)

### Data Visualization

#### Flow Diagrams
- `@xyflow/react`: ^12.10.0 (React Flow for diagram visualization)

#### Charts
- `echarts`: ^6.0.0 (Charting library for data visualization)

### Rich Text Editing

#### ProseMirror Suite
```json
{
  "prosemirror-commands": "^1.7.1",
  "prosemirror-dropcursor": "^1.8.2",
  "prosemirror-gapcursor": "^1.4.0",
  "prosemirror-history": "^1.5.0",
  "prosemirror-inputrules": "^1.5.1",
  "prosemirror-keymap": "^1.2.3",
  "prosemirror-model": "^1.25.4",
  "prosemirror-schema-basic": "^1.2.4",
  "prosemirror-schema-list": "^1.5.1",
  "prosemirror-state": "^1.4.4",
  "prosemirror-view": "^1.41.5"
}
```

**Purpose:** Rich text editor for slide content and document editing

### Code Syntax Highlighting
- `shiki`: ^3.21.0 (Syntax highlighter)
- `tokenlens`: ^1.3.1 (Token visualization)

### Mathematical Rendering
- `katex`: ^0.16.33 (LaTeX math rendering)
- `temml`: ^0.13.1 (Math rendering alternative)
- `mathml2omml`: workspace:* (MathML to OMML converter for PowerPoint)

---

## 3. Backend Stack

### Runtime Environment
- **Node.js:** >=20.9.0 (required)
- **Production:** Node.js 22 Alpine (Docker)

### API Framework
- **Next.js API Routes:** Serverless API endpoints
- **Route Handlers:** TypeScript-based route handlers

**API Route Examples:**
```
app/api/
├── chat/route.ts
├── generate/scene-content/route.ts
├── parse-pdf/route.ts
├── transcription/route.ts
├── web-search/route.ts
└── pbl/chat/route.ts
```

### HTTP Client
- `undici`: ^7.22.0 (High-performance HTTP client)

---

## 4. AI/ML Frameworks

### Vercel AI SDK

**Core SDK:**
```json
{
  "ai": "^6.0.42",
  "@ai-sdk/react": "^3.0.44"
}
```

**Provider SDKs:**
```json
{
  "@ai-sdk/anthropic": "^3.0.23",
  "@ai-sdk/google": "^3.0.13",
  "@ai-sdk/openai": "^3.0.13"
}
```

**Purpose:** Unified interface for LLM providers with streaming support

### LangChain & LangGraph

**Core:**
```json
{
  "@langchain/core": "^1.1.16",
  "@langchain/langgraph": "^1.1.1"
}
```

**Usage:**
- **Multi-agent orchestration** via LangGraph StateGraph
- **Agent coordination** with director pattern
- **State management** for multi-turn conversations

**Implementation:** `lib/orchestration/director-graph.ts`
```typescript
import { Annotation, StateGraph, START, END } from '@langchain/langgraph';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
```

### Model Context Protocol (MCP)
```json
{
  "@modelcontextprotocol/sdk": "^1.27.1"
}
```

**Purpose:** Tool calling and agent capabilities for PBL (Project-Based Learning)

### OpenAI SDK
```json
{
  "openai": "^4.104.0"
}
```

**Usage:** Direct OpenAI API access for specific features

### AI Service Integration
- `@copilotkit/backend`: ^0.37.0
- `@copilotkit/runtime`: ^1.51.2
- `copilotkit`: ^0.0.58

---

## 5. State Management

### Client-Side State

#### Zustand
```json
{
  "zustand": "^5.0.10"
}
```

**State Stores:**
- `useCanvasStore` - Canvas editor state
- `useStageStore` - Stage/course management
- `useSnapshotStore` - Undo/redo history
- `useKeyboardStore` - Keyboard shortcuts
- `useSettingsStore` - User settings
- `useMediaGenerationStore` - Media generation queue

**Example:**
```typescript
import { create } from 'zustand';

export const useCanvasStore = create<CanvasState>((set) => ({
  selectedElements: [],
  zoom: 1,
  // ... state and actions
}));
```

### Local Data Persistence

#### Dexie (IndexedDB Wrapper)
```json
{
  "dexie": "^4.2.1"
}
```

**Database Schema:** `lib/utils/database.ts`

**Tables:**
- `stages` - Course information
- `scenes` - Slide/page data
- `audioFiles` - TTS audio blobs
- `imageFiles` - User-uploaded images
- `chatSessions` - Chat history
- `playbackState` - Playback position
- `stageOutlines` - Generated outlines
- `mediaFiles` - AI-generated media
- `generatedAgents` - AI agent profiles

**Database Version:** 8 (with migration support)

### State Utilities
- `immer`: ^11.1.3 (Immutable updates)
- `nanoid`: ^5.1.6 (Unique ID generation)

---

## 6. Media Processing

### Canvas Rendering
```json
{
  "@napi-rs/canvas": "^0.1.88"
}
```

**Purpose:** Native canvas implementation for server-side image generation

**Platform Support:** Multi-platform (Linux, macOS, Windows, Android ARM)

**Docker Dependencies:**
```dockerfile
RUN apk add --no-cache python3 build-base g++ cairo-dev pango-dev \
    jpeg-dev giflib-dev librsvg-dev
```

### Image Processing
```json
{
  "sharp": "^0.34.5"
}
```

**Purpose:** High-performance image processing (resize, format conversion, optimization)

**Features:**
- Image resizing and thumbnail generation
- Format conversion (PNG, JPEG, WebP)
- Color space manipulation

### PDF Processing
```json
{
  "unpdf": "^1.4.0"
}
```

**Purpose:** Built-in PDF parser with text and image extraction

**Alternative Provider:** MinerU (commercial OCR service)

**API Route:** `app/api/parse-pdf/route.ts`

### Document Export

#### PowerPoint Generation
```json
{
  "pptxgenjs": "workspace:*",
  "pptxtojson": "^1.11.0"
}
```

**Custom Fork:** Modified version in `packages/pptxgenjs/`

**Features:**
- Create PowerPoint presentations programmatically
- Export slides with elements, images, and formatting
- Support for charts, tables, and media

#### HTML Export
- `jszip`: ^3.10.1 (ZIP file creation)
- `file-saver`: ^2.0.5 (File download utility)

### Math & Formula Conversion
- `mathml2omml`: workspace:* (MathML to Office MathML)

**Custom Package:** `packages/mathml2omml/`

### SVG Processing
```json
{
  "svg-arc-to-cubic-bezier": "^3.2.0",
  "svg-pathdata": "^8.0.0"
}
```

**Purpose:** SVG path manipulation and conversion

---

## 7. Build & Development Tools

### Package Manager
```json
{
  "packageManager": "pnpm@10.28.0+sha512.05df71d1421f21399e053fde567cea34d446fa02c76571441bfc1c7956e98e363088982d940465fd34480d4d90a0668bc12362f8aa88000a64e83d0b0e47be48"
}
```

**Features:**
- Workspace support (monorepo)
- Efficient dependency management
- Fast installation times

### Build Tools

#### Rollup (for packages)
```json
{
  "rollup": "^4.35.0",
  "@rollup/plugin-commonjs": "^28.0.1",
  "@rollup/plugin-node-resolve": "^16.0.1",
  "rollup-plugin-typescript2": "^0.36.0"
}
```

**Usage:** Build `mathml2omml` and `pptxgenjs` packages

#### TypeScript Compiler
```json
{
  "typescript": "^5",
  "tslib": "^2.8.0"
}
```

### Code Quality

#### ESLint
```json
{
  "eslint": "^9",
  "eslint-config-next": "16.1.2"
}
```

**Configuration:** `eslint.config.mjs` (Flat config format)

#### Prettier
```json
{
  "prettier": "3.8.1"
}
```

**Scripts:**
- `pnpm check` - Check formatting
- `pnpm format` - Format code

### Docker Multi-Stage Build

**Dockerfile Analysis:**

```dockerfile
# Stage 1: Base
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Stage 2: Dependencies
FROM base AS deps
# Native build tools for sharp, @napi-rs/canvas
RUN apk add --no-cache python3 build-base g++ cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

# Stage 3: Builder
FROM base AS builder
RUN pnpm build

# Stage 4: Runner
FROM node:22-alpine AS runner
# Runtime dependencies only
RUN apk add --no-cache libc6-compat cairo pango jpeg giflib librsvg
```

**Benefits:**
- Smaller final image size
- Separation of build and runtime dependencies
- Optimized for production deployment

---

## 8. Additional Key Dependencies

### Data Validation
```json
{
  "zod": "^4.3.5"
}
```

**Purpose:** Schema validation and type-safe parsing

### JSON Processing
```json
{
  "jsonrepair": "^3.13.2",
  "js-yaml": "^4.1.1",
  "partial-json": "^0.1.7"
}
```

**Purpose:** JSON repair for LLM outputs, YAML parsing, streaming JSON

### Utilities
```json
{
  "lodash": "^4.17.21",
  "mitt": "^3.0.1",
  "tinycolor2": "^1.6.0"
}
```

**Purpose:** Utility functions, event emitter, color manipulation

### Stream Processing
```json
{
  "streamdown": "^2.1.0",
  "use-stick-to-bottom": "^1.1.1"
}
```

**Purpose:** Markdown streaming, auto-scroll for chat

### Theming
```json
{
  "next-themes": "^0.4.6"
}
```

**Purpose:** Dark/light mode support

---

## 9. Tech Stack Diagram

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[React 19.2.3]
        B[Next.js 16.1.2 App Router]
        C[Tailwind CSS 4]
        D[Shadcn/ui + Radix UI]
        E[Lucide React Icons]
        F[Motion Animations]
    end

    subgraph "State Management"
        G[Zustand]
        H[Dexie IndexedDB]
        I[React Context]
    end

    subgraph "AI/ML Layer"
        J[Vercel AI SDK 6.0]
        K[LangGraph 1.1]
        L[LangChain Core]
        M[MCP SDK]
        N[OpenAI SDK]
    end

    subgraph "Media Processing"
        O[@napi-rs/canvas]
        P[Sharp]
        Q[unpdf]
        R[PptxGenJS]
    end

    subgraph "Rich Text & Math"
        S[ProseMirror]
        T[KaTeX + Temml]
        U[MathML2OMML]
    end

    subgraph "Build & Dev Tools"
        V[TypeScript 5]
        W[pnpm 10.28]
        X[Rollup]
        Y[ESLint + Prettier]
        Z[Docker Multi-Stage]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    D --> F

    B --> G
    G --> H
    G --> I

    B --> J
    J --> K
    K --> L
    J --> M
    J --> N

    B --> O
    O --> P
    B --> Q
    B --> R

    B --> S
    S --> T
    R --> U

    V --> W
    W --> X
    V --> Y
    W --> Z

    style A fill:#61DAFB,stroke:#217BBC,color:#fff
    style B fill:#000000,stroke:#fff,color:#fff
    style J fill:#0070F3,stroke:#0051CC,color:#fff
    style K fill:#7C3AED,stroke:#5B21B6,color:#fff
    style V fill:#3178C6,stroke:#235A9E,color:#fff
```

---

## 10. Dependency Analysis

### Core Dependencies Table

| Category | Dependency | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | next | 16.1.2 | React framework with App Router |
| **Framework** | react | 19.2.3 | UI library |
| **Language** | typescript | ^5 | Type-safe JavaScript |
| **Styling** | tailwindcss | ^4 | Utility-first CSS |
| **UI Components** | @radix-ui/* | ^1.x | Headless UI primitives |
| **UI System** | shadcn | ^3.6.3 | Component system |
| **State** | zustand | ^5.0.10 | Client state management |
| **Database** | dexie | ^4.2.1 | IndexedDB wrapper |
| **AI SDK** | ai | ^6.0.42 | Vercel AI SDK |
| **AI SDK** | @ai-sdk/react | ^3.0.44 | React integration for AI SDK |
| **AI SDK** | @langchain/langgraph | ^1.1.1 | Multi-agent orchestration |
| **MCP** | @modelcontextprotocol/sdk | ^1.27.1 | Model Context Protocol |
| **Canvas** | @napi-rs/canvas | ^0.1.88 | Native canvas rendering |
| **Images** | sharp | ^0.34.5 | Image processing |
| **PDF** | unpdf | ^1.4.0 | PDF parsing |
| **Export** | pptxgenjs | workspace:* | PowerPoint generation |
| **Rich Text** | prosemirror-* | ^1.x | Rich text editor |
| **Math** | katex | ^0.16.33 | LaTeX rendering |
| **Icons** | lucide-react | ^0.562.0 | Icon library |
| **Animations** | motion | ^12.27.5 | Animation library |
| **Validation** | zod | ^4.3.5 | Schema validation |

### Version Constraints

**Exact Versions (Production Reliability):**
- `next`: 16.1.2 (exact)
- `react`: 19.2.3 (exact)
- `react-dom`: 19.2.3 (exact)

**Caret Ranges (Backward Compatible):**
- Most dependencies use `^` (caret) for minor/patch updates
- Example: `^5.0.10` allows 5.x.x but not 6.0.0

**Workspace Dependencies:**
- `mathml2omml`: workspace:* (local package)
- `pptxgenjs`: workspace:* (local package)

### Dependency Health

**Total Dependencies:** ~96 production dependencies
**Dev Dependencies:** ~20 development dependencies

**Well-Maintained Libraries:**
- All major dependencies are actively maintained
- Regular updates with security patches
- Strong community support

**Native Dependencies:**
- `@napi-rs/canvas`: Requires native compilation
- `sharp`: Requires native compilation
- Docker image includes necessary build tools

---

## 11. Technology Stack Highlights

### Modern & Future-Ready
- **React 19**: Latest React with concurrent features
- **Next.js 16**: Cutting-edge with App Router
- **TypeScript 5**: Latest language features
- **Tailwind CSS 4**: Newest major version

### AI-Native Architecture
- **Multi-Agent Orchestration**: LangGraph for complex agent workflows
- **Streaming Responses**: First-class streaming support via AI SDK
- **MCP Support**: Model Context Protocol for extensibility
- **Multi-Provider**: Support for OpenAI, Anthropic, Google, and more

### Performance Optimized
- **Server-Side Rendering**: Next.js SSR for fast initial loads
- **Client-Side State**: Zustand for efficient re-renders
- **IndexedDB**: Local data persistence without server calls
- **Image Optimization**: Sharp for efficient image processing

### Developer Experience
- **Type Safety**: End-to-end TypeScript
- **Hot Reload**: Fast refresh during development
- **Linting**: ESLint + Prettier for code quality
- **Workspace**: Monorepo setup for shared packages

### Production Ready
- **Docker Support**: Multi-stage builds for small images
- **Environment Agnostic**: Works on Vercel, self-hosted, or local
- **Error Handling**: JSON repair for LLM outputs
- **Migration Support**: Database versioning with migrations

---

## 12. Technology Choices Rationale

### Why Next.js?
- **Full-stack framework**: Frontend and backend in one codebase
- **App Router**: Modern routing with React Server Components
- **API Routes**: Built-in backend without separate server
- **Deployment**: Easy deployment to Vercel or self-hosted

### Why Zustand over Redux?
- **Simpler API**: Less boilerplate
- **Better TypeScript**: Improved type inference
- **Smaller Bundle**: Minimal overhead
- **Flexible**: Can be combined with React Context

### Why Dexie over LocalStorage?
- **Structured Data**: Relational-like queries
- **Large Storage**: Much larger capacity than localStorage
- **Async Operations**: Non-blocking I/O
- **Indexes**: Fast lookups on indexed fields

### Why LangGraph?
- **Multi-Agent**: Built for agent orchestration
- **State Management**: Declarative state transitions
- **Visualization**: Can export graph for debugging
- **Production Ready**: Battle-tested by LangChain

### Why ProseMirror?
- **Rich Editing**: Most powerful rich text editor framework
- **Schema-Based**: Type-safe document structure
- **Extensible**: Custom nodes and marks
- **Collaboration**: Ready for real-time collaboration

---

## Conclusion

OpenMAIC represents a modern, AI-native web application built with cutting-edge technologies. The technology stack prioritizes developer experience, type safety, and AI capabilities while maintaining performance and scalability. The use of TypeScript throughout, combined with React 19 and Next.js 16, provides a solid foundation for the complex multi-agent orchestration that powers the platform's interactive classroom experience.

The strategic use of AI frameworks (Vercel AI SDK, LangGraph, MCP) enables sophisticated multi-agent workflows, while the careful selection of UI libraries (Shadcn/ui, Radix UI, Tailwind CSS) ensures a polished, accessible user interface. The media processing stack (@napi-rs/canvas, Sharp, unpdf) provides robust capabilities for handling images, PDFs, and PowerPoint exports.

This technology stack is well-positioned for future growth, with all major dependencies actively maintained and aligned with modern web development best practices.
