# 🛠 AEO/GEO Audit & Optimization Plan: ElitFinans

Based on the [AEO_GEO_TACTICAL_INSTRUCTION.md](file:///Users/varonachka/Website/AEO_GEO_TACTICAL_INSTRUCTION.md) and [SKILL.md](file:///Users/varonachka/Website/.agents/skills/aeo-geo/SKILL.md), this plan outlines the necessary improvements to maximize visibility in AI search engines (ChatGPT, Claude, Gemini, Perplexity).

---

## 🔍 Audit Summary

| Factor | Status | Gap |
| :--- | :--- | :--- |
| **Robots.txt** | ✅ Good | Missing `ClaudeBot` (Anthropic's official crawler). |
| **Bing Indexing** | ⚠️ Warning | No Bing Webmaster Tools verification meta tag found. |
| **JSON-LD Schema** | ✅ Excellent | Very detailed. Includes Org, Service, Person, and FAQ. |
| **Heading Structure** | ⚠️ Warning | Headings are "stylized statements", not "conversational questions". |
| **Content Blocks** | ❌ Missing | No explicit "TLDR/Summary" boxes or Atomic Answer Blocks (AABs). |
| **E-E-A-T Signals** | ✅ Good | Author info is present, but lacks specific technical metrics in text. |
| **Performance** | ✅ Good | LCP/Speed appears to be optimized via Next.js 16/React 19. |

---

## 🛠 Phase 1: Technical Foundations

### 1.1 Update `robots.txt`
Ensure all major AI crawlers are explicitly allowed.
- **Action**: Add `User-agent: ClaudeBot` and verify `anthropic-ai`.
- **Target File**: `public/robots.txt`

### 1.2 Add Bing Verification
ChatGPT relies on Bing's index. We need to signal that we are verified.
- **Action**: Add a (placeholder) Bing verification meta tag if not present.
- **Target File**: `src/app/layout.tsx`

---

## 📝 Phase 2: Content Architecture (Atomic Strategy)

### 2.1 Refactor Headings as Questions
AI agents reason through queries. Transforming section titles into questions helps the LLM "match" the answer.
- **Action**: 
    - Change `H1` to include a direct answer context.
    - Transform section headers (Services, How we work) into conversational questions.
- **Target File**: `src/app/page.tsx`

### 2.2 Implement TLDR Summary Box
AI models "cherry-pick" summaries. A dedicated block helps them cite us as the "TLDR" source.
- **Action**: Add a `SummaryBox` component at the top of the Home page and major service sections.
- **Target File**: `src/app/page.tsx`

### 2.3 Add "Atomic Answer Blocks" (AABs)
For each service, provide a 1-2 sentence "Quick Answer" that can be easily pulled as a snippet.
- **Action**: Refactor service descriptions to include a "Quick Answer" line.
- **Target File**: `src/app/page.tsx`

---

## 🧠 Phase 3: Authority & Freshness

### 3.1 Strengthen Information Gain
"Data over water". Replace generic phrases with specific metrics.
- **Action**: Inject at least 1 specific stat/metric per major section (e.g. "We save on average 32% more than traditional accountants due to...").
- **Target File**: `src/app/page.tsx`

### 3.2 Expert Freshness (2026 Ready)
Ensure the "2026" context is consistently applied to trigger freshness signals in LLMs.
- **Action**: Audit all date mentions and update to reflect current/future context.
- **Target File**: `src/app/page.tsx`

---

## 📊 Next Steps
1. [ ] Update `robots.txt`.
2. [ ] Update `layout.tsx` with Bing/Meta tags.
3. [ ] Implement Header/Atomic block refactoring in `page.tsx`.
4. [ ] Run a final AI-simulated audit (ask the AI about the brand).
