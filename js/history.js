/* ==========
   CONFIG
========== */
const STORAGE_KEY = "transactions";

/* ==========
   SEED
========== */
const seedTransactions = [
    {id: "txt1", date: "05-01-2026", type: "expense", category: "Food", amount: 45, note:"Pizza"},
    {id: "txt2", date: "10-01-2026", type: "icome", category: "Salary", amount: 10000, note:"December salery"},
    { id: "tx3", date: "2026-01-12", type: "expense", category: "Transport", amount: 18, note: "Bus" },
    { id: "tx4", date: "2026-01-19", type: "expense", category: "Shopping", amount: 210, note: "Skincare" }
];
/* ==========
   DOM
========== */
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("searchInput");
const filterMode = document.getElementById("filterMode");

const rangeWrap = document.getElementById("rangeWrap");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");


const yearSpan = document.getElementById("yaer");

/* ==========
   STATE
========== */
let allTx = [];
let filteredTx = [];

/* ==========
   INIT
========== */

init();

function init(){
    setYear();
    ensureSeed();
    allTx = loadTransactions();
    bindEvents();
    toggleRangeUI();
    applyFiltersAndRender();


}

/* ==========
   COMMON - take to COMMON.JS
========== */
function setYear(){
    if (!localStorage.getItem(STORAGE_KEY)){
        localStorage.setItem(STORAGE_KEY,JASON.stringify(seedTransactions));
    }
}

function ensureSeed() {}

/* ==========
   STORAGE
========== */
function loadTransactions() {}


/* ==========
   EVENTS
========== */
function bindEvents() {}

function toggleRangeUI() {}

function applyFiltersAndRender() {}




/* ==========
   EXPORT CSV
========== */
function exportToCSV(arr) {}


/* =================
   NEW TRANSACTION
====================*/

const txtList = document.getElementById("txList");
const emptyState = document.getElementById("emptyState");

const DATA_URL ="../data/data.json";

async function loadTransactions() {
   try{
      const res = await fetch(DATA_URL);
      if(!res.ok) throw new Error("failed to load JSON");
      const transactions = await res.json();

      renderTransactions(transactions);
   }
   catch(err){
      console.error(err);
      emptyState.style.display = "block";
      emptyState.textContent = "Could not load transactions."
   }  
}
function renderTransactions(transactions) {
  txList.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  for (const tx of transactions) {
    txList.appendChild(createTxItem(tx));
  }
}

function createTxItem(tx) {
  const isIncome = tx.type === "income";

  const li = document.createElement("li");
  li.className = `tx-item ${isIncome ? "tx--income" : "tx--expense"}`;
  li.dataset.id = tx.id;

  // icon (קבוע לפי סוג)
  const icon = document.createElement("div");
  icon.className = "tx-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = isIncome ? "↗" : "↘";

  // text
  const text = document.createElement("div");
  text.className = "tx-text";

  const title = document.createElement("div");
  title.className = "tx-title";
  // אם תרצי: tx.note יהיה הכותרת, והקטגוריה תופיע בשורה השנייה
  title.textContent = tx.note || tx.category;

  const sub = document.createElement("div");
  sub.className = "tx-sub";
  sub.textContent = `${tx.date} • ${tx.category}`;

  text.appendChild(title);
  text.appendChild(sub);

  // amount (קבוע בפורמט +/-, גם לפי סוג)
  const amount = document.createElement("div");
  amount.className = "tx-amount";
  amount.textContent = `${isIncome ? "+" : "-"} ₪${Number(tx.amount).toLocaleString()}`;

  // delete button (קבוע)
  const delBtn = document.createElement("button");
  delBtn.className = "tx-delete";
  delBtn.type = "button";
  delBtn.setAttribute("aria-label", "Delete transaction");
  delBtn.textContent = "🗑️";

  // (רשות) פעולה בסיסית למחיקה מהמסך בלבד
  delBtn.addEventListener("click", () => {
    li.remove();
    if (txList.children.length === 0) emptyState.style.display = "block";
  });

  // build
  li.append(icon, text, amount, delBtn);
  return li;
}

loadTransactions();