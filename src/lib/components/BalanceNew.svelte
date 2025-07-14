<script lang="ts">
  import { balance, cwBalance } from '$lib/stores/game';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Popover } from 'bits-ui';

  function abbreviate(num: number) {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  }

  const addMoneyAmounts = [100, 500, 1000];
  let cwBalanceFormatted = $derived(abbreviate($cwBalance));
</script>

<Popover.Root>
  <Popover.Trigger
    class="flex min-h-[32px] cursor-pointer flex-col justify-center gap-0.5 rounded-lg border border-white/10 px-2.5 py-1 transition-colors hover:bg-white/5"
  >
    <div class="flex flex-row items-center gap-2">
      <span class="flex h-3 w-3 shrink-0 items-center justify-center">
        <!-- Blue hexagon icon -->
        <img src="/gt_icon.png" alt="GT Icon" width="10" height="10" />
      </span>
      <span class="text-[10px] leading-none font-bold whitespace-nowrap text-white"
        >{abbreviate($balance)}</span
      >
    </div>
    <div class="flex flex-row items-center gap-2">
      <span class="flex h-3 w-3 shrink-0 items-center justify-center">
        <!-- Cash stack icon -->
        <img src="/cw_icon.png" alt="CW Icon" width="10" height="10" />
      </span>
      <span class="text-[10px] leading-none font-bold whitespace-nowrap text-white"
        >{cwBalanceFormatted}</span
      >
    </div>
  </Popover.Trigger>
  <Popover.Content
    forceMount
    sideOffset={12}
    class="z-50 w-72 rounded-xl border border-white/10 bg-[#282c34]/95 p-4 text-white shadow-2xl backdrop-blur-sm"
  >
    {#snippet child({ wrapperProps, props, open })}
      {#if open}
        <div {...wrapperProps}>
          <div {...props} transition:flyAndScale>
            <div class="mb-3 flex items-center gap-2">
              <span class="flex h-4 w-4 items-center justify-center">
                <img src="/gt_icon.png" alt="GT Icon" width="12" height="12" />
              </span>
              <h3 class="text-sm font-bold text-white">Add Game Tokens</h3>
            </div>
            <div class="grid grid-cols-3 gap-2">
              {#each addMoneyAmounts as amount}
                <button
                  onclick={() => ($balance += amount)}
                  class="group relative overflow-hidden rounded-lg border border-[#1ACB37]/20 bg-gradient-to-br from-[#1ACB37] to-[#17b32f] px-3 py-2.5 text-sm font-bold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <div
                    class="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"
                  ></div>
                  <span class="relative">+{amount}</span>
                </button>
              {/each}
            </div>
            <div class="mt-3 border-t border-white/10 pt-3">
              <p class="text-center text-xs text-white/70">Click to add tokens to your balance</p>
            </div>
          </div>
        </div>
      {/if}
    {/snippet}
  </Popover.Content>
</Popover.Root>
