// useBlogMutation.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { BlogPost } from "@/types/database";
import { createBlogPost, updateBlogPost, deleteBlogPost, type CreatePostInput, type UpdatePostInput } from "./action";

/**
 * Hook: useCreateBlog
 * Handles creating new blog posts using TanStack Query
 */
export function useCreateBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (post: CreatePostInput) => createBlogPost(post),

    onSuccess: () => {
      // Refresh blog list after creation
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["blog"] });
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
    mutationFn: ({ postId, updatedData }: { postId: string; updatedData: UpdatePostInput }) =>
      updateBlogPost(postId, updatedData),

    onSuccess: (_, variables) => {
      // Refresh blog list and specific blog after update
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["blog", variables.postId] });
    },

    onError: (err) => {
      console.error("❌ Error updating blog:", err);
    },
  });
}

/**
 * Hook: useDeleteBlog
 * Handles deleting blog posts using TanStack Query
 */
export function useDeleteBlog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deleteBlogPost(postId),

    onSuccess: () => {
      // Refresh blog list after deletion
      qc.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (err) => {
      console.error("❌ Error deleting blog:", err);
    },
  });
}
