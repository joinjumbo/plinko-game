import { LOCAL_STORAGE_KEY } from '$lib/constants/game';
import { balance, cwBalance } from '$lib/stores/game';
import { get } from 'svelte/store';

export function setBalanceFromLocalStorage() {
  // Load GT balance
  const rawGtValue = window.localStorage.getItem(LOCAL_STORAGE_KEY.GT_BALANCE);
  const parsedGtValue = parseFloat(rawGtValue ?? '');
  if (!isNaN(parsedGtValue)) {
    balance.set(parsedGtValue);
  }
  
  // Load CW balance
  const rawCwValue = window.localStorage.getItem(LOCAL_STORAGE_KEY.CW_BALANCE);
  const parsedCwValue = parseFloat(rawCwValue ?? '');
  if (!isNaN(parsedCwValue)) {
    cwBalance.set(parsedCwValue);
  }
}

export function writeBalanceToLocalStorage() {
  // Save GT balance
  const gtBalanceVal = get(balance);
  if (!isNaN(gtBalanceVal)) {
    const gtBalanceValStr = gtBalanceVal.toFixed(2);
    window.localStorage.setItem(LOCAL_STORAGE_KEY.GT_BALANCE, gtBalanceValStr);
  }
  
  // Save CW balance
  const cwBalanceVal = get(cwBalance);
  if (!isNaN(cwBalanceVal)) {
    const cwBalanceValStr = cwBalanceVal.toFixed(2);
    window.localStorage.setItem(LOCAL_STORAGE_KEY.CW_BALANCE, cwBalanceValStr);
  }
}
