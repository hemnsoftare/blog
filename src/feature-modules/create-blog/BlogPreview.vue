<script setup lang="ts">
import { ref, computed, reactive } from "vue"
import BlogPreview from "./BlogPreview.vue"

const title = ref("")
const description = ref("")
const imagePreview = ref<string | null>(null)
const showPreview = ref(false)

const errors = reactive({
  title: "",
  description: "",
  image: "",
})

// Date
const currentDate = computed(() =>
  new Date().toLocaleDateString()
)

// Fake author (change later)
const authorName = ref("Anonymous")

// Image preview
const handleImageInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return
  imagePreview.value = URL.createObjectURL(file)
}

// Preview toggle
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Fill title and description first")
    return
  }
  showPreview.value = !showPreview.value
}

// Fake submit
const handleSubmit = () => {
  errors.title = ""
  errors.description = ""

  if (title.value.length < 3) {
    errors.title = "Title too short"
    return
  }

  if (description.value.length < 10) {
    errors.description = "Description too short"
    return
  }

  alert("Blog ready to submit ✅")
}
</script>

<template>
  <div class="container">

    <div class="header">
      <h2>Create Blog</h2>
      <button @click="togglePreview">
        {{ showPreview ? "Back" : "Preview" }}
      </button>
    </div>

    <BlogPreview
      v-if="showPreview"
      :title="title"
      :description="description"
      :image="imagePreview"
      :author="authorName"
      :date="currentDate"
    />

    <div v-else class="editor">

      <input
        v-model="title"
        placeholder="Blog Title"
      />
      <span class="err">{{ errors.title }}</span>

      <textarea
        v-model="description"
        rows="5"
        placeholder="Blog content..."
      ></textarea>
      <span class="err">{{ errors.description }}</span>

      <input type="file" @change="handleImageInput" />

      <img v-if="imagePreview" :src="imagePreview" class="preview" />

      <button @click="handleSubmit">Create Blog</button>

    </div>

  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.editor {
  margin-top: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
}

.preview {
  width: 100%;
  margin: 10px 0;
  border-radius: 8px;
}

.err {
  color: red;
  font-size: 14px;
}
</style>
