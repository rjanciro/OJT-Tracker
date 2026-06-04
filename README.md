<div align="center">

# ⏱ OJT Tracker

*A clean, client-side progress tracker for on-the-job training hours.*

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Data Model](#-data-model) • [Production](#-production-ready)

---

![GitHub Pages](https://img.shields.io/badge/hosted_on-GitHub_Pages-222?style=flat&logo=githubpages&logoColor=white)
![PWA](https://img.shields.io/badge/PWA_Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)
![No Dependencies](https://img.shields.io/badge/zero_dependencies-brightgreen?style=flat)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat)

</div>

---

## 🧠 What is OJT Tracker?

> A single-page web app for students to **log daily attendance**, **track progress** toward their training hour target, and **export records** — all in the browser with zero setup.

```mermaid
mindmap
  root((OJT Tracker))
    📊 Dashboard
      Total Hours
      Remaining Hours
      Progress Bar
      Est. End Date
    📝 Logging
      Time In / Out
      Lunch Deduction
      Auto Calculation
      Edit / Delete
    📈 Analytics
      Monthly Chart
      Statistics Panel
      Best Month
      Longest Day
    🔍 Controls
      Date Filter
      Search
      CSV Export
      Dark / Light Mode
```

---

## ✨ Features

```mermaid
flowchart LR
    A[📅 Log Daily Entry] --> B[⚡ Auto-calc Hours]
    B --> C{📊 Dashboard Updates}
    C --> D[📈 Progress Bar]
    C --> E[📉 Remaining Hours]
    C --> F[🎯 Est. End Date]
    C --> G[📆 Monthly Breakdown]

    H[🔍 Search & Filter] --> I[📋 Filtered Table]
    J[✏️ Edit / Delete] --> K[🔄 Recalculates All Stats]
    L[🌙 Dark / Light Mode] --> M[💾 Persisted in localStorage]
    N[📤 Export CSV] --> O[📎 Downloadable Report]
```

| Feature | Why it matters |
|---|---|
| **Live Dashboard** | See total hours, remaining, progress %, and estimated end date at a glance |
| **Customizable Target** | Defaults to 500 hrs — adjust from 1–9999 to match your program |
| **Daily Time Logs** | Log time-in, time-out, and optionally deduct 1-hour lunch |
| **Monthly Breakdown** | Visual bar chart + table of hours per month |
| **Statistics Panel** | Total days logged, avg hrs/day, best month, longest day |
| **Search & Filter** | Filter by date range or search across all entries |
| **CSV Export** | One-click download of all logs for reporting |
| **Dark / Light Theme** | Toggle and persist your preference |

---

## 🏗 Architecture

```mermaid
flowchart TB
    subgraph Browser["🌐 Browser (Client-Side)"]
        HTML["index.html<br/><i>UI Layout</i>"]
        CSS["style.css<br/><i>Styling & Theme</i>"]
        JS["script.js<br/><i>All Application Logic</i>"]
    end

    subgraph Storage["💾 Browser Storage"]
        LS["localStorage<br/><i>ojtLogs → JSON array</i>"]
        Theme["localStorage<br/><i>ojtTheme → dark/light</i>"]
        Target["localStorage<br/><i>ojtTarget → number</i>"]
    end

    subgraph PWA["📱 PWA Layer"]
        SW["sw.js<br/><i>Service Worker</i>"]
        Manifest["manifest.json<br/><i>Installable</i>"]
    end

    HTML --> CSS
    HTML --> JS
    JS <--> LS
    JS <--> Theme
    JS <--> Target
    SW -.-> HTML
    SW -.-> CSS
    SW -.-> JS
    Manifest -.-> HTML

    style Browser fill:#1a1a2e,color:#fff
    style Storage fill:#16213e,color:#fff
    style PWA fill:#0f3460,color:#fff
```

| Layer | Technology |
|---|---|
| **UI** | HTML5 + Vanilla CSS3 (custom properties, animations, glassmorphism) |
| **Logic** | Vanilla ES6+ JavaScript — zero frameworks, zero dependencies |
| **Storage** | Browser `localStorage` — no server, no database, no API |
| **Fonts** | Google Inter (400–800) |
| **Icons** | Inline SVGs |
| **PWA** | Service worker + Web App Manifest |

---

## 🚀 Getting Started

### Run Locally

```bash
git clone https://github.com/rjanciro/OJT-Tracker.git
cd OJT-Tracker
start index.html
```

No `npm install`. No build step. Just open and go.

### Deploy to GitHub Pages

```mermaid
flowchart LR
    A[📦 Push to GitHub] --> B[⚙️ Settings > Pages]
    B --> C[📄 Source: Deploy from branch]
    C --> D[🌿 Branch: main]
    D --> E[📁 Folder: / root]
    E --> F[✅ Save]
    F --> G[🌍 Live in ~2 min]
```

Your site will be live at `https://<username>.github.io/<repo-name>/`.

> Includes a **service worker** for offline caching and a **manifest.json** for Add to Home Screen on mobile.

---

## 🎯 Usage

```mermaid
flowchart TD
    Start[🏁 Open the App] --> Target[🎯 Set Target Hours]
    Target --> Add[📅 Add Daily Log]
    Add --> Auto[⚡ Hours Auto-calculated]
    Auto --> Check{✅ All done?}
    Check -->|No| Add
    Check -->|Yes| View[📊 View Progress]
    View --> Filter[🔍 Filter / Search Logs]
    Filter --> Export[📤 Export CSV]
    Export --> Edit[✏️ Edit or Delete Entries]
    Edit --> Toggle[🌙 Toggle Theme]
    Toggle --> Clear[🗑 Clear All Data ?]
    Clear --> Start
```

1. **Set your target** — Adjust the "Target Hours" field to your required hours (e.g., 500, 750, 1000).
2. **Add a log** — Enter date, time-in, time-out, toggle lunch deduction. Hours are auto-calculated.
3. **Edit / Delete** — Click the pencil or trash icon on any row.
4. **Filter** — Use date range pickers or search box above the log table.
5. **Export** — Click "Export CSV" to download your records.
6. **Toggle Theme** — Click the sun/moon icon in the header.

---

## 💾 Data Model

```mermaid
classDiagram
    class LogEntry {
        +number id
        +string date
        +string timeIn
        +string timeOut
        +boolean lunch
        +number hours
    }
    class localStorage {
        +LogEntry[] ojtLogs
        +string ojtTheme
        +number ojtTarget
    }
    localStorage --> LogEntry
```

Every log entry is stored as a JSON object in `localStorage` under `ojtLogs`:

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

Additional keys:

| Key | Type | Description |
|---|---|---|
| `ojtTarget` | `number` | Target hours (default 500) |
| `ojtTheme` | `"light"` or absent | Theme preference |

---

## 🏭 Production Ready

```mermaid
quadrantChart
    title OJT Tracker Production Features
    x-axis "Low Effort" --> "High Effort"
    y-axis "Low Impact" --> "High Impact"
    quadrant-1 "Core Strengths"
    quadrant-2 "Nice to Have"
    quadrant-3 "Low Priority"
    quadrant-4 "Quick Wins"
    "PWA Offline": [0.3, 0.8]
    "SEO Meta Tags": [0.2, 0.7]
    "Dark/Light Theme": [0.6, 0.85]
    "Responsive Design": [0.5, 0.9]
    "CSV Export": [0.4, 0.75]
    "Service Worker": [0.25, 0.65]
    "Keyboard A11Y": [0.15, 0.55]
    "Print Styles": [0.1, 0.4]
```

- **📱 PWA Ready** — Service worker caches assets for offline access; installable via manifest.
- **🔍 SEO Optimized** — Meta tags, Open Graph tags, and semantic HTML structure.
- **♿ Accessible** — Focus-visible outlines, `prefers-reduced-motion` support.
- **📐 Responsive** — Fully functional on desktop, tablet, and mobile.
- **🖨 Print Friendly** — Optimized print styles for generating paper records.
- **⚡ Performance** — CSS preloaded, search debounced, animations hardware-accelerated.

---

## 📄 License

Distributed under the MIT License.

---

<p align="center">
  Created with ❤️ by <a href="https://github.com/rjanciro">rjanciro</a>
</p>
