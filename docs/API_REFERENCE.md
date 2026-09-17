# API Endpoints Reference

This document provides a quick reference for all available API endpoints in the Instagram Clone backend.

## HTTP Endpoints

### Health Check

Monitor the backend service availability and health status.

**Endpoint**: `GET /health`

**Authentication**: None (public endpoint)

**Response**: JSON object with health status

**Status Codes**:
- `200 OK` - All services are healthy
- `503 Service Unavailable` - One or more services are degraded or unhealthy

**Example Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "version": "1.0.0",
  "checks": {
    "firestore": "healthy",
    "auth": "healthy"
  }
}
```

**Documentation**: See [HEALTH_ENDPOINT.md](HEALTH_ENDPOINT.md) for detailed documentation.

**Use Cases**:
- Uptime monitoring
- Service health checks
- Integration with monitoring tools (UptimeRobot, Pingdom, etc.)
- CI/CD pipeline health verification
- Load balancer health checks

---

## Firestore Triggers (Cloud Functions)

These functions are automatically triggered by Firestore document changes and are not directly callable via HTTP.

### addLike

**Trigger**: `onCreate` on `/posts/{creatorId}/userPosts/{postId}/likes/{userId}`

**Action**: Increments the `likesCount` field on the corresponding post

### removeLike

**Trigger**: `onDelete` on `/posts/{creatorId}/userPosts/{postId}/likes/{userId}`

**Action**: Decrements the `likesCount` field on the corresponding post

### addFollower

**Trigger**: `onCreate` on `/following/{userId}/userFollowing/{followingId}`

**Actions**:
- Increments `followersCount` on the followed user
- Increments `followingCount` on the following user

### removeFollower

**Trigger**: `onDelete` on `/following/{userId}/userFollowing/{followingId}`

**Actions**:
- Decrements `followersCount` on the followed user
- Decrements `followingCount` on the following user

### addComment

**Trigger**: `onCreate` on `/posts/{creatorId}/userPosts/{postId}/comments/{userId}`

**Action**: Increments the `commentsCount` field on the corresponding post

---

## Deployment

To deploy all functions:

```bash
cd backend/functions
firebase deploy --only functions
```

To deploy a specific function:

```bash
firebase deploy --only functions:health
```

## Function URLs

After deployment, functions are available at:

```
https://[region]-[project-id].cloudfunctions.net/[function-name]
```

Example:
```
https://us-central1-instagram-clone-12345.cloudfunctions.net/health
```

## Testing

### Test Health Endpoint Locally

```bash
# Start the Firebase emulator
cd backend/functions
npm run serve

# In another terminal, test the endpoint
curl http://localhost:5001/[project-id]/[region]/health
```

### Test Health Endpoint in Production

```bash
curl https://[region]-[project-id].cloudfunctions.net/health
```

## Monitoring

The health endpoint is designed to be monitored continuously. Recommended monitoring intervals:
- **Development**: Every 5 minutes
- **Production**: Every 1-2 minutes

Set up alerts for:
- Non-200 status codes
- Response time > 5 seconds
- Status field !== "healthy"

## Security Notes

- The health endpoint is intentionally public and does not require authentication
- No sensitive information is exposed in health check responses
- Rate limiting should be configured at the infrastructure level if needed
- Firestore trigger functions are not directly accessible via HTTP

## Future Endpoints

Potential endpoints for future development:
- User profile management
- Post creation/deletion
- Search functionality
- Analytics and reporting
- Admin operations

---

For more detailed information about specific endpoints, refer to their individual documentation files in this directory.
