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

// Date
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Author name
const authorName = computed(() => {
  if (!user.value) return "Anonymous"
  return user.value.fullName || user.value.firstName || user.value.username || "Anonymous"
})

// Image
const handleImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

// Preview toggle
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Fill title and description to preview.")
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
      onError: (error) => alert("Error: " + error.message),
    }
  )
}
</script>

<template>
  <div class="page-container">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="header">
        <h1>Create a New Blog</h1>

        <button @click="togglePreview" class="preview-btn">
          {{ showPreview ? "Edit" : "Preview" }}
        </button>
      </div>

      <!-- Switch animation -->
      <transition name="fade-slide" mode="out-in">

        <BlogPreview
          v-if="showPreview"
          :title="title"
          :description="description"
          :image="imagePreview"
          :author="authorName"
          :date="currentDate"
        />

        <div v-else class="form-card">
          <form @submit.prevent="handleSubmit" class="space-y-6">

            <!-- Author -->
            <div class="author-row">
              <div class="avatar">{{ authorName.charAt(0) }}</div>
              <div>
                <div class="author-name">{{ authorName }}</div>
                <div class="date">{{ currentDate }}</div>
              </div>
            </div>

            <!-- Title -->
            <div>
              <input v-model="title" placeholder="Enter blog title" class="input-box" />
              <span class="error" v-if="errors.title">{{ errors.title }}</span>
            </div>

            <!-- Image -->
            <div>
              <div v-if="!imagePreview" class="upload-card">
                <input type="file" class="hidden" id="upload" @change="handleImage" />
                <label for="upload">
                  Click to upload image
                </label>
              </div>

              <div v-else class="image-wrap">
                <img :src="imagePreview" />
                <button type="button" @click="removeImage">Remove</button>
              </div>

              <span class="error" v-if="errors.image">{{ errors.image }}</span>
            </div>

            <!-- Description -->
            <div>
              <textarea v-model="description" rows="6" class="text-box"></textarea>
              <span class="error" v-if="errors.description">{{ errors.description }}</span>
            </div>

            <!-- Buttons -->
            <div class="actions">
              <button type="button" @click="togglePreview" class="btn secondary">
                Preview
              </button>

              <button type="submit" class="btn primary">
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
/* Page entrance */
.page-container {
  padding: 3rem 1rem;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.preview-btn {
  padding: 8px 16px;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  transition: transform .2s ease;
}
.preview-btn:hover { transform: scale(1.05); }

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: 0.4s ease all;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.avatar {
  background: #2563eb;
  color: white;
  border-radius: 999px;
  width: 40px;
  height: 40px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
}

.author-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-box,
.text-box {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.upload-card {
  padding: 1rem;
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}

.image-wrap img {
  width: 100%;
  border-radius: 15px;
  transition: transform 0.3s;
}
.image-wrap img:hover {
  transform: scale(1.05);
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  transition: transform 0.2s;
}

.btn:hover { transform: scale(1.03); }

.primary {
  background: #2563eb;
  color: white;
}

.secondary {
  background: #f3f4f6;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
  display: block;
}
</style>
