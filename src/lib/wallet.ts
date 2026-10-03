import { EXAMPLE_WALLET, getCard } from '../data/cards';
import type { WalletEntry } from './calc';
import { KEYS, useStored } from './storage';

export function isWallet(v: unknown): v is WalletEntry[] {
  return (
    Array.isArray(v) &&
    v.every(
      (e) =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as WalletEntry).cardId === 'string' &&
        typeof (e as WalletEntry).points === 'number' &&
        Number.isFinite((e as WalletEntry).points) &&
        getCard((e as WalletEntry).cardId) !== undefined,
    )
  );
}

/** The user's wallet, seeded with the example wallet on first visit. */
export function useWallet() {
  return useStored<WalletEntry[]>(KEYS.wallet, EXAMPLE_WALLET, isWallet);
}
