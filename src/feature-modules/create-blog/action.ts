// blogActions.ts
import { db } from "@/lib/firebase"; // make sure this points to your Firebase initialization
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import type { BlogPost } from "@/types";

// Reference to the posts collection
const postsCollection = collection(db, "posts");

/**
 * Create a new blog post
 */
export const createBlogPost = async (
  post: Omit<BlogPost, "id" | "likes" | "dislikes" | "createdAt" | "updatedAt">
) => {
  try {
    const newPost = {
      ...post,
      likes: Math.floor(Math.random() * 100), // Initialize with random likes
      dislikes: Math.floor(Math.random() * 100), // Initialize with random dislikes
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(postsCollection, newPost);
    return docRef.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  postId: string,
  updatedData: Partial<BlogPost>
) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};
