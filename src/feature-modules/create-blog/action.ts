// blogActions.ts
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  DocumentData
} from "firebase/firestore"
import type { BlogPost } from "@/types"

// Firestore collection reference
const postsCollection = collection(db, "posts")

// Type for creating a post (Firestore-safe)
type CreatePostInput = Omit<
  BlogPost,
  "id" | "likes" | "dislikes" | "createdAt" | "updatedAt"
>

/**
 * Create a new blog post
 */
export const createBlogPost = async (
  post: CreatePostInput
): Promise<string> => {
  try {
    const newPost: DocumentData = {
      ...post,
      likes: 0,
      dislikes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(postsCollection, newPost)
    return docRef.id

  } catch (error) {
    console.error("Error creating blog post:", error)
    throw new Error("Failed to create blog post")
  }
}

/**
 * Update an existing blog post
 */
export const updateBlogPost = async (
  postId: string,
  updatedData: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<void> => {
  try {
    const postRef = doc(db, "posts", postId)

    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    })

  } catch (error) {
    console.error("Error updating blog post:", error)
    throw new Error("Failed to update blog post")
  }
}
