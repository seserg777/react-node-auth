# Git Hooks Configuration

This directory contains Git hooks managed by [Husky](https://typicode.github.io/husky/).

## Available Hooks

### `pre-commit`
Runs before each commit to ensure code quality:
- ✅ Runs ESLint on staged files and auto-fixes issues
- ✅ Runs Jest tests for backend (all tests)
- ✅ Prevents commit if tests fail

**What it does:**
1. Lints and fixes JavaScript files in `apps/backend/src/`
2. Lints and fixes React files in `apps/frontend/src/`
3. Runs all backend tests with `npm test`
4. If any step fails, the commit is blocked

### `commit-msg`
Validates commit message format:
- ✅ Ensures commit message is not empty
- ✅ Requires minimum 10 characters
- ✅ Prevents meaningless commit messages

## How to Use

### Normal Workflow
```bash
# Stage your changes
git add .

# Commit (hooks run automatically)
git commit -m "Add new feature"

# If tests pass, commit succeeds ✅
# If tests fail, commit is blocked ❌
```

### Skip Hooks (Emergency Only!)
```bash
# Skip all hooks (NOT RECOMMENDED)
git commit --no-verify -m "Emergency fix"

# Or set HUSKY=0
HUSKY=0 git commit -m "Skip hooks"
```

## Troubleshooting

### Hooks not running?
```bash
# Reinstall husky
npm run prepare

# Make hooks executable (Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Tests failing?
```bash
# Run tests manually to debug
cd apps/backend
npm test

# Fix issues, then commit again
```

### Lint errors?
```bash
# Run linting manually
npm run lint

# Auto-fix issues
cd apps/backend && npm run lint -- --fix
cd apps/frontend && npm run lint -- --fix
```

## Benefits

1. **Code Quality**: Ensures all committed code passes linting
2. **Test Coverage**: Prevents breaking changes from being committed
3. **Team Consistency**: Everyone follows the same standards
4. **Early Detection**: Catches issues before code review

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.husky/commit-msg` - Commit message validation
- `.lintstagedrc.json` - Lint-staged configuration
- `package.json` - Husky setup in "prepare" script

