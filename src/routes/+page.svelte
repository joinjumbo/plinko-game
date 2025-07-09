<script lang="ts">
  import logo from '$lib/assets/logo.svg';
  import Balance from '$lib/components/Balance.svelte';
  import LiveStatsWindow from '$lib/components/LiveStatsWindow/LiveStatsWindow.svelte';
  import Plinko from '$lib/components/Plinko';
  import SettingsWindow from '$lib/components/SettingsWindow';
  import Sidebar from '$lib/components/Sidebar';
  import { setBalanceFromLocalStorage, writeBalanceToLocalStorage } from '$lib/utils/game';
  import GitHubLogo from 'phosphor-svelte/lib/GithubLogo';

  $effect(() => {
    setBalanceFromLocalStorage();
  });
</script>

<svelte:window onbeforeunload={writeBalanceToLocalStorage} />

<div class="relative flex min-h-dvh w-full flex-col">
  <nav class="sticky top-0 z-10 w-full px-5 drop-shadow-lg">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between">
      <!-- <img src={logo} alt="logo" class="h-6 sm:h-7" /> -->
      <div class="flex items-center justify-between w-full">
        <img src={logo} alt="logo" class="h-6 sm:h-7" />
        <Balance />
      </div>
    </div>
  </nav>

  <div class="flex-1 px-2 pb-32">
    <div class="mx-auto mt-3 w-full max-w-none drop-shadow-xl">
      <div class="flex flex-col-reverse overflow-hidden">
        <div class="flex-1">
          <Plinko />
        </div>
      </div>
    </div>
  </div>

  <!-- Place Sidebar as sticky footer here -->
  <Sidebar />

  <!-- <SettingsWindow /> -->
  <LiveStatsWindow />

  <!-- <footer class="px-5 pt-16 pb-4">
    <div class="mx-auto max-w-[40rem]">
      <div aria-hidden="true" class="h-[1px] bg-slate-700"></div>
      <div class="flex items-center justify-between p-2">
        <p class="text-sm text-slate-500">
          <a
            href="https://www.ansonh.com"
            target="_blank"
            rel="noreferrer"
            class=" text-cyan-600 transition hover:text-cyan-500"
          >
            Anson Heung
          </a>
          © {new Date().getFullYear()}
        </p>
        <a
          href="https://github.com/AnsonH/plinko-game"
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-1 p-1 text-sm text-slate-500 transition hover:text-cyan-500"
        >
          <GitHubLogo class="size-4" weight="bold" />
          <span>Source Code</span>
        </a>
      </div>
    </div>
  </footer> -->
</div>

<style lang="postcss">
  @reference "../app.css";

  :global(body) {
    /* Radial gradient background: #272B34 at 0%, #181A1F at 100% */
    background: radial-gradient(circle at 50% 40%, #272b34 0%, #181a1f 100%);
  }
</style>
