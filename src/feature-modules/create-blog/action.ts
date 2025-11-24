import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc
} from "firebase/firestore"
import type { BlogPost } from "@/types/database"

// Firestore collection reference
const postsCollection = collection(db, "posts")

// Type for creating a new blog post (excluding auto fields)
export type CreatePostInput = Omit<
  BlogPost,
  "id" | "likes" | "dislikes" | "createdAt" | "updatedAt" | "comments"
>

// Type for updating a blog post
export type UpdatePostInput = Partial<Omit<BlogPost, "id" | "createdAt" | "comments">>

/**
 * Create a new blog post
 * @param post - blog data from user
 * @returns document ID of the created post
 */
export const createBlogPost = async (
  post: CreatePostInput
): Promise<string> => {
  try {
    // Validate required fields
    if (!post.title?.trim()) {
      throw new Error("Title is required")
    }
    if (!post.content?.trim()) {
      throw new Error("Content is required")
    }
    if (!post.image) {
      throw new Error("Image is required")
    }
    if (!post.authorId) {
      throw new Error("Author ID is required")
    }
    if (!post.authorName) {
      throw new Error("Author name is required")
    }

    // Data being sent to Firestore
    const docRef = await addDoc(postsCollection, {
      ...post,
      likes: 0,
      dislikes: 0,
      comments: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating blog post:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create blog post")
  }
}

/**
 * Update existing blog post
 * @param postId - ID of the post
 * @param updatedData - fields to update
 */
export const updateBlogPost = async (
  postId: string,
  updatedData: UpdatePostInput
): Promise<void> => {
  try {
    // Verify post exists
    const postRef = doc(db, "posts", postId)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      throw new Error("Blog post not found")
    }

    // Update the post
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    })

  } catch (error) {
    console.error("Error updating blog post:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to update blog post")
  }
}

/**
 * Delete a blog post
 * @param postId - ID of the post to delete
 */
export const deleteBlogPost = async (postId: string): Promise<void> => {
  try {
    const { deleteDoc } = await import("firebase/firestore")
    const postRef = doc(db, "posts", postId)
    
    // Verify post exists
    const postSnap = await getDoc(postRef)
    if (!postSnap.exists()) {
      throw new Error("Blog post not found")
    }

    await deleteDoc(postRef)
  } catch (error) {
    console.error("Error deleting blog post:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to delete blog post")
  }
}
