const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Health check endpoint
exports.health = functions.https.onRequest(async (req, res) => {
    try {
        // Check Firestore connectivity
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'instagram-clone-backend',
            version: '1.0.0',
            checks: {
                firestore: 'unknown',
                auth: 'unknown'
            }
        };

        // Test Firestore connection
        try {
            await db.collection('_health_check').doc('test').set({
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            healthCheck.checks.firestore = 'healthy';
        } catch (error) {
            healthCheck.checks.firestore = 'unhealthy';
            healthCheck.status = 'degraded';
        }

        // Test Auth service
        try {
            await admin.auth().listUsers(1);
            healthCheck.checks.auth = 'healthy';
        } catch (error) {
            healthCheck.checks.auth = 'unhealthy';
            healthCheck.status = 'degraded';
        }

        const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(healthCheck);
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            service: 'instagram-clone-backend',
            error: error.message
        });
    }
});

exports.addLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onCreate((snap, context) => {
        return db
            .collection("posts")
            .doc(context.params.creatorId)
            .collection("userPosts")
            .doc(context.params.postId)
            .update({
                likesCount: admin.firestore.FieldValue.increment(1)
            })
    });
exports.removeLike = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/likes/{userId}')
    .onDelete((snap, context) => {
        return db
            .collection('posts')
            .doc(context.params.creatorId)
            .collection('userPosts')
            .doc(context.params.postId)
            .update({
                likesCount: admin.firestore.FieldValue.increment(-1)
            })
    })


exports.addFollower = functions.firestore.document('/following/{userId}/userFollowing/{FollowingId}')
    .onCreate((snap, context) => {
        return db
            .collection('users')
            .doc(context.params.FollowingId)
            .update({
                followersCount: admin.firestore.FieldValue.increment(1)
            }).then(() => {
                return db
                    .collection('users')
                    .doc(context.params.userId)
                    .update({
                        followingCount: admin.firestore.FieldValue.increment(1)
                    })
            })
    })

exports.removeFollower = functions.firestore.document('/following/{userId}/userFollowing/{FollowingId}')
    .onDelete((snap, context) => {
        return db
            .collection('users')
            .doc(context.params.FollowingId)
            .update({
                followersCount: admin.firestore.FieldValue.increment(-1)
            }).then(() => {
                return db
                    .collection('users')
                    .doc(context.params.userId)
                    .update({
                        followingCount: admin.firestore.FieldValue.increment(-1)
                    })
            })
    })

exports.addComment = functions.firestore.document('/posts/{creatorId}/userPosts/{postId}/comments/{userId}')
    .onCreate((snap, context) => {
        return db
            .collection("posts")
            .doc(context.params.creatorId)
            .collection("userPosts")
            .doc(context.params.postId)
            .update({
                commentsCount: admin.firestore.FieldValue.increment(1)
            })
    })
