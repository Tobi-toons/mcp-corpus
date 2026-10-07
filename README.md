# MCP Corpus

An open-source library of commands for AI coding agents and MCP tools.
Find the right command fast, copy it, and know what it does before you run it.

**Covers (and growing):** Claude Code, Codex, Cursor, Antigravity, Mistral Vibe, and MCP tools and skills.

> **Status:** early. The data format is ready and the website is being built.

## What makes it different

Every command in the library has:

- a plain description of what it does
- a link to the official source
- the agent version it was tested on
- a "last verified" date
- risk labels (for example: runs shell commands, uses the network, writes files)

Every submission is checked by a person before it is added. See [SECURITY.md](SECURITY.md).

## Contribute a command

Read [CONTRIBUTING.md](CONTRIBUTING.md). You can use the submission form (easiest)
or open a pull request with one small YAML file.

## Project layout

```
data/commands/<agent>/<command>.yaml   one file per command
schema/command.schema.json             the rules every command file must follow
.github/ISSUE_TEMPLATE/                the submission form
```

## Run the site locally

The site uses Astro and Tailwind CSS.

```bash
npm install
npm run dev
```

## Safety note

Always read a command before you run it. Reviews lower the risk, but they can't remove it.

## License

MIT. See [LICENSE](LICENSE).
