# Security

MCP Corpus lists commands that people copy and run. We take that seriously.

## How we keep the library safe

- Every submission is read by a maintainer before it is added.
- Automatic checks flag risky patterns, such as `curl | bash`, `sudo`, `rm -rf`, and encoded text.
- Every command has risk labels so you can see what it may do.
- Every command links to an official source.
- Only maintainers can merge changes into `main`.

## Report a bad command

If you find a command that is harmful, hidden, or wrong in a risky way:

1. Go to the **Security** tab of this repo.
2. Click **Report a vulnerability** (private report).
3. Tell us which file and why it is a problem.

We will remove dangerous commands as fast as we can.

## Your part

Read every command before you run it. We review carefully, but we can't promise that any command is safe in your setup. Use the library at your own risk.

## Supported versions

Only the latest version on `main` is supported.
