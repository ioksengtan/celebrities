# References

Source data and planning docs behind the CEO/celebrity-speech products.

## Core feed (week1 / P0)

| File | Role | On this branch |
| --- | --- | --- |
| `healthy_seven_feed.json` | 7 speeches + `quotes_wall` 35 | Y |
| `quotes_index_key_quotes_migration.json` | 7 KQ → verified | Y |
| `content_review_flags.json` | 4 `speech_id` excluded from wall | Y |
| `p0_quotes_draft.json` | 16 drafts, written as verified | Y |
| `w1_continue_quotes_draft.json` | 10 drafts (JH-2025-001×5, EM-2026-004×5) | **N — gzip+base64 payload corrupt, not invented** |
| `sa_2025_001_quotes_draft.json` | 5 Bloomberg drafts → verified | Y |
| `prod001_summary_zh_draft.json` | 4 Chinese speech summaries | Y |
| `quotes_index.json` | Merged wall/speech feed (upsert by `quote_id` or `speech_id`+quote) | Y |

Hold this round (never verified on the wall): `EM-2026-005`, `SA-2026-001`.

## Other

- `speeches_database.json` — 30 speeches/interviews (2024–2026) metadata.
- `speeches_indexes.json` — 7 derived index views.
- `product_recommendations.json` — candidate product ideas.
- `美國大學畢業典禮名人演講專案報告（完整版）.docx` — full project report.
