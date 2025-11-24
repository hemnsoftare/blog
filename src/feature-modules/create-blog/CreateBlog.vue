<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue"
import { useUser } from "@clerk/vue"
import BlogPreview from "./compoennt/BlogPreview.vue"
import { useCreateBlog } from "./useCreatePost"
import { useRouter } from "vue-router"
import { createBlogSchema } from "./createBlog.schema"
import { FormInput, FormTextarea, FormButton, ErrorMessage } from "../auth/component"

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

const generalError = ref("")

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
  // Reset file input
  const fileInput = document.getElementById('image-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
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
  generalError.value = ""

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
      if (field in errors) {
        errors[field] = issue.message
      } else {
        generalError.value = issue.message
      }
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
        generalError.value = "Error creating blog: " + error.message
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
      <FormButton
        v-if="!showPreview"
        type="button"
        variant="outline"
        @click="togglePreview"
        :disabled="!title || !description"
      >
        Preview
      </FormButton>
      <FormButton
        v-else
        type="button"
        variant="outline"
        @click="togglePreview"
      >
        Edit
      </FormButton>
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
      <form @submit.prevent="handleSubmit">
        <!-- Title -->
        <FormInput
          v-model="title"
          label="Blog Title"
          type="text"
          placeholder="Enter a captivating title..."
          :error="errors.title"
          :required="true"
        />

        <!-- Description -->
        <FormTextarea
          v-model="description"
          label="Blog Content"
          placeholder="Write your blog content here..."
          :error="errors.description"
          :required="true"
          :rows="10"
          :show-char-count="true"
          :max-length="5000"
        />

        <!-- Image Upload -->
        <div class="image-upload-section">
          <label class="image-label">
            Cover Image
            <span class="required">*</span>
          </label>
          <div class="image-upload-container">
            <input
              type="file"
              accept="image/*"
              @change="handleImageInput"
              class="file-input"
              id="image-upload"
            />
            <label for="image-upload" class="file-label">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ imagePreview ? 'Change Image' : 'Choose Image' }}</span>
            </label>
          </div>
          
          <div v-if="imagePreview" class="image-preview-container">
            <img :src="imagePreview" class="preview" alt="Preview" />
            <button type="button" @click="removeImage" class="remove-image-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Remove
            </button>
          </div>
          
          <p v-if="errors.image" class="error-text">{{ errors.image }}</p>
        </div>

        <!-- Error Message -->
        <ErrorMessage
          v-if="generalError"
          :message="generalError"
          variant="error"
        />

        <!-- Action Buttons -->
        <div class="action-buttons">
          <FormButton
            type="button"
            variant="outline"
            @click="togglePreview"
            :disabled="!title || !description"
          >
            Preview
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            :loading="isPending"
            full-width
          >
            Publish Blog
          </FormButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.editor {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.image-upload-section {
  margin-bottom: 1.5rem;
}

.image-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.image-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.file-label:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #6b7280;
}

.file-label span {
  color: #374151;
  font-weight: 500;
}

.image-preview-container {
  position: relative;
  margin-top: 1rem;
}

.preview {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.remove-image-btn:hover {
  background: #dc2626;
}

.remove-image-btn svg {
  width: 1rem;
  height: 1rem;
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .page {
    padding: 1rem;
  }

  .editor {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
