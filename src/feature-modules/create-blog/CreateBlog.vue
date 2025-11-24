<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue"
import { useUser } from "@clerk/vue"
import BlogPreview from "./compoennt/BlogPreview.vue"
import { useCreateBlog } from "./useCreatePost"
import { useRouter } from "vue-router"
import { createBlogSchema } from "./createBlog.schema"

// Clerk
const { user } = useUser()
const router = useRouter()

// Form state
const title = ref<string>("")
const description = ref<string>("")
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const showPreview = ref(false)

// API
const { mutate: createBlog, isPending } = useCreateBlog()

// Error state
const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Computed values
const authorName = computed<string>(() => {
  const u = user.value
  return u?.fullName || u?.firstName || u?.username || "Anonymous"
})

const currentDate = computed<string>(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// ✅ Auto-save draft
watch([title, description], () => {
  const draft = {
    title: title.value,
    description: description.value,
  }
  localStorage.setItem("blog-draft", JSON.stringify(draft))
})

// ✅ Load draft
onMounted(() => {
  const draft = localStorage.getItem("blog-draft")

  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      title.value = parsed.title || ""
      description.value = parsed.description || ""
    } catch {
      console.warn("Invalid draft data")
    }
  }
})

// ✅ Image upload
const handleImageInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

// ✅ Remove image
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

// ✅ Toggle preview
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Please fill in title and description first.")
    return
  }

  showPreview.value = !showPreview.value
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
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof typeof errors
      errors[field] = issue.message
    })
    return
  }

  const data = result.data

  createBlog(
    {
      title: data.title,
      content: data.description,
      image: imagePreview.value,
      authorName: data.author,
      date: data.date,
      authorImage: user.value?.imageUrl || "",
    },
    {
      onSuccess: () => {
        localStorage.removeItem("blog-draft")
        router.push("/")
      },
      onError: (error) => {
        alert("Error creating blog: " + error.message)
      },
    }
  )
}
</script>

<template>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <h1>Create Blog</h1>
      <button @click="togglePreview">
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

    <!-- Form Mode -->
    <div v-else class="editor">

      <!-- Title -->
      <input v-model="title" placeholder="Blog title..." />
      <p class="err">{{ errors.title }}</p>

      <!-- Description -->
      <textarea v-model="description" rows="5" placeholder="Write description..."></textarea>
      <p class="err">{{ errors.description }}</p>

      <!-- Image -->
      <input type="file" @change="handleImageInput" />

      <img v-if="imagePreview" :src="imagePreview" class="preview" />
      <button v-if="imagePreview" @click="removeImage">Remove Image</button>

      <p class="err">{{ errors.image }}</p>

      <!-- Submit -->
      <button @click="handleSubmit">
        {{ isPending ? "Creating..." : "Publish Blog" }}
      </button>

    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 700px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.editor {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.preview {
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
}

.err {
  color: red;
  font-size: 13px;
  margin-top: 4px;
}
</style>
