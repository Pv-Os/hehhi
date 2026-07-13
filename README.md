# hehhi

**Visual portfolios for software engineers.**

hehhi transforms GitHub repositories, schemas, APIs, and live applications into interactive portfolios that help hiring managers and collaborators understand what developers have built — without cloning repositories or reading through code.

Every portfolio includes:

* Visual project cards generated from developer assets
* Interactive database schema and API explorers
* Sandboxed live terminal sessions for runnable projects
* An AI-powered "Ask Me Anything" widget grounded in the developer's own work
* Hosted portfolio pages with optional custom domains

## Why hehhi?

GitHub is excellent for source control but poor at showcasing engineering impact.

hehhi bridges that gap by helping developers answer questions like:

* What does this project actually do?
* Why was this architecture chosen?
* How does this system scale?
* Can I try it without setting it up locally?

Our goal is to make backend, infrastructure, and systems work as tangible and interactive as a designer's portfolio.

---

## Core Features

### Project Cards

Paste a GitHub repository, schema link, API specification, or live application URL to generate a rich project showcase.

Project cards include:

* Repository metadata
* Tech stack detection
* Language breakdown
* README rendering
* Key file summaries
* Last updated information

### Schema Visualization

Convert supported database schemas into interactive ERDs.

Supported formats:

* dbdiagram.io links
* Raw SQL schema files

### API Explorer

Render OpenAPI and Swagger specifications into interactive endpoint documentation.

### Live Terminal

Run supported projects directly in the browser using secure, ephemeral containers.

Key constraints:

* No internet egress
* Session TTL: 15 minutes
* Resource-limited execution
* No persistent storage

### Ask Me Anything (AMA)

Every portfolio includes an AI-powered Q&A experience.

Visitors can ask questions such as:

* "How does authentication work?"
* "What database did you use and why?"
* "What would you improve in this architecture?"

Responses are generated exclusively from developer-provided context, including:

* README files
* Project annotations
* Developer bios
* Manual Q&A entries
* Portfolio descriptions

If sufficient context is unavailable, the assistant explicitly says so instead of guessing.

### Custom Domains

Developers can publish portfolios at:

```text
username.hehhi.me
```

or connect their own domain using CNAME records.

---

## Architecture Overview

```text
GitHub OAuth
      ↓
Repository Import
      ↓
Content Extraction
      ↓
Portfolio Generation
      ↓
Content Indexing
      ↓
Vector Store
      ↓
AMA Retrieval
      ↓
LLM Response Streaming
```

### High-Level Components

* Web application
* API service
* Background workers
* Vector database
* Sandbox execution environment
* CDN-backed static hosting

---

## Monorepo Structure

```text
apps/
├── web/          # Frontend application
├── api/          # Backend API

packages/
├── types/        # Shared TypeScript types
├── ui/           # Shared UI components
├── config/       # Shared configuration
```

> The exact structure may evolve as the platform matures.

---

## Technology Stack

### Frontend

* TypeScript
* React
* Next.js
* Tailwind CSS

### Backend

* Fastify
* TypeScript
* Octokit

### AI

* Anthropic Claude
* Retrieval-Augmented Generation (RAG)

### Infrastructure

* Container sandbox provider
* Vector database
* CDN
* Object storage

---

## Getting Started

### Prerequisites

* Node.js 20+
* pnpm 9+
* GitHub OAuth application
* Anthropic API key

### Installation

Clone the repository:

```bash
git clone https://github.com/<org>/hehhi.git
cd hehhi
```

Install dependencies:

```bash
pnpm install
```

Create environment files:

```bash
cp .env.example .env
```

Start the development environment:

```bash
pnpm dev
```

---

## Environment Variables

Example:

```env
NODE_ENV=development

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

ANTHROPIC_API_KEY=

DATABASE_URL=

VECTOR_DB_URL=

SESSION_SECRET=

APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

See `.env.example` for the complete list.

---

## Available Scripts

### Run development servers

```bash
pnpm dev
```

### Build all packages

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

### Run linting

```bash
pnpm lint
```

### Format code

```bash
pnpm format
```

---

## AMA Design Principles

The AMA experience follows three rules:

1. Answer only from developer-provided content.
2. Never speculate or invent information.
3. Clearly indicate when sufficient context is unavailable.

Example fallback response:

> I don't have enough information in this portfolio to answer that accurately.

---

## Security

### Sandbox Execution

All live terminal sessions are:

* Ephemeral
* Isolated
* Network-restricted
* Resource-limited

### Data Privacy

* AMA conversations are developer-owned data
* Conversation logs can be deleted on request
* Visitor authentication is not required
* Sensitive repository data is never indexed without explicit developer consent

---

## Roadmap

### Phase 1 — Private Beta

* GitHub OAuth
* Repository import
* Project cards
* Portfolio hosting
* Basic AMA

### Phase 2 — Public Beta

* Live terminal sessions
* Custom domains
* Visitor analytics
* Vector retrieval
* AMA question logs

### Phase 3 — General Availability

* Billing and pricing
* API explorer
* AMA escalation workflows
* Performance hardening

---

## Contributing

We welcome contributions.

Please read:

* `CONTRIBUTING.md`
* `CODE_OF_CONDUCT.md`

Before submitting a pull request:

1. Create a feature branch.
2. Run tests locally.
3. Ensure linting passes.
4. Update documentation when necessary.

---

## License

This project is licensed under the MIT License unless otherwise specified.

See `LICENSE` for details.
