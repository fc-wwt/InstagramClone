# Health Endpoint Documentation

## Overview

The health endpoint provides a way to monitor the status and availability of the Instagram Clone backend services.

## Endpoint Details

### URL
```
GET /health
```

### Response Format

#### Healthy Response (200 OK)
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

#### Degraded Response (503 Service Unavailable)
```json
{
  "status": "degraded",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "version": "1.0.0",
  "checks": {
    "firestore": "unhealthy",
    "auth": "healthy"
  }
}
```

#### Unhealthy Response (503 Service Unavailable)
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "instagram-clone-backend",
  "error": "Error message details"
}
```

## Status Codes

- **200 OK**: All services are healthy and operational
- **503 Service Unavailable**: One or more services are degraded or unhealthy

## Health Checks

The endpoint performs the following checks:

### 1. Firestore Database
- Tests connectivity to Firebase Firestore
- Attempts to write a test document to verify write permissions
- Status: `healthy` or `unhealthy`

### 2. Firebase Authentication
- Tests connectivity to Firebase Authentication service
- Attempts to list users to verify service availability
- Status: `healthy` or `unhealthy`

## Usage

### cURL Example
```bash
curl https://your-project.cloudfunctions.net/health
```

### JavaScript/Fetch Example
```javascript
fetch('https://your-project.cloudfunctions.net/health')
  .then(response => response.json())
  .then(data => {
    console.log('Health Status:', data.status);
    console.log('Checks:', data.checks);
  })
  .catch(error => {
    console.error('Health check failed:', error);
  });
```

### Node.js Example
```javascript
const https = require('https');

https.get('https://your-project.cloudfunctions.net/health', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const health = JSON.parse(data);
    console.log('Service Status:', health.status);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
```

## Monitoring Integration

### Uptime Monitoring
The health endpoint can be integrated with uptime monitoring services such as:
- UptimeRobot
- Pingdom
- StatusCake
- AWS CloudWatch
- Google Cloud Monitoring

### Example Monitoring Setup

1. **Configure your monitoring service** to check the health endpoint every 1-5 minutes
2. **Set alert thresholds** based on:
   - HTTP status code (alert on non-200 responses)
   - Response time (alert if > 5 seconds)
   - Response content (alert if status !== "healthy")

3. **Alert channels** can include:
   - Email notifications
   - SMS alerts
   - Slack/Discord webhooks
   - PagerDuty integration

## Best Practices

1. **Regular Monitoring**: Check the endpoint at regular intervals (recommended: every 1-5 minutes)
2. **Timeout Configuration**: Set appropriate timeout values (recommended: 10 seconds)
3. **Alert Fatigue**: Configure alerts to trigger only after multiple consecutive failures
4. **Dashboard Integration**: Display health status on operational dashboards
5. **Logging**: Log all health check results for historical analysis

## Troubleshooting

### Firestore Unhealthy
- Check Firebase project configuration
- Verify Firestore security rules
- Check Firebase service status at https://status.firebase.google.com/
- Review Cloud Functions logs for detailed error messages

### Auth Unhealthy
- Verify Firebase Authentication is enabled in the project
- Check authentication service configuration
- Review Firebase service status
- Check Cloud Functions IAM permissions

### Timeout Errors
- Check network connectivity
- Verify Cloud Functions are deployed and running
- Review Cloud Functions quotas and limits
- Check for cold start issues (first request after idle period)

## Security Considerations

- The health endpoint is publicly accessible by design
- No sensitive information is exposed in the response
- The endpoint does not require authentication
- Rate limiting should be configured at the infrastructure level if needed

## Deployment

After deploying the updated Cloud Functions:

```bash
cd backend/functions
firebase deploy --only functions:health
```

The health endpoint will be available at:
```
https://[region]-[project-id].cloudfunctions.net/health
```

Replace `[region]` and `[project-id]` with your Firebase project details.
