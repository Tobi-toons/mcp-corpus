// MCP Corpus: checks every command file in data/commands.
// Run it with:  node scripts/validate-commands.mjs
//
// ERROR   = the check fails and the pull request can't be merged.
// WARNING = a human should look closely. It does not fail the check.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, basename, dirname, extname } from 'node:path';
import Ajv from 'ajv';
import { parse } from 'yaml';

const ROOT = process.cwd();
const DATA_DIR = join(ROOT, 'data', 'commands');
const IN_CI = process.env.GITHUB_ACTIONS === 'true';

const schema = JSON.parse(readFileSync(join(ROOT, 'schema', 'command.schema.json'), 'utf8'));
const validateSchema = new Ajv({ allErrors: true }).compile(schema);

let errors = 0;
let warnings = 0;

function report(level, file, message) {
  if (level === 'error') errors++;
  else warnings++;
  const label = level === 'error' ? 'ERROR' : 'WARNING';
  console.log(`${label}  ${file}: ${message}`);
  if (IN_CI) console.log(`::${level} file=${file}::${message}`);
}

function listFiles(dir) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(listFiles(full));
    else out.push(full);
  }
  return out;
}

// Things that are never allowed.
const BLOCKED = [
  [/base64\s+(-d|--decode)/i, 'decodes hidden text (base64 decode)'],
  [/\beval\b/i, 'uses eval, which can hide what runs'],
  [/[A-Za-z0-9+/]{60,}={0,2}/, 'contains a long encoded-looking string'],
  [/\b(sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{12,}|xox[abp]-[A-Za-z0-9-]{10,})/, 'looks like a real API key or token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'contains a private key'],
  [/\brm\s+-[a-z]*[rf][a-z]*\s+(\/|~|\*|\$HOME|%USERPROFILE%)(\s|$)/i, 'deletes a very broad path'],
  [/:\(\)\s*\{/, 'looks like a fork bomb'],
  [/\b(mkfs|dd\s+if=)/i, 'can wipe or overwrite disks'],
  [/chmod\s+(-R\s+)?777/i, 'opens file permissions to everyone'],
  [/\.ssh\/|id_rsa|id_ed25519|\.aws\/credentials/i, 'touches SSH keys or cloud credentials'],
];

// Things that need a risk label. If the label is missing, the check fails.
const NEEDS_LABEL = [
  [/\b(curl|wget|Invoke-WebRequest|iwr)\b/i, 'uses-network', 'downloads from the network'],
  [/\|\s*(sudo\s+)?(ba|z|da|k)?sh\b|\|\s*(iex|Invoke-Expression)\b/i, 'installs-software', 'pipes a download into a shell'],
  [/\b(npm|pnpm|yarn|pip|pip3|brew|apt|apt-get|winget|cargo|go)\s+(install|add|i)\b/i, 'installs-software', 'installs software'],
  [/\b(rm|del|rmdir|Remove-Item)\b/i, 'deletes-files', 'deletes files'],
];

// Things a human should look at. They only warn.
const WATCH = [
  [/\bsudo\b/i, 'uses sudo'],
  [/\|\s*(sudo\s+)?(ba|z|da|k)?sh\b|\|\s*(iex|Invoke-Expression)\b/i, 'pipes a download into a shell: check that it comes from the tool\'s official docs'],
  [/\.env\b|token|secret|password|api[_-]?key/i, 'mentions secrets or keys'],
  [/\bnpx\b|\buvx\b|\bpipx\b/i, 'runs a package straight from the internet'],
  [/(^|\s)(>|>>)\s*\S/, 'writes to a file with a redirect'],
];

const SHORTENERS = /^https:\/\/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|rb\.gy)\//i;

const seenIds = new Map();
let files;
try {
  files = listFiles(DATA_DIR);
} catch {
  console.log('ERROR  data/commands: folder not found. Run this from the repo root.');
  process.exit(1);
}

let checked = 0;
for (const full of files) {
  const file = relative(ROOT, full).split('\\').join('/');
  const ext = extname(full).toLowerCase();

  if (ext !== '.yaml' && ext !== '.yml') {
    report('warning', file, 'not a YAML file, so it is ignored');
    continue;
  }
  checked++;

  let doc;
  try {
    doc = parse(readFileSync(full, 'utf8'));
  } catch (e) {
    report('error', file, `can't read the YAML: ${e.message.split('\n')[0]}`);
    continue;
  }

  if (!validateSchema(doc)) {
    for (const e of validateSchema.errors) {
      const where = e.instancePath ? e.instancePath.slice(1) : 'file';
      const extra = e.params?.additionalProperty ? ` (${e.params.additionalProperty})` : '';
      report('error', file, `${where} ${e.message}${extra}`);
    }
    continue; // the checks below need valid data
  }

  // The folder must match the agent.
  const folder = basename(dirname(full));
  if (folder !== doc.agent) {
    report('error', file, `is in folder "${folder}" but agent is "${doc.agent}"`);
  }
  if (seenIds.has(doc.id)) {
    report('error', file, `id "${doc.id}" is already used by ${seenIds.get(doc.id)}`);
  }
  seenIds.set(doc.id, file);

  if (SHORTENERS.test(doc.source_url)) {
    report('error', file, 'source_url is a link shortener. Use the real link');
  }
  if (new Date(doc.last_verified) > new Date()) {
    report('error', file, 'last_verified is in the future');
  }

  const text = doc.command;
  for (const [re, why] of BLOCKED) {
    if (re.test(text)) report('error', file, `command ${why}. This is not allowed`);
  }
  for (const [re, label, why] of NEEDS_LABEL) {
    if (re.test(text) && !doc.risk.includes(label)) {
      report('error', file, `command ${why}, so risk must include "${label}"`);
    }
  }
  for (const [re, why] of WATCH) {
    if (re.test(text)) report('warning', file, `needs a close look: command ${why}`);
  }
}

console.log(`\nChecked ${checked} command file(s): ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors > 0 ? 1 : 0);
