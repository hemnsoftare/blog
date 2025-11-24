// File: src/components/contact/ContactForm.vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <NotificationStack :notifications="notifications" @remove="removeNotification" />

    <div :class="['max-w-7xl mx-auto transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']">
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Have a question or want to work together? We'd love to hear from you.</p>

        <div v-if="formProgress > 0" class="mt-6 max-w-md mx-auto">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Form Progress</span>
            <span>{{ Math.round(formProgress) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${formProgress}%` }" />
          </div>
        </div>
      </header>

      <div class="grid lg:grid-cols-3 gap-8">
        <ContactInfo :items="contactInfo" />

        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div v-if="showSuccess" class="text-center py-12">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 class="text-3xl font-bold text-gray-900 mb-4">Thank You!</h3>
              <p class="text-gray-600 text-lg">Your message has been sent successfully. We'll get back to you soon.</p>
            </div>

            <form v-else @submit.prevent="onSubmit" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <InputField label="Full Name *" v-model="form.name" :error="errors.name" @blur="touch('name')" icon="user" placeholder="John Doe" />
                <InputField label="Email Address *" v-model="form.email" :error="errors.email" @blur="touch('email')" icon="mail" placeholder="john@example.com" type="email" />
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <InputField label="Phone Number *" v-model="form.phone" :error="errors.phone" @blur="touch('phone')" icon="phone" placeholder="+1 (555) 123-4567" />

                <div>
                  <label class="text-sm font-semibold text-gray-700 mb-2 block">Category *</label>
                  <select v-model="form.category" name="category" @blur="touch('category')" :class="selectClass('category')">
                    <option value="">Select a category</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  <p v-if="errors.category" class="mt-1 text-sm text-red-600 flex items-center gap-1">{{ errors.category }}</p>
                </div>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 block">Subject *</label>
                <input v-model="form.subject" name="subject" @blur="touch('subject')" :class="inputClass('subject')" placeholder="Brief description of your inquiry" />
                <p v-if="errors.subject" class="mt-1 text-sm text-red-600">{{ errors.subject }}</p>
              </div>

              <div>
                <label class="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span class="flex items-center gap-2">Your Message *</span>
                  <span :class="['text-xs', charCount > 1000 ? 'text-red-600' : 'text-gray-500']">{{ charCount }}/1000</span>
                </label>
                <textarea v-model="form.message" name="message" @blur="touch('message')" rows="6" :class="textareaClass('message')" placeholder="Please provide as much detail as possible..." />
                <p v-if="errors.message" class="mt-1 text-sm text-red-600">{{ errors.message }}</p>
              </div>

              <div>
                <label class="flex items-start gap-3 cursor-pointer">
                  <input v-model="form.agreeToTerms" type="checkbox" name="agreeToTerms" @blur="touch('agreeToTerms')" class="mt-1 w-4 h-4 text-blue-600" />
                  <span class="text-sm text-gray-700">I agree to the terms and conditions and privacy policy *</span>
                </label>
                <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-red-600">{{ errors.agreeToTerms }}</p>
              </div>

              <div class="flex gap-4 pt-4">
                <button type="submit" :disabled="isSubmitting" class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
                  <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>
                  <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>

                <button type="button" @click="resetForm" class="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200">Reset</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useContactForm from '@/composables/useContactForm';
import ContactInfo from './ContactInfo.vue';
import InputField from './InputField.vue';
import NotificationStack from './NotificationStack.vue';

const { form, errors, touched, isSubmitting, notifications, notificationCounter, validateField, validateForm, submit, reset, addNotification, removeNotification, showSuccess } = useContactForm();

const isVisible = ref(false);

const charCount = computed(() => form.value.message.length);

const formProgress = computed(() => {
  const fields: (keyof typeof form.value)[] = ['name','email','phone','subject','message','category'];
  const filled = fields.filter(f => (form.value[f] as any)?.toString().trim() !== '').length;
  return (filled / fields.length) * 100;
});

const contactInfo = [
  { icon: 'phone', title: 'Phone', content: '+1 (555) 123-4567', link: 'tel:+15551234567' },
  { icon: 'mail', title: 'Email', content: 'contact@company.com', link: 'mailto:contact@company.com' },
  { icon: 'map', title: 'Address', content: '123 Business St, Suite 100, City, ST 12345' },
  { icon: 'clock', title: 'Business Hours', content: 'Mon-Fri: 9AM-6PM EST' }
];

const { onSubmit, resetForm, touch, inputClass, textareaClass, selectClass } = (() => {
  const onSubmit = async () => {
    Object.keys(form.value).forEach(k => { touched.value[k] = true; });

    if (!validateForm()) { addNotification('error', 'Please fix all errors before submitting'); return; }

    try {
      await submit();
    } catch (e) {
      // submit handles errors and notifications
    }
  };

  return { onSubmit, resetForm: reset, touch: (field: string) => { touched.value[field] = true; validateField(field as any, form.value[field]); }, inputClass: (f: string) => ("w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 "+(errors.value[f] ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500')), textareaClass: (f: string) => ("w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 resize-none "+(errors.value[f] ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500')), selectClass: (f: string) => ("w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 "+(errors.value[f] ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500')) };
})();

onMounted(() => { setTimeout(() => { isVisible.value = true; }, 100); });

// expose helpers used in template
const onSubmitProxy = () => (onSubmit());

// re-assign names used by template
const onSubmit = onSubmitProxy;
const resetForm = resetForm;

</script>

<style scoped>
.notification-enter-active, .notification-leave-active { transition: all 0.3s ease; }
.notification-enter-from, .notification-leave-to { opacity: 0; transform: translateX(100px); }
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>


// File: src/components/contact/ContactInfo.vue
<template>
  <div class="lg:col-span-1 space-y-6">
    <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

      <div v-for="(info, index) in items" :key="index" class="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
          <component :is="iconFor(info.icon)" class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 mb-1">{{ info.title }}</h3>
          <a v-if="info.link" :href="info.link" class="text-gray-600 hover:text-blue-600 transition-colors">{{ info.content }}</a>
          <p v-else class="text-gray-600">{{ info.content }}</p>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
      <h3 class="text-xl font-bold mb-4">Follow Us</h3>
      <div class="flex gap-4">
        <button v-for="(s, i) in socials" :key="i" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
          <span class="text-xs font-semibold">{{ s[0] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import icons from '@/icons';

interface Item { icon: string; title: string; content: string; link?: string }
const props = defineProps<{ items: Item[] }>();
const socials = ['Facebook','Twitter','LinkedIn','Instagram'];

const iconFor = (key: string) => icons[key] || icons['mail'];
</script>

<style scoped>
</style>


// File: src/components/contact/InputField.vue
<template>
  <div>
    <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
      <component :is="iconComponent" class="w-4 h-4" v-if="iconComponent" />
      <span>{{ label }}</span>
    </label>
    <input v-if="type !== 'textarea' && type !== 'select'" :type="type" v-model="modelValueProxy" @blur="$emit('blur')" :class="computedClass" :placeholder="placeholder" />
    <textarea v-else-if="type === 'textarea'" v-model="modelValueProxy" @blur="$emit('blur')" :class="computedClass" />
    <slot v-else />
    <p v-if="error" class="mt-1 text-sm text-red-600 flex items-center gap-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import icons from '@/icons';
const props = defineProps<{ label: string; modelValue: any; error?: string; icon?: string; placeholder?: string; type?: string }>();
const emit = defineEmits(['update:modelValue','blur']);

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (v: any) => emit('update:modelValue', v)
});

const iconComponent = computed(() => props.icon ? icons[props.icon] : null);
const computedClass = computed(() => `w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${props.error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'}`);
</script>

<style scoped>
</style>


// File: src/components/contact/NotificationStack.vue
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification">
      <div v-for="n in notifications" :key="n.id" :class="['flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300', n.type === 'success' ? 'bg-green-500 text-white' : n.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white']">
        <component :is="iconFor(n.type)" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ n.message }}</span>
        <button @click="$emit('remove', n.id)" class="ml-2 hover:bg-white/20 rounded p-1"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import icons from '@/icons';
const props = defineProps<{ notifications: Array<{ id: number; type: string; message: string }> }>();
const iconFor = (t: string) => t === 'success' ? icons.check : t === 'error' ? icons.alert : icons.mail;
</script>

<style scoped>
.notification-enter-active, .notification-leave-active { transition: all 0.3s ease; }
.notification-enter-from, .notification-leave-to { opacity: 0; transform: translateX(100px); }
</style>


// File: src/composables/useContactForm.ts
import { ref } from 'vue';

interface FormData { name: string; email: string; phone: string; subject: string; message: string; category: string; priority: string; agreeToTerms: boolean }

export default function useContactForm() {
  const form = ref<FormData>({ name: '', email: '', phone: '', subject: '', message: '', category: '', priority: 'medium', agreeToTerms: false });
  const errors = ref<Record<string,string>>({});
  const touched = ref<Record<string,boolean>>({});
  const isSubmitting = ref(false);
  const notifications = ref<Array<{ id: number; type: 'success'|'error'|'info'; message: string }>>([]);
  const notificationCounter = ref(0);
  const showSuccess = ref(false);

  const validateField = (name: keyof FormData, value: any) => {
    switch (name) {
      case 'name': if (!value.trim()) return 'Name is required'; if (value.trim().length < 2) return 'Name must be at least 2 characters'; if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters'; return undefined;
      case 'email': if (!value.trim()) return 'Email is required'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'; return undefined;
      case 'phone': if (!value.trim()) return 'Phone number is required'; if (!/^[\d\s\-\+\(\)]+$/.test(value)) return 'Invalid phone number format'; if (value.replace(/\D/g,'').length < 10) return 'Phone must be at least 10 digits'; return undefined;
      case 'subject': if (!value.trim()) return 'Subject is required'; if (value.trim().length < 5) return 'Subject must be at least 5 characters'; return undefined;
      case 'message': if (!value.trim()) return 'Message is required'; if (value.trim().length < 20) return 'Message must be at least 20 characters'; if (value.trim().length > 1000) return 'Message must not exceed 1000 characters'; return undefined;
      case 'category': if (!value) return 'Please select a category'; return undefined;
      case 'agreeToTerms': if (!value) return 'You must agree to terms and conditions'; return undefined;
      default: return undefined;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string,string> = {};
    let valid = true;
    (Object.keys(form.value) as Array<keyof FormData>).forEach(k => {
      const err = validateField(k, (form.value as any)[k]);
      if (err) { newErrors[k as string] = err; valid = false; }
    });
    errors.value = newErrors;
    return valid;
  };

  const addNotification = (type: 'success'|'error'|'info', message: string) => {
    const id = notificationCounter.value++;
    notifications.value.push({ id, type, message });
    setTimeout(() => { notifications.value = notifications.value.filter(n => n.id !== id); }, 5000);
  };

  const removeNotification = (id: number) => { notifications.value = notifications.value.filter(n => n.id !== id); };

  const submit = async () => {
    isSubmitting.value = true;
    try {
      // simulate API
      await new Promise(r => setTimeout(r, 1200));
      addNotification('success', "Message sent successfully! We'll get back to you soon.");
      showSuccess.value = true;
      // reset
      form.value = { name: '', email: '', phone: '', subject: '', message: '', category: '', priority: 'medium', agreeToTerms: false };
      errors.value = {};
      touched.value = {};
      setTimeout(() => { showSuccess.value = false; }, 4000);
    } catch (e) {
      addNotification('error', 'Failed to send message. Please try again.');
      throw e;
    } finally { isSubmitting.value = false; }
  };

  const reset = () => { form.value = { name: '', email: '', phone: '', subject: '', message: '', category: '', priority: 'medium', agreeToTerms: false }; errors.value = {}; touched.value = {}; addNotification('info','Form has been reset'); };

  return { form, errors, touched, isSubmitting, notifications, notificationCounter, validateField, validateForm, submit, reset, addNotification, removeNotification, showSuccess };
}


// File: src/icons/index.ts
import type { Component } from 'vue';

const Mail = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' } as Component;
const Phone = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' } as Component;
const Map = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' } as Component;
const Clock = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' } as Component;
const Check = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' } as Component;
const Alert = { template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' } as Component;

export default { mail: Mail, phone: Phone, map: Map, clock: Clock, check: Check, alert: Alert };
