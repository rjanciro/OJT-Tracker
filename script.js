function getTargetHours() {
  return parseInt(localStorage.getItem("ojtTarget")) || 500;
}

let logs = JSON.parse(localStorage.getItem("ojtLogs")) || [];
let filterFrom = "";
let filterTo = "";
let filterSearch = "";

initTheme();
document.getElementById("targetHours").value = getTargetHours();
render();
updateSummary();
renderMonthlySummary();
updateStats();
createParticles();

function initTheme() {
  const saved = localStorage.getItem("ojtTheme");
  if (saved === "light") {
    document.documentElement.classList.add("light");
  }
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
}

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.classList.toggle("light");
  localStorage.setItem("ojtTheme", isLight ? "light" : "dark");
}

function createParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 25; i++) {
    const dot = document.createElement("span");
    dot.style.left = Math.random() * 100 + "%";
    dot.style.animationDuration = (15 + Math.random() * 25) + "s";
    dot.style.animationDelay = (Math.random() * 20) + "s";
    dot.style.width = dot.style.height = (2 + Math.random() * 3) + "px";
    const colors = ["rgba(99,102,241,", "rgba(139,92,246,", "rgba(16,185,129,"];
    dot.style.background = colors[Math.floor(Math.random() * colors.length)] + (0.15 + Math.random() * 0.2) + ")";
    container.appendChild(dot);
  }
}

function toast(message, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = "toast" + (isError ? " error" : "");
  requestAnimationFrame(() => {
    el.classList.add("show");
    clearTimeout(el._hide);
    el._hide = setTimeout(() => el.classList.remove("show"), 2500);
  });
}

document.getElementById("logForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const date = document.getElementById("date").value;
  const timeIn = normalizeTimeInput(document.getElementById("timeIn").value);
  const timeOut = normalizeTimeInput(document.getElementById("timeOut").value);
  const lunch = document.getElementById("lunch").checked;

  if (!timeIn || !timeOut) {
    toast("Please enter time in 12-hour format, like 7:00 AM.", true);
    return;
  }

  const day = new Date(date + "T00:00:00").getDay();
  if (day === 0 || day === 6) {
    toast("Weekends (Saturday & Sunday) are excluded.", true);
    return;
  }

  const hours = calculateHours(timeIn, timeOut, lunch);
  if (hours <= 0) {
    toast("Invalid time range. Check your Time In and Time Out.", true);
    return;
  }

  if (id) {
    const log = logs.find(l => l.id == id);
    Object.assign(log, { date, timeIn, timeOut, lunch, hours });
    toast("Log updated successfully!");
  } else {
    const existing = logs.find(l => l.date === date);
    if (existing) {
      Object.assign(existing, { timeIn, timeOut, lunch, hours });
      toast("Log updated successfully!");
    } else {
      logs.push({ id: Date.now(), date, timeIn, timeOut, lunch, hours });
      toast("Log added successfully!");
    }
  }

  save();
  this.reset();
  document.getElementById("editId").value = "";
  document.getElementById("lunch").checked = true;
  document.getElementById("timeIn").value = "7:00 AM";
  document.getElementById("timeOut").value = "4:00 PM";
});

function calculateHours(timeIn, timeOut, lunch) {
  const start = parseTimeToMinutes(timeIn);
  const end = parseTimeToMinutes(timeOut);
  let hours = (end - start) / 60;
  if (lunch) hours -= 1;
  return hours;
}

function parseTimeToMinutes(timeString) {
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!match) return NaN;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return NaN;
  if (period === "AM") {
    hours = hours === 12 ? 0 : hours;
  } else {
    hours = hours === 12 ? 12 : hours + 12;
  }
  return hours * 60 + minutes;
}

function normalizeTimeInput(timeString) {
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!match) return "";
  const hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (hours < 1 || hours > 12) return "";
  return formatTime12(hours, minutes, period);
}

function formatTime12(hours, minutes, period) {
  return `${hours}:${minutes} ${period}`;
}

function formatStoredTime(timeString) {
  const totalMinutes = parseAnyTimeToMinutes(timeString);
  if (Number.isNaN(totalMinutes)) return timeString;
  let hours = Math.floor(totalMinutes / 60);
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}

function parseAnyTimeToMinutes(timeString) {
  const twelveHour = timeString.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2]);
    const period = twelveHour[3].toUpperCase();
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return NaN;
    if (period === "AM") {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
    return hours * 60 + minutes;
  }
  const twentyFourHour = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return NaN;
    return hours * 60 + minutes;
  }
  return NaN;
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
}

function animateValue(el, start, end, suffix = "") {
  if (start === end) {
    el.textContent = end.toFixed(1) + suffix;
    return;
  }
  const duration = 800;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    el.textContent = current.toFixed(1) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = end.toFixed(1) + suffix;
    }
  }
  requestAnimationFrame(tick);
}

function getFilteredLogs() {
  return logs.filter(log => {
    if (filterFrom && log.date < filterFrom) return false;
    if (filterTo && log.date > filterTo) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const dateStr = formatDate(log.date).toLowerCase();
      const timeIn = formatStoredTime(log.timeIn).toLowerCase();
      const timeOut = formatStoredTime(log.timeOut).toLowerCase();
      const hoursStr = String(log.hours);
      if (
        !dateStr.includes(q) &&
        !timeIn.includes(q) &&
        !timeOut.includes(q) &&
        !hoursStr.includes(q) &&
        !log.date.includes(q)
      ) return false;
    }
    return true;
  });
}

function render() {
  const table = document.getElementById("logTable");
  table.innerHTML = "";

  const filtered = getFilteredLogs();
  filtered.sort((a, b) => new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00"));

  filtered.forEach((log, i) => {
    const row = table.insertRow();
    row.style.animationDelay = (i * 0.035) + "s";
    row.innerHTML = `
      <td>${formatDate(log.date)}</td>
      <td>${formatStoredTime(log.timeIn)}</td>
      <td>${formatStoredTime(log.timeOut)}</td>
      <td>${log.lunch ? '<span style="color:#10b981;font-weight:600;">Yes</span>' : '<span style="color:var(--text-dim);">No</span>'}</td>
      <td><strong>${log.hours}</strong></td>
      <td>
        <span class="action-btn" onclick="editLog(${log.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </span>
        <span class="action-btn delete" onclick="deleteLog(${log.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </span>
      </td>
    `;
  });

  if (filtered.length === 0) {
    const row = table.insertRow();
    row.innerHTML = '<td colspan="6" style="text-align:center;padding:32px;color:var(--text-dim);font-size:14px;">' +
      (logs.length === 0 ? 'No logs yet. Add your first entry above.' : 'No logs match your filters.') +
      '</td>';
  }

  const total = logs.length;
  const shown = filtered.length;
  document.getElementById("logsCount").textContent =
    shown + " of " + total + " entr" + (total === 1 ? "y" : "ies") +
    (shown !== total ? "" : "");
}

function renderMonthlySummary() {
  const grid = document.getElementById("monthlyGrid");
  const table = document.getElementById("monthlyTable");
  const monthlyMap = new Map();

  logs.forEach(log => {
    const monthKey = getMonthKey(log.date);
    const current = monthlyMap.get(monthKey) || { hours: 0, logs: 0 };
    monthlyMap.set(monthKey, {
      hours: current.hours + Number(log.hours),
      logs: current.logs + 1
    });
  });

  const months = Array.from(monthlyMap.entries())
    .sort((a, b) => new Date(a[0] + "-01") - new Date(b[0] + "-01"));

  grid.innerHTML = "";
  table.innerHTML = "";

  if (months.length === 0) {
    grid.innerHTML = '<div class="monthly-empty">No logs yet. Start tracking to see monthly breakdown.</div>';
    table.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-dim);padding:24px;">No data available</td></tr>';
    return;
  }

  const highestHours = Math.max(...months.map(([, data]) => data.hours), 1);

  months.forEach(([monthKey, data], i) => {
    const displayMonth = formatMonth(monthKey);
    const barWidth = Math.max((data.hours / highestHours) * 100, 8);

    const card = document.createElement("div");
    card.className = "monthly-card";
    card.style.animationDelay = (i * 0.08) + "s";
    card.innerHTML = `
      <div class="monthly-card__label">${displayMonth}</div>
      <div class="monthly-card__hours">${data.hours.toFixed(1)} hrs</div>
      <div class="monthly-bar">
        <span style="width: 0%"></span>
      </div>
      <div class="monthly-card__count">${data.logs} log${data.logs === 1 ? "" : "s"}</div>
    `;
    grid.appendChild(card);

    requestAnimationFrame(() => {
      const bar = card.querySelector(".monthly-bar span");
      bar.style.width = barWidth + "%";
    });

    const row = table.insertRow();
    row.innerHTML = `<td>${displayMonth}</td><td>${data.hours.toFixed(1)}</td><td>${data.logs}</td>`;
  });
}

function getMonthKey(dateString) {
  const date = new Date(dateString + "T00:00:00");
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonth(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function updateStats() {
  const totalDays = logs.length;
  document.getElementById("totalDays").textContent = totalDays;

  const totalHours = logs.reduce((s, l) => s + l.hours, 0);
  const avg = totalDays > 0 ? (totalHours / totalDays) : 0;
  document.getElementById("avgHours").textContent = avg.toFixed(1);

  const monthlyMap = new Map();
  logs.forEach(log => {
    const key = getMonthKey(log.date);
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + Number(log.hours));
  });
  let bestMonth = "—";
  let bestHours = 0;
  for (const [key, h] of monthlyMap) {
    if (h > bestHours) {
      bestHours = h;
      bestMonth = formatMonth(key);
    }
  }
  document.getElementById("bestMonth").textContent = bestMonth;

  const longest = logs.reduce((max, l) => l.hours > max ? l.hours : max, 0);
  document.getElementById("longestDay").textContent = longest > 0 ? longest.toFixed(1) + "h" : "—";
}

function editLog(id) {
  const log = logs.find(l => l.id === id);
  if (!log) return;
  openEditModal(log);
}

function openEditModal(log) {
  document.getElementById("modalEditId").value = log.id;
  document.getElementById("modalDate").value = log.date;
  document.getElementById("modalTimeIn").value = formatStoredTime(log.timeIn);
  document.getElementById("modalTimeOut").value = formatStoredTime(log.timeOut);
  document.getElementById("modalLunch").checked = log.lunch;
  const modal = document.getElementById("editModal");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
  document.body.style.overflow = "";
}

document.getElementById("modalCloseBtn").addEventListener("click", closeEditModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeEditModal);

document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this || e.target.classList.contains("modal-overlay")) closeEditModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const modal = document.getElementById("editModal");
    if (modal && modal.style.display === "flex") closeEditModal();
  }
});

document.getElementById("modalSaveBtn").addEventListener("click", function () {
  const id = document.getElementById("modalEditId").value;
  const date = document.getElementById("modalDate").value;
  const timeIn = normalizeTimeInput(document.getElementById("modalTimeIn").value);
  const timeOut = normalizeTimeInput(document.getElementById("modalTimeOut").value);
  const lunch = document.getElementById("modalLunch").checked;

  if (!timeIn || !timeOut) {
    toast("Please enter time in 12-hour format, like 7:00 AM.", true);
    return;
  }

  const day = new Date(date + "T00:00:00").getDay();
  if (day === 0 || day === 6) {
    toast("Weekends (Saturday & Sunday) are excluded.", true);
    return;
  }

  const hours = calculateHours(timeIn, timeOut, lunch);
  if (hours <= 0) {
    toast("Invalid time range.", true);
    return;
  }

  const log = logs.find(l => l.id == id);
  if (log) {
    Object.assign(log, { date, timeIn, timeOut, lunch, hours });
    save();
    toast("Log updated successfully!");
  }
  closeEditModal();
});

function deleteLog(id) {
  if (!confirm("Delete this log entry?")) return;
  logs = logs.filter(l => l.id !== id);
  save();
  toast("Log deleted.");
}

// TARGET HOURS
document.getElementById("targetHours").addEventListener("change", function () {
  const val = parseInt(this.value);
  if (val > 0 && val <= 9999) {
    localStorage.setItem("ojtTarget", val);
    save();
    toast("Target hours updated to " + val);
  } else {
    this.value = getTargetHours();
    toast("Enter a value between 1 and 9999.", true);
  }
});

// FILTER EVENTS
document.getElementById("filterFrom").addEventListener("change", function () {
  filterFrom = this.value;
  render();
});

document.getElementById("filterTo").addEventListener("change", function () {
  filterTo = this.value;
  render();
});

document.getElementById("filterSearch").addEventListener("input", function () {
  filterSearch = this.value;
  render();
});

document.getElementById("clearFiltersBtn").addEventListener("click", function () {
  document.getElementById("filterFrom").value = "";
  document.getElementById("filterTo").value = "";
  document.getElementById("filterSearch").value = "";
  filterFrom = "";
  filterTo = "";
  filterSearch = "";
  render();
});

// EXPORT CSV
document.getElementById("exportCsvBtn").addEventListener("click", function () {
  if (logs.length === 0) {
    toast("No data to export.", true);
    return;
  }

  const headers = ["Date", "Time In", "Time Out", "Lunch Deducted", "Hours"];
  const rows = logs.map(log => [
    log.date,
    formatStoredTime(log.timeIn),
    formatStoredTime(log.timeOut),
    log.lunch ? "Yes" : "No",
    log.hours.toFixed(1)
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ojt_logs_" + new Date().toISOString().slice(0, 10) + ".csv";
  link.click();
  URL.revokeObjectURL(link.href);
  toast("CSV exported successfully!");
});

// CLEAR ALL
document.getElementById("clearAllBtn").addEventListener("click", function () {
  if (logs.length === 0) {
    toast("No data to clear.", true);
    return;
  }
  if (!confirm("Are you sure you want to delete ALL log entries? This cannot be undone.")) return;
  if (!confirm("This will permanently remove all " + logs.length + " entries. Continue?")) return;
  logs = [];
  save();
  toast("All data cleared.");
});

function save() {
  localStorage.setItem("ojtLogs", JSON.stringify(logs));
  render();
  updateSummary();
  renderMonthlySummary();
  updateStats();
}

function updateSummary() {
  const required = getTargetHours();
  const total = logs.reduce((s, l) => s + l.hours, 0);
  const remaining = Math.max(required - total, 0);
  const progress = Math.min((total / required) * 100, 100);

  const totalEl = document.getElementById("totalHours");
  const remainEl = document.getElementById("remainingHours");
  const progressEl = document.getElementById("progress");
  const progressFill = document.getElementById("progressFill");

  const oldTotal = parseFloat(totalEl.textContent) || 0;
  const oldRemain = parseFloat(remainEl.textContent) || 0;

  animateValue(totalEl, oldTotal, total, "");
  animateValue(remainEl, oldRemain, remaining, "");

  progressEl.textContent = progress.toFixed(1) + "%";
  progressFill.style.width = progress + "%";
  document.getElementById("targetDisplay").textContent = required;

  document.getElementById("endDate").textContent = estimateEndDate(remaining);
}

function estimateEndDate(remaining) {
  if (logs.length === 0) return "\u2014";
  const avg = logs.reduce((s, l) => s + l.hours, 0) / logs.length;
  let daysNeeded = Math.ceil(remaining / avg);
  let date = new Date();
  while (daysNeeded > 0) {
    date.setDate(date.getDate() + 1);
    const d = date.getDay();
    if (d !== 0 && d !== 6) daysNeeded--;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
}
