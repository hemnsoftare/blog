// ==========================
// 🔹 User (Account) Type
// ==========================
export interface User {
  id: string; // Firestore document ID (usually the user UID from Clerk/Firebase Auth)
  name: string; // Display name of the user
  email: string; // User email
  imageUrl: string; // Profile image URL
  createdAt: string; // Timestamp (ISO or Firebase Timestamp string)
}

// ==========================
// 🔹 Comment Type
// ==========================
export interface Comment {
  id: string; // Unique comment ID (Firestore doc id)
  text: string; // Comment content
  createdAt: string; // Timestamp (ISO or Firebase Timestamp string)
  userName: string; // Optional display name for quick access
  userImage?: string; // Optional user image
}

// ==========================
// 🔹 Blog Post Type
// ==========================
export interface BlogPost {
  id: string; // Firestore document ID
  title: string; // Blog post title
  content: string; // Full blog content
  image: string; // Blog image (e.g. car photo)
  authorId: string; // Reference to user (User.id)
  authorName: string; // Cached author name for display
  authorImage: string; // Cached author image for display
  likes: number; // Number of likes
  dislikes: number; // Number of dislikes
  createdAt: string; // Timestamp (ISO or Firebase Timestamp string)
  updatedAt?: string; // Optional for edits
  comments: Comment[]; // Array of comments
}

// ==========================
// 🔹 Firestore Collections
// ==========================
// You can use these collection names when calling Firestore APIs.
export const COLLECTIONS = {
  USERS: "users",
  POSTS: "posts",
  COMMENTS: "comments",
};
