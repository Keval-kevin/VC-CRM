# Virtual Coders CRM Execution Pack

This pack contains the final upgraded build instructions for the Virtual Coders multi-tenant IT Sales CRM.

## Files

- `VIBECODING_FINAL_MASTER_GUIDE.md`: Final product, architecture, UI, admin, AI, QA, and execution guide.
- `agents/backend.toml`: Backend agent instructions.
- `agents/frontend.toml`: Frontend agent instructions.
- `agents/database.toml`: Database agent instructions.
- `agents/qa.toml`: QA agent instructions.
- `agents/devops.toml`: DevOps agent instructions.
- `prompts/CODEX_EXECUTION_PLAN.md`: Step-by-step Codex execution plan.
- `qa/QA_MASTER_CHECKLIST.md`: Full QA checklist.
- `database/DUMMY_DATA_PLAN.md`: Dummy data seed plan.

## Recommended use

1. Add these files to your repository root.
2. Start with `prompts/CODEX_EXECUTION_PLAN.md` Phase 0.
3. Do not skip audit and merge planning if an existing CRM already exists.
4. Execute one phase at a time.
5. Use the relevant `.toml` agent for each workstream.
6. Do not accept a module unless the QA checklist passes for that module.
