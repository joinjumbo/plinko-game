<script lang="ts">
  import { balance } from '$lib/stores/game';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Popover } from 'bits-ui';


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

<Popover.Root>
  <Popover.Trigger
    class="flex cursor-pointer flex-col justify-center gap-0.5 rounded-lg border border-white/10 px-2.5 py-1 transition-colors hover:bg-white/5 min-h-[32px]"
  >
    <div class="flex flex-row items-center gap-2">
      <span class="flex h-3 w-3 items-center justify-center shrink-0">
        <!-- Blue hexagon icon -->
        <img src="/gt_icon.png" alt="GT Icon" width="10" height="10" />
      </span>
      <span class="text-[10px] leading-none font-bold text-white whitespace-nowrap"
        >{abbreviate($balance)}</span
      >
    </div>
    <div class="flex flex-row items-center gap-2">
      <span class="flex h-3 w-3 items-center justify-center shrink-0">
        <!-- Cash stack icon -->
        <img src="/cw_icon.png" alt="CW Icon" width="10" height="10" />
      </span>
      <span class="text-[10px] leading-none font-bold text-white whitespace-nowrap">{mockBalanceFormatted}</span>
    </div>
  </Popover.Trigger>
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
