<script lang="ts">
  import { binColorsByRowCount } from '$lib/constants/game';
  import { winRecords } from '$lib/stores/game';

  type Props = {
    /**
     * Number of last wins to display.
     */
    winCount?: number;
  };

  let { winCount = 6 }: Props = $props();

  let lastWins = $derived($winRecords.slice(-winCount).toReversed());
</script>

<!-- Clamps in mobile:
      - Height: From 1.5rem at 340px viewport width to 2rem at 620px viewport width
      - Font size: From 8px at 340px viewport width to 10px at 620px viewport width
 -->
<div
  class="flex h-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-row gap-1 overflow-hidden rounded-xs text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:h-12 lg:text-sm"
>
  {#each lastWins as { binIndex, rowCount, payout: { multiplier } }}
    <div
      class="flex aspect-square items-center justify-center font-bold text-gray-950"
      style:background-color={binColorsByRowCount[rowCount].background[binIndex]}
    >
      {multiplier}{multiplier < 100 ? '×' : ''}
    </div>
  {/each}
</div>
