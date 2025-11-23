// useBlogHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";

import {
  getAllBlogs,
  getBlogById,
  likeBlog,
  removeLike,
  dislikeBlog,
  removeDislike,
  getCommentsByPostId,
  addCommentToPost,
  updateCommentInPost,
  deleteCommentFromPost,
} from "./blog.action";
import type { BlogPost, Comment } from "../../types/database";

// ========================================================
// 🔹 BLOG QUERIES
// ========================================================

//  Get all blogs
export function useAllBlogs() {
  return useQuery<BlogPost[]>({
    queryKey: ["posts"],
    queryFn: getAllBlogs,
  });
}

//  Get one blog
export function useBlog(postId: string) {
  return useQuery<BlogPost | null>({
    queryKey: ["post", postId],
    queryFn: () => getBlogById(postId),
    enabled: !!postId,
  });
}

// ========================================================
// 🔹 BLOG MUTATIONS (like/dislike)
// ========================================================

export function useLikeBlog(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeBlog(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useRemoveLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDislikeBlog(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dislikeBlog(postId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useRemoveDislike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeDislike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}
// ========================================================
// 🔹 COMMENT HOOKS
// ========================================================

// Fetch comments for one blog
export function useComments(postId: string) {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId,
  });
}

//  Add comment
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      text,
      userName,
      userImage,
    }: {
      postId: string;
      text: string;
      userName: string;
      userImage?: string;
    }) =>
      addCommentToPost(postId, {
        text,
        userName,
        userImage,
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}

//  Update comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
      text,
    }: {
      postId: string;
      commentId: string;
      text: string;
    }) => updateCommentInPost(postId, commentId, text),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}

//  Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => deleteCommentFromPost(postId, commentId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}
