<div align="center">
  <h1>OJT Tracker</h1>
  <p>A clean, client-side progress tracker for on-the-job training hours.</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#data-model">Data Model</a>
  </p>
</div>

---

**OJT Tracker** is a single-page web application that helps students log their daily attendance during on-the-job training. Track time-in/time-out, monitor progress toward your target hours, view monthly statistics, and export records — all directly in the browser with no server or installation needed.

## Features

- **Live Dashboard** — Total hours, remaining hours, progress percentage, and estimated completion date.
- **Customizable Target** — Set your own target hours (defaults to 500) via the settings in the form section.
- **Daily Time Logs** — Log time-in, time-out, and optional lunch deduction per day.
- **Monthly Breakdown** — Bar chart and table showing hours per month.
- **Statistics Panel** — Days logged, average hours/day, best month, longest day.
- **Search & Filter** — Filter logs by date range and search across entries.
- **Edit & Delete** — Update or remove log entries via an inline modal.
- **Export to CSV** — Download all logs as a CSV file.
- **Dark / Light Theme** — Toggle between dark and light mode (persisted).
- **100% Client-Side** — All data is stored in your browser's localStorage. Nothing is uploaded anywhere.

## Tech Stack

| Layer | Technology |
|---|---|
| **HTML** | HTML5 (semantic elements, inline SVGs) |
| **CSS** | Vanilla CSS3 (custom properties, animations, responsive, glassmorphism) |
| **JavaScript** | Vanilla ES6+ (no frameworks, no build tools) |
| **Fonts** | Google Fonts — Inter (400–800) |
| **Storage** | Browser `localStorage` |
| **Icons** | Inline SVG icons |
| **Build** | None — open `index.html` directly |

## Getting Started

No build step, no server, no dependencies.

### Local Usage

1. **Clone the repo**
   ```bash
   git clone https://github.com/rjanciro/OJT-Tracker.git
   ```
2. **Open the app**
   ```bash
   cd OJT-Tracker
   start index.html
   ```
   Or simply double-click `index.html` in your file explorer.

That's it. The app runs entirely in your browser.

### Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Go to your repo **Settings > Pages**.
3. Under **Source**, select `Deploy from a branch`.
4. Choose `main` (or `master`) as the branch and `/ (root)` as the folder.
5. Click **Save**.

Your site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.

> The app includes a service worker for offline caching and a `manifest.json` for PWA support (Add to Home Screen on mobile).

---

## Production Features

- **PWA Ready** — Service worker caches assets for offline access; installable via manifest.
- **SEO Optimized** — Meta tags, Open Graph tags, and semantic HTML.
- **Accessible** — Focus-visible outlines, reduced-motion support, semantic structure.
- **Responsive** — Works on desktop, tablet, and mobile.
- **Print Friendly** — Optimized print styles for generating paper records.

## Usage

1. **Set your target** — Adjust the "Target Hours" field in the form section to your required hours (e.g., 500, 750, 1000).
2. **Add a log** — Fill in the date, time-in, time-out, and toggle the lunch deduction. The form auto-calculates hours.
3. **Edit / Delete** — Click the pencil or trash icon on any row in the log table.
4. **Filter** — Use the date range pickers or the search box above the table.
5. **Export** — Click the "Export CSV" button to download your records.
6. **Clear All** — Click "Clear All Data" to reset everything (requires two confirmations).
7. **Toggle Theme** — Click the sun/moon icon in the header.

## Data Model

All logs are stored in `localStorage` under the key `ojtLogs` as a JSON array:

```json
{
  "id": 1717500000000,
  "date": "2025-06-04",
  "timeIn": "7:00 AM",
  "timeOut": "4:00 PM",
  "lunch": true,
  "hours": 8
}
```

The theme preference is stored under `ojtTheme` (`"light"` or absent for dark mode).

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Created by <a href="https://github.com/rjanciro">rjanciro</a>
</p>
