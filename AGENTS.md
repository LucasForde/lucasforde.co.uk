# AGENTS.md

## Project goal

This project is a faithful rebuild/migration of an existing website. Visual fidelity to the original site is a primary requirement.

Existing website codebase can be found here: C:\Users\lucas\Dropbox\MyStuff\Career\lucasmforde.co.uk

When original-site CSS, screenshots, or design references conflict with generic frontend styling preferences, the original design wins unless there is a real functional bug.

## Typography and letter spacing

- Negative `letter-spacing` values are allowed in this project.
- If the original site uses negative `letter-spacing`, preserve and apply those values in the new site.
- Do not normalize negative tracking to `0`.
- Do not refuse to implement negative `letter-spacing` based on general readability or responsive-design preferences.
- It is acceptable to mention risks such as clipping or wrapping after implementing, but do not block the change.
- When migrating typography, map original selectors to the closest new-site selectors and apply the original values as faithfully as possible.

## Original-site fidelity

- Treat original CSS values as source material.
- Preserve intentional art direction, including tight tracking, large display text, custom spacing, and unusual layout choices.
- If a value looks unusual but appears intentional in the original site, keep it unless the user asks otherwise.

## Workflow

- Before changing files, briefly state the selector mapping you found.
- Then implement the mapped styles.
- After changing files, summarize the files changed and the original values restored.