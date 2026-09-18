import { readFile, writeFile, mkdtemp, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { spawnSync } from 'node:child_process';

// Exercise the actual template in Node without a browser, database or generated files.
function moduleUrl(source, jsx = false) {
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: jsx ? ts.JsxEmit.ReactJSX : undefined } }).outputText;
  const resolved = output.replace(/from ['"]([^'"]+)['"]/g, (_, specifier) => `from ${JSON.stringify(specifier.startsWith('data:') ? specifier : import.meta.resolve(specifier))}`);
  return `data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`;
}

function testEnglishPrompt() {
test('English prompt keeps its first letter in every format', async () => {
  for (const format of Object.keys(helpers.printFormats)) {
    const blob = await pdf(React.createElement(QrMaterialDocument, { options: {
      format, locale: 'en', name: 'Coffee shop', prompt: 'Have feedback or suggestions? Tell us',
      brand: 'Backsignal', caption: 'Scan the QR code · No sign-up required',
      url: 'https://backsignal.tech/q/00000000-0000-4000-8000-000000000001',
    } })).toBlob();
    const directory = await mkdtemp(join(tmpdir(), 'backsignal-pdf-test-'));
    const filename = join(directory, 'preview.pdf');
    await writeFile(filename, Buffer.from(await blob.arrayBuffer()));
    const result = spawnSync('pdftotext', [filename, '-'], { encoding: 'utf8', timeout: 10_000 });
    await unlink(filename);
    await rmdir(directory);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.replace(/\s+/g, ' ').includes('Have feedback'), `${format}: ${result.stdout}`);
  }
});
}
const helpersUrl = moduleUrl(await readFile(new URL('../src/lib/qr-materials.ts', import.meta.url), 'utf8'));
const helpers = await import(helpersUrl);
const logoUrl = moduleUrl(await readFile(new URL('../src/components/dashboard/qr-print-logo.tsx', import.meta.url), 'utf8'), true);
let source = await readFile(new URL('../src/components/dashboard/qr-material-document.tsx', import.meta.url), 'utf8');
source = source.replace('@/lib/qr-materials', helpersUrl).replace('./qr-print-logo', logoUrl).replaceAll('/fonts/inter/', fileURLToPath(new URL('../public/fonts/inter/', import.meta.url)));
const { QrMaterialDocument } = await import(moduleUrl(source, true));
testEnglishPrompt();

test('vector QR includes four-module quiet zone', () => {
  assert.deepEqual(helpers.qrVector({ size: 1, get: () => 1 }), { size: 9, path: 'M4,4h1v1h-1z' });
});

for (const format of Object.keys(helpers.printFormats)) {
  for (const locale of ['ru', 'en']) {
  test(`renders one-page ${format}/${locale} PDF with Cyrillic and long text`, async () => {
    const blob = await pdf(React.createElement(QrMaterialDocument, { options: {
      format, locale, name: 'Кофейня «Обратный сигнал» — длинное название организации',
      prompt: 'Есть замечания или предложения? Расскажите нам о своём опыте и поделитесь впечатлениями',
      brand: 'Обратный сигнал', caption: 'Без регистрации', url: 'https://backsignal.tech/q/00000000-0000-4000-8000-000000000001',
    } })).toBlob();
    const bytes = Buffer.from(await blob.arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.equal((bytes.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1);
    const [width, height] = helpers.printFormats[format];
    const mediaBox = bytes.toString('latin1').match(/\/MediaBox \[0 0 ([\d.]+) ([\d.]+)\]/);
    assert.ok(mediaBox);
    assert.ok(Math.abs(Number(mediaBox[1]) - width * 72 / 25.4) < 0.01);
    assert.ok(Math.abs(Number(mediaBox[2]) - height * 72 / 25.4) < 0.01, `height ${mediaBox[2]}, expected ${height * 72 / 25.4}`);
  });
  }
}
