import { afterEach, expect, test, vi } from 'vitest'
import { page } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { buildVisualApiMock } from './issue-437-visual-fixtures'

vi.mock('@/lib/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api')>()
  return buildVisualApiMock(actual)
})

import App from '@/App'

const TRANSACTIONS_ROUTE = '/transactions?from=2026-07-01&to=2026-07-31'

async function renderRoute(route: string, heading: string) {
  window.history.replaceState({}, '', route)
  const screen = await render(<App />)
  await expect.element(screen.getByRole('heading', { name: heading, exact: true })).toBeVisible()
  return screen
}

async function selectTransactionRows(...indexes: number[]) {
  const checkboxes = page.getByRole('checkbox')
  for (const index of indexes) {
    await checkboxes.nth(index).click()
  }
}

afterEach(async () => {
  await page.viewport(360, 780)
})

test('bulk transaction actions fit the Samsung S23 viewport', async () => {
  const screen = await renderRoute(TRANSACTIONS_ROUTE, 'Transações')
  await selectTransactionRows(1, 2)

  const bulkActions = screen.getByTestId('transactions-bulk-actions')
  await expect.element(bulkActions).toBeInViewport()
  await expect(bulkActions).toMatchScreenshot('transaction-bulk-actions')
})

test('transaction header keeps month and actions on one line', async () => {
  const screen = await renderRoute(TRANSACTIONS_ROUTE, 'Transações')
  const header = screen.getByTestId('transactions-page-header')

  await expect.element(header.getByText('07/2026', { exact: true })).toBeVisible()
  await expect.element(header.getByRole('button', { name: /Adicionar/ })).toBeVisible()
  await expect(header).toMatchScreenshot('transaction-header')
})

test('mobile filters drill into the same panel', async () => {
  const screen = await renderRoute(TRANSACTIONS_ROUTE, 'Transações')
  await screen.getByRole('button', { name: 'Filtros' }).click()
  await page.getByRole('menuitem', { name: 'Conta' }).click()

  const filterPanel = page.getByRole('menu').last()
  await expect.element(filterPanel.getByText('Conta', { exact: true }).first()).toBeVisible()
  await expect.element(filterPanel.getByText('Conta Principal')).toBeVisible()
  await expect(filterPanel).toMatchScreenshot('transaction-account-filter')
})

test('transfer linking dialog survives mobile rotation', async () => {
  const screen = await renderRoute(TRANSACTIONS_ROUTE, 'Transações')
  await selectTransactionRows(3, 4)
  await screen.getByTestId('transactions-bulk-actions').getByRole('button', { name: 'Ações' }).click()
  await page.getByRole('menuitem', { name: 'Vincular como transferência' }).click()

  const dialog = page.getByRole('dialog', { name: 'Vincular como transferência' })
  await expect.element(dialog).toBeVisible()
  await page.viewport(780, 360)
  await expect.element(dialog.getByRole('button', { name: 'Cancelar' })).toBeInViewport()
  await expect(dialog).toMatchScreenshot('transfer-dialog-landscape')
})

test('account page keeps Add Account as the mobile primary action', async () => {
  const screen = await renderRoute('/accounts', 'Contas')
  const header = screen.getByTestId('accounts-page-header')

  await expect.element(header.getByRole('button', { name: 'Adicionar Conta' })).toBeVisible()
  await expect(header).toMatchScreenshot('account-header-actions')
  await header.getByRole('button', { name: 'Mais' }).click()

  const secondaryMenu = page.getByRole('menu')
  await expect.element(secondaryMenu.getByText('Coleções')).toBeVisible()
  await expect.element(secondaryMenu.getByText('Conectar Banco')).toBeVisible()
})

test('manual account actions follow the balance and remain reachable', async () => {
  const screen = await renderRoute('/accounts', 'Contas')
  const accountRow = screen.getByTestId('account-row-manual-primary')
  await expect(accountRow).toMatchScreenshot('manual-account-actions')
  await accountRow.getByRole('button', { name: 'Mais' }).click()

  const accountMenu = page.getByRole('menu')
  await expect.element(accountMenu.getByText('Editar')).toBeVisible()
  await expect.element(accountMenu.getByText('Excluir')).toBeVisible()
})

test('rule conditions use two-line mobile fields', async () => {
  const screen = await renderRoute('/rules', 'Regras')
  await screen.getByTestId('rules-add-button').click()

  const dialog = page.getByRole('dialog', { name: 'Nova Regra' })
  await dialog.getByRole('button', { name: 'Adicionar condição' }).click()
  await dialog.getByRole('button', { name: 'Adicionar condição' }).click()
  await expect.element(dialog.getByPlaceholder('Valor...').last()).toBeVisible()
  await expect(dialog).toMatchScreenshot('rule-fields')
})
