import { z } from "zod"

// Max 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed image types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]

// Safe file type check (prevents SSR crash)
const isFile = (value: unknown) =>
  typeof window !== "undefined" && value instanceof File

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(5000, "Description must not exceed 5000 characters"),

  image: z
    .custom<File>((file) => isFile(file), {
      message: "Image is required",
    })
    .refine((file) => (file as File).size <= MAX_FILE_SIZE, {
      message: "Image must be less than 10MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes((file as File).type), {
      message: "Invalid image format. Only JPG, PNG, WEBP or GIF allowed",
    }),

  author: z
    .string()
    .min(1, "Author name is required"),

  date: z.string(),

  profileUser: z
    .string()
    .url("Profile image must be a valid URL")
    .optional(),
})

// Auto-generated TypeScript type
export type CreateBlogInput = z.infer<typeof createBlogSchema>
