// blogActions.ts
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  increment,
  query,
  orderBy,
  where,
  arrayUnion,
} from "firebase/firestore";
import type { BlogPost, Comment } from "../../types/database";

// Firestore references
const postsCollection = collection(db, "posts");
const commentsCollection = collection(db, "comments");

// ========================================================
// 🔹 BLOG ACTIONS
// ========================================================

//  Get all blogs
export const getAllBlogs = async (): Promise<BlogPost[]> => {
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data() as Omit<BlogPost, "id">;

    return {
      id: d.id,
      ...data,
    };
  });
};

//  Get single blog
export const getBlogById = async (id: string): Promise<BlogPost | null> => {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data() as Omit<BlogPost, "id">;

  return {
    id: docSnap.id,
    ...data,
  };
};

//  Like blog
export const likeBlog = async (postId: string) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { likes: increment(1) });
};

//  Remove like
export const removeLike = async (postId: string) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { likes: increment(-1) });
};

//  Dislike blog
export const dislikeBlog = async (postId: string) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { dislikes: increment(1) });
};

//  Remove dislike
export const removeDislike = async (postId: string) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { dislikes: increment(-1) });
};

// ========================================================
// 🔹 COMMENT ACTIONS
// ========================================================

/**
 * ADD COMMENT TO POST
 */
export const addCommentToPost = async (
  postId: string,
  comment: Omit<Comment, "id" | "createdAt">
) => {
  const postRef = doc(db, "posts", postId);

  const newComment: Comment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await updateDoc(postRef, {
    comments: arrayUnion(newComment),
  });

  return newComment.id;
};

/**
 * UPDATE COMMENT INSIDE POST
 */
export const updateCommentInPost = async (
  postId: string,
  commentId: string,
  newText: string
) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found");
  }

  const postData = postSnap.data();
  const comments: Comment[] = postData.comments || [];

  const updatedComments = comments.map((comment) =>
    comment.id === commentId ? { ...comment, text: newText } : comment
  );

  await updateDoc(postRef, { comments: updatedComments });
};

/**
 * DELETE COMMENT FROM POST
 */
export const deleteCommentFromPost = async (
  postId: string,
  commentId: string
) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) {
    throw new Error("Post not found");
  }

  const postData = postSnap.data();
  const comments: Comment[] = postData.comments || [];

  const filteredComments = comments.filter(
    (comment) => comment.id !== commentId
  );

  await updateDoc(postRef, { comments: filteredComments });
};

/**
 * GET COMMENTS FOR A POST
 */
export const getCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  const q = query(
    commentsCollection,
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data() as Omit<Comment, "id">;

    return {
      id: d.id,
      ...data,
    };
  });
};
