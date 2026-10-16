---
title: TIDAS Dependency Maintenance
docType: guide
scope: repo
status: active
authoritative: false
owner: tidas
language: en
whenToUse:
  - when reviewing a dependency proposal or its update-job health
  - when changing dependency discovery configuration
whenToUpdate:
  - when updater coverage, traffic budgets or proposal acceptance changes
checkPaths:
  - .github/dependabot.yml
  - _docs/agents/dependency-maintenance.md
lastReviewedAt: 2026-10-16
lastReviewedCommit: d7295264fb04fcc18a859896988a92c4be7d4cc8
lastReviewedNote: "TIDAS #90: reviewed npm/Actions discovery, existing secretless PR validation and narrow lockfile governance; no dependency or published specification upgrade."
---

## Dependency maintenance

`.github/dependabot.yml` monitors the sole root pnpm graph through the npm
ecosystem and the repository's GitHub Actions references. Routine proposals
target `main` weekly in Asia/Shanghai with a seven-day version cooldown. Runtime
and development-tool patch/minor updates form separate groups, with at most two
open npm version PRs. Actions patch/minor updates form one group with a one-PR
limit. Major updates stay individually visible; no blanket major-version ignore
is configured. Security alerts, update settings and security PR limits are
separate from these version-update traffic budgets.

Discovery grants no merge or deployment authority. Automatic merge stays off.
Before accepting or associating a Dependabot proposal, verify both its native
merge state and any independent review/merge service's effective live policy,
including queued work. A service source change alone does not prove that policy
is deployed. Keep proposals unadopted when live merge authority cannot be
established. Accepted grouped proposals use one owning Issue and the existing
workspace controller's guarded existing-PR intake, review, merge and finish
workflow; agents maintain the tracking and evidence.

The existing `Validate docs` PR workflow runs without private-repository or
production credentials: frozen install, lint, typecheck, full build (including
tests, specification verification and static-output gates), then the vendored
shared SEO checker and retained report. Reuse it for dependency proposals.
Keep exact pnpm/TypeScript pins, Node bounds, build restrictions, release-age
exceptions, integrity hashes and executable Action commit references. An updater
proposal may require a reviewed compatibility or toolchain-contract change; do
not weaken those tests merely to obtain green CI. Dependabot's hosted ability to
regenerate this pnpm 11 lock must be established on the first real candidate,
using the canonical frozen install and existing validation.

A change confined to `pnpm-lock.yaml` still needs that validation, but does not
automatically require edits or review stamps in five runtime documents. Its
narrow Docpact rule requires the validation guide to exist. Changes to the
manifest, source, runtime pins, publication configuration, generated checker,
specification pin or public specification assets retain their semantic rules.
Update explanatory contracts whenever behavior changes, including behavior
discovered while reviewing a lockfile-only proposal.

During the normal weekly queue review, inspect the latest hosted updater result
and exact candidate CI. Record scan/lockfile failures and accepted work in the
owning Issue; an absent PR alone does not prove a successful scan. Security
triage follows its urgency. No new recurring reminder or unrelated development
step is required. Pin eligible merged child commits through normal workspace
integration; source integration does not authorize site publication.

See the [workspace policy](https://github.com/tiangong-lca/workspace/blob/main/_docs/workspace-dependency-update-policy.md)
and [repository validation guide](./repo-validation.md).
