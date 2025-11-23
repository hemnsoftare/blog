// useBlogMutation.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { BlogPost } from "@/types";
import { createBlogPost, updateBlogPost } from "./action";

/**
 * Hook: useCreateBlog
 * Handles creating new blog posts with TanStack Query
 */
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      post: Omit<
        BlogPost,
        "id" | "likes" | "dislikes" | "createdAt" | "updatedAt"
      >
    ) => {
      return await createBlogPost(post);
    },
    onSuccess: () => {
      // ✅ Invalidate blog queries so new post appears
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to create blog:", error);
    },
  });
}

/**
 * Hook: useUpdateBlog
 * Handles updating existing blog posts with TanStack Query
 */
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      updatedData,
    }: {
      postId: string;
      updatedData: Partial<BlogPost>;
    }) => {
      await updateBlogPost(postId, updatedData);
    },
    onSuccess: () => {
      // ✅ Invalidate posts cache so UI updates
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to update blog:", error);
    },
  });
}
