# QA report — The 11-Variable Matrix (IELTS-T2-W-P2)

## Audit — 3 November 2026 (Claude Fable 5.1)

Scope: both question banks (`prompts-b2.json`, B2 · Band 7; `prompts.json`, C1 · Band 8), 23 prompts × 11 boxes = 253 items each, read as a B2 and as a C1 student, plus the engine. Brief from T.Chris: vocabulary at the right CEFR level; keys worded properly; the key the longest option no more than 25% of the time; no distractor that could be the correct answer.

### Headline counts

| | B2 bank | C1 bank |
|---|---|---|
| Items read | 253 | 253 |
| Items changed | 253 | 208 |
| Keys reworded | 228 | 13 |
| Distractor sets rewritten | 253 | 205 |
| Key = single longest, before → after | 24.5% → 25.3% | 24.5% → 25.3% |
| Key = single shortest, before → after | **65.6%** → 24.9% | 9.5% → 24.9% |

Engine: options were already shuffled at render time; no key-position bug. Both HTML files parse (acorn); smoke test at 390 px / 420 px, light and dark, both levels, Solo mode: 0 console errors, 0 overflow.

### P1 — fairness

- **B2 was solvable by length.** The key was the single *shortest* option in 166 of 253 items, because distractors had been padded ("The announcement of every single crime to the public to shame criminals into obeying the law" against a 32-character key). The few "longest" keys sat in a fixed pattern — Example A in 23/23 prompts, Mechanism B 17/23, Position 22/23 — so a student could learn "pick the longest in box 4, the shortest everywhere else".
- **Fix:** every item now has an assigned length rank spread by a 4-way rotation across prompts and boxes, so in each bank the key is the single longest in 64 items (25.3%), the single shortest in 63 (24.9%), and neither in 126; no box has the longest or shortest key in more than 6 of 23 prompts. No option is more than 1.8× the length of the shortest in its set. `tools/validate.js` now enforces all of this (and fails above 30%, or above 10/23 in any one box).
- **Absolute-word give-aways** (key the only option without *all/every/never/only…*): 6 found, all removed.

### P1 — distractors that could be correct

Two independent reads (first pass, then a blind second read of the rewritten banks) found a second acceptable answer in roughly 60 further items, mostly in Example and Nuance boxes: a distractor that was simply another concrete case of the facet (C1 p4 Example A "Companies relocating their headquarters to smaller and cheaper premises"), another genuine limit on the same facet (B2 p17 Nuance A "A library offers a free space for the whole community"), or a second defensible balanced position (B2 p14, p18; C1 p8, p10). Each was replaced by a wrong-slot, too-narrow, aim-not-example or one-side-restated distractor of the same length. Two keys were themselves wrong for their box (C1 p5 Position restated Facet B; C1 p1 Example B was a principle, not a case) and were rewritten.

### P2 — wording, shape and vocabulary

- B2 keys were often an aim rather than a mechanism, or a padded phrase; 228 were reworded into plain B2 English that fits the slot sentence ("This works by …", "For example, …", "However, …", "I believe that …"). C1 keys needed only 13 changes.
- Options now share one grammatical shape per item (an -ing clause among "The X of Y" nominalisations marked the odd one out in B2 p15, p17).
- Above-level words removed from the B2 bank (*inmates, encyclopaedias, mitigating, degradation, autonomy…*); childish or cartoon distractors removed from both banks ("Police arresting anyone who drives near a city centre").
- B2 prompt text: "is okay" → "is acceptable" (p10).
- Real-world claims checked or hedged: Japan's long-term care insurance (paid into by adults, not "everyone"), English grammar schools select by exam not interview, Welsh/Māori "sustained in daily use" rather than "returned to", GM seed lawsuits concerned replanted seed, not accidental pollination.

### Engine and UI

- The B2 screen asked for the "BALANCED POSITION" and "REASON" but the box tag, running plan and feedback said "Synthesized Position" / "Rationale" (from the bank's `phaseName`). Added `LEVEL.labels` and `phaseLabel()`; the bank's `phaseName`, the leaderboard and the Sheet are unchanged.
- Corrected the stale comment claiming the B2 bank uses unsimplified prompt text.

### Unchanged / not touched

- Prompt ids, phase indices, the API URL, the Apps Script backend and the leaderboard: nothing keyed on them changed, so past scores and the live board are unaffected.
- `prompts.js` is an unrelated professional-vocabulary bank (law, medicine…) that nothing in this app loads; left in place.
- The C1 prompt text (exam wording) was not edited.

### Judgement calls for T.Chris

1. B2 p22 ("good and bad points of television") is an open prompt, so any sensible good point is a valid Facet A; the distractors are now clearly wrong-slot, but the item remains softer than the Discuss items. Consider replacing p22 with a Discuss-both-views prompt.
2. Mechanism options in both banks are "The X of Y" nominalisations rather than -ing phrases; they read naturally after "works by", so they were kept. Say if you want -ing phrases to match the Scriptorium's slot-shape contract.
3. Named real-world examples (Paris low-emission days, Welsh and Māori immersion schooling, Japan's care insurance) were kept where checkable; tell me if you would rather all examples be hypothetical.

### Tests

`node tools/validate.js` — structure, length balance, per-box predictability, duplicates, absolute-word give-aways, register.
