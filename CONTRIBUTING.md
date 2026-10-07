# Contributing to MCP Corpus

Thank you for helping. This guide explains how to add a command and what we accept.

## Two ways to submit

1. **Submission form (easiest):** open a new issue and choose **Submit a command**.
2. **Pull request:** add one YAML file in `data/commands/<agent>/` and open a pull request.

## File format

One command per file. The file name should match the `id`.

```yaml
id: claude-code-continue
name: Continue the last session
agent: claude-code
type: cli-command
command: claude --continue
description: Opens Claude Code and continues the most recent conversation in this folder.
tags: [session, resume]
source_url: https://docs.claude.com/en/docs/claude-code/cli-reference
agent_version: ""
last_verified: 2026-10-06
risk: []
author: your-github-username
```

The full rules are in `schema/command.schema.json`.

### Fields

| Field | Required | Notes |
|---|---|---|
| `id` | yes | lowercase letters, numbers, and dashes |
| `name` | yes | short title |
| `agent` | yes | `claude-code`, `codex`, `cursor`, `antigravity`, `mistral-vibe`, or `mcp` |
| `type` | yes | `cli-command`, `slash-command`, `flag`, `mcp-install`, or `skill` |
| `command` | yes | the exact command |
| `description` | yes | what it does, in plain words |
| `source_url` | yes | official docs or the project's repo |
| `last_verified` | yes | the day you ran it and it worked |
| `risk` | yes | a list of risk labels. Use `[]` if none apply |
| `tags`, `agent_version`, `author` | no | helpful, but optional |

### Risk labels

`runs-shell`, `uses-network`, `writes-files`, `deletes-files`, `installs-software`, `needs-secrets`

Be honest. Too many labels is better than too few.

## What we accept

- Commands that do what the description says, and nothing more
- Commands that link to an official source
- Commands you have run yourself

## What we do not accept

- Commands that hide what they do (encoded text, `base64`, long one-liners nobody can read)
- Commands that send data to servers that are not clearly explained
- Commands that read keys, tokens, passwords, or SSH files
- Broad deletes (for example `rm -rf` on large paths) and unneeded `sudo`
- Commands that turn off security features
- Real API keys or tokens. Use placeholders like `YOUR_API_KEY`
- Install scripts that download and run code (`curl ... | bash`), unless they come from the tool's own official docs. Even then they need the `installs-software` and `uses-network` labels and extra review

## How review works

1. Automatic checks run on your submission.
2. A maintainer reads the command by hand.
3. We may ask you to change something.
4. If it passes, it is added to the library.

We may reject a command if we are not sure it is safe.

## Keeping commands current

Agents change fast. If a command stops working, open a pull request with a fix, or open an issue.
