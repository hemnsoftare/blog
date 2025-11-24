<template>
  <div class="update-blog-container">
    <div class="update-blog-card">
      <!-- Header -->
      <div class="header">
        <h1>Update Blog</h1>
        <p class="subtitle">Edit and update your blog content below</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleUpdate" class="form">
        <!-- Title -->
        <FormInput
          v-model="formData.title"
          label="Blog Title"
          type="text"
          placeholder="Enter updated blog title..."
          :error="errors.title"
          :required="true"
        />

        <!-- Description -->
        <FormTextarea
          v-model="formData.description"
          label="Blog Content"
          placeholder="Update your blog content..."
          :error="errors.description"
          :required="true"
          :rows="10"
          :show-char-count="true"
          :max-length="5000"
        />

        <!-- Image -->
        <div class="image-section">
          <label class="image-label">
            Update Cover Image
          </label>
          <div class="image-upload-container">
            <input
              type="file"
              accept="image/*"
              @change="handleImageInput"
              class="file-input"
              id="update-image-upload"
            />
            <label for="update-image-upload" class="file-label">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ imagePreview ? 'Change Image' : 'Choose New Image' }}</span>
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

        <!-- Buttons -->
        <div class="action-buttons">
          <FormButton
            type="button"
            variant="outline"
            @click="handleCancel"
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            :loading="loading"
            full-width
          >
            Update Blog
          </FormButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { FormInput, FormTextarea, FormButton, ErrorMessage } from '../auth/component'

const router = useRouter()

const formData = reactive({
  title: '',
  description: ''
})

const errors = reactive({
  title: '',
  description: '',
  image: ''
})

const generalError = ref('')
const loading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const handleImageInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  const fileInput = document.getElementById('update-image-upload') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const handleUpdate = async () => {
  errors.title = ''
  errors.description = ''
  errors.image = ''
  generalError.value = ''

  // Validation
  if (!formData.title.trim()) {
    errors.title = 'Title is required'
    return
  }

  if (!formData.description.trim()) {
    errors.description = 'Content is required'
    return
  }

  loading.value = true

  try {
    // TODO: Implement actual update logic
    console.log('Updating blog:', { ...formData, image: imageFile.value })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/')
  } catch (err: any) {
    generalError.value = err.message || 'Failed to update blog. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.update-blog-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 1rem;
}

.update-blog-card {
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  padding: 2.5rem;
  animation: fadeIn 0.5s ease-in-out;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 0.9375rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-section {
  margin-bottom: 1rem;
}

.image-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
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
  margin-top: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .update-blog-card {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
