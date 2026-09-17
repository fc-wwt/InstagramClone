# Instagram Clone - Backend Functions

This directory contains the Firebase Cloud Functions for the Instagram Clone backend.

## Functions Overview

### HTTP Endpoints

#### Health Check (`/health`)
Monitors the backend service availability and health status. Returns information about Firestore and Authentication service health.

- **Method**: GET
- **Authentication**: None (public)
- **Documentation**: See [docs/HEALTH_ENDPOINT.md](../../docs/HEALTH_ENDPOINT.md)

### Firestore Triggers

#### addLike
Increments the like count when a user likes a post.

#### removeLike
Decrements the like count when a user unlikes a post.

#### addFollower
Updates follower/following counts when a user follows another user.

#### removeFollower
Updates follower/following counts when a user unfollows another user.

#### addComment
Increments the comment count when a user comments on a post.

## Setup

### Prerequisites

- Node.js 14 or higher
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project configured

### Installation

```bash
cd backend/functions
npm install
```

## Development

### Run Functions Locally

Start the Firebase emulator:

```bash
npm run serve
```

The functions will be available at:
```
http://localhost:5001/[project-id]/[region]/[function-name]
```

Example:
```
http://localhost:5001/instagram-clone/us-central1/health
```

### Test the Health Endpoint Locally

```bash
# Start the emulator
npm run serve

# In another terminal
curl http://localhost:5001/[project-id]/[region]/health
```

## Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

The test suite includes:
- Health endpoint functionality
- Service health checks (Firestore, Auth)
- Error handling
- Response format validation

## Deployment

### Deploy All Functions

```bash
npm run deploy
```

Or using Firebase CLI directly:

```bash
firebase deploy --only functions
```

### Deploy a Specific Function

```bash
firebase deploy --only functions:health
```

### View Deployment Status

```bash
firebase functions:list
```

## Monitoring

### View Logs

```bash
npm run logs
```

Or for a specific function:

```bash
firebase functions:log --only health
```

### Health Monitoring

The health endpoint can be monitored using:
- UptimeRobot
- Pingdom
- StatusCake
- Google Cloud Monitoring
- Custom monitoring scripts

See [docs/HEALTH_ENDPOINT.md](../../docs/HEALTH_ENDPOINT.md) for integration examples.

## Configuration

### Environment Variables

Firebase Cloud Functions use Firebase config for environment variables:

```bash
# Set a config value
firebase functions:config:set someservice.key="THE API KEY"

# Get config values
firebase functions:config:get

# Deploy after config changes
firebase deploy --only functions
```

### Function Settings

Function settings are configured in `index.js`:
- Memory allocation
- Timeout settings
- Region configuration

## Troubleshooting

### Common Issues

#### Cold Start Delays
First request after idle period may be slow. Consider:
- Using Cloud Scheduler to keep functions warm
- Optimizing function initialization code

#### Permission Errors
Ensure the service account has proper IAM roles:
- Cloud Functions Developer
- Firebase Admin SDK Administrator Service Agent

#### Deployment Failures
Check:
- Node.js version matches `engines` in package.json
- All dependencies are listed in package.json
- Firebase project is properly configured

### Debug Mode

Enable debug logging:

```javascript
process.env.DEBUG = 'true';
```

## Best Practices

1. **Error Handling**: Always wrap async operations in try-catch blocks
2. **Logging**: Use `console.log()` for info, `console.error()` for errors
3. **Timeouts**: Set appropriate timeout values for long-running operations
4. **Testing**: Write tests for all functions before deployment
5. **Monitoring**: Set up alerts for function failures and performance issues

## Security

- Functions run with Firebase Admin SDK privileges
- Validate all input data
- Use Firestore security rules as the primary security layer
- Never expose sensitive credentials in code
- Use Firebase config for API keys and secrets

## Performance

- Minimize cold start time by reducing dependencies
- Use connection pooling for external services
- Implement caching where appropriate
- Monitor function execution time and memory usage

## Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions/best-practices)

## Support

For issues and questions:
- Check the [main project README](../../README.md)
- Review [Architecture Documentation](../../docs/ARCHITECTURE.md)
- Open an issue on GitHub
