<template>
  <nav
    class="border-primary-dark/40 flex h-[70px] w-full items-center justify-center border-b-[3px] bg-white"
  >
    <div
      class="text-primary-dark flex w-[90%] max-w-[1440px] items-center justify-between"
    >
      <!-- Logo -->
      <router-link to="/" class="font-main text-lg font-bold lg:text-xl">
        Faaji-Sticks
      </router-link>

      <!-- Desktop Menu -->
      <div class="hidden items-center justify-center gap-5 text-xs lg:flex">
        <router-link class="text-sm font-semibold" to="/sign-in">
          Login
        </router-link>
        <router-link
          class="hover:bg-accent bg-primary-dark rounded-full px-5 py-2 font-semibold text-white transition-all"
          to="/sign-up"
        >
          Get Started
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="text-primary-dark lg:hidden"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <component :is="isOpen ? MdCancel : GlHamburger" :size="30" />
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition name="slide-down">
      <div
        v-if="isOpen"
        class="absolute top-[70px] left-0 z-50 w-full bg-white shadow-md lg:hidden"
      >
        <div class="text-primary-dark flex flex-col items-center gap-4 py-6">
          <router-link
            class="text-sm font-semibold"
            to="/sign-in"
            @click="closeMenu"
          >
            Login
          </router-link>
          <router-link
            class="hover:bg-accent bg-primary-dark rounded-full px-5 py-2 font-semibold text-white"
            to="/sign-up"
            @click="closeMenu"
          >
            Get Started
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { GlHamburger } from "@kalimahapps/vue-icons";
import { MdCancel } from "@kalimahapps/vue-icons";
// import { FaBars, FaTimes } from "vue-icons/fa"; // uses vue-icons version

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};
</script>

<style scoped>
/* Simple slide down animation for mobile dropdown */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
