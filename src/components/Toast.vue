<template>
  <div
    v-if="message"
    :class="[
      'fixed bottom-6 left-1/2 -translate-x-1/2 transform rounded-lg px-6 py-3 text-white shadow-lg animate-fadeIn',
      bgColor,
    ]"
  >
    {{ message }}
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props: message and type
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info",
  },
});

// Compute background color class based on type
const bgColor = computed(() => {
  if (props.type === "error") return "bg-red-500";
  if (props.type === "success") return "bg-green-500";
  return "bg-gray-700";
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
