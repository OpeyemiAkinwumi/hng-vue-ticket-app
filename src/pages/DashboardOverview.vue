<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { logoutUser } from "../utils/auth.js";

const router = useRouter();

const user = ref(null);
const stats = ref({
  total: 0,
  open: 0,
  resolved: 0,
});

onMounted(() => {
  const session = JSON.parse(sessionStorage.getItem("ticketapp_session"));
  if (!session) {
    router.push("/sign-in");
    return;
  }

  user.value = session;

  const savedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const total = savedTickets.length;
  const open = savedTickets.filter((t) => t.status === "open").length;
  const resolved = savedTickets.filter((t) => t.status === "closed").length;

  stats.value = { total, open, resolved };
});

const handleLogout = () => {
  logoutUser();
  router.push("/sign-in");
};
</script>

<template>
  <section class="flex min-h-screen flex-col items-center bg-[#F3F2FF]">
    <div class="w-full max-w-[1440px] px-6 py-12">
      <!-- Header -->
      <div class="mb-10 flex flex-col items-center justify-between md:flex-row">
        <h1 class="text-3xl font-bold text-[#2D2A3E]">
          Welcome, {{ user?.name || "User" }} 👋
        </h1>

        <button
          @click="handleLogout"
          class="mt-4 rounded-lg bg-[#6C63FF] px-5 py-2 font-medium text-white transition-all hover:bg-[#4B47CC] md:mt-0"
        >
          Logout
        </button>
      </div>

      <!-- Stats Section -->
      <div class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div class="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md">
          <p class="text-5xl font-bold text-[#6C63FF]">{{ stats.total }}</p>
          <p class="mt-2 font-medium text-[#6B6780]">Total Tickets</p>
        </div>

        <div class="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md">
          <p class="text-5xl font-bold text-green-500">{{ stats.open }}</p>
          <p class="mt-2 font-medium text-[#6B6780]">Open Tickets</p>
        </div>

        <div class="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md">
          <p class="text-5xl font-bold text-gray-500">{{ stats.resolved }}</p>
          <p class="mt-2 font-medium text-[#6B6780]">Resolved Tickets</p>
        </div>
      </div>

      <!-- Navigation to Ticket Management -->
      <div class="flex justify-center">
        <RouterLink
          to="/dashboard/tickets"
          class="rounded-lg bg-[#A594F9] px-8 py-3 font-semibold text-white shadow transition-all hover:bg-[#8E7AF5]"
        >
          Go to Ticket Management
        </RouterLink>
      </div>
    </div>
  </section>
</template>
