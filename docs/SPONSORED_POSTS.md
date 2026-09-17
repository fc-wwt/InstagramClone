# Sponsored Posts Feature

## Overview

The Sponsored Posts feature allows the Instagram Clone app to highlight specific posts in the user's feed with special visual treatment. This feature is designed to increase engagement and provide monetization opportunities through sponsored content.

## How It Works

### Selection Logic

The app uses an intelligent fallback system to ensure there's always a sponsored post displayed:

1. **Priority 1**: Posts explicitly marked with `isSponsored: true` in Firestore
2. **Priority 2**: If no sponsored posts exist, randomly select one from the current feed

This approach ensures:
- Content managers have full control when needed
- There's always a highlighted post for engagement
- The feature works immediately without requiring database changes

### Visual Highlighting

Sponsored posts are displayed with multiple visual indicators:

1. **Position**: Always placed at the top of the feed
2. **Border**: 2px gold (#FFD700) border around the entire post card
3. **Badge**: Gold badge with star icon and "Sponsored" text overlaid on the post image
4. **Header Label**: "SPONSORED" label next to the username
5. **Shadow**: Elevated shadow effect to make the post "pop"
6. **Styling**: Tasteful and non-intrusive design

### Quantity

Currently, **one sponsored post** is displayed per feed view. This provides:
- Simple implementation and testing
- Better user experience (not overwhelming)
- More value for advertisers (exclusive positioning)
- Easy expansion to multiple sponsored posts in the future

## Implementation Details

### Data Structure

To mark a post as sponsored in Firestore, add the `isSponsored` field:

```javascript
// Firestore structure
/posts/{userId}/userPosts/{postId}
{
  caption: "Post caption",
  creation: Timestamp,
  downloadURL: "https://...",
  type: 0, // 0 for video, 1 for image
  likesCount: 42,
  commentsCount: 10,
  isSponsored: true  // <-- Add this field
}
```

### Code Components

#### 1. Redux Action (`frontend/redux/actions/index.js`)

```javascript
export function selectSponsoredPost(posts) {
    if (!posts || posts.length === 0) {
        return null;
    }

    // First, check if any posts are explicitly marked as sponsored
    const sponsoredPosts = posts.filter(post => post.isSponsored === true);
    
    if (sponsoredPosts.length > 0) {
        return sponsoredPosts[0];
    }

    // Fallback: randomly select one post from the feed
    const randomIndex = Math.floor(Math.random() * posts.length);
    return { ...posts[randomIndex], isSponsoredFallback: true };
}
```

#### 2. Feed Component (`frontend/components/main/post/Feed.js`)

The Feed component:
- Calls `selectSponsoredPost()` to choose the sponsored post
- Filters it out from the regular feed to avoid duplication
- Places it at the top with `isDisplayedAsSponsored: true` flag
- Passes the flag to the Post component

#### 3. Post Component (`frontend/components/main/post/Post.js`)

The Post component:
- Receives `isSponsored` prop from route params
- Applies sponsored styling conditionally
- Renders badges and labels when `isSponsored` is true

#### 4. Styles (`frontend/components/styles.js`)

New `sponsored` stylesheet with:
- `container`: Gold border and shadow for the post card
- `badge`: Floating badge with star icon
- `headerBadge`: Small label next to username
- All using gold theme (#FFD700)

## Usage

### For Developers

No code changes needed! The feature works automatically with the fallback system.

### For Content Managers

To mark a post as sponsored via Firebase Console:

1. Navigate to Firestore Database
2. Go to: `posts` → `{userId}` → `userPosts` → `{postId}`
3. Click "Add field"
4. Field name: `isSponsored`
5. Type: `boolean`
6. Value: `true`
7. Click "Add"

### For Admin Panel Integration (Future)

To add sponsored post management to the admin panel:

```javascript
// Example admin panel code
const markAsSponsored = async (userId, postId) => {
  await firebase.firestore()
    .collection('posts')
    .doc(userId)
    .collection('userPosts')
    .doc(postId)
    .update({
      isSponsored: true
    });
};

const unmarkAsSponsored = async (userId, postId) => {
  await firebase.firestore()
    .collection('posts')
    .doc(userId)
    .collection('userPosts')
    .doc(postId)
    .update({
      isSponsored: false
    });
};
```

## Testing

### Manual Testing

1. **Test with no sponsored posts**:
   - Open the app
   - Verify a random post is highlighted at the top
   - Pull to refresh
   - Verify a different random post may be highlighted

2. **Test with sponsored post**:
   - Mark a post as sponsored in Firestore
   - Open the app
   - Verify that specific post is highlighted at the top
   - Verify it has gold border, badge, and header label

3. **Test visual elements**:
   - Verify badge appears on both images and videos
   - Verify badge doesn't interfere with video controls
   - Verify "SPONSORED" label appears next to username
   - Verify gold border is visible around the post

### Automated Testing (Future)

```javascript
describe('Sponsored Posts', () => {
  it('should select explicitly sponsored post', () => {
    const posts = [
      { id: '1', isSponsored: false },
      { id: '2', isSponsored: true },
      { id: '3', isSponsored: false }
    ];
    const result = selectSponsoredPost(posts);
    expect(result.id).toBe('2');
  });

  it('should fallback to random selection', () => {
    const posts = [
      { id: '1', isSponsored: false },
      { id: '2', isSponsored: false }
    ];
    const result = selectSponsoredPost(posts);
    expect(result.isSponsoredFallback).toBe(true);
  });
});
```

## Future Enhancements

### Multiple Sponsored Posts

To show multiple sponsored posts:

```javascript
// In selectSponsoredPost function
export function selectSponsoredPosts(posts, count = 3) {
    const sponsoredPosts = posts.filter(post => post.isSponsored === true);
    
    if (sponsoredPosts.length >= count) {
        return sponsoredPosts.slice(0, count);
    }
    
    // Fill remaining slots with random posts
    const remaining = count - sponsoredPosts.length;
    const nonSponsored = posts.filter(post => !post.isSponsored);
    const randomPosts = shuffleArray(nonSponsored).slice(0, remaining);
    
    return [...sponsoredPosts, ...randomPosts];
}
```

### Rotation Strategy

Implement rotation for multiple sponsored posts:

```javascript
// Rotate through sponsored posts every N seconds
const [currentSponsoredIndex, setCurrentSponsoredIndex] = useState(0);

useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSponsoredIndex((prev) => 
            (prev + 1) % sponsoredPosts.length
        );
    }, 10000); // Rotate every 10 seconds
    
    return () => clearInterval(interval);
}, [sponsoredPosts]);
```

### Analytics Integration

Track sponsored post performance:

```javascript
const trackSponsoredView = (postId) => {
    firebase.firestore()
        .collection('analytics')
        .doc('sponsored_views')
        .collection('views')
        .add({
            postId,
            userId: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
};

const trackSponsoredClick = (postId) => {
    firebase.firestore()
        .collection('analytics')
        .doc('sponsored_clicks')
        .collection('clicks')
        .add({
            postId,
            userId: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
};
```

### Map Integration (If Applicable)

If the app adds location features:

```javascript
// Different marker for sponsored posts
const markerColor = post.isSponsored ? '#FFD700' : '#4285F4';
const markerSize = post.isSponsored ? 40 : 30;
const zIndex = post.isSponsored ? 1000 : 1;
```

## Troubleshooting

### Sponsored post not showing

1. Check if posts exist in the feed
2. Verify `isSponsored` field is set to `true` (boolean, not string)
3. Check Redux state in React DevTools
4. Verify `selectSponsoredPost` is being called

### Badge not visible

1. Check z-index of badge (should be 10)
2. Verify badge positioning (absolute with top/right)
3. Check if image is loading properly
4. Verify MaterialIcons is imported

### Border not showing

1. Check if `sponsored.container` style is applied
2. Verify borderWidth and borderColor in styles
3. Check if there are conflicting styles

## Performance Considerations

- **Minimal overhead**: Selection logic runs once per feed load
- **No extra API calls**: Uses existing feed data
- **Efficient rendering**: Only one sponsored post per view
- **Optimized styles**: Uses React Native's optimized StyleSheet

## Security Considerations

- Only admins should be able to mark posts as sponsored
- Implement Firestore security rules:

```javascript
// firestore.rules
match /posts/{userId}/userPosts/{postId} {
  allow read: if true;
  allow write: if request.auth.uid == userId;
  allow update: if request.auth.uid == userId 
    || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

## Conclusion

The Sponsored Posts feature provides a flexible, scalable solution for highlighting content in the Instagram Clone app. With intelligent fallback logic and tasteful visual design, it enhances user engagement while maintaining a positive user experience.
