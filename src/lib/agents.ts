const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// The four agents that get a logo button. "color" is the brand color
// used for the glow and the shockwave tint (see global.css).
export const AGENTS = [
  { id: 'claude-code', label: 'Claude Code', color: '#d97757', logo: `${base}/logos/claude-code.svg` },
  { id: 'codex', label: 'Codex', color: '#7c8cff', logo: `${base}/logos/codex.svg` },
  { id: 'mistral-vibe', label: 'Mistral Vibe', color: '#fa520f', logo: `${base}/logos/mistral-vibe.svg` },
  { id: 'antigravity', label: 'Antigravity', color: '#4285f4', logo: `${base}/logos/antigravity.svg` },
] as const;

export const AGENT_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
