<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue"
import { useUser } from "@clerk/vue"
import BlogPreview from "./compoennt/BlogPreview.vue"
import { useCreateBlog } from "./useCreatePost"
import { useRouter } from "vue-router"
import { createBlogSchema } from "./createBlog.schema"
import { marked } from "marked"

const { user } = useUser()
const router = useRouter()

// Form state
const title = ref("")
const description = ref("")
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const showPreview = ref(false)
const darkMode = ref(false)

// API
const { mutate: createBlog, isPending } = useCreateBlog()

// Errors
const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Date
const currentDate = computed(() =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
)

// Author
const authorName = computed(() => {
  if (!user.value) return "Anonymous"
  return user.value.fullName || user.value.firstName || user.value.username || "Anonymous"
})

// Markdown rendering
const markdownPreview = computed(() => marked(description.value))

// ✅ Auto Save Draft
watch([title, description], () => {
  const draft = {
    title: title.value,
    description: description.value,
  }
  localStorage.setItem("blog-draft", JSON.stringify(draft))
})

// ✅ Load Draft
onMounted(() => {
  const saved = localStorage.getItem("blog-draft")
  if (saved) {
    const draft = JSON.parse(saved)
    title.value = draft.title
    description.value = draft.description
  }
})

// ✅ Handle Image Upload + Drag & Drop
const handleImage = (file: File) => {
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const handleImageInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    handleImage(target.files[0])
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file) handleImage(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

// ✅ Toggle Preview Mode
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Fill title and description to preview.")
    return
  }
  showPreview.value = !showPreview.value
}

// ✅ Dark Mode Toggle
const toggleTheme = () => {
  darkMode.value = !darkMode.value
}

// ✅ Submit
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

  const validated = result.data

  createBlog(
    {
      title: validated.title,
      content: validated.description,
      image: imagePreview.value,
      authorName: validated.author,
      date: validated.date,
      authorImage: user.value?.imageUrl || ""
    },
    {
      onSuccess: () => {
        localStorage.removeItem("blog-draft")
        router.push("/")
      },
      onError: (err) => alert("Error creating blog: " + err.message),
    }
  )
}
</script>

<template>
  <div :class="['page', darkMode && 'dark']">

    <!-- Header -->
    <div class="top-bar">
      <h1>Create a Blog</h1>

      <div class="actions">
        <button @click="toggleTheme">{{ darkMode ? "Light Mode" : "Dark Mode" }}</button>
        <button @click="togglePreview">{{ showPreview ? "Edit" : "Preview" }}</button>
      </div>
    </div>

    <!-- Switch Preview -->
    <transition name="fade" mode="out-in">
      <BlogPreview
        v-if="showPreview"
        :title="title"
        :description="description"
        :image="imagePreview"
        :author="authorName"
        :date="currentDate"
      />

      <div v-else class="editor">

        <!-- Author -->
        <div class="author">
          <div class="avatar">{{ authorName.charAt(0) }}</div>
          <div>
            <b>{{ authorName }}</b>
            <span>{{ currentDate }}</span>
          </div>
        </div>

        <!-- Title -->
        <input v-model="title" class="input" placeholder="Blog title..." />
        <span v-if="errors.title" class="error">{{ errors.title }}</span>

        <!-- Image Drop -->
        <div
          class="drop-zone"
          @drop="onDrop"
          @dragover.prevent
        >
          <input type="file" @change="handleImageInput" hidden id="upload"/>
          <label for="upload">Drag or click to upload image</label>
        </div>

        <div v-if="imagePreview">
          <img :src="imagePreview" class="image-preview"/>
          <button @click="removeImage">Remove Image</button>
        </div>

        <span v-if="errors.image" class="error">{{ errors.image }}</span>

        <!-- Description -->
        <textarea v-model="description" rows="6" class="textarea" placeholder="Write markdown..."></textarea>
        <span v-if="errors.description" class="error">{{ errors.description }}</span>

        <!-- Markdown Preview -->
        <div class="markdown-preview">
          <h3>Live Markdown Preview</h3>
          <div v-html="markdownPreview"></div>
        </div>

        <!-- Button -->
        <button @click="handleSubmit" class="publish-btn">
          {{ isPending ? "Publishing..." : "Publish Blog" }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page {
  max-width: 850px;
  margin: auto;
  padding: 2rem;
  transition: 0.3s;
}
.dark {
  background: #0f172a;
  color: white;
}

.top-bar {
  display:flex;
  justify-content: space-between;
  align-items:center;
  margin-bottom: 1.5rem;
}

.editor {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,.1);
}

.dark .editor {
  background: #1e293b;
}

.input, .textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #ccc;
}

.drop-zone {
  border: 2px dashed #aaa;
  padding: 25px;
  text-align: center;
  border-radius: 10px;
  margin: 10px 0;
  cursor: pointer;
}

.image-preview {
  width: 100%;
  border-radius: 12px;
  margin-top: 10px;
}

.author {
  display:flex;
  gap:10px;
  margin-bottom: 10px;
}

.avatar {
  background: #2563eb;
  color:white;
  padding:10px;
  border-radius:50%;
  font-weight:bold;
}

.markdown-preview {
  margin-top: 20px;
  padding: 10px;
  background: #f1f5f9;
  border-radius: 8px;
}

.dark .markdown-preview {
  background: #334155;
}

.error {
  color: red;
  font-size: .9rem;
}

.publish-btn {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border-radius: 10px;
  transition:.2s;
}
.publish-btn:hover {
  transform: scale(1.02);
}

.fade-enter-active, .fade-leave-active {
  transition: .25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
