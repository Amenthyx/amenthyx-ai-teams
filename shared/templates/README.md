# Strategy Templates

Pre-built, fully-filled strategy files for common project types. Copy one and customize it for your project.

## Usage

```bash
cp shared/templates/STRATEGY_SAAS_MVP.md my-strategy.md
# Edit to customize, then activate:
# --team fullStack --strategy my-strategy.md
```

## Available Templates

| Template | Project Type | Stack | Timeline | Complexity |
|----------|-------------|-------|----------|------------|
| `STRATEGY_SAAS_MVP.md` | SaaS web application | Next.js 14, PostgreSQL, Redis, Vercel | 4 weeks | Medium |
| `STRATEGY_MOBILE_APP.md` | Cross-platform mobile app | Flutter 3.x, Firebase, Dart | 6 weeks | Medium |
| `STRATEGY_API_BACKEND.md` | REST/GraphQL API backend | Go, PostgreSQL, Redis, Docker, K8s | 8 weeks | Large |
| `STRATEGY_DATA_PIPELINE.md` | Real-time data pipeline | Python, Kafka, Spark, ClickHouse | 6 weeks | Large |
| `STRATEGY_LANDING_PAGE.md` | Marketing landing page | Astro, Tailwind, Sanity CMS, Vercel | 2 weeks | Small |

## Recommended Teams Per Template

| Template | Primary Team | Alternative Teams |
|----------|-------------|-------------------|
| SaaS MVP | `--team fullStack` | `--team react`, `--team nodejs` |
| Mobile App | `--team flutter` | `--team reactNative`, `--team swiftIOS` |
| API Backend | `--team goCloud` | `--team nodejs`, `--team javaSpring`, `--team rust` |
| Data Pipeline | `--team dataEng` | `--team pythonData`, `--team scalaSpark` |
| Landing Page | `--team react` | `--team vueFrontend`, `--team fullStack` |

## Creating Your Own Template

1. Copy `STRATEGY_TEMPLATE.md` from the project root
2. Fill out ALL sections with specific, concrete values
3. Run `python shared/strategy_validator.py your-template.md` to validate
4. Place in `shared/templates/` and update this README
