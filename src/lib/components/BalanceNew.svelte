<script lang="ts">
  import { balance } from '$lib/stores/game';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Popover } from 'bits-ui';

  let balanceFormatted = $derived(
    $balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  );

  function abbreviate(num: number) {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  }

  const addMoneyAmounts = [100, 500, 1000];
  let mockBalance = 1310;
  let mockBalanceFormatted = $derived(abbreviate(mockBalance));
</script>

<div class="flex flex-col gap-1 rounded-lg border border-white/5 px-2 py-1.5 shadow-sm">
  <div class="flex flex-row items-center gap-1">
    <span class="flex h-3 w-3 items-center justify-center">
      <!-- Blue hexagon icon -->
      <svg width="10" height="10" viewBox="0 0 40 40" fill="none">
        <polygon
          points="20,3 37,12 37,28 20,37 3,28 3,12"
          fill="#1DE6FF"
          stroke="#0BC2E6"
          stroke-width="2"
        />
        <circle cx="20" cy="20" r="7" fill="#0BC2E6" opacity="0.7" />
        <circle cx="20" cy="20" r="2.5" fill="#fff" opacity="0.8" />
      </svg>
    </span>
    <span class="mr-1 min-w-[1.5rem] text-[10px] leading-none font-bold text-white drop-shadow-sm"
      >{abbreviate($balance)}</span
    >
    <Popover.Root>
      <Popover.Trigger
        class="ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-md border-none bg-[#1ACB37] text-[10px] font-bold text-white shadow-sm transition-colors hover:bg-[#17b32f]"
        >+</Popover.Trigger
      >
      <Popover.Content
        forceMount
        sideOffset={8}
        class="z-30 max-w-xs rounded-lg bg-[#22272e] p-3 text-white shadow-lg"
      >
        {#snippet child({ wrapperProps, props, open })}
          {#if open}
            <div {...wrapperProps}>
              <div {...props} transition:flyAndScale>
                <p class="mb-2 text-base font-semibold">Add money</p>
                <div class="flex gap-2">
                  {#each addMoneyAmounts as amount}
                    <button
                      onclick={() => ($balance += amount)}
                      class="cursor-pointer rounded-md border-none bg-[#1ACB37] px-3 py-1 text-base font-bold text-[#222] transition-colors hover:bg-[#17b32f]"
                    >
                      +₹{amount}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/snippet}
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="flex flex-row items-center gap-1">
    <span class="flex h-3 w-3 items-center justify-center">
      <!-- Cash stack icon -->
      <svg width="10" height="10" viewBox="0 0 32 32" fill="none">
        <rect
          x="2"
          y="10"
          width="28"
          height="12"
          rx="3"
          fill="#1ACB37"
          stroke="#0B8A24"
          stroke-width="2"
        />
        <rect x="8" y="14" width="16" height="4" rx="1" fill="#fff" opacity="0.7" />
        <rect x="14" y="10" width="4" height="12" rx="1" fill="#FFD600" opacity="0.7" />
        <rect x="6" y="22" width="20" height="2" rx="1" fill="#0B8A24" opacity="0.2" />
        <rect x="6" y="8" width="20" height="2" rx="1" fill="#0B8A24" opacity="0.2" />
        <rect x="12" y="16" width="8" height="2" rx="1" fill="#fff" opacity="0.5" />
      </svg>
    </span>
    <span class="min-w-[1.5rem] text-[10px] leading-none font-bold text-white drop-shadow-sm"
      >{mockBalanceFormatted}</span
    >
  </div>
</div>
