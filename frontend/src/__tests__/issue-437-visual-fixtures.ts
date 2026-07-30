import { vi } from 'vitest'
import type {
  Account,
  BankConnection,
  Category,
  CategoryGroup,
  Payee,
  Rule,
  Transaction,
  User,
  Workspace,
} from '@/types'

const USER_ID = 'visual-user'

export const visualUser: User = {
  id: USER_ID,
  email: 'issue437@example.com',
  is_active: true,
  is_superuser: false,
  is_verified: true,
  is_2fa_enabled: false,
  preferences: {
    currency_display: 'BRL',
    date_format: 'DD/MM/YYYY',
    language: 'pt-BR',
    onboarding_completed: true,
  },
}

export const visualWorkspace: Workspace = {
  id: 'visual-workspace',
  name: 'Pessoal',
  kind: 'personal',
  is_archived: false,
  default_currency: 'BRL',
  locale: 'pt-BR',
  icon: null,
  color: null,
  created_at: '2026-07-01T00:00:00Z',
  created_by_user_id: USER_ID,
  managed_by_user_id: null,
  role: 'owner',
}

export const visualCategory: Category = {
  id: 'category-market',
  user_id: USER_ID,
  group_id: 'category-group-daily',
  name: 'Mercado Sintético',
  icon: 'shopping-cart',
  color: '#22c55e',
  is_system: false,
  treat_as_transfer: false,
  is_ignored: false,
}

export const visualCategoryGroup: CategoryGroup = {
  id: 'category-group-daily',
  user_id: USER_ID,
  name: 'Despesas do dia',
  icon: 'wallet',
  color: '#22c55e',
  position: 1,
  is_system: false,
  categories: [visualCategory],
}

const visualAccountBase: Account = {
  id: 'manual-primary',
  user_id: USER_ID,
  connection_id: null,
  external_id: null,
  name: 'Conta Principal',
  display_name: null,
  masked_number: null,
  institution_name: null,
  institution_logo_url: null,
  type: 'checking',
  balance: 11734.6,
  current_balance: 11734.6,
  previous_balance: null,
  balance_primary: 11734.6,
  currency: 'BRL',
  credit_limit: null,
  available_credit: null,
  statement_close_day: null,
  payment_due_day: null,
  next_close_date: null,
  next_due_date: null,
  minimum_payment: null,
  card_brand: null,
  card_level: null,
  is_closed: false,
  closed_at: null,
}

export const visualAccounts: Account[] = [
  visualAccountBase,
  {
    ...visualAccountBase,
    id: 'manual-savings',
    name: 'Reserva Sintética',
    type: 'savings',
    balance: 6900,
    current_balance: 6900,
    balance_primary: 6900,
  },
  {
    ...visualAccountBase,
    id: 'connected-account',
    connection_id: 'bank-connection',
    external_id: 'connected-external',
    name: 'Conta Conectada Sintética',
    institution_name: 'Banco Sintético',
    masked_number: '0437',
    balance: 3200,
    current_balance: 3200,
    balance_primary: 3200,
  },
]
const activeVisualAccounts = visualAccounts.filter((account) => !account.is_closed)

export const visualConnection: BankConnection = {
  id: 'bank-connection',
  user_id: USER_ID,
  provider: 'synthetic',
  institution_name: 'Banco Sintético',
  display_name: null,
  logo_url: null,
  external_id: 'bank-external',
  status: 'active',
  settings: null,
  last_sync_at: '2026-07-28T12:00:00Z',
  created_at: '2026-07-01T00:00:00Z',
}

const visualTransactionBase: Transaction = {
  id: 'expense-a',
  user_id: USER_ID,
  account_id: 'manual-primary',
  category_id: visualCategory.id,
  category: visualCategory,
  external_id: null,
  description: 'Compra sintética A',
  amount: 189.9,
  currency: 'BRL',
  date: '2026-07-28',
  type: 'debit',
  source: 'manual',
  status: 'posted',
  payee: 'Mercado Sintético',
  payee_id: 'payee-market',
  payee_name: 'Mercado Sintético',
  notes: null,
  transfer_pair_id: null,
  amount_primary: 189.9,
  fx_rate_used: 1,
  fx_fallback: false,
  installment_number: null,
  total_installments: null,
  installment_total_amount: null,
  installment_purchase_date: null,
  bill_id: null,
  effective_bill_date: null,
  splits: [],
  is_ignored: false,
}

export const visualTransactions: Transaction[] = [
  visualTransactionBase,
  {
    ...visualTransactionBase,
    id: 'expense-b',
    description: 'Compra sintética B',
    amount: 75.5,
    date: '2026-07-27',
  },
  {
    ...visualTransactionBase,
    id: 'transfer-debit',
    description: 'Transferência sintética saída',
    amount: 500,
    date: '2026-07-26',
    category_id: null,
    category: null,
    payee: null,
    payee_id: null,
    payee_name: null,
  },
  {
    ...visualTransactionBase,
    id: 'transfer-credit',
    account_id: 'manual-savings',
    description: 'Transferência sintética entrada',
    amount: 500,
    date: '2026-07-26',
    type: 'credit',
    category_id: null,
    category: null,
    payee: null,
    payee_id: null,
    payee_name: null,
  },
]

export const visualPayee: Payee = {
  id: 'payee-market',
  user_id: USER_ID,
  name: 'Mercado Sintético',
  type: 'merchant',
  is_favorite: false,
  notes: null,
  created_at: '2026-07-01T00:00:00Z',
  transaction_count: 2,
}

export const visualRule: Rule = {
  id: 'rule-market',
  user_id: USER_ID,
  name: 'Mercado sintético',
  conditions_op: 'and',
  conditions: [{ field: 'description', op: 'contains', value: 'Compra' }],
  actions: [{ op: 'set_category', value: visualCategory.id }],
  priority: 10,
  is_active: true,
}

function buildIdentityApiMocks(actual: typeof import('@/lib/api')) {
  return {
    auth: { ...actual.auth, me: vi.fn(async () => visualUser) },
    workspaces: { ...actual.workspaces, list: vi.fn(async () => [visualWorkspace]) },
    collections: { ...actual.collections, list: vi.fn(async () => []) },
    info: { ...actual.info, get: vi.fn(async () => ({ features: { agents: false } })) },
  }
}

function buildTransactionApiMocks(actual: typeof import('@/lib/api')) {
  return {
    accounts: {
      ...actual.accounts,
      list: vi.fn(async (includeClosed = false) => includeClosed ? visualAccounts : activeVisualAccounts),
    },
    transactions: {
      ...actual.transactions,
      list: vi.fn(async () => ({
        items: visualTransactions,
        total: visualTransactions.length,
        page: 1,
        limit: 20,
        summary: { income: 500, expense: 765.4, net: -265.4, excluded: 0, currency: 'BRL' },
      })),
      transferCandidates: vi.fn(async (transactionId: string) =>
        visualTransactions.filter((transaction) => transaction.id !== transactionId)),
    },
  }
}

function buildLookupApiMocks(actual: typeof import('@/lib/api')) {
  return {
    categories: { ...actual.categories, list: vi.fn(async () => [visualCategory]) },
    categoryGroups: { ...actual.categoryGroups, list: vi.fn(async () => [visualCategoryGroup]) },
    payees: { ...actual.payees, list: vi.fn(async () => [visualPayee]) },
    rules: { ...actual.rules, list: vi.fn(async () => [visualRule]) },
    recurring: { ...actual.recurring, list: vi.fn(async () => []) },
    groups: { ...actual.groups, list: vi.fn(async () => []) },
  }
}

function buildConnectionApiMocks(actual: typeof import('@/lib/api')) {
  return {
    connections: {
      ...actual.connections,
      list: vi.fn(async () => [visualConnection]),
      getProviders: vi.fn(async () => []),
    },
    currencies: {
      ...actual.currencies,
      list: vi.fn(async () => [{ code: 'BRL', symbol: 'R$', name: 'Real brasileiro', flag: '🇧🇷' }]),
    },
  }
}

function buildEnvironmentApiMocks(actual: typeof import('@/lib/api')) {
  return {
    settings: {
      ...actual.settings,
      attachments: vi.fn(async () => ({
        allowed_extensions: ['png'],
        max_file_size_mb: 10,
        max_attachments_per_transaction: 10,
      })),
    },
    admin: {
      ...actual.admin,
      accountingMode: vi.fn(async () => ({ mode: 'cash' as const })),
      numberFormat: vi.fn(async () => ({ format: 'auto' as const })),
      dateFormat: vi.fn(async () => ({ format: 'dmy' as const })),
      defaultColors: vi.fn(async () => ({ light: null, dark: null })),
    },
  }
}

/**
 * Replaces every API call reached by issue #437 routes with stable fixtures.
 * @example `vi.mock('@/lib/api', () => buildVisualApiMock(actualApi))`
 */
export function buildVisualApiMock(actual: typeof import('@/lib/api')) {
  return {
    ...actual,
    ...buildIdentityApiMocks(actual),
    ...buildTransactionApiMocks(actual),
    ...buildLookupApiMocks(actual),
    ...buildConnectionApiMocks(actual),
    ...buildEnvironmentApiMocks(actual),
  }
}
