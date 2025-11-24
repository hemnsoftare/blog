<script setup lang="ts">
import { ref, computed, reactive } from "vue"
import { useUser } from "@clerk/vue"
import BlogPreview from "./compoennt/BlogPreview.vue"
import { useCreateBlog } from "./useCreatePost"
import { useRouter } from "vue-router"
import { createBlogSchema } from "./createBlog.schema"

const { user } = useUser()
const router = useRouter()

const title = ref("")
const description = ref("")
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const showPreview = ref(false)

// Create blog mutation
const { mutate: createBlog, isPending } = useCreateBlog()

// Date
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Author name fallback
const authorName = computed(() => {
  const data = user.value

  if (!data) return "Anonymous"

  return (
    data.fullName ||
    data.firstName ||
    data.username ||
    "Anonymous"
  )
})

// Errors
const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Handle image upload
const handleImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Remove image
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

// Toggle preview mode
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Please fill in title and description to preview.")
    return
  }
  showPreview.value = !showPreview.value
}

// Submit blog
const handleSubmit = () => {
  errors.title = ""
  errors.description = ""
  errors.image = ""

  const result = createBlogSchema.safeParse({
    title: title.value,
    description: description.value,
    image: imageFile.value,
    author: authorName.value,
    date: currentDate.value,
    profileUser: user.value?.imageUrl,
  })

  if (!result.success) {
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof typeof errors
      errors[field] = err.message
    })
    return
  }

  const validatedData = result.data

  createBlog(
    {
      title: validatedData.title,
      content: validatedData.description,
      image: imagePreview.value,
      authorName: validatedData.author,
      date: validatedData.date,
      authorImage: user.value?.imageUrl || "",
    },
    {
      onSuccess: () => router.push("/"),
      onError: (error) =>
        alert("Error creating blog: " + error.message),
    }
  )
}
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Create a New Blog</h1>

        <button
          @click="togglePreview"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          {{ showPreview ? "Edit" : "Preview" }}
        </button>
      </div>

      <!-- Preview Mode -->
      <BlogPreview
        v-if="showPreview"
        :title="title"
        :description="description"
        :image="imagePreview"
        :author="authorName"
        :date="currentDate"
      />

      <!-- Edit Mode -->
      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">

          <!-- Author Info -->
          <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {{ authorName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ authorName }}</p>
              <p class="text-sm text-gray-500">{{ currentDate }}</p>
            </div>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium mb-2">Blog Title</label>
            <input
              v-model="title"
              type="text"
              class="w-full p-3 border rounded-xl"
            />
            <p v-if="errors.title" class="text-sm text-red-500">{{ errors.title }}</p>
          </div>

          <!-- Image -->
          <div>
            <label class="text-sm font-medium mb-2 block">Cover Image</label>

            <div v-if="!imagePreview">
              <input type="file" @change="handleImage" />
            </div>

            <div v-else>
              <img :src="imagePreview" class="w-full h-64 object-cover rounded-lg" />
              <button type="button" @click="removeImage" class="text-red-500 mt-2">
                Remove Image
              </button>
            </div>

            <p v-if="errors.image" class="text-red-500 text-sm mt-1">
              {{ errors.image }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label>Description</label>
            <textarea v-model="description" rows="6" class="w-full p-3 border rounded-xl"></textarea>
            <p v-if="errors.description" class="text-red-500 text-sm">
              {{ errors.description }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="togglePreview" class="flex-1 bg-gray-200 p-3 rounded-xl">
              Preview
            </button>

            <button type="submit" class="flex-1 bg-blue-600 text-white p-3 rounded-xl">
              {{ isPending ? "Creating..." : "Create Blog" }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
