<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300',
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          ]"
        >
          <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ notification.message }}</span>
          <button
            @click="removeNotification(notification.id)"
            class="ml-2 hover:bg-white/20 rounded p-1"
          >
            <XIcon class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>

    <div :class="['max-w-7xl mx-auto transition-all duration-1000', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a question or want to work together? We'd love to hear from you.
        </p>
        
        <!-- Progress Bar -->
        <div v-if="formProgress > 0" class="mt-6 max-w-md mx-auto">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Progress</span>
            <span>{{ Math.round(formProgress) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${formProgress}%` }"
            />
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Sidebar - Contact Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div
              v-for="(info, index) in contactInfo"
              :key="index"
              class="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                <component :is="info.icon" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ info.title }}</h3>
                <a
                  v-if="info.link"
                  :href="info.link"
                  class="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {{ info.content }}
                </a>
                <p v-else class="text-gray-600">{{ info.content }}</p>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 class="text-xl font-bold mb-4">Follow Us</h3>
            <div class="flex gap-4">
              <button
                v-for="(social, index) in ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']"
                :key="index"
                class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <span class="text-xs font-semibold">{{ social[0] }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div v-if="showSuccess" class="text-center py-12">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon class="w-12 h-12 text-green-600" />
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p class="text-gray-600 text-lg">
                Your message has been sent successfully. We'll get back to you soon.
              </p>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name & Email Row -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <UserIcon class="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    name="name"
                    @blur="handleBlur('name')"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                      errors.name && touched.name
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-blue-500'
                    ]"
                    placeholder="John Doe"
                  />
                  <p v-if="errors.name && touched.name" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon class="w-4 h-4" />
                    {{ errors.name }}
                  </p>
                </div>

                <div>
                  <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MailIcon class="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    name="email"
                    @blur="handleBlur('email')"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                      errors.email && touched.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-blue-500'
                    ]"
                    placeholder="john@example.com"
                  />
                  <p v-if="errors.email && touched.email" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon class="w-4 h-4" />
                    {{ errors.email }}
                  </p>
                </div>
              </div>

              <!-- Phone & Category Row -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <PhoneIcon class="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    name="phone"
                    @blur="handleBlur('phone')"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-blue-500'
                    ]"
                    placeholder="+1 (555) 123-4567"
                  />
                  <p v-if="errors.phone && touched.phone" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon class="w-4 h-4" />
                    {{ errors.phone }}
                  </p>
                </div>

                <div>
                  <label class="text-sm font-semibold text-gray-700 mb-2 block">
                    Category *
                  </label>
                  <select
                    v-model="form.category"
                    name="category"
                    @blur="handleBlur('category')"
                    :class="[
                      'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                      errors.category && touched.category
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-300 focus:border-blue-500'
                    ]"
                  >
                    <option value="">Select a category</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  <p v-if="errors.category && touched.category" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircleIcon class="w-4 h-4" />
                    {{ errors.category }}
                  </p>
                </div>
              </div>

              <!-- Subject -->
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 block">
                  Subject *
                </label>
                <input
                  v-model="form.subject"
                  type="text"
                  name="subject"
                  @blur="handleBlur('subject')"
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200',
                    errors.subject && touched.subject
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-blue-500'
                  ]"
                  placeholder="Brief description of your inquiry"
                />
                <p v-if="errors.subject && touched.subject" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircleIcon class="w-4 h-4" />
                  {{ errors.subject }}
                </p>
              </div>

              <!-- Priority -->
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 block">
                  Priority Level
                </label>
                <div class="flex gap-4">
                  <label
                    v-for="level in ['low', 'medium', 'high', 'urgent']"
                    :key="level"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      v-model="form.priority"
                      type="radio"
                      name="priority"
                      :value="level"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-sm text-gray-700 capitalize">{{ level }}</span>
                  </label>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label class="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">
                    <MessageSquareIcon class="w-4 h-4" />
                    Your Message *
                  </span>
                  <span :class="['text-xs', charCount > 1000 ? 'text-red-600' : 'text-gray-500']">
                    {{ charCount }}/1000
                  </span>
                </label>
                <textarea
                  v-model="form.message"
                  name="message"
                  @blur="handleBlur('message')"
                  rows="6"
                  :class="[
                    'w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 resize-none',
                    errors.message && touched.message
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-gray-300 focus:border-blue-500'
                  ]"
                  placeholder="Please provide as much detail as possible..."
                />
                <p v-if="errors.message && touched.message" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircleIcon class="w-4 h-4" />
                  {{ errors.message }}
                </p>
              </div>

              <!-- Terms Checkbox -->
              <div>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    v-model="form.agreeToTerms"
                    type="checkbox"
                    name="agreeToTerms"
                    @blur="handleBlur('agreeToTerms')"
                    class="mt-1 w-4 h-4 text-blue-600"
                  />
                  <span class="text-sm text-gray-700">
                    I agree to the terms and conditions and privacy policy *
                  </span>
                </label>
                <p v-if="errors.agreeToTerms && touched.agreeToTerms" class="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircleIcon class="w-4 h-4" />
                  {{ errors.agreeToTerms }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <LoaderIcon v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                  <SendIcon v-else class="w-5 h-5" />
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
                
                <button
                  type="button"
                  @click="handleReset"
                  class="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

// Icon components (simplified versions)
const SendIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>' };
const CheckCircleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' };
const AlertCircleIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' };
const PhoneIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' };
const MailIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>' };
const MapPinIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' };
const ClockIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' };
const UserIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' };
const MessageSquareIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' };
const LoaderIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>' };
const XIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' };

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  category?: string;
  agreeToTerms?: string;
}

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ContactInfo {
  icon: any;
  title: string;
  content: string;
  link?: string;
}

// State
const form = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  category: '',
  priority: 'medium',
  agreeToTerms: false
});

const errors = ref<FormErrors>({});
const touched = ref<Record<string, boolean>>({});
const isSubmitting = ref(false);
const notifications = ref<Notification[]>([]);
const isVisible = ref(false);
const showSuccess = ref(false);
const notificationCounter = ref(0);

// Computed
const charCount = computed(() => form.value.message.length);

const formProgress = computed(() => {
  const fields: (keyof FormData)[] = ['name', 'email', 'phone', 'subject', 'message', 'category'];
  const filledFields = fields.filter(field => {
    const value = form.value[field];
    return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
  }).length;
  return (filledFields / fields.length) * 100;
});

const contactInfo: ContactInfo[] = [
  {
    icon: PhoneIcon,
    title: 'Phone',
    content: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: MailIcon,
    title: 'Email',
    content: 'contact@company.com',
    link: 'mailto:contact@company.com'
  },
  {
    icon: MapPinIcon,
    title: 'Address',
    content: '123 Business St, Suite 100, City, ST 12345'
  },
  {
    icon: ClockIcon,
    title: 'Business Hours',
    content: 'Mon-Fri: 9AM-6PM EST'
  }
];

// Methods
const validateField = (name: keyof FormData, value: any): string | undefined => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
      return undefined;

    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return undefined;

    case 'phone':
      if (!value.trim()) return 'Phone number is required';
      if (!/^[\d\s\-\+\(\)]+$/.test(value)) return 'Invalid phone number format';
      if (value.replace(/\D/g, '').length < 10) return 'Phone must be at least 10 digits';
      return undefined;

    case 'subject':
      if (!value.trim()) return 'Subject is required';
      if (value.trim().length < 5) return 'Subject must be at least 5 characters';
      return undefined;

    case 'message':
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 20) return 'Message must be at least 20 characters';
      if (value.trim().length > 1000) return 'Message must not exceed 1000 characters';
      return undefined;

    case 'category':
      if (!value) return 'Please select a category';
      return undefined;

    case 'agreeToTerms':
      if (!value) return 'You must agree to terms and conditions';
      return undefined;

    default:
      return undefined;
  }
};

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  let isValid = true;

  (Object.keys(form.value) as Array<keyof FormData>).forEach(key => {
    const error = validateField(key, form.value[key]);
    if (error) {
      newErrors[key as keyof FormErrors] = error;
      isValid = false;
    }
  });

  errors.value = newErrors;
  return isValid;
};

const handleBlur = (fieldName: keyof FormData) => {
  touched.value[fieldName] = true;
  const error = validateField(fieldName, form.value[fieldName]);
  errors.value[fieldName] = error;
};

const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
  const id = notificationCounter.value++;
  notifications.value.push({ id, type, message });
  setTimeout(() => removeNotification(id), 5000);
};

const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id);
};

const getNotificationIcon = (type: string) => {
  if (type === 'success') return CheckCircleIcon;
  if (type === 'error') return AlertCircleIcon;
  return MessageSquareIcon;
};

const handleSubmit = async () => {
  // Mark all fields as touched
  Object.keys(form.value).forEach(key => {
    touched.value[key] = true;
  });

  if (!validateForm()) {
    addNotification('error', 'Please fix all errors before submitting');
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success
    showSuccess.value = true;
    addNotification('success', "Message sent successfully! We'll get back to you soon.");
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      category: '',
      priority: 'medium',
      agreeToTerms: false
    };
    touched.value = {};
    errors.value = {};

    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);

  } catch (error) {
    addNotification('error', 'Failed to send message. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleReset = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: '',
    priority: 'medium',
    agreeToTerms: false
  };
  errors.value = {};
  touched.value = {};
  addNotification('info', 'Form has been reset');
};

// Watch for reactive validation
watch(
  () => form.value,
  (newForm) => {
    Object.keys(newForm).forEach(key => {
      const fieldName = key as keyof FormData;
      if (touched.value[fieldName]) {
        const error = validateField(fieldName, newForm[fieldName]);
        errors.value[fieldName] = error;
      }
    });
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>