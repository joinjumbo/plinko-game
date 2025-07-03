<script lang="ts">
  import ogImage from '$lib/assets/og_image.jpg';
  import type { Snippet } from 'svelte';
  import '../app.css';

  let { children }: { children: Snippet } = $props();

  // --- Responsive breakpoint detection ---
  // Mobile: < 640px, Tablet: 640px - 1023px, Desktop: >= 1024px
  let isMobileOrTablet = true;

  function checkBreakpoint() {
    if (typeof window !== 'undefined') {
      isMobileOrTablet = window.innerWidth < 1024;
    }
  }

  // Initial check and listen for resize
  if (typeof window !== 'undefined') {
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkBreakpoint);
    }
  });
</script>

<svelte:head>
  <title>Plinko</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    rel="stylesheet"
  />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Plinko" />
  <meta property="og:url" content="https://plinko-web-game.netlify.app/" />
  <meta property="og:image" content={ogImage} />
</svelte:head>

{#if isMobileOrTablet}
  {@render children?.()}
{:else}
  <div class="bg-opacity-95 fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900">
    <div class="max-w-lg rounded-xl border-2 border-red-500 bg-gray-800 p-10 shadow-2xl">
      <h1 class="mb-4 text-center text-3xl font-bold text-red-400">Unsupported Device</h1>
      <p class="text-center text-lg text-white">
        The Plinko game is only available on mobile and tablet devices.<br />
        Please use a smaller screen to access the site.
      </p>
    </div>
  </div>
{/if}
