import { parse } from 'yaml';

export interface Command {
  id: string;
  name: string;
  agent: 'claude-code' | 'codex' | 'antigravity' | 'mistral-vibe' | 'mcp';
  type: string;
  command: string;
  description: string;
  tags?: string[];
  source_url: string;
  agent_version?: string;
  last_verified: string;
  risk: string[];
  author?: string;
}

export const AGENT_LABELS: Record<string, string> = {
  'claude-code': 'Claude Code',
  codex: 'Codex',
  antigravity: 'Antigravity',
  'mistral-vibe': 'Mistral Vibe',
  mcp: 'MCP',
};

export const RISK_LABELS: Record<string, string> = {
  'runs-shell': 'runs shell',
  'uses-network': 'uses network',
  'writes-files': 'writes files',
  'deletes-files': 'deletes files',
  'installs-software': 'installs software',
  'needs-secrets': 'needs secrets',
};

// Reads every YAML file in data/commands when the site is built.
const files = import.meta.glob('/data/commands/**/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getCommands(): Command[] {
  return Object.values(files)
    .map((raw) => parse(raw) as Command)
    .sort((a, b) => a.name.localeCompare(b.name));
}
