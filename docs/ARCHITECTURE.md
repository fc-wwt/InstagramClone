# Instagram Clone - Architecture Documentation

## System Overview

This Instagram Clone is a full-stack social media application built with React Native (mobile), ReactJS (admin panel), and Firebase backend services.

## High-Level Architecture

The following diagram provides a high-level overview of the system architecture:

![System Architecture](architecture-flowchart.svg)

The architecture consists of three main layers:

1. **Client Layer**: Mobile app (React Native + Expo) and Admin Panel (ReactJS)
2. **Authentication**: Firebase Authentication for user management
3. **Backend Services**: Cloud Functions, Firestore Database, Storage, and Push Notifications

## Architecture Diagram

```mermaid
flowchart TB
    subgraph "Client Layer"
        A[Mobile App<br/>React Native + Expo]
        B[Admin Panel<br/>ReactJS]
    end
    
    subgraph "Authentication"
        C[Firebase Authentication]
    end
    
    subgraph "Backend Services"
        D[Firebase Cloud Functions<br/>Node.js]
        E[Firebase Firestore<br/>NoSQL Database]
        F[Firebase Storage<br/>Media Storage]
        G[Expo Notifications<br/>Push Notifications]
    end
    
    subgraph "Data Collections"
        H[(Users)]
        I[(Posts)]
        J[(Comments)]
        K[(Likes)]
        L[(Following)]
        M[(Chats)]
        N[(Feed)]
    end
    
    A -->|Auth| C
    B -->|Auth| C
    A -->|API Calls| D
    A -->|Read/Write| E
    A -->|Upload/Download| F
    A -->|Receive| G
    B -->|Admin Operations| E
    
    D -->|Triggers| E
    D -->|Update Counters| E
    
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M
    E --> N
    
    F -->|Profile Images| H
    F -->|Post Media| I
    
    style A fill:#61dafb
    style B fill:#61dafb
    style C fill:#ffca28
    style D fill:#ffa726
    style E fill:#ffa726
    style F fill:#ffa726
    style G fill:#000000,color:#fff
```

## Component Architecture

### Mobile Application (Frontend)

```mermaid
flowchart LR
    A[App.js<br/>Entry Point] --> B{Auth State}
    B -->|Not Logged In| C[Auth Screens]
    B -->|Logged In| D[Main Navigation]
    
    C --> C1[Login]
    C --> C2[Register]
    
    D --> E[Bottom Tab Navigator]
    
    E --> F1[Feed Screen]
    E --> F2[Search Screen]
    E --> F3[Camera Screen]
    E --> F4[Chat List Screen]
    E --> F5[Profile Screen]
    
    D --> G[Stack Screens]
    G --> G1[Post Detail]
    G --> G2[Comment]
    G --> G3[Chat]
    G --> G4[Edit Profile]
    G --> G5[Save Post]
    
    H[Redux Store] -.->|State Management| D
    
    style A fill:#4caf50
    style D fill:#2196f3
    style E fill:#ff9800
    style H fill:#9c27b0
```

## Backend Cloud Functions

The Firebase Cloud Functions handle real-time data updates and maintain data consistency:

### Function Triggers

```mermaid
flowchart TD
    A[Firestore Triggers] --> B[addLike]
    A --> C[removeLike]
    A --> D[addFollower]
    A --> E[removeFollower]
    A --> F[addComment]
    
    B -->|Increment| G[Post likesCount]
    C -->|Decrement| G
    
    D -->|Increment| H[User followersCount]
    D -->|Increment| I[User followingCount]
    
    E -->|Decrement| H
    E -->|Decrement| I
    
    F -->|Increment| J[Post commentsCount]
    
    style A fill:#ff6f00
    style B fill:#4caf50
    style C fill:#f44336
    style D fill:#4caf50
    style E fill:#f44336
    style F fill:#4caf50
```

## Data Model

### Core Collections

1. **Users**
   - Profile information
   - Follower/Following counts
   - Ban status

2. **Posts**
   - Organized by user: `/posts/{userId}/userPosts/{postId}`
   - Contains: images/videos, captions, timestamps
   - Counters: likes, comments

3. **Likes**
   - Path: `/posts/{userId}/userPosts/{postId}/likes/{userId}`

4. **Comments**
   - Path: `/posts/{userId}/userPosts/{postId}/comments/{commentId}`

5. **Following**
   - Path: `/following/{userId}/userFollowing/{followingId}`

6. **Chats**
   - Direct messaging between users
   - Real-time message updates

7. **Feed**
   - Aggregated posts for user timeline

## Technology Stack

### Frontend (Mobile)
- **Framework**: React Native with Expo SDK 42
- **Navigation**: React Navigation 5
- **State Management**: Redux + Redux Thunk
- **UI Components**: React Native Paper, Material Bottom Tabs
- **Media**: Expo Camera, Image Picker, Video Player
- **Notifications**: Expo Notifications

### Admin Panel
- **Framework**: ReactJS 17
- **UI Library**: Material-UI, Bootstrap
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Functions**: Firebase Cloud Functions
- **Database**: Firebase Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Authentication**: Firebase Authentication

## Security

### Firestore Rules
- User data: Read by all, write by owner or admin
- Posts: Read by all, write by owner or admin
- Likes: Write by authenticated user
- Comments: Write by authenticated users
- Following: Write by owner
- Chats: Read/write by participants only

### Storage Rules
- Profile images: Read by all, write by owner
- Post media: Read by all, write by owner

## Key Features

1. **User Authentication**
   - Email/password registration and login
   - Session management

2. **Social Features**
   - Post creation (images/videos)
   - Like and comment on posts
   - Follow/unfollow users
   - User search
   - Direct messaging

3. **Media Management**
   - Camera integration
   - Image and video upload
   - Media library access
   - Video thumbnails

4. **Real-time Updates**
   - Live chat messages
   - Push notifications
   - Feed updates

5. **Admin Panel**
   - User management
   - Content moderation
   - Ban/unban users

## Deployment

- **Mobile App**: Expo managed workflow
- **Admin Panel**: Web hosting (static site)
- **Backend**: Firebase Cloud Functions (serverless)
- **Database**: Firebase Firestore (managed)
- **Storage**: Firebase Storage (managed)

## Scalability Considerations

- Firestore automatic scaling
- Cloud Functions auto-scaling
- CDN for media delivery via Firebase Storage
- Optimized queries with proper indexing
- Pagination for large data sets
