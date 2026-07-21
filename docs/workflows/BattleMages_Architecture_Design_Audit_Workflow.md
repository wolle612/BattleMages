# BattleMages -- Architecture & Design Audit Workflow

**Purpose:**\
This workflow defines how Claude should perform a comprehensive review
of the BattleMages project before major development phases. The goal is
to identify the highest-impact improvements while respecting the
project's design philosophy and technical architecture.

------------------------------------------------------------------------

# General Rules

Before starting:

-   Read the complete project.
-   Read all relevant documentation.
-   Read `CLAUDE.md`.
-   Do **not** modify files.
-   Do **not** implement solutions.
-   Do **not** rewrite documentation.
-   Do **not** make assumptions when information is missing.
-   Ask questions if fundamental contradictions are discovered.
-   Be constructive, honest and critical.

Your role is simultaneously:

-   Lead Game Designer
-   Software Architect
-   Technical Director
-   UX Designer
-   Reviewer

Think like someone preparing a commercial indie game for its next major
production phase.

------------------------------------------------------------------------

# Audit Process

For every section:

1.  Analyse the current state.
2.  Identify strengths.
3.  Identify weaknesses.
4.  Identify risks.
5.  Suggest improvements.
6.  Do **not** implement anything.

------------------------------------------------------------------------

# 1. Architecture Review

Evaluate:

-   Project structure
-   Module responsibilities
-   Data flow
-   Separation of concerns
-   Maintainability
-   Scalability
-   Technical debt
-   Duplicate logic
-   Hardcoded systems
-   Future risks

------------------------------------------------------------------------

# 2. Gameplay & Game Design Review

Evaluate:

-   Core Design Philosophy
-   Combat Identity
-   Build Archetypes
-   Spell Roles
-   Rotation Design
-   Decision Quality
-   Build Diversity
-   Synergies
-   Complexity
-   Readability

Evaluate systems, **not numbers**.

------------------------------------------------------------------------

# 3. UI / UX Review

Evaluate:

-   Information hierarchy
-   Combat readability
-   Tooltips
-   Combat feedback
-   Player guidance
-   Build clarity
-   Click economy
-   Frustration points

------------------------------------------------------------------------

# 4. VFX / Art Pipeline Review

Evaluate:

-   Consistency
-   Asset structure
-   Scalability
-   Reusability
-   Production effort
-   Long-term maintainability

------------------------------------------------------------------------

# 5. Documentation Review

Check:

-   Outdated documents
-   Contradictions
-   Missing documentation
-   Documentation quality
-   Missing design decisions

------------------------------------------------------------------------

# 6. Code Quality Review

Evaluate:

-   Clean Code
-   Naming
-   Data-driven architecture
-   Hardcodings
-   Redundancies
-   Possible bugs
-   Dead code
-   Maintainability

------------------------------------------------------------------------

# 7. Project Maturity

Assess:

-   Which systems are production-ready?
-   Which still feel like prototypes?
-   Which systems require another design pass?

------------------------------------------------------------------------

# 8. Risks

Identify:

-   Technical risks
-   Design risks
-   Pipeline risks
-   Long-term maintenance risks

------------------------------------------------------------------------

# 9. Quick Wins

List improvements with:

-   High impact
-   Low effort
-   Low risk

------------------------------------------------------------------------

# 10. Roadmap

Create a prioritized roadmap.

## P0 -- Blockers

Issues preventing healthy long-term development.

## P1 -- High Priority

High-value improvements.

## P2 -- Medium Priority

Important improvements after P1.

## P3 -- Long-Term Vision

Large improvements for future milestones.

For every item provide:

-   Description
-   Benefit (1--5)
-   Effort (1--5)
-   Risk (1--5)
-   Short justification

------------------------------------------------------------------------

# Reporting Style

Be concise but thorough.

Do not overwhelm with tiny issues.

Focus on the improvements that would have the largest positive impact on
BattleMages.

------------------------------------------------------------------------

# Important

If you discover a topic that deserves significantly deeper
investigation:

-   Stop.
-   Present your findings.
-   Explain why this area deserves a dedicated audit.
-   Wait for approval before continuing.

Prefer several deep audits over one superficial report.
