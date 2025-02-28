<template>
  <component
    :is="as"
    v-bind="$props"
    :class="linkUI"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { twMerge } from "tailwind-merge";

import type { NuxtLinkProps } from "#app";
import { NuxtLink } from "#components";

const { ui, type = "inline", as = NuxtLink } = defineProps<
  NuxtLinkProps & {
    ui?: string;
    type?: "primary" | "secondary" | "ghost" | "tertiary" | "inline";
    as?: string | Component;
  }
>();

const linkUI = computed(() => {
  let base
    = "inline-block inline-flex items-center justify-center border border-transparent px-4 py-4 align-middle leading-3 focus:outline-none focus:ring-4 focus:ring-primary-400 focus:ring-opacity-50 dark:focus:ring-blue-800 dark:focus:ring-opacity-80";

  if (type) {
    base = twMerge(base, types[type]);
  }
  return twMerge(base, types[type], ui);
});
const types = {
  primary:
    "rounded-zk bg-neutral-950 text-neutral-100 hover:bg-neutral-800 hover:text-white active:bg-neutral-950 active:text-neutral-200 disabled:bg-neutral-700 disabled:text-neutral-400 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 dark:hover:text-neutral-950 dark:focus:bg-neutral-100 dark:focus:text-neutral-950 dark:active:bg-neutral-300 dark:disabled:hover:bg-neutral-700 dark:disabled:hover:text-neutral-400",
  secondary:
    "rounded-zk bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-800 focus:bg-neutral-300 active:bg-neutral-400 active:text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-500 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus:bg-neutral-800 dark:active:bg-neutral-900 dark:active:text-neutral-400 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-500",
  danger:
    "rounded-zk bg-error-100 text-error-950 hover:bg-error-200  active:bg-error-300 disabled:bg-transparent dark:bg-error-400/20 dark:text-error-300 dark:hover:bg-error-400/40 dark:active:bg-error-400/20",
  ghost:
    "border-b-1 rounded-none border-x-0 border-t-0 border-b-neutral-300 p-0 pb-0.5 pt-0.5 hover:border-b-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
  inline:
    "border-b-1 rounded-none border-x-0 border-t-0 border-b-neutral-300 p-0 pb-0.5 hover:border-b-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ",
  tertiary:
    "rounded-zk border-neutral-200 bg-neutral-100/50 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 active:text-neutral-950/50 disabled:bg-neutral-100 disabled:text-neutral-600 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus:text-neutral-100 dark:active:bg-neutral-900",
};
</script>
