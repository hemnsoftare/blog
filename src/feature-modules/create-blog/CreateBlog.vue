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

const { mutate: createBlog, isPending } = useCreateBlog()

const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Date format
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Author
const authorName = computed(() => {
  const data = user.value
  if (!data) return "Anonymous"
  return data.fullName || data.firstName || data.username || "Anonymous"
})

// Upload image
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

// Toggle preview
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Please fill in title and description to preview.")
    return
  }
  showPreview.value = !showPreview.value
}

// Submit
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
      onError: (error) => alert("Error creating blog: " + error.message),
    }
  )
}
</script>

<template>
  <div class="min-h-screen py-8 animate-container">
    <div class="max-w-4xl mx-auto px-4">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800 animate-fade">Create a New Blog</h1>

        <button @click="togglePreview" class="btn-animate">
          {{ showPreview ? "Edit" : "Preview" }}
        </button>
      </div>

      <!-- Switch Animation -->
      <transition name="fade-slide" mode="out-in">
        <BlogPreview
          v-if="showPreview"
          :key="'preview'"
          :title="title"
          :description="description"
          :image="imagePreview"
          :author="authorName"
          :date="currentDate"
        />

        <div
          v-else
          :key="'form'"
          class="bg-white rounded-2xl shadow-sm border p-6 md:p-8"
        >
          <form @submit.prevent="handleSubmit" class="space-y-6">

            <!-- Author -->
            <div class="flex items-center gap-3 pb-4 border-b">
              <div class="avatar animate-pop">
                {{ authorName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="font-medium">{{ authorName }}</p>
                <p class="text-sm text-gray-500">{{ currentDate }}</p>
              </div>
            </div>

            <!-- Title -->
            <div>
              <input
                v-model="title"
                placeholder="Blog Title"
                class="input-field"
              />
              <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
            </div>

            <!-- Image -->
            <div>
              <div v-if="!imagePreview" class="upload-box">
                <input type="file" class="hidden" id="img" @change="handleImage" />
                <label for="img" class="cursor-pointer">Click to upload image</label>
              </div>

              <div v-else class="image-preview">
                <img :src="imagePreview" class="preview-img" />
                <button type="button" @click="removeImage">Remove</button>
              </div>

              <p v-if="errors.image" class="text-red-500 text-sm">{{ errors.image }}</p>
            </div>

            <!-- Description -->
            <div>
              <textarea
                v-model="description"
                rows="6"
                placeholder="Write your blog..."
                class="textarea-field"
              ></textarea>
              <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4">
              <button type="button" @click="togglePreview" class="btn-secondary">Preview</button>
              <button type="submit" class="btn-primary">
                {{ isPending ? "Creating..." : "Create Blog" }}
              </button>
            </div>

          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Overall fade */
.animate-container {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transition between views */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Button animation */
.btn-animate {
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  transition: transform 0.2s ease, background 0.2s ease;
}
.btn-animate:hover {
  transform: scale(1.05);
  background: #1d4ed8;
}
.btn-animate:active {
  transform: scale(0.95);
}

/* Avatar animation */
.animate-pop {
  animation: pop 0.5s ease;
}
@keyframes pop {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Image hover */
.preview-img {
  width: 100%;
  border-radius: 12px;
  transition: transform 0.4s ease;
}
.preview-img:hover {
  transform: scale(1.05);
}

/* Inputs */
.input-field, .textarea-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

/* Buttons */
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 12px;
  border-radius: 12px;
  width: 100%;
}

.btn-secondary {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 12px;
  width: 100%;
}
</style>
