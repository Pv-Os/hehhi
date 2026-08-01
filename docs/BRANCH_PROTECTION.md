Branch protection runbook

This file describes the recommended settings for GitHub branch protection to ensure CI checks run and PRs are reviewed before merge.

Recommended settings for the `main` branch:
- Require status checks to pass before merging
  - Add required checks: `api CI` (name from .github/workflows/api.yml) and `web CI` (name from .github/workflows/web.yml) as applicable
  - Also require `lint`, `typecheck`, and `test` jobs if they are present in workflows
- Require pull request reviews before merging
  - Require review from CODEOWNERS
- Include administrators? Optional (recommendation: yes, to enforce rules across all contributors)

How to enable (admin steps):
1. Go to the repository Settings → Branches → Branch protection rules
2. Click "Add rule" and set the branch name pattern to `main`
3. Check "Require status checks to pass before merging" and select the CI checks from the list
4. Check "Require pull request reviews before merging" and optionally "Include administrators"
5. Save changes

Notes
- The workflow job names appear in the branch protection UI after the workflows have run at least once.
- If the required checks don't appear, trigger a dummy commit to run the workflows.
