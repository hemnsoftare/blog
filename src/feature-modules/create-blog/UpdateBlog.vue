<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-50 p-6">
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6 animate-fade">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Update Blog</h1>
        <p class="text-gray-500 mt-1">
          Edit and update your blog content below
        </p>
      </div>

      <!-- Fake form -->
      <form class="space-y-5">

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Blog Title
          </label>
          <input
            type="text"
            placeholder="Enter updated blog title..."
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Blog Content
          </label>
          <textarea
            rows="5"
            placeholder="Update your blog content..."
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          ></textarea>
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Update Cover Image
          </label>
          <div class="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
            Click to upload new image
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update Blog
          </button>
        </div>
      </form>

      <!-- Fake status message -->
      <p class="text-green-500 text-sm text-center mt-4">
        Changes will be saved when the system is connected ✅
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Simple fade-in animation */
.animate-fade {
  animation: fadeIn 0.5s ease-in-out;
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
</style>
