# BugThrive Labs

Cybersecurity learning platform — monorepo for the web frontend and the API.

```
bugthrive-labs/
├── frontend/   React 18 + TypeScript + Vite + Tailwind + shadcn/ui — student dashboard (mock data)
├── backend/    Java 21 + Spring Boot 3 + Maven — API skeleton with health endpoint
├── docs/       Project documentation (see docs/phase-1.md)
└── README.md
```

The two apps are independent: each builds and runs on its own, and the frontend does **not**
call the backend yet.

## Prerequisites

- **Node.js 18+** (tested with 20.11) and npm
- **JDK 21** — `JAVA_HOME` must point to it (Maven itself is bundled as `mvnw`)
- **PostgreSQL** or **Docker** — only needed to *run* the backend; its tests use in-memory H2

## Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Structure:

```
src/
├── components/
│   ├── ui/          shadcn/ui primitives (button, card, badge, input, progress, avatar, dropdown-menu)
│   ├── layout/      AppLayout, Topbar, Sidebar, SearchBox, NotificationsMenu, ProfileMenu, Logo
│   ├── dashboard/   StatCard, CourseCard, ContinueLearningCard, LearningPathCard, ProgressOverview, ...
│   ├── course/      TierBadge, FavouriteButton
│   └── common/      PageHeader, SegmentedControl, EmptyState
├── data/            mock courses (modules/sections/questions), paths, exams, badges, categories
├── lib/             cn() helper, search matching, learning-state (saved courses + solved questions)
├── pages/           Dashboard, BrowseLabs, LearningPaths, LearningPathDetail, MyLearning,
│                    CourseDetail, Section, Achievements, Certificates, Placeholder, NotFound
└── types/
```

Add more shadcn components with `npx shadcn@2.3.0 add <component>` (the project uses Tailwind v3).

## Backend

```bash
cd backend
docker compose up -d                 # local PostgreSQL (optional if you have your own)
./mvnw spring-boot:run               # Windows: mvnw.cmd spring-boot:run  → http://localhost:8080
curl http://localhost:8080/api/v1/health
./mvnw clean verify                  # build + tests
```

Full details — profiles, environment variables, response format — in [backend/README.md](backend/README.md).

## Phase 1 scope

See [docs/phase-1.md](docs/phase-1.md) for what's included, what's deferred, and the branding tokens.
