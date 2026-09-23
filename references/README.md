# References

Source data and planning docs behind the CEO/celebrity-speech products.

## Core feed (week1 / P0)

| File | Role | On this branch |
| --- | --- | --- |
| `healthy_seven_feed.json` | 7 speeches + `quotes_wall` 35 | Y |
| `quotes_index_key_quotes_migration.json` | 7 KQ → verified | Y |
| `content_review_flags.json` | 4 `speech_id` excluded from wall | Y |
| `p0_quotes_draft.json` | 16 drafts, written as verified | Y |
| `w1_continue_quotes_draft.json` | 10 drafts (JH-2025-001×5, EM-2026-004×5) | **Y — draft→verified** |
| `week2_quotes_to_merge_verified.json` | 15 verified (EM-2026-002×5, MZ-2024-001×5, SP-2025-002×5) | **Y — merged** |
| `week3_quotes_to_merge_verified.json` | 20 verified (MZ-2024-001×5, MZ-2025-001×5, SA-2026-002×5, JH-2026-006×5) | **Y — merged** |
| `week3_quotes_draft_hold.json` | 4 drafts (SA-2026-001×4)；未 verified、不上牆 | **Y — draft only** |
| `speech_aliases.json` | EM-2026-003 → EM-2026-002（同一場，不重複上架） | **Y** |
| `sa_2025_001_quotes_draft.json` | 5 Bloomberg drafts → verified | Y |
| `prod001_summary_zh_draft.json` | 4 Chinese speech summaries | Y |
| `quotes_index.json` | Merged wall/speech feed (upsert by `quote_id` or `speech_id`+quote) | Y |

Hold this round (never verified on the wall): `EM-2026-005`, `SA-2026-001`.

## Other

- `speeches_database.json` — 31 speeches/interviews (including one undated interview) metadata.
- `speeches_indexes.json` — 7 derived index views.
- `product_recommendations.json` — candidate product ideas.
- `美國大學畢業典禮名人演講專案報告（完整版）.docx` — full project report.

## Satya Nadella interview import (2026-09-19)

- `SN-UNDATED-001`: user-provided transcript; event date unknown, not the import date. Speech `verification_status` is `transcript_text_verified` (in-repo transcript check only; not fully video-verified).
- Full transcript: `transcripts/SN-UNDATED-001.txt`; Traditional Chinese editorial: `editorials/SN-UNDATED-001.md`.
- Five timestamped quotes are in `quotes_index.json`. `SN-UNDATED-001-Q01`, `Q03`, and `Q04` are `verified` after matching the in-repo transcript at timestamps 26:27, 09:49, and 08:13. `Q02` and `Q05` remain `draft` and stay off the verified wall. No full YouTube re-listen.
- Speech page: `products/core/speech.html?id=SN-UNDATED-001`. The default list includes featured speeches and speeches with verified quotes, so this interview now appears there via Q01 / Q03 / Q04.
