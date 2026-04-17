# Contributing Guidelines

## Code Style

- Use 2-space indentation
- Use meaningful variable names
- Add comments for complex logic
- Follow ESLint rules for JavaScript

## Commit Messages

Format: `<type>: <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Example:
```
feat: add two-factor authentication
fix: resolve login timeout issue
docs: update API documentation
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to remote: `git push origin feature/feature-name`
4. Create Pull Request
5. Wait for review and merge

## Testing

Before committing:
- Test backend endpoints: `npm test` (when implemented)
- Test frontend components
- Manual testing of features
- Check browser console for errors

## Documentation

- Update README for new features
- Document API changes in DEPLOYMENT.md
- Add comments to complex functions
- Update DATABASE.md for schema changes

## Issues

When reporting issues:
- Provide clear description
- Include steps to reproduce
- Share error messages
- Mention environment (OS, Node version, etc.)

## Questions?

Check existing issues and documentation first.
