# Editing Your Website's Text

This is your reference for making text changes yourself, without needing me. It uses the GitHub + Netlify setup already in place — no new accounts, no extra cost.

## How it works, step by step

1. Go to your repo: **https://github.com/GitUpMush4/Nolan-Property-Services**
2. Click the file you want to edit (e.g. `index.html`) from the list
3. Click the **pencil icon** (top right of the file view) to start editing
4. Find the line you want to change (use `Ctrl+F` in your browser to search the page for a phrase)
5. Edit the text **between the tags** — e.g. in `<h1>Some Headline</h1>`, only change `Some Headline`, leave the `<h1>` and `</h1>` alone
6. Scroll down, add a short note describing your change, click **Commit changes**
7. Netlify picks it up automatically and the live site updates within about a minute

## Golden rules

- Only edit the words between `>` and `<` — never delete or add angle brackets, quotes, or `=` signs
- If a line has `&amp;` that means `&`, and `&#39;` means an apostrophe — you can type a normal `&` or `'` when writing new text, you don't need to use those codes
- If something looks broken after you save, don't panic — GitHub keeps full history. Message me and I can revert it in seconds
- Small text tweaks (a sentence, a headline) are very safe to do yourself. Layout/design changes are not covered by this guide — send those to me

## Where things live

| What you want to change | File | Roughly where |
|---|---|---|
| Homepage headline & intro paragraph | `index.html` | lines 84–86 |
| Homepage "What We Do" section title | `index.html` | line 160 |
| Homepage "Why Nolan Property Services" title | `index.html` | line 221 |
| Homepage "Recent Work" section title | `index.html` | line 260 |
| Homepage bottom call-to-action heading | `index.html` | line 329 |
| Services page headline & intro | `services.html` | lines 60–62 |
| Residential services section title | `services.html` | line 74 |
| Commercial services section title | `services.html` | line 128 |
| Individual service descriptions (e.g. "Kitchen & Bathroom Renovations") | `services.html` | search the page for the service name |
| Gallery page headline & intro | `gallery.html` | lines 60–62 |
| Photo captions (e.g. "Hallway Renovation") | `gallery.html` | search for `photo-tile-caption` |
| About page headline & intro | `about.html` | lines 60–62 |
| "Our Approach" text | `about.html` | lines 69–70, and the paragraphs just below |
| "Areas We Cover" text | `about.html` | lines 100–101 |
| Contact page headline & intro | `contact.html` | lines 60–62 |

## Things to send to me instead

These appear in multiple places across all 5 files, so a manual edit risks missing one and showing the wrong info somewhere:

- **Phone number** or **email address** (appears in header, footer, and multiple sections on every page)
- **Business hours**, if you ever want to add these
- Anything involving colours, layout, images, or new sections

Just message me what needs to change and I'll do a clean find-and-replace across every file at once.
