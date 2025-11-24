// useBlogMutation.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { BlogPost } from "@/types";
import { createBlogPost, updateBlogPost } from "./action";

/**
 * Hook: useCreateBlog
 * Handles creating new blog posts using TanStack Query
 */
export function useCreateBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (post: Omit<BlogPost, "id" | "likes" | "dislikes" | "createdAt" | "updatedAt">) =>
      createBlogPost(post),

    onSuccess: () => {
      // Refresh blog list after creation
      qc.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (err) => {
      console.error("❌ Error creating blog:", err);
    },
  });
}

/**
 * Hook: useUpdateBlog
 * Handles updating existing blog posts using TanStack Query
 */
export function useUpdateBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, updatedData }: { postId: string; updatedData: Partial<BlogPost> }) =>
      updateBlogPost(postId, updatedData),

    onSuccess: () => {
      // Refresh blog list after update
      qc.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (err) => {
      console.error("❌ Error updating blog:", err);
    },
  });
}
