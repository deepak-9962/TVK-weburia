const fs = require('fs');
const path = require('path');

const ENV_PATH = path.resolve(__dirname, '..', '.env');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'env.local.json');

function parseEnvFile(content) {
  const result = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key) {
      result[key] = value;
    }
  });

  return result;
}

function ensureRequiredKeys(env) {
  const requiredKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = requiredKeys.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment keys: ${missing.join(', ')}`);
  }
}

function writeEnvJson(env) {
  const payload = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Created ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

function main() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('No .env file found. Please create one based on .env.example.');
    process.exit(1);
  }

  const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
  const parsedEnv = parseEnvFile(envContent);

  ensureRequiredKeys(parsedEnv);
  writeEnvJson(parsedEnv);
}

main();
