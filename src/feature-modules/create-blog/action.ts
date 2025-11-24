
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"
import type { BlogPost } from "@/types"

// Firestore collection reference
const postsCollection = collection(db, "posts")

// Type for creating a new blog post (excluding auto fields)
export type CreatePostInput = Omit<
  BlogPost,
  "id" | "likes" | "dislikes" | "createdAt" | "updatedAt"
>

/**
 * Create a new blog post
 * @param post - blog data from user
 * @returns document ID of the created post
 */
export const createBlogPost = async (
  post: CreatePostInput
): Promise<string> => {
  try {
    // Data being sent to Firestore
    const docRef = await addDoc(postsCollection, {
      ...post,
      likes: 0,
      dislikes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating blog post:", error)
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
  updatedData: Partial<CreatePostInput>
): Promise<void> => {
  try {
    const postRef = doc(db, "posts", postId)

    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    })

  } catch (error) {
    console.error("Error updating blog post:", error)
    throw new Error("Failed to update blog post")
  }
}
