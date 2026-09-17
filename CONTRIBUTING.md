# Contributing to Instagram Clone

First off, thank you for considering contributing to Instagram Clone! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this standard.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots or animated GIFs** if possible
- **Include your environment details** (OS, Node version, React Native version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List any similar features** in other applications if applicable

### Pull Requests

- Fill in the required template
- Follow the coding standards
- Include appropriate test cases
- Update documentation as needed
- End all files with a newline

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account and project
- Git

### Frontend Setup

```bash
cd frontend
npm install
# Configure your Firebase credentials in the config file
npm start
```

### Backend Setup

```bash
cd backend/functions
npm install
# Configure Firebase project
firebase login
firebase use --add
npm run serve  # For local testing
```

### Admin Panel Setup

```bash
cd admin
npm install
# Configure your Firebase credentials
npm start
```

## Pull Request Process

1. **Create a feature branch** from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   - Ensure the app runs without errors
   - Test on both iOS and Android if possible
   - Verify no existing functionality is broken

4. **Commit your changes** using conventional commits:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots or GIFs for UI changes
   - List of changes made

7. **Wait for review** and address any feedback

## Coding Standards

### JavaScript/React Native

- Use functional components with hooks
- Follow ESLint rules (if configured)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await instead of promises when possible

### File Organization

- Place components in appropriate directories
- Keep related files together
- Use index.js for barrel exports when appropriate

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.js`)
- **Functions**: camelCase (e.g., `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)
- **Files**: Match component name or use kebab-case for utilities

### Code Style

```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const userData = await firebase.firestore()
      .collection('users')
      .doc(userId)
      .get();
    return userData.data();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Avoid
function getUserData(id) {
  firebase.firestore().collection('users').doc(id).get().then(doc => {
    return doc.data()
  }).catch(err => console.log(err))
}
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```
feat(auth): add password reset functionality

fix(feed): resolve infinite scroll issue on Android

docs(readme): update installation instructions

refactor(profile): simplify user data fetching logic
```

## Testing

- Test your changes on both iOS and Android when possible
- Verify that existing features still work
- Test edge cases and error scenarios
- Check for memory leaks in long-running operations

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update architecture documentation for structural changes
- Include inline comments for non-obvious code

## Questions?

Feel free to:
- Open an issue for discussion
- Check the [Wiki](https://github.com/SimCoderYoutube/InstagramClone/wiki)
- Watch the [YouTube Series](https://www.youtube.com/watch?v=xE8UEX7vXVQ&list=PLxabZQCAe5fgatwOQny9wKJVs4YD6xkf1)

## Recognition

Contributors will be recognized in the project. Thank you for your contributions!

---

**Happy Coding!** 🚀
