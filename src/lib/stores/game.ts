import PlinkoEngine from '$lib/components/Plinko/PlinkoEngine';
import { binColor } from '$lib/constants/game';
import {
  RiskLevel,
  type BetAmountOfExistingBalls,
  type RowCount,
  type WinRecord,
} from '$lib/types';
import { interpolateRgbColors } from '$lib/utils/colors';
import { countValueOccurrences } from '$lib/utils/numbers';
import { derived, writable } from 'svelte/store';

export const plinkoEngine = writable<PlinkoEngine | null>(null);

export const betAmount = writable<number>(1);

export const betAmountOfExistingBalls = writable<BetAmountOfExistingBalls>({});

export const rowCount = writable<RowCount>(10);

export const riskLevel = writable<RiskLevel>(RiskLevel.MEDIUM);

export const winRecords = writable<WinRecord[]>([]);

/**
 * History of total profits. Should be updated whenever a new win record is pushed
 * to `winRecords` store.
 *
 * We deliberately don't use `derived(winRecords, ...)` to optimize performance.
 */
export const totalProfitHistory = writable<number[]>([0]);

/**
 * Game Token (GT) balance - used for betting, saved to local storage.
 *
 * We only save the balance to local storage on browser `beforeunload` event instead of
 * on every balance change. This prevents unnecessary writes to local storage, which can
 * be slow on low-end devices.
 */
export const balance = writable<number>(0);

/**
 * Cash Withdrawal (CW) balance - earned from wins, saved to local storage.
 */
export const cwBalance = writable<number>(0);

/**
 * RGB colors for every bin. The length of the array is the number of bins.
 * Alternate bins are colored differently to indicate GT vs CW rewards.
 */
export const binColors = derived<typeof rowCount, { background: string[]; shadow: string[]; currencyType: string[] }>(
  rowCount,
  ($rowCount) => {
    const binCount = $rowCount + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);

    const redToYellowBg = interpolateRgbColors(
      binColor.background.red,
      binColor.background.yellow,
      redToYellowLength,
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    const redToYellowShadow = interpolateRgbColors(
      binColor.shadow.red,
      binColor.shadow.yellow,
      redToYellowLength,
    ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

    const baseBackground = [...redToYellowBg, ...redToYellowBg.toReversed().slice(isBinsEven ? 0 : 1)];
    const baseShadow = [...redToYellowShadow, ...redToYellowShadow.toReversed().slice(isBinsEven ? 0 : 1)];
    
    // Add blue tint to CW bins (even indices)
    const background = baseBackground.map((color, index) => {
      if (index % 2 === 0) {
        // CW bins - add blue tint
        const rgb = color.match(/\d+/g)!.map(Number);
        return `rgb(${Math.max(0, rgb[0] - 50)}, ${Math.max(0, rgb[1] - 30)}, ${Math.min(255, rgb[2] + 80)})`;
      }
      return color; // GT bins - keep original
    });
    
    const shadow = baseShadow.map((color, index) => {
      if (index % 2 === 0) {
        // CW bins - add blue tint to shadow
        const rgb = color.match(/\d+/g)!.map(Number);
        return `rgb(${Math.max(0, rgb[0] - 30)}, ${Math.max(0, rgb[1] - 20)}, ${Math.min(255, rgb[2] + 50)})`;
      }
      return color; // GT bins - keep original
    });

    const currencyType = Array.from({ length: binCount }, (_, index) => index % 2 === 0 ? 'CW' : 'GT');

    return {
      background,
      shadow,
      currencyType,
    };
  },
);

export const binProbabilities = derived<
  [typeof winRecords, typeof rowCount],
  { [binIndex: number]: number }
>([winRecords, rowCount], ([$winRecords, $rowCount]) => {
  const occurrences = countValueOccurrences($winRecords.map(({ binIndex }) => binIndex));
  const probabilities: Record<number, number> = {};
  for (let i = 0; i < $rowCount + 1; ++i) {
    probabilities[i] = occurrences[i] / $winRecords.length || 0;
  }
  return probabilities;
});
