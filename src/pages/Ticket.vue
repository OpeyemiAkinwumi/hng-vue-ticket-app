<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Toast from "../components/Toast.vue";

const router = useRouter();

const tickets = ref([]);
const form = reactive({ title: "", description: "", status: "open" });
const editingTicket = ref(null);
const errors = reactive({});
const toast = reactive({ show: false, message: "", type: "" });

// ✅ Load session & tickets
onMounted(() => {
  const session = JSON.parse(sessionStorage.getItem("ticketapp_session"));
  if (!session) {
    router.push("/login");
    return;
  }

  const savedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.value = savedTickets;
});

// ✅ Toast handler
function showToast(message, type = "info") {
  toast.show = true;
  toast.message = message;
  toast.type = type;

  setTimeout(() => {
    toast.show = false;
    toast.message = "";
    toast.type = "";
  }, 2500);
}

// ✅ Validate fields
function validateForm() {
  const newErrors = {};
  if (!form.title.trim()) newErrors.title = "Title is required";
  if (!["open", "in_progress", "closed"].includes(form.status))
    newErrors.status = "Status must be open, in_progress, or closed";
  return newErrors;
}

// ✅ Create or Update Ticket
function handleSubmit(e) {
  e.preventDefault();
  const newErrors = validateForm();
  Object.assign(errors, newErrors);

  if (Object.keys(newErrors).length > 0) return;

  let updatedTickets;

  if (editingTicket.value) {
    // Edit existing ticket
    updatedTickets = tickets.value.map((t) =>
      t.id === editingTicket.value.id ? { ...t, ...form } : t
    );
    showToast("Ticket updated successfully!", "success");
  } else {
    // Create new ticket
    const newTicket = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      status: form.status,
    };
    updatedTickets = [...tickets.value, newTicket];
    showToast("Ticket created successfully!", "success");
  }

  tickets.value = updatedTickets;
  localStorage.setItem("tickets", JSON.stringify(updatedTickets));

  Object.assign(form, { title: "", description: "", status: "open" });
  editingTicket.value = null;
}

// ✅ Edit ticket
function handleEdit(ticket) {
  Object.assign(form, {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
  });
  editingTicket.value = ticket;
}

// ✅ Delete ticket
function handleDelete(id) {
  if (confirm("Are you sure you want to delete this ticket?")) {
    const updated = tickets.value.filter((t) => t.id !== id);
    tickets.value = updated;
    localStorage.setItem("tickets", JSON.stringify(updated));
    showToast("Ticket deleted successfully", "success");
  }
}

// ✅ Status color helper
function getStatusColor(status) {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-600";
    case "in_progress":
      return "bg-amber-100 text-amber-600";
    case "closed":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-200 text-gray-700";
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#F3F2FF] py-10">
    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" />

    <div class="mx-auto w-full max-w-[1440px] px-6">
      <!-- Header -->
      <div class="mb-10 flex flex-col items-center justify-between md:flex-row">
        <h1 class="text-3xl font-bold text-[#2D2A3E]">Ticket Management</h1>

        <button
          @click="router.push('/dashboard')"
          class="mt-4 rounded-lg bg-[#6C63FF] px-5 py-2 font-medium text-white hover:bg-[#4B47CC] md:mt-0"
        >
          Back to Dashboard
        </button>
      </div>

      <!-- Ticket Form -->
      <div class="mb-10 rounded-2xl bg-white p-6 shadow-md">
        <h2 class="mb-4 text-xl font-semibold text-[#2D2A3E]">
          {{ editingTicket ? "Edit Ticket" : "Create New Ticket" }}
        </h2>

        <form @submit="handleSubmit" class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="col-span-1">
            <label class="block font-medium text-[#2D2A3E] mb-1">
              Title <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="form.title"
              placeholder="Ticket title"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            />
            <p v-if="errors.title" class="text-sm text-red-500 mt-1">{{ errors.title }}</p>
          </div>

          <div class="col-span-1">
            <label class="block font-medium text-[#2D2A3E] mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <p v-if="errors.status" class="text-sm text-red-500 mt-1">{{ errors.status }}</p>
          </div>

          <div class="col-span-1 md:col-span-3">
            <label class="block font-medium text-[#2D2A3E] mb-1">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Describe the issue or details..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
            ></textarea>
          </div>

          <div class="col-span-1 md:col-span-3 flex justify-end">
            <button
              type="submit"
              class="rounded-lg bg-[#6C63FF] px-6 py-2 font-medium text-white hover:bg-[#4B47CC]"
            >
              {{ editingTicket ? "Update Ticket" : "Create Ticket" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Ticket List -->
      <div>
        <h2 class="mb-4 text-xl font-semibold text-[#2D2A3E]">All Tickets</h2>

        <p v-if="tickets.length === 0" class="text-center text-[#6B6780]">
          No tickets available.
        </p>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg"
          >
            <div class="mb-3 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-[#2D2A3E]">{{ ticket.title }}</h3>
              <span
                class="rounded-full px-3 py-1 text-sm font-medium"
                :class="getStatusColor(ticket.status)"
              >
                {{ ticket.status.replace('_', ' ') }}
              </span>
            </div>

            <p class="text-sm text-[#6B6780] mb-4">
              {{ ticket.description || "No description provided." }}
            </p>

            <div class="flex justify-end gap-3">
              <button
                @click="handleEdit(ticket)"
                class="rounded-lg bg-[#A594F9] px-3 py-1 text-white hover:bg-[#8E7AF5]"
              >
                Edit
              </button>
              <button
                @click="handleDelete(ticket.id)"
                class="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
