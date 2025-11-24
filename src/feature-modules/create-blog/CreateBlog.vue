<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue"
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

const history = ref<string[]>([])

const errors = reactive({
  title: "",
  description: "",
  image: "",
})

const { mutate: createBlog, isPending } = useCreateBlog()

const currentDate = computed(() =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
)

const authorName = computed(() => {
  const data = user.value
  return data?.fullName || data?.firstName || data?.username || "Anonymous"
})

// Undo
const undo = () => {
  const last = history.value.pop()
  if (last) description.value = last
}

watch(description, (newVal, oldVal) => {
  history.value.push(oldVal)
})

// ✅ Auto Save Draft
watch([title, description], () => {
  localStorage.setItem("blog-draft", JSON.stringify({
    title: title.value,
    description: description.value,
  }))
})

// ✅ Load draft
onMounted(() => {
  const draft = localStorage.getItem("blog-draft")
  if (draft) {
    const data = JSON.parse(draft)
    title.value = data.title
    description.value = data.description
  }
})

// ✅ Drag & Drop Image
const handleImage = (file: File) => {
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

const handleImageInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) handleImage(target.files[0])
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (file) handleImage(file)
}

// Toggle preview
const togglePreview = () => {
  if (!title.value || !description.value) return alert("Fill title & description first")
  showPreview.value = !showPreview.value
}

// Submit
const handleSubmit = () => {
  errors.title = errors.description = errors.image = ""

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
      errors[err.path[0] as keyof typeof errors] = err.message
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
      authorImage: user.value?.imageUrl || ""
    },
    {
      onSuccess: () => {
        localStorage.removeItem("blog-draft")
        router.push("/")
      }
    }
  )
}
</script>

<template>
  <div class="page">

    <header class="top">
      <h1>Create Blog</h1>
      <button @click="togglePreview">
        {{ showPreview ? "Edit" : "Preview" }}
      </button>
    </header>

    <transition name="slide-fade" mode="out-in">
      <BlogPreview
        v-if="showPreview"
        :title="title"
        :description="description"
        :image="imagePreview"
        :author="authorName"
        :date="currentDate"
      />

      <div v-else class="editor" @drop="onDrop" @dragover.prevent>

        <input v-model="title" placeholder="Title..." />
        <span class="err">{{ errors.title }}</span>

        <textarea v-model="description" rows="6" placeholder="Write..."></textarea>
        <span class="err">{{ errors.description }}</span>

        <div class="drop-zone">
          <input type="file" @change="handleImageInput" />
          <p>Drag or Upload image</p>
        </div>

        <img v-if="imagePreview" :src="imagePreview" class="preview"/>

        <span class="err">{{ errors.image }}</span>

        <div class="actions">
          <button @click="undo">Undo</button>
          <button @click="handleSubmit">
            {{ isPending ? "Creating..." : "Publish" }}
          </button>
        </div>

      </div>
    </transition>

  </div>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.editor {
  background: white;
  padding: 20px;
  border-radius: 16px;
  animation: fadeIn .4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: .3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.drop-zone {
  border: 2px dashed #aaa;
  padding: 20px;
  margin: 10px 0;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}

.preview {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

.err {
  color: red;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style>
