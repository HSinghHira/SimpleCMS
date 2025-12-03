Contributing to Simple CMS
==========================

Hi there! Thank you for taking the time to contribute to **Simple CMS**! Every contribution — bug reports, feature ideas, documentation, or code — is highly appreciated and helps make this tool better for everyone.

We’re a friendly, beginner-friendly project and **especially welcome first-time open-source contributors**.

How to Contribute
-----------------

### 1\. Found a bug or have a feature idea?

* Check if it’s already reported: [Issues](https://github.com/hsinghhira/simplecms/issues)
* If not, open a new Issue
* Use a clear title and description
* Add screenshots whenever possible (UI/UX issues love them!)

### 2\. Ready to write code?

```
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/simple-cms.git
cd simple-cms

# 3. Install dependencies (we use Bun)
bun install

# 4. Start the development server
bun run dev
# Open http://localhost:5173
```

### 3\. Make your changes

* Create a descriptive branch:
    
    ```
    git checkout -b feat/your-feature-name
    # or
    git checkout -b fix/your-bug-fix
    ```
* Keep changes small and focused
* Follow the existing code style (Prettier + ESLint are configured)

### 4\. Test your changes

Make sure the following still work:

* YAML and TOML frontmatter parsing
* Drag & drop / file upload
* Copy to clipboard & Download buttons
* Auto-save drafts (IndexedDB)
* Mobile layout

### 5\. Commit and push

```
bun run format   # Prettier
bun run lint     # ESLint (fix any errors)

git add .
git commit -m "feat: add image paste from clipboard"
git push origin your-branch-name
```

Then open a **Pull Request** — we’ll review it as fast as possible (usually within 24–48 hours).

Project Structure Highlights
----------------------------

* `src/App.jsx` → Main app logic, slash commands, draft handling
* `src/components/Editor.jsx` → Tiptap editor + toolbar
* `src/components/Aside.jsx` → Frontmatter sidebar & field rendering
* `src/components/Landing.jsx` → Landing page with drag-and-drop

Current Wishlist (feel free to pick one!)
-----------------------------------------

* \[ \] Paste images from clipboard
* \[ \] Live HTML preview tab
* \[ \] More slash commands (table, embed, mermaid, etc.)
* \[ \] Persistent dark/light theme setting
* \[ \] Nested frontmatter objects support
* \[ \] Table of contents generator
* \[ \] i18n / translations
* \[ \] PWA install banner

Code of Conduct
---------------

Be respectful, inclusive, and kind.
This project follows the standard Contributor Covenant — everyone is welcome.

Recognition
-----------

Every merged contributor gets:

* Credit in the app footer
* Mention in release notes
* Eternal gratitude

Let’s keep **Simple CMS** the simplest, most privacy-friendly Markdown + frontmatter editor out there — together!

— Harman Singh Hira ([@hsinghhira](https://hsinghhira.me))

