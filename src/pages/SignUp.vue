<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";

const router = useRouter();
const toast = reactive({ show: false, message: "", type: "" });

const formData = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({});

const showToast = (message, type = "info") => {
  toast.show = true;
  toast.message = message;
  toast.type = type;
  setTimeout(() => {
    toast.show = false;
    toast.message = "";
    toast.type = "";
  }, 3000);
};

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (!formData.name) errors.name = "Full name is required";
  if (!formData.email) errors.email = "Email is required";
  if (!formData.password) errors.password = "Password is required";
  if (formData.password.length < 6)
    errors.password = "Password must be at least 6 characters";
  if (formData.confirmPassword !== formData.password)
    errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length > 0) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find((u) => u.email === formData.email);

  if (existingUser) {
    showToast("User with this email already exists", "error");
    return;
  }

  users.push({
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });

  localStorage.setItem("users", JSON.stringify(users));
  showToast("Account created successfully!", "success");

  setTimeout(() => {
    router.push("/sign-in");
  }, 1000);
};
</script>

<template>
  <section class="flex min-h-screen items-center justify-center bg-[#F3F2FF] p-6">
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />

    <div
      class="flex w-full max-w-[1440px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row"
    >
      <!-- LEFT SIDE -->
      <div
        class="flex flex-1 flex-col items-center justify-center bg-linear-to-br from-[#6C63FF] to-[#A594F9] p-10 text-white"
      >
        <h1 class="mb-4 text-3xl font-bold">Faaji Sticks</h1>
        <p class="mb-6 max-w-md text-center">
          Join Faaji Sticks and simplify ticket management — from creation to
          resolution.
        </p>
        <img
          src="/src/ticket.jpg"
          alt="Login Illustration"
          class="w-[200px] md:w-[200px]"
        />
      </div>

      <!-- RIGHT SIDE -->
      <div class="flex flex-1 flex-col justify-center px-8 py-10 md:px-16">
        <h2 class="mb-1 text-2xl font-semibold text-[#2D2A3E]">
          Create Account
        </h2>
        <p class="mb-8 text-[#6B6780]">Sign up to start managing tickets</p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="name" class="mb-1 block font-medium text-[#2D2A3E]">
              Full Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              placeholder="John Doe"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <label for="email" class="mb-1 block font-medium text-[#2D2A3E]">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="password" class="mb-1 block font-medium text-[#2D2A3E]">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="********"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="mb-1 block font-medium text-[#2D2A3E]"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="********"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#6C63FF] focus:outline-none"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-[#6C63FF] py-3 font-medium text-white transition-all duration-300 hover:bg-[#4B47CC]"
          >
            Sign Up
          </button>

          <p class="mt-3 text-center text-[#6B6780]">
            Already have an account?
            <RouterLink to="/sign-in" class="font-semibold text-[#6C63FF]">
              Login
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
