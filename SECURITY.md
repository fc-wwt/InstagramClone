# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Instagram Clone team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the project maintainers. You can find contact information in the [README.md](README.md).

Include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about the progress of fixing the vulnerability
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)
- **Timeline**: We aim to patch critical vulnerabilities within 7 days and other vulnerabilities within 30 days

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**: Regularly update npm packages and Expo SDK
2. **Secure Firebase Configuration**: Never commit Firebase config files with sensitive data
3. **Environment Variables**: Use environment variables for sensitive configuration
4. **Authentication**: Enable Firebase Authentication security features
5. **Firestore Rules**: Review and test Firestore security rules regularly
6. **Storage Rules**: Ensure Firebase Storage rules are properly configured

### For Developers

#### Firebase Security

1. **Firestore Security Rules**
   - Never use `allow read, write: if true;` in production
   - Validate user authentication before allowing operations
   - Implement proper data validation rules
   - Test rules using Firebase Emulator Suite

2. **Firebase Storage Rules**
   - Restrict file uploads to authenticated users
   - Validate file types and sizes
   - Implement proper access controls

3. **API Keys**
   - Firebase API keys are safe to include in client code
   - However, ensure proper security rules are in place
   - Use Firebase App Check for additional security

#### Code Security

1. **Input Validation**
   ```javascript
   // Always validate and sanitize user input
   const sanitizeInput = (input) => {
     return input.trim().replace(/[<>]/g, '');
   };
   ```

2. **Authentication Checks**
   ```javascript
   // Always verify user authentication
   if (!firebase.auth().currentUser) {
     throw new Error('User not authenticated');
   }
   ```

3. **Data Access**
   ```javascript
   // Verify user has permission to access data
   const userId = firebase.auth().currentUser.uid;
   if (requestedUserId !== userId) {
     throw new Error('Unauthorized access');
   }
   ```

#### Dependency Security

1. **Regular Updates**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

2. **Review Dependencies**
   - Only use trusted packages
   - Review package permissions
   - Check for known vulnerabilities

#### Sensitive Data

1. **Never Commit**:
   - API keys (except Firebase client keys)
   - Service account credentials
   - Private keys
   - `.env` files with secrets
   - User data or test data with PII

2. **Use Environment Variables**:
   ```javascript
   // Good
   const apiKey = process.env.API_KEY;
   
   // Bad
   const apiKey = 'hardcoded-key-123';
   ```

## Known Security Considerations

### Firebase Client Configuration

Firebase client configuration (API keys, project IDs) are safe to include in client-side code. Security is enforced through:
- Firebase Authentication
- Firestore Security Rules
- Storage Security Rules
- Firebase App Check (recommended)

### User Data Privacy

- User passwords are handled by Firebase Authentication (never stored in Firestore)
- Personal information should be protected by proper Firestore rules
- Implement data deletion capabilities for GDPR compliance

### File Uploads

- Validate file types before upload
- Implement file size limits
- Scan uploaded files for malware (recommended for production)
- Use Firebase Storage security rules to restrict access

## Security Checklist for Deployment

Before deploying to production:

- [ ] Review and test Firestore security rules
- [ ] Review and test Storage security rules
- [ ] Enable Firebase App Check
- [ ] Set up proper authentication flows
- [ ] Implement rate limiting for Cloud Functions
- [ ] Enable CORS properly for Cloud Functions
- [ ] Review all environment variables
- [ ] Audit npm dependencies
- [ ] Enable Firebase Security Rules testing
- [ ] Set up monitoring and alerts
- [ ] Implement proper error handling (don't expose sensitive info)
- [ ] Review user permissions and roles
- [ ] Test authentication edge cases
- [ ] Implement proper session management
- [ ] Set up backup and recovery procedures

## Firestore Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{userId}/userPosts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

## Storage Security Rules Example

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{postId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 10 * 1024 * 1024 && // 10MB limit
        request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
```

## Additional Resources

- [Firebase Security Documentation](https://firebase.google.com/docs/rules)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security](https://reactnative.dev/docs/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

For security concerns, please contact the maintainers through the channels listed in [README.md](README.md).

---

Thank you for helping keep Instagram Clone and its users safe!
