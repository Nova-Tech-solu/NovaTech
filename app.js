// ─── CONFIG ───────────────────────────────────────────────
// Change this to your deployed Render/Railway backend URL
const API_BASE = "https://your-api.onrender.com";

// ─── AUTH GUARD ───────────────────────────────────────────
function requireAuth() {
  if (sessionStorage.getItem("das_auth") !== "1") {
    window.location.href = "../index.html";
  }
}

function logout() {
  sessionStorage.removeItem("das_auth");
  window.location.href = "../index.html";
}

// ─── FETCH WRAPPER ────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

// ─── DATAFRAME → HTML TABLE ───────────────────────────────
// The backend stores DataFrames as orient='split':
// { columns: [...], data: [[...], [...]] }
function dfToTable(splitData, tableId = "") {
  if (!splitData || !splitData.columns || !splitData.data) {
    return `<p class="empty-state">No data available.</p>`;
  }
  const cols = splitData.columns;
  const rows = splitData.data;

  let html = `<div class="table-scroll"><table class="data-table" ${tableId ? `id="${tableId}"` : ""}>`;
  html += `<thead><tr>${cols.map(c => `<th>${escHtml(String(c))}</th>`).join("")}</tr></thead>`;
  html += `<tbody>`;
  for (const row of rows) {
    html += `<tr>${row.map(v => `<td>${escHtml(v == null ? "—" : String(v))}</td>`).join("")}</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── TIMESTAMP FORMATTER ──────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

// ─── NAV ACTIVE STATE ─────────────────────────────────────
function setActiveNav(pageId) {
  document.querySelectorAll(".nav-link").forEach(el => {
    el.classList.toggle("active", el.dataset.page === pageId);
  });
}
