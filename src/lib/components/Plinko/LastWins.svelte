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

<!-- LastWins with smaller size and adjusted font -->
<div class="flex flex-row gap-1 overflow-hidden">
  {#each lastWins as { binIndex, rowCount, payout: { multiplier } }, index}
    <div
      class="flex items-center justify-center px-2 py-1.5 text-xs font-bold text-gray-950 {index === 0 ? 'rounded-l-md' : ''} {index === lastWins.length - 1 ? 'rounded-r-md' : ''}"
      style:background-color={binColorsByRowCount[rowCount].background[binIndex]}
    >
      {multiplier}{multiplier < 100 ? '×' : ''}
    </div>
  {/each}
</div>
