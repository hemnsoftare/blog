// src/actions/blogActions.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // your firebase config

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
}

// 🔍 Search blogs by title (case-insensitive)
export async function searchBlogsByTitle(title: string): Promise<Blog[]> {
  if (!title.trim()) return [];

  const blogsRef = collection(db, "blogs");

  // For Firestore, case-insensitive search requires stored lowercase titles
  const q = query(
    blogsRef,
    where("titleLower", ">=", title.toLowerCase()),
    where("titleLower", "<=", title.toLowerCase() + "\uf8ff")
  );

  const snapshot = await getDocs(q);
  const results: Blog[] = [];

  snapshot.forEach((doc) => {
    results.push({ id: doc.id, ...(doc.data() as Blog) });
  });

  return results;
}
