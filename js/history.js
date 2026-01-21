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

const emptyState = document.getElementById("emptyState");
const txList = document.getElementById("txList");

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