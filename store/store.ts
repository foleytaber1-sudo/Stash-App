import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Account = {
  id: string;
  name: string;
  balance: number;
};

export type Envelope = {
  id: string;
  name: string;
  balance: number;
  goalAmount: number;
  icon: string;
};

export type Transaction = {
  id: string;
  type:
    | 'income'
    | 'stuff'
    | 'spend'
    | 'transfer'
    | 'delete-envelope'
    | 'delete-account';
  amount: number;
  date: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  envelopeId?: string;
  description: string;
  locked?: boolean;
};

type StashStore = {
  accounts: Account[];
  envelopes: Envelope[];
  transactions: Transaction[];
  addAccount: (name: string, balance: number) => void;
  editAccountName: (id: string, name: string) => void;
  deleteAccount: (id: string) => void;
  addEnvelope: (name: string, icon?: string) => void;
  editEnvelopeName: (id: string, name: string) => void;
  editEnvelopeGoal: (id: string, goalAmount: number) => void;
  editEnvelopeIcon: (id: string, icon: string) => void;
  stuffEnvelope: (id: string, amount: number) => void;
  deleteEnvelope: (id: string) => void;
  addIncome: (accountId: string, amount: number) => void;
  transferBetweenAccounts: (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string
  ) => void;
  spendFromEnvelope: (
    envelopeId: string,
    accountId: string,
    amount: number,
    note?: string
  ) => void;
  deleteTransaction: (id: string) => void;
  resetApp: () => void;
};

const now = () => new Date().toISOString();

export const useStashStore = create<StashStore>()(
  persist(
    (set) => ({
      accounts: [],
      envelopes: [],
      transactions: [],

      addAccount: (name, balance) =>
        set((state) => {
          const accountId = Date.now().toString();

          return {
            accounts: [...state.accounts, { id: accountId, name, balance }],
            transactions:
              balance > 0
                ? [
                    {
                      id: `${Date.now()}-starting-balance`,
                      type: 'income',
                      amount: balance,
                      date: now(),
                      accountId,
                      description: `Starting balance for ${name}`,
                      locked: true,
                    },
                    ...state.transactions,
                  ]
                : state.transactions,
          };
        }),

      editAccountName: (id, name) =>
        set((state) => ({
          accounts: state.accounts.map((item) =>
            item.id === id ? { ...item, name } : item
          ),
        })),

      deleteAccount: (id) =>
        set((state) => {
          const account = state.accounts.find((item) => item.id === id);

          return {
            accounts: state.accounts.filter((item) => item.id !== id),
            transactions: account
              ? [
                  {
                    id: Date.now().toString(),
                    type: 'delete-account',
                    amount: account.balance,
                    date: now(),
                    accountId: id,
                    description: `Deleted account ${account.name}`,
                    locked: true,
                  },
                  ...state.transactions,
                ]
              : state.transactions,
          };
        }),

      addEnvelope: (name, icon = '💵') =>
        set((state) => ({
          envelopes: [
            ...state.envelopes,
            {
              id: Date.now().toString(),
              name,
              balance: 0,
              goalAmount: 0,
              icon,
            },
          ],
        })),

      editEnvelopeName: (id, name) =>
        set((state) => ({
          envelopes: state.envelopes.map((item) =>
            item.id === id ? { ...item, name } : item
          ),
        })),

      editEnvelopeGoal: (id, goalAmount) =>
        set((state) => ({
          envelopes: state.envelopes.map((item) =>
            item.id === id ? { ...item, goalAmount } : item
          ),
        })),

      editEnvelopeIcon: (id, icon) =>
        set((state) => ({
          envelopes: state.envelopes.map((item) =>
            item.id === id ? { ...item, icon } : item
          ),
        })),

      stuffEnvelope: (id, amount) =>
        set((state) => {
          const envelope = state.envelopes.find((item) => item.id === id);

          return {
            envelopes: state.envelopes.map((item) =>
              item.id === id
                ? { ...item, balance: item.balance + amount }
                : item
            ),
            transactions: [
              {
                id: Date.now().toString(),
                type: 'stuff',
                amount,
                date: now(),
                envelopeId: id,
                description: `Stuffed ${envelope?.name ?? 'Envelope'}`,
              },
              ...state.transactions,
            ],
          };
        }),

      deleteEnvelope: (id) =>
        set((state) => {
          const envelope = state.envelopes.find((item) => item.id === id);

          return {
            envelopes: state.envelopes.filter((item) => item.id !== id),
            transactions: envelope
              ? [
                  {
                    id: Date.now().toString(),
                    type: 'delete-envelope',
                    amount: envelope.balance,
                    date: now(),
                    envelopeId: id,
                    description: `Deleted ${envelope.name} and returned $${envelope.balance.toFixed(
                      2
                    )} to Available To Stuff`,
                    locked: true,
                  },
                  ...state.transactions,
                ]
              : state.transactions,
          };
        }),

      addIncome: (accountId, amount) =>
        set((state) => {
          const account = state.accounts.find((item) => item.id === accountId);

          return {
            accounts: state.accounts.map((item) =>
              item.id === accountId
                ? { ...item, balance: item.balance + amount }
                : item
            ),
            transactions: [
              {
                id: Date.now().toString(),
                type: 'income',
                amount,
                date: now(),
                accountId,
                description: `Income to ${account?.name ?? 'Account'}`,
              },
              ...state.transactions,
            ],
          };
        }),

      transferBetweenAccounts: (fromAccountId, toAccountId, amount, note) =>
        set((state) => {
          const fromAccount = state.accounts.find(
            (item) => item.id === fromAccountId
          );
          const toAccount = state.accounts.find((item) => item.id === toAccountId);
          const cleanNote = note?.trim();

          if (!fromAccount || !toAccount) return state;
          if (fromAccountId === toAccountId) return state;
          if (amount <= 0) return state;

          return {
            accounts: state.accounts.map((item) => {
              if (item.id === fromAccountId) {
                return { ...item, balance: item.balance - amount };
              }

              if (item.id === toAccountId) {
                return { ...item, balance: item.balance + amount };
              }

              return item;
            }),
            transactions: [
              {
                id: Date.now().toString(),
                type: 'transfer',
                amount,
                date: now(),
                fromAccountId,
                toAccountId,
                description: cleanNote
                  ? `${cleanNote} • Transfer from ${fromAccount.name} to ${toAccount.name}`
                  : `Transfer from ${fromAccount.name} to ${toAccount.name}`,
              },
              ...state.transactions,
            ],
          };
        }),

      spendFromEnvelope: (envelopeId, accountId, amount, note) =>
        set((state) => {
          const envelope = state.envelopes.find((item) => item.id === envelopeId);
          const account = state.accounts.find((item) => item.id === accountId);
          const cleanNote = note?.trim();

          return {
            envelopes: state.envelopes.map((item) =>
              item.id === envelopeId
                ? { ...item, balance: item.balance - amount }
                : item
            ),
            accounts: state.accounts.map((item) =>
              item.id === accountId
                ? { ...item, balance: item.balance - amount }
                : item
            ),
            transactions: [
              {
                id: Date.now().toString(),
                type: 'spend',
                amount,
                date: now(),
                accountId,
                envelopeId,
                description: cleanNote
                  ? `${cleanNote} • ${envelope?.name ?? 'Envelope'} • ${
                      account?.name ?? 'Account'
                    }`
                  : `Spent from ${
                      envelope?.name ?? 'Envelope'
                    } using ${account?.name ?? 'Account'}`,
              },
              ...state.transactions,
            ],
          };
        }),

      deleteTransaction: (id) =>
        set((state) => {
          const transaction = state.transactions.find((item) => item.id === id);

          if (!transaction) return state;

          if (
            transaction.locked ||
            transaction.type === 'delete-envelope' ||
            transaction.type === 'delete-account'
          ) {
            return state;
          }

          let updatedAccounts = state.accounts;
          let updatedEnvelopes = state.envelopes;

          if (transaction.type === 'income' && transaction.accountId) {
            updatedAccounts = state.accounts.map((account) =>
              account.id === transaction.accountId
                ? { ...account, balance: account.balance - transaction.amount }
                : account
            );
          }

          if (transaction.type === 'stuff' && transaction.envelopeId) {
            updatedEnvelopes = state.envelopes.map((envelope) =>
              envelope.id === transaction.envelopeId
                ? { ...envelope, balance: envelope.balance - transaction.amount }
                : envelope
            );
          }

          if (
            transaction.type === 'spend' &&
            transaction.accountId &&
            transaction.envelopeId
          ) {
            updatedAccounts = state.accounts.map((account) =>
              account.id === transaction.accountId
                ? { ...account, balance: account.balance + transaction.amount }
                : account
            );

            updatedEnvelopes = state.envelopes.map((envelope) =>
              envelope.id === transaction.envelopeId
                ? { ...envelope, balance: envelope.balance + transaction.amount }
                : envelope
            );
          }

          if (
            transaction.type === 'transfer' &&
            transaction.fromAccountId &&
            transaction.toAccountId
          ) {
            updatedAccounts = state.accounts.map((account) => {
              if (account.id === transaction.fromAccountId) {
                return { ...account, balance: account.balance + transaction.amount };
              }

              if (account.id === transaction.toAccountId) {
                return { ...account, balance: account.balance - transaction.amount };
              }

              return account;
            });
          }

          return {
            accounts: updatedAccounts,
            envelopes: updatedEnvelopes,
            transactions: state.transactions.filter((item) => item.id !== id),
          };
        }),

      resetApp: () =>
        set({
          accounts: [],
          envelopes: [],
          transactions: [],
        }),
    }),
    {
      name: 'stash-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);