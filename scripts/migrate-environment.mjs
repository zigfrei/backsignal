import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'dotenv';

const [target, ...options] = process.argv.slice(2);
if (!['stage', 'prod'].includes(target) || options.some((option) => !['--check', '--status', '--studio'].includes(option)) || new Set(options).size !== options.length || (options.includes('--status') && options.includes('--studio'))) {
  console.error('Usage: node scripts/migrate-environment.mjs stage|prod [--studio|--status] [--check]');
  process.exit(1);
}

const root = fileURLToPath(new URL('../', import.meta.url));
const filename = `.env.migrations.${target}`;
let config;
try {
  config = parse(readFileSync(new URL(`../${filename}`, import.meta.url)));
} catch {
  console.error(`Cannot read ${filename}. Copy .env.migrations.example and configure the matching Neon branch.`);
  process.exit(1);
}

const expectedEnvironment = target === 'prod' ? 'production' : 'stage';
if (config.APP_ENV !== expectedEnvironment || !config.DIRECT_URL?.trim()) {
  console.error(`${filename} must contain APP_ENV="${expectedEnvironment}" and a non-empty DIRECT_URL.`);
  process.exit(1);
}

let database;
try {
  database = new URL(config.DIRECT_URL);
  if (!['postgres:', 'postgresql:'].includes(database.protocol) || !database.hostname || database.hostname.includes('-pooler')) {
    throw new Error('Invalid direct PostgreSQL URL');
  }
} catch {
  console.error(`Invalid DIRECT_URL in ${filename}; use the direct PostgreSQL connection URL.`);
  process.exit(1);
}

// Never log credentials or fall back to the application's stage .env.
console.log(`Environment: ${expectedEnvironment}; config: ${filename}; database host: ${database.hostname}`);
if (options.includes('--check')) {
  console.log('Configuration checked. No database connection or migration performed. Verify this host belongs to the intended Neon branch.');
  process.exit(0);
}

const command = options.includes('--studio')
  ? ['studio', '--browser', 'none', '--port', target === 'prod' ? '5556' : '5555']
  : ['migrate', options.includes('--status') ? 'status' : 'deploy'];
if (options.includes('--studio')) {
  console.log(`Prisma Studio: http://localhost:${target === 'prod' ? '5556' : '5555'}. Changes in Studio affect the selected database directly.`);
}
const result = spawnSync('pnpm', ['exec', 'prisma', ...command], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    APP_ENV: expectedEnvironment,
    DIRECT_URL: config.DIRECT_URL,
    DATABASE_URL: config.DIRECT_URL,
    DOTENV_CONFIG_PATH: fileURLToPath(new URL(`../${filename}`, import.meta.url)),
    DOTENV_CONFIG_OVERRIDE: 'false',
  },
});
if (result.error) console.error('Could not start Prisma CLI. Check that pnpm is available.');
process.exit(result.status ?? 1);
