# Blockchain & Web3 Team — Tailored Strategy v3.1

> Pre-configured for **smart contracts, DeFi protocols, and blockchain dApps**.
> Fill in sections marked **[FILL IN]** with your project specifics. Everything else is ready.
> Activate: `--team web3 --strategy path/to/this-file.md`

---

## 1. Project Identity

**Project Name**: [FILL IN]

**One-Line Vision**: [FILL IN]

**Problem Statement**: [FILL IN]

**Desired Outcome**: [FILL IN]

**Project Type**: [FILL IN — Greenfield / Extending existing codebase / Migration / Rewrite / Prototype / MVP / Production]

**Repository**: [FILL IN — GitHub URL or desired repo name]

---

## 2. Target Audience

**Primary Users**: [FILL IN — e.g., DeFi users, NFT collectors, DAO members, crypto traders]

**Secondary Users**: [FILL IN — e.g., protocol governance participants, liquidity providers, developers]

**User Personas**:

| Persona | Role | Pain Points | Goals | Tech Savvy |
|---------|------|-------------|-------|------------|
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Anti-Users**: [FILL IN]

---

## 3. Core Features (Prioritized)

### P0 — Must-Have (Launch Blockers)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P1 — Should-Have (Important but not blocking)
| # | Feature | Description | Acceptance Criteria | Estimated Complexity |
|---|---------|-------------|--------------------|--------------------|
| 1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| 2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

### P2 — Nice-to-Have (If time permits)
| # | Feature | Description |
|---|---------|-------------|
| 1 | [FILL IN] | [FILL IN] |

---

## 4. Technical Constraints

**Required Tech Stack**:
- **Language**: Solidity 0.8+ / TypeScript / Rust (Solana programs)
- **Framework**: Hardhat / Foundry / Anchor (Solana) / ethers.js v6 / wagmi / viem
- **Database**: IPFS (decentralized storage) / The Graph (subgraph indexing) / PostgreSQL (off-chain indexer)
- **Cache**: Redis (RPC response caching, session management)
- **Message Queue**: N/A (blockchain events serve as the message layer)

**Hosting/Infrastructure**:
- **Cloud Provider**: Vercel / AWS / self-hosted (frontend) + blockchain nodes (Alchemy / Infura / QuickNode)
- **Deployment**: Ethereum Mainnet / L2 (Arbitrum, Optimism, Base) / Solana / Testnet first
- **CDN**: Vercel Edge / CloudFront / Cloudflare (frontend)
- **Domain**: [FILL IN or "TBD"]

**Integrations**:

| Service | Purpose | Auth Method | Rate Limits |
|---------|---------|-------------|-------------|
| Alchemy / Infura / QuickNode | RPC provider (blockchain access) | API key | Per plan |
| The Graph | Subgraph indexing (on-chain data queries) | API key | Per plan |
| IPFS (Pinata / Web3.Storage) | Decentralized file storage | API key | Per plan |
| Wallet SDKs (WalletConnect / RainbowKit) | User wallet connection | Client-side | N/A |
| Chainlink / Pyth | Oracle data feeds | On-chain | Per network |

**Existing Codebase**: [FILL IN — Path to existing contracts/dApp, or "greenfield"]

**Package Manager**: npm / pnpm (frontend + Hardhat) / forge (Foundry) / anchor (Solana)

**Monorepo or Polyrepo**: Monorepo (contracts/ + frontend/ + subgraph/ + scripts/)

**Linting**:
- `solhint` — Solidity linting and style
- `slither` — Solidity static analysis (vulnerability detection)
- `ESLint` — TypeScript/JavaScript linting
- `prettier` + `prettier-plugin-solidity` — formatting

---

## 5. Non-Functional Requirements

**Performance**:
- Gas optimization: < 100K gas per standard transaction
- RPC response time: < 500ms for read operations
- Frontend load time: < 3 seconds (dApp)
- Subgraph sync time: < 1 hour from deployment to fully indexed

**Security**:
- Authentication: Wallet-based authentication (EIP-4361 Sign-In with Ethereum)
- Authorization: On-chain access control (OpenZeppelin AccessControl / Ownable)
- Smart contract security: Reentrancy guards, overflow protection (Solidity 0.8+), pausable patterns
- Deployment security: Multisig deployment (Gnosis Safe), timelock for upgrades
- Audit: Independent security audit required before mainnet deployment
- Compliance: [FILL IN — FinCEN / MiCA / SEC considerations / none]

**Scalability**:
- Expected launch users: [FILL IN — daily active wallets]
- Expected 6-month users: [FILL IN]
- Expected 1-year users: [FILL IN]
- Scaling strategy: L2 deployment for throughput, subgraph for read scaling, RPC load balancing

**Availability**:
- Uptime target: 99.9% for frontend/subgraph; smart contracts are always available (blockchain uptime)
- Recovery time objective (RTO): < 30 minutes for frontend/subgraph
- Recovery point objective (RPO): N/A for on-chain data (immutable); < 5 minutes for off-chain
- Multi-region: [FILL IN — yes / no / future]

**Accessibility**:
- WCAG AA for dApp frontend
- Screen reader support for wallet interactions
- Internationalization: [FILL IN — languages needed]

**Observability**:
- Logging: Tenderly (transaction tracing and debugging), application logs (structured JSON)
- Metrics: Dune Analytics / custom dashboards (TVL, tx volume, unique users, gas costs)
- Tracing: Block explorer monitoring (Etherscan / Arbiscan), event log indexing
- Alerting: Anomalous transaction alerts, contract pause events, large withdrawal detection

---

## 6. Testing Requirements

**Test Coverage Target**: >= 95% for smart contracts (line + branch); >= 80% for frontend/subgraph code

**Required Test Types**:
- [x] Unit tests — Hardhat / Foundry tests for all contract functions
- [x] Integration tests — multi-contract interaction tests, deployment scripts
- [x] Fuzzing — Echidna / Foundry fuzzing for edge cases and invariants
- [x] Formal verification — symbolic execution for critical paths (Certora / Halmos)
- [x] Fork testing — mainnet fork tests against live state
- [x] Gas profiling — gas reports for all public functions
- [x] Security scanning — slither static analysis (zero HIGH/CRITICAL)
- [x] Frontend tests — React Testing Library / Cypress for dApp flows
- [ ] Formal audit — [FILL IN — engage external auditor before mainnet]

**CI/CD Requirements**:
- [x] GitHub Actions (tested locally with `act` before push)
- [x] Pre-commit hooks (solhint, slither, prettier, ESLint)
- [x] Branch protection (require PR reviews, passing CI)
- [x] Automated test suite on every PR (unit + fuzz + fork tests)
- [x] Gas report diff on every PR
- [x] Manual approval gate for testnet/mainnet deployment

**Testing Tools**: Hardhat, Foundry (forge test + forge fuzz), Echidna, slither, Certora, React Testing Library, act

---

## 7. Timeline & Milestones

**Hard Deadline**: [FILL IN]

**Milestones**:

| # | Milestone | Target Date | Deliverables | Success Criteria |
|---|-----------|-------------|--------------|-----------------|
| M1 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M2 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M3 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |
| M4 | [FILL IN] | [FILL IN] | [FILL IN] | [FILL IN] |

**Budget Constraints**:
- Gas costs (deployment + testing): [FILL IN — ETH/SOL for testnet/mainnet]
- RPC provider: [FILL IN — $/month for Alchemy/Infura/QuickNode]
- Security audit: [FILL IN — $ one-time cost]
- Frontend hosting: [FILL IN — $/month]

---

## 7.1 Cost Approval & Payment Governance

> **MANDATORY** — The Team Leader produces `COST_ESTIMATION.md` BEFORE any execution begins.
> No sub-agents are spawned, no PM decisions are made, until the user explicitly approves the cost estimate.

**Token Budget Tolerance**: [FILL IN — e.g., "< $5 per run" / "< $20 total" / "$X max"]

**Payment Authorization Rules**:
- **Auto-approve threshold**: $0 — always ask before any payment
- **Requires explicit approval**: All card payments, mainnet gas costs, RPC provider upgrades, security audit fees, domain purchases
- **Forbidden without user present**: Any mainnet deployment, any payment over $50, any recurring subscription, any token/ETH expenditure

**External Service Payments**:

| Service | Expected Cost | Payment Method | Pre-Approved? |
|---------|--------------|----------------|---------------|
| RPC provider (Alchemy/Infura) | [FILL IN] | Card / free tier | No — ask first |
| Mainnet deployment gas | [FILL IN] | Crypto wallet | No — ask first |
| Security audit | [FILL IN] | Card / crypto | No — ask first |
| IPFS pinning (Pinata) | [FILL IN] | Card / free tier | No — ask first |

**Cost Estimation Detail Level**: Detailed per-wave breakdown + gas estimation

**What happens if actual costs exceed estimate?**: Stop and ask

---

## 8. Success Criteria

**Launch Criteria** (ALL must be true before v1.0):
- [ ] All P0 features implemented and tested
- [ ] Smart contract coverage >= 95% (line + branch)
- [ ] Frontend code coverage >= 80%
- [ ] Zero CRITICAL/HIGH findings in slither analysis
- [ ] Security audit passed (external auditor)
- [ ] Testnet deployment verified (all features functional)
- [ ] Multisig configured for contract admin functions
- [ ] Timelock configured for upgradeable contracts
- [ ] Gas optimization targets met (< 100K per standard tx)
- [ ] Subgraph deployed and fully indexed
- [ ] Frontend deployed and accessible
- [ ] Monitoring dashboards live (Tenderly, Dune)
- [ ] Documentation complete (README, contract docs, user guide)
- [ ] CI/CD pipeline tested and working
- [ ] Mainnet deployment succeeds

**KPIs**:
| Metric | Target | How to Measure |
|--------|--------|----------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Definition of Done**: [FILL IN]

---

## 9. Reference & Inspiration

**Competitor/Reference Products**:
| Product | What to Learn | What to Avoid |
|---------|--------------|---------------|
| [FILL IN] | [FILL IN] | [FILL IN] |
| [FILL IN] | [FILL IN] | [FILL IN] |

**Design Inspiration**: [FILL IN — dApp UI references, protocol design patterns]

**Technical References**: [FILL IN — e.g., OpenZeppelin docs, EIP standards, Solidity patterns]

**Internal Documentation**: [FILL IN]

---

## 10. Out of Scope

**Explicitly NOT building** (agents must refuse if asked):
1. [FILL IN]
2. [FILL IN]
3. [FILL IN]

**Deferred to future versions**:
1. [FILL IN]
2. [FILL IN]

---

## 11. Risk & Constraints

**Known Risks**:
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Smart contract vulnerability (reentrancy, overflow, access control) | H | H | Comprehensive test suite (95%+ coverage), fuzzing, slither analysis, formal verification, external audit, bug bounty program |
| Gas price spikes (mainnet deployment/usage becomes expensive) | M | H | L2 deployment strategy, gas optimization, batch operations, off-peak deployment timing |
| Regulatory changes (SEC/MiCA/FinCEN enforcement actions) | M | H | Legal review before launch, jurisdictional awareness, compliance documentation, decentralization roadmap |
| Oracle manipulation (price feed attacks) | M | H | Multiple oracle sources, TWAP pricing, circuit breakers, manipulation detection |

**Hard Constraints** (non-negotiable):
- OpenZeppelin standards for all token/access control implementations
- Security audit completed and passed before any mainnet deployment
- Upgradeable proxy pattern for contracts that may need updates
- Conventional commits enforced on all repositories
- All changes via Pull Request with CI checks passing

**Soft Constraints** (preferred but negotiable):
- [FILL IN]
- [FILL IN]

---

## 11.1 Dynamic Agent Scaling

> The PM may spawn additional agents beyond the default roster if the workload requires it.

**Allow PM to spawn extra agents?**: Yes, with TL approval

**Max concurrent agents**: 15

**Scaling triggers** (PM spawns extra agents when):
- A single smart contract or feature has estimated complexity XL and can be split
- A wave is falling behind its timeline target
- QA finds >= 3 blocking security issues requiring parallel fix agents
- The strategy explicitly requests parallel streams (e.g., contracts + frontend + subgraph)

**Agent types the PM may add**:
- [ ] Additional Solidity Engineers (for complex contract logic)
- [ ] Frontend Engineers (for dApp development)
- [ ] Security Audit Specialist (for internal pre-audit, formal verification)
- [ ] Subgraph/Indexer Specialist (for The Graph integration)
- [ ] Formal Verification Specialist (for Certora/Halmos proofs)
- [ ] Any role from the team roster

**Scaling constraints**:
- Extra agents MUST appear in `COST_ESTIMATION.md` revision (user re-approves if cost increases > 20%)
- Extra agents inherit the same execution protocol, evidence requirements, and atomic commit rules
- PM documents scaling decisions in `.team/SCALING_LOG.md`

---

## 12. Evidence & Proof Requirements

**What proof do you need from the team?**
- [x] Smart contract test results (unit + fuzz + fork tests with coverage report)
- [x] Gas report for all public functions
- [x] Slither static analysis report (zero CRITICAL/HIGH)
- [x] Testnet deployment verification (contract addresses, transaction hashes)
- [x] Multisig configuration proof (signers, threshold)
- [x] Subgraph deployment and query verification
- [x] Frontend deployment and functionality screenshots
- [x] Security audit report (or internal pre-audit results)
- [x] CI/CD pipeline passing (act + remote)
- [x] Monitoring dashboard screenshots (Tenderly, Dune)

**Reporting Frequency**: Every wave completion

**Final Deliverable**: PPTX presentation + PDF report

---

## 12.1 Data Preservation & Uncertainty Policy

> **MANDATORY** — These are absolute rules. No agent may override them.

**Data Preservation (No-Delete Rule)**:

All data produced during execution is permanent. Nothing is ever deleted — files, contract artifacts, deployment records, test results, evidence artifacts, git history. The team uses archive patterns instead of deletion.

- **Archive method for files**: Move to `.team/archive/{date}_{filename}`
- **Archive method for table rows**: Add `status: archived` column
- **Archive method for documents**: Add `[ARCHIVED {date}]` marker
- **Git history protection**: Never rebase/squash published commits (non-negotiable)

**Uncertainty Escalation**:

If any agent is unsure about an action's effect, safety, correctness, or scope, it stops and escalates to the Team Leader. If the TL is also unsure, the TL escalates to you (the user).

- **Escalation threshold**: < 90% confidence — escalate
- **Escalation response time expectation**: [FILL IN — "within minutes" / "hours" / "whenever available"]
- **What counts as "unsure"**: Any action that might deploy to mainnet, spend gas/tokens, introduce contract vulnerabilities, cost money, affect user funds, be irreversible (immutable contracts), or fall outside the stated strategy scope
- **Preferred escalation format**: Detailed context + options

---

## 13. GitHub Auto-Sync Policy

> Every meaningful update (wave completion, agent output, evidence submission) triggers an automatic commit + push.

**Auto-sync frequency**: Every agent completion

**Auto-push enabled?**: Yes

**Branch strategy for auto-sync**:
- Working branch: `team/web3/execution`
- Merge to main: After release sign-off only

**What gets auto-synced**:
- [x] `.team/` planning artifacts (charter, kanban, milestones)
- [x] `.team/evidence/` proof artifacts
- [x] Source code changes (contracts, frontend, subgraph, scripts)
- [x] `.team/COMMIT_LOG.md` updates
- [x] `.team/reports/` PPTX + PDF
- [x] `COST_ESTIMATION.md` and revisions

---

## 14. Additional Context

[FILL IN — Anything else the team should know: target blockchain, token economics, governance model, existing protocol integrations, legal considerations, community strategy, etc.]

---

*Blockchain & Web3 Team Strategy v3.1 — Amenthyx AI Teams*
*Pre-configured for smart contracts, DeFi protocols, and blockchain dApps*
*Cost-First | No-Delete | Ask-When-Unsure | Auto-Synced | Dynamically Scaled | Evidence-Driven*
