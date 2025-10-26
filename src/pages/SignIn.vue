<template>
  <section class="flex min-h-screen items-center justify-center bg-[#F3F2FF] p-6">
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />

    <div class="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">
      <!-- LEFT SIDE -->
      <div class="flex flex-1 flex-col items-center justify-center bg-linear-to-br from-[#6C63FF] to-[#A594F9] p-10 text-white">
        <h1 class="mb-4 text-3xl font-bold">Faaji Sticks</h1>
        <p class="mb-6 max-w-md text-center">
          Your seamless way to create, track, and resolve tickets — all in one
          place.
        </p>
        <img src="/src/ticket.jpg" alt="Login Illustration" class="w-[200px] md:w-[220px]" />
      </div>

      <!-- RIGHT SIDE -->
      <div class="flex flex-1 flex-col justify-center px-8 py-10 md:px-16">
        <h2 class="mb-1 text-2xl font-semibold text-[#2D2A3E]">Welcome Back</h2>
        <p class="mb-8 text-[#6B6780]">Login to manage your tickets</p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="mb-1 block font-medium text-[#2D2A3E]">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="mb-1 block font-medium text-[#2D2A3E]">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="********"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="w-full rounded-lg bg-[#6C63FF] py-3 font-medium text-white transition-all duration-300 hover:bg-[#4B47CC]"
          >
            Login
          </button>

          <!-- Redirect -->
          <p class="mt-3 text-center text-[#6B6780]">
            Don’t have an account?
            <RouterLink to="/sign-up" class="font-semibold text-[#6C63FF] hover:underline">
              Sign up
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const toast = reactive({ show: false, message: "", type: "" });
const errors = reactive({});

function showToast(message, type = "info") {
  toast.show = true;
  toast.message = message;
  toast.type = type;
  setTimeout(() => {
    toast.show = false;
    toast.message = "";
    toast.type = "";
  }, 3000);
}

function handleSubmit() {
  errors.email = email.value ? "" : "Email is required";
  errors.password = password.value ? "" : "Password is required";

  if (errors.email || errors.password) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.email === email.value && u.password === password.value
  );

  if (!user) {
    showToast("Invalid email or password", "error");
    return;
  }

  sessionStorage.setItem(
    "ticketapp_session",
    JSON.stringify({ name: user.name, email: user.email })
  );

  showToast("Login successful!", "success");

  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
}
</script>
