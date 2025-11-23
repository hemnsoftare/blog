<script setup lang="ts">
import { ref, computed } from "vue";
import { useUser } from "@clerk/vue";
import BlogPreview from "./compoennt/BlogPreview.vue";
import { useCreateBlog } from "./useCreatePost";
import { useRouter } from "vue-router";

const { user } = useUser();

const title = ref("");
const description = ref("");
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const showPreview = ref(false);

// Get current date formatted
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Get user display name from Clerk
const authorName = computed(() => {
  if (user.value) {
    return user.value.fullName || user.value.firstName || user.value.username || "Anonymous";
  }
  return "Anonymous";
});
const router = useRouter()
// Handle image selection
const handleImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Remove selected image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Toggle preview mode
const togglePreview = () => {
  if (!title.value || !description.value) {
    alert("Please fill in title and description to preview.");
    return;
  }
  showPreview.value = !showPreview.value;
};
const {mutate :createBlog , isPending} = useCreateBlog()

// Submit handler
import { ZodError } from "zod";
import { createBlogSchema } from "./createBlog.schema";
import { reactive } from "vue";
const errors = reactive({
  title: "",
  description: "",
  image: "",
});

const handleSubmit = () => {
  errors.title = "";
  errors.description = "";
  errors.image = "";

  const result = createBlogSchema.safeParse({
    title: title.value,
    description: description.value,
    image: imageFile.value,
    author: authorName.value,
    date: currentDate.value,
    profileUser: user?.value?.imageUrl,
  });

  if (!result.success) {
    console.log("Zod Error:", result.error);

    // No .value needed with reactive
    result.error.issues.forEach((err) => {
      const field = err.path[0] as "title" | "description" | "image";
      errors[field] = err.message;
    });

    return;
  }


  const validatedData = result.data;

  createBlog(
    {
      title: validatedData.title,
      content: validatedData.description,
      image: imagePreview.value,
      authorName: validatedData.author,
      date: validatedData.date,
      authorImage: user.value?.imageUrl || '',
    },
    {
      onSuccess: () => router.push("/"),
      onError: (error) =>
        alert("Error creating blog: " + error.message),
    }
  );
};


</script>

<template>
  <div class="min-h-screen  py-8">
    <div class="max-w-4xl mx-auto px-4">
      <p v-if="errors.title"> {{ errors.title }}</p>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Create a New Blog</h1>
        <button
          @click="togglePreview"
          class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
            <input
              v-model="title"
              type="text"
              placeholder="Enter an engaging title..."
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            
            <div v-if="!imagePreview" class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                @change="handleImage"
                class="hidden"
                id="imageInput"
              />
              <label for="imageInput" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-600 font-medium">Click to upload cover image</p>
                <p class="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            <!-- Image Preview with Remove -->
            <div v-else class="relative">
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-full h-72 object-cover rounded-xl"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
              <p v-if="errors?.image" class="text-red-500 text-sm mt-1">{{ errors?.image }}</p>

          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="description"
              rows="6"
              placeholder="Write your blog content here..."
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            ></textarea>
            <p class="text-sm text-gray-400 mt-1 text-right">{{ description.length }} characters</p>
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="togglePreview"
              class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
            >
              Preview
            </button>
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            >
          {{ isPending ? 'Creating...' : 'Create Blog' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
