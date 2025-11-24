<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue"
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
const isMounted = ref(false)

const { mutate: createBlog, isPending } = useCreateBlog()

const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Fade-in after mount
onMounted(() => {
  isMounted.value = true
})

// Date
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
})

// Author
const authorName = computed(() => {
  if (!user.value) return "Anonymous"
  return user.value.fullName || user.value.firstName || user.value.username || "Anonymous"
})

// Image handling
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

// Toggle preview
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Please complete title and description to preview.")
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
      authorImage: user.value?.imageUrl || ""
    },
    {
      onSuccess: () => router.push("/"),
      onError: (e) => alert("Error creating blog: " + e.message)
    }
  )
}
</script>

<template>
  <div :class="['page', isMounted && 'visible']">
    <div class="container">

      <!-- Header -->
      <div class="header">
        <div>
          <h1>Create a New Blog</h1>
          <p>Write something beautiful ✍️</p>
        </div>

        <button class="preview-toggle" @click="togglePreview">
          {{ showPreview ? "Edit" : "Preview" }}
        </button>
      </div>

      <transition name="view-switch" mode="out-in">

        <!-- Preview Mode -->
        <BlogPreview
          v-if="showPreview"
          :title="title"
          :description="description"
          :image="imagePreview"
          :author="authorName"
          :date="currentDate"
        />

        <!-- Form Mode -->
        <div v-else class="editor-card">

          <!-- User Info -->
          <div class="user-bar">
            <div class="avatar">
              {{ authorName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="name">{{ authorName }}</p>
              <span class="date">{{ currentDate }}</span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="form">

            <!-- Title -->
            <div>
              <input
                v-model="title"
                placeholder="Enter blog title..."
                class="input"
              />
              <span class="err" v-if="errors.title">{{ errors.title }}</span>
            </div>

            <!-- Image Upload -->
            <div>
              <div v-if="!imagePreview" class="drop-box">
                <label for="imgUpload">Upload a cover image</label>
                <input id="imgUpload" type="file" hidden @change="handleImage" />
              </div>

              <div v-else class="image-preview">
                <img :src="imagePreview" />
                <button type="button" class="remove-btn" @click="removeImage">
                  Remove
                </button>
              </div>

              <span class="err" v-if="errors.image">{{ errors.image }}</span>
            </div>

            <!-- Description -->
            <div>
              <textarea
                v-model="description"
                rows="6"
                placeholder="Write something meaningful..."
                class="textarea"
              />
              <span class="char-count">{{ description.length }} chars</span>
              <span class="err" v-if="errors.description">{{ errors.description }}</span>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button type="button" class="ghost" @click="togglePreview">
                Preview
              </button>

              <button type="submit" class="primary">
                {{ isPending ? "Publishing…" : "Publish Blog" }}
              </button>
            </div>

          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 2rem 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: 0.6s ease;
}
.page.visible {
  opacity: 1;
  transform: translateY(0);
}

.container {
  max-width: 850px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.preview-toggle {
  background: #2563eb;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  transition: 0.2s;
}
.preview-toggle:hover { transform: scale(1.05); }

.view-switch-enter-active,
.view-switch-leave-active {
  transition: 0.4s ease;
}
.view-switch-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.view-switch-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.editor-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.user-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.avatar {
  background: #2563eb;
  color: white;
  height: 42px;
  width: 42px;
  border-radius: 20px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
}

.input, .textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.drop-box {
  border: 2px dashed #ccc;
  padding: 30px;
  text-align:center;
  border-radius: 12px;
  cursor: pointer;
}

.image-preview img {
  width: 100%;
  border-radius: 12px;
  transition: transform .3s;
}
.image-preview img:hover {
  transform: scale(1.04);
}

.remove-btn {
  margin-top: 8px;
  color: red;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.primary {
  flex: 1;
  background: #2563eb;
  color: white;
  padding: 12px;
  border-radius: 12px;
}

.ghost {
  flex: 1;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 12px;
}

.err {
  color: red;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}

.char-count {
  font-size: 0.8rem;
  color: gray;
  display: block;
  text-align: right;
}
</style>
