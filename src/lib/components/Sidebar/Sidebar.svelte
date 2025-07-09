<script lang="ts">
  import { Select } from '$lib/components/ui';
  import { autoBetIntervalMs, rowCountOptions } from '$lib/constants/game';
  import {
    balance,
    betAmount,
    betAmountOfExistingBalls,
    plinkoEngine,
    riskLevel,
    rowCount,
  } from '$lib/stores/game';
  import { isGameSettingsOpen, isLiveStatsOpen } from '$lib/stores/layout';
  import { BetMode, RiskLevel } from '$lib/types';
  import { flyAndScale } from '$lib/utils/transitions';
  import { Popover, Tooltip } from 'bits-ui';
  import ChartLine from 'phosphor-svelte/lib/ChartLine';
  import GearSix from 'phosphor-svelte/lib/GearSix';
  import Infinity from 'phosphor-svelte/lib/Infinity';
  import Question from 'phosphor-svelte/lib/Question';
  import type { FormEventHandler } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  let betMode: BetMode = $state(BetMode.MANUAL);

  /**
   * When `betMode` is `AUTO`, the number of bets to be placed. Zero means infinite bets.
   */
  let autoBetInput = $state(0);

  /**
   * Number of auto bets remaining when `betMode` is `AUTO`.
   *
   * - `number`: Finite count of how many bets left. It decrements from `autoBetInput` to 0.
   * - `null`: For infinite bets (i.e. `autoBetInput` is 0).
   */
  let autoBetsLeft: number | null = $state(null);

  let autoBetInterval: ReturnType<typeof setInterval> | null = $state(null);

  let isBetAmountNegative = $derived($betAmount < 0);
  let isBetExceedBalance = $derived($betAmount > $balance);
  let isAutoBetInputNegative = $derived(autoBetInput < 0);

  let isDropBallDisabled = $derived(
    $plinkoEngine === null || isBetAmountNegative || isBetExceedBalance || isAutoBetInputNegative,
  );

  let hasOutstandingBalls = $derived(Object.keys($betAmountOfExistingBalls).length > 0);

  const handleBetAmountFocusOut: FormEventHandler<HTMLInputElement> = (e) => {
    const parsedValue = parseFloat(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
      $betAmount = -1; // If input field is empty, this forces re-render so its value resets to 0
      $betAmount = 0;
    } else {
      $betAmount = parsedValue;
    }
  };

  function resetAutoBetInterval() {
    if (autoBetInterval !== null) {
      clearInterval(autoBetInterval);
      autoBetInterval = null;
    }
  }

  function autoBetDropBall() {
    if (isBetExceedBalance) {
      resetAutoBetInterval();
      return;
    }

    // Infinite mode
    if (autoBetsLeft === null) {
      $plinkoEngine?.dropBall();
      return;
    }

    // Finite mode
    if (autoBetsLeft > 0) {
      $plinkoEngine?.dropBall();
      autoBetsLeft -= 1;
    }
    if (autoBetsLeft === 0 && autoBetInterval !== null) {
      resetAutoBetInterval();
      return;
    }
  }

  const handleAutoBetInputFocusOut: FormEventHandler<HTMLInputElement> = (e) => {
    const parsedValue = parseInt(e.currentTarget.value.trim());
    if (isNaN(parsedValue)) {
      autoBetInput = -1; // If input field is empty, this forces re-render so its value resets to 0
      autoBetInput = 0;
    } else {
      autoBetInput = parsedValue;
    }
  };

  function handleBetClick() {
    if (betMode === BetMode.MANUAL) {
      $plinkoEngine?.dropBall();
    } else if (autoBetInterval === null) {
      autoBetsLeft = autoBetInput === 0 ? null : autoBetInput;
      autoBetInterval = setInterval(autoBetDropBall, autoBetIntervalMs);
    } else if (autoBetInterval !== null) {
      resetAutoBetInterval();
    }
  }

  const betModes = [
    { value: BetMode.MANUAL, label: 'Manual' },
    { value: BetMode.AUTO, label: 'Auto' },
  ];
  const riskLevels = [
    { value: RiskLevel.LOW, label: 'Low' },
    { value: RiskLevel.MEDIUM, label: 'Medium' },
    { value: RiskLevel.HIGH, label: 'High' },
  ];
</script>

<!-- bet controls -->
<div
  class="fixed right-0 bottom-0 left-0 z-50 mx-4 mb-4 flex
  w-auto flex-col gap-4 rounded-lg bg-[#333742] p-4 shadow-xl"
  style="box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18);"
>
  <div class="flex gap-1 rounded-lg border-2 border-[#3D424E] bg-[#2C303B] p-1">
    {#each betModes as { value, label }}
      <button
        disabled={autoBetInterval !== null}
        onclick={() => (betMode = value)}
        class={twMerge(
          'flex-1 rounded-lg py-2 text-sm font-medium text-white transition hover:not-disabled:bg-slate-600 active:not-disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50',
          // betMode === value && 'bg-slate-600',
          betMode === value && 'bg-[#1ACB37] text-black',
        )}
      >
        {label}
      </button>
    {/each}
  </div>

  {#if betMode === BetMode.AUTO}
    <div class="flex gap-4">
      <div class="flex flex-1 flex-col gap-2">
        <label for="riskLevel" class="text-sm font-medium text-slate-300">Risk Level</label>
        <Select
          id="riskLevel"
          bind:value={$riskLevel}
          items={riskLevels}
          disabled={hasOutstandingBalls || autoBetInterval !== null}
        />
      </div>
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex items-center gap-1">
          <label for="autoBetInput" class="text-sm font-medium text-slate-300">Number of Bets</label
          >
          <Popover.Root>
            <Popover.Trigger class="p-1">
              <Question class="text-slate-300" weight="bold" />
            </Popover.Trigger>
            <Popover.Content
              class="z-30 max-w-lg rounded-md bg-white p-3 text-sm font-medium text-gray-950 drop-shadow-xl"
            >
              <p>Enter '0' for unlimited bets.</p>
              <Popover.Arrow />
            </Popover.Content>
          </Popover.Root>
        </div>
        <div class="relative">
          <input
            id="autoBetInput"
            value={autoBetInterval === null ? autoBetInput : autoBetsLeft ?? 0}
            disabled={autoBetInterval !== null}
            onfocusout={handleAutoBetInputFocusOut}
            type="number"
            min="0"
            inputmode="numeric"
            class={twMerge(
              'w-full rounded-md border-2 border-slate-600 bg-slate-900 py-2 pr-8 pl-3 text-sm text-white transition-colors hover:cursor-pointer hover:not-disabled:border-slate-500 focus:border-slate-500 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
              isAutoBetInputNegative && 'border-red-500 hover:border-red-400 focus:border-red-400',
            )}
          />
          {#if autoBetInput === 0}
            <Infinity class="absolute top-3 right-3 size-4 text-slate-400" weight="bold" />
          {/if}
        </div>
        {#if isAutoBetInputNegative}
          <p class="text-xs leading-5 text-red-400">This must be greater than or equal to 0.</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex flex-col gap-2">
      <label for="riskLevel" class="text-sm font-medium text-slate-300">Risk Level</label>
      <Select
        id="riskLevel"
        bind:value={$riskLevel}
        items={riskLevels}
        disabled={hasOutstandingBalls || autoBetInterval !== null}
      />
    </div>
  {/if}

  <div class="relative flex flex-col gap-2">
    <label for="betAmount" class="text-sm font-medium text-slate-300">Bet Amount</label>
    <div class="flex items-end gap-2">
      <div class="relative w-1/2">
        <input
          id="betAmount"
          value={$betAmount}
          onfocusout={handleBetAmountFocusOut}
          disabled={autoBetInterval !== null}
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          class={twMerge(
            'w-full rounded-lg border-2 border-slate-600 bg-slate-900 py-4 pr-2 pl-7 text-lg text-white transition-colors hover:cursor-pointer hover:not-disabled:border-slate-500 focus:border-slate-500 focus:outline-hidden  disabled:cursor-not-allowed disabled:opacity-50',
            (isBetAmountNegative || isBetExceedBalance) &&
              'border-red-500 hover:not-disabled:border-red-400 focus:border-red-400',
          )}
        />
        <div class="absolute top-4 left-3 text-lg text-slate-500 select-none" aria-hidden="true">
          ₹
        </div>
      </div>
      <!-- <button
        disabled={autoBetInterval !== null}
        onclick={() => {
          $betAmount = parseFloat(($betAmount / 2).toFixed(2));
        }}
        class="touch-manipulation bg-slate-600 px-4 font-bold text-white diagonal-fractions transition-colors hover:not-disabled:bg-slate-500 active:not-disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        1/2
      </button>
      <button
        disabled={autoBetInterval !== null}
        onclick={() => {
          $betAmount = parseFloat(($betAmount * 2).toFixed(2));
        }}
        class="relative touch-manipulation rounded-r-md bg-slate-600 px-4 text-sm font-bold text-white transition-colors after:absolute after:left-0 after:inline-block after:h-1/2 after:w-[2px] after:bg-slate-800 after:content-[''] hover:not-disabled:bg-slate-500 active:not-disabled:bg-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        2×
      </button> -->
      <button
        onclick={handleBetClick}
        disabled={isDropBallDisabled}
        class={twMerge(
          'w-1/2 touch-manipulation rounded-md py-4 text-lg font-semibold text-slate-900 transition-colors',
          betMode === BetMode.MANUAL
            ? 'bg-[#1ACB37] hover:bg-[#30D44A] active:bg-[#1DAA34] disabled:bg-[#52525B] disabled:text-neutral-400'
            : autoBetInterval !== null
              ? 'bg-[#FF6565] hover:bg-[#FF7575] active:bg-[#FF5555]'
              : 'bg-[#1ACB37] hover:bg-[#30D44A] active:bg-[#1DAA34] disabled:bg-[#52525B] disabled:text-neutral-400',
        )}
      >
        {#if betMode === BetMode.MANUAL}
          Bet
        {:else if autoBetInterval !== null}
          Stop
        {:else}
          Start
        {/if}
      </button>
    </div>
    {#if isBetAmountNegative}
      <p class="absolute text-xs leading-5 text-red-400">
        This must be greater than or equal to 0.
      </p>
    {:else if isBetExceedBalance}
      <p class="absolute text-xs leading-5 text-red-400">Can't bet more than your balance!</p>
    {/if}
  </div>
</div>
