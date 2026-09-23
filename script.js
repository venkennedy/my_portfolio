/* ============ EDIT THESE ============ */
const PHOTO = "IMG_7747.JPG";   // paste an image path (e.g. "photo.jpg", placed next to index.html) to show your photo

const CONTACT = {
  email:    "kennedyvenoliah2@gmail.com",
  linkedin: "https://www.linkedin.com/in/venoliahkennedy-676384233",
  github:   "https://github.com/venkennedy",
  medium:   "https://medium.com/@kennedyvenoliah2",
  leetcode: "https://leetcode.com/u/kennedyvenoliah2/"
};

/* Each entry = one folder card on labsetc.html AND one category page (e.g. letsdefend.html).
   slug must match the "data-slug" on that page's <div id="lab-detail">.
   folder must exactly match the folder name inside writeups/ on disk (case-sensitive).
   To add a write-up: just drop the PDF into that folder, commit and push — the file list
   below is generated automatically at deploy time (see scripts/generate-manifest.js).
   mediumUrl: link to the published Medium post covering this category, once it's live. */
const LABS = [
  {
    slug: "letsdefend",
    page: "letsdefend.html",
    folder: "LetsDefend_labs",
    title: "LetsDefend Labs",
    platform: "LetsDefend",
    category: "Blue team, alert triage",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "seedlabs",
    page: "seedlabs.html",
    folder: "Seed_labs",
    title: "SEED Labs",
    platform: "SEED Labs",
    category: "Systems & security labs",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "splunk",
    page: "splunk.html",
    folder: "Splunk_Labs",
    title: "Splunk Labs",
    platform: "Splunk",
    category: "SIEM & log analysis",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "huntress",
    page: "huntress.html",
    folder: "Huntress_CTF_2025",
    title: "Huntress CTF 2025",
    platform: "Huntress",
    category: "Capture the flag",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "hackthebox",
    page: "hackthebox.html",
    folder: "HackTheBox_labs",
    title: "Hack The Box",
    platform: "Hack The Box",
    category: "Hands-on penetration testing labs",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "tryhackme",
    page: "tryhackme.html",
    folder: "TryHackMe_labs",
    title: "TryHackMe",
    platform: "TryHackMe",
    category: "Guided security challenges",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  },
  {
    slug: "leetcode",
    page: "leetcode.html",
    folder: "leetCode",
    title: "LeetCode",
    platform: "LeetCode",
    category: "Problem solving",
    problem: "",
    approach: "",
    tools: [],
    terminal: "",
    shots: [],
    lessons: "",
    mediumUrl: ""
  }
];
/* ==================================== */

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Filename without its extension, used as the display label for each file row.
const fileLabel = filename => filename.replace(/\.(pdf|docx)$/i, "");
const fileBadge = filename => /\.docx$/i.test(filename) ? "DOC" : "PDF";

async function loadManifest() {
  try {
    const res = await fetch("writeups/manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("manifest not found");
    return await res.json();
  } catch (e) {
    return null; // e.g. opened via file:// directly, or not deployed yet
  }
}

function renderPortrait() {
  const frame = document.getElementById("portrait");
  if (!frame || !PHOTO) return;
  frame.innerHTML = "";
  const img = document.createElement("img");
  img.src = PHOTO; img.alt = "Portrait of Venoliah Kennedy";
  frame.appendChild(img);
}

function renderContact() {
  const cl = document.getElementById("contact-list");
  if (!cl) return;
  const rows = [
    ["Email", CONTACT.email, v => "mailto:" + v],
    ["LinkedIn", CONTACT.linkedin, v => v],
    ["Medium", CONTACT.medium, v => v],
    ["LeetCode", CONTACT.leetcode, v => v],
    ["GitHub", CONTACT.github, v => v]
  ];
  rows.forEach(([label, val, href]) => {
    const li = document.createElement("li");
    li.innerHTML = val
      ? `<a href="${esc(href(val))}"${/^https?:/.test(href(val)) ? ' target="_blank" rel="noopener"' : ""}><span class="label">${label}</span><span class="value">${esc(val.replace(/^https?:\/\/(www\.)?/, ""))}</span></a>`
      : `<div class="empty"><span class="label">${label}</span><span class="value">To be added</span></div>`;
    cl.appendChild(li);
  });
}

/* Folder grid on labsetc.html */
function renderFolderGrid(manifest) {
  const grid = document.getElementById("folder-grid");
  if (!grid) return;
  grid.innerHTML = LABS.map(lab => {
    const count = manifest ? (manifest[lab.slug] || []).length : null;
    const countLabel = count === null ? "" : count ? `${count} write-up${count > 1 ? "s" : ""}` : "Coming soon";
    return `
    <a class="folder-card" href="${esc(lab.page)}">
      <span class="folder-icon" aria-hidden="true">
        <svg viewBox="0 0 64 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 8a4 4 0 0 1 4-4h14l6 6h32a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" fill="var(--surface)" stroke="var(--garnet)" stroke-width="2"/>
          <path d="M2 16h60" stroke="var(--line)" stroke-width="2"/>
        </svg>
      </span>
      <span class="folder-label">${esc(lab.title)}</span>
      <span class="folder-count">${countLabel}</span>
    </a>`;
  }).join("");
}

/* File list — one row per PDF, burgundy divider between rows */
function renderFileList(lab, manifest) {
  if (manifest === null) {
    return `<div class="full"><h4>Write-ups</h4><p class="pending">Write-ups load once this site is running from a server (via Netlify, or VS Code's Live Server locally) — opening the file directly can't read the folder.</p></div>`;
  }
  const files = manifest[lab.slug] || [];
  if (!files.length) {
    return `<div class="full"><h4>Write-ups</h4><p class="pending">No write-ups in writeups/${esc(lab.folder)} yet.</p></div>`;
  }
  const rows = files.map(f => {
    const href = `writeups/${encodeURIComponent(lab.folder)}/${encodeURIComponent(f)}`;
    return `<a class="file-row" href="${href}" target="_blank" rel="noopener">
      <span class="file-badge">${fileBadge(f)}</span>
      <span class="file-name">${esc(fileLabel(f))}</span>
    </a>`;
  }).join("");
  return `<div class="full"><h4>Write-ups</h4><div class="file-list">${rows}</div></div>`;
}

/* Detail content used on each category page */
function labDetailHTML(lab, manifest) {
  const mediumLink = lab.mediumUrl ? `<div class="full"><a class="plink" href="${esc(lab.mediumUrl)}" target="_blank" rel="noopener">Read on Medium →</a></div>` : "";

  return `
    <div class="win-bar"><span class="win-dot"></span><span class="win-dot"></span><span class="win-dot"></span><span class="win-title">${esc(lab.platform.toLowerCase())} / write-ups</span></div>
    <div class="win-body">
      <h3>${esc(lab.title)}</h3>
      <div class="meta">${esc(lab.platform)} — ${esc(lab.category)}</div>
      <div class="lab-grid">
        ${renderFileList(lab, manifest)}
        ${mediumLink}
      </div>
    </div>`;
}

/* Individual category page (letsdefend.html, seedlabs.html, etc.) */
function renderLabDetail(manifest) {
  const el = document.getElementById("lab-detail");
  if (!el) return;
  const slug = el.getAttribute("data-slug");
  const lab = LABS.find(l => l.slug === slug);
  if (!lab) { el.innerHTML = "<p class=\"pending\">Unknown category.</p>"; return; }
  el.className = "win";
  el.innerHTML = labDetailHTML(lab, manifest);
}

document.addEventListener("DOMContentLoaded", async () => {
  renderPortrait();
  renderContact();
  const manifest = await loadManifest();
  renderFolderGrid(manifest);
  renderLabDetail(manifest);
});
