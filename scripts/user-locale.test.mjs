import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const dependencyUrl = moduleUrl(`
  export const state = { session: null, writes: [], fail: false };
  export async function getCurrentSession() { return state.session; }
  export const prisma = { user: { updateMany: async (query) => {
    if (state.fail) throw new Error('Database unavailable');
    state.writes.push(query);
    return { count: 1 };
  } } };
  export const routing = { locales: ['ru', 'en'] };
`);
const { state } = await import(dependencyUrl);
const source = await readFile(new URL('../src/actions/user-locale.ts', import.meta.url), 'utf8');
let code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
code = code.replaceAll("'next-intl'", JSON.stringify(import.meta.resolve('next-intl')));
for (const name of ['@/data/auth', '@/lib/prisma', '@/i18n/routing']) {
  code = code.replaceAll(JSON.stringify(name), JSON.stringify(dependencyUrl)).replaceAll(`'${name}'`, JSON.stringify(dependencyUrl));
}
const { updateUserLocale } = await import(moduleUrl(code));

test('unsupported locale or browser-supplied user data is rejected', async () => {
  state.writes = [];
  for (const value of ['de', '', undefined, { locale: 'en', userId: 'another-user' }]) {
    assert.deepEqual(await updateUserLocale(value), { success: false });
  }
  assert.deepEqual(state.writes, []);
});

test('guests can switch language without writing a user preference', async () => {
  state.session = null;
  state.writes = [];
  assert.deepEqual(await updateUserLocale('en'), { success: true });
  assert.deepEqual(state.writes, []);
});

test('preference updates are scoped to the current session user and changed locale', async () => {
  state.session = { user: { id: 'owner' } };
  state.writes = [];
  assert.deepEqual(await updateUserLocale('en'), { success: true });
  assert.deepEqual(state.writes, [{ where: { id: 'owner', preferredLocale: { not: 'en' } }, data: { preferredLocale: 'en' } }]);
});

test('database failure returns an error instead of claiming language was saved', async () => {
  state.fail = true;
  try { assert.deepEqual(await updateUserLocale('ru'), { success: false }); }
  finally { state.fail = false; }
});
