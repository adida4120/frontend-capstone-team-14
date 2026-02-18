document.addEventListener("DOMContentLoaded", function (){
  console.log("history.js loaded");

  /* ========= DOM ========= */
  const txList = document.getElementById("txList");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");

  const searchInput = document.getElementById("searchInput");
  const filterMode = document.getElementById("filterMode");
  const modeInputs = document.getElementById("modeInputs");
  const monthSelect = document.getElementById("monthSelect");
  const exportBtn = document.getElementById("exportBtn");

  if (!txList || !emptyState || !resultsCount) {
    console.error("Missing required HTML elements");
    return;
  }

  /* ========= DATA ========= */
  const STORAGE_KEY = "moneyBuddyData";
  let transactions = [];
  let filtered = [];


  /* ========= LOAD / SAVE ========= */

  async function loadData() {
    try{
      const localData = localStorage.getItem(STORAGE_KEY);

      if(localData){
      transactions = JSON.parse(localData);
      console.log("History loaded from LocalStorage");}

      else {
        const res = await fetch("../data/data.json");
        if(!res.ok) throw new Error("Failed to load data.json");

        transactions = await res.json();

        // Save JSON to LocalStorage the very first time
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
        console.log("History loaded and saved to LocalStorage");
      }

   
    }
    catch(err){
        console.error("Error loadimg data", err);
        transactions = [];
        renderList(filtered);
        updateSummary(filtered);
    } 

    initMonthSelect(transactions);
    buildModeInputs("all", transactions);
    applyFilters();
  }

 /* ========= START ========= */
  loadData();


  /* ========= EVENTS ========= */
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (monthSelect) monthSelect.addEventListener("change", applyFilters);

  if (filterMode) {
    filterMode.addEventListener("change", function () {
      buildModeInputs(filterMode.value, transactions);
      applyFilters();
    });
  }

  if (modeInputs) {
    modeInputs.addEventListener("change", applyFilters);
    modeInputs.addEventListener("input", applyFilters);
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      exportFilteredToCSV(filtered);
    });
  }

  /* ========= FILTERING ========= */
  function applyFilters() {
    let query = "";
    if (searchInput){
      query = searchInput.value.toLowerCase().trim();
    }

    let selectedMonth = "all";
     if (monthSelect){
      selectedMonth = monthSelect.value;
    }

    let mode = "all";
    if (filterMode){
      mode = filterMode.value;
    }

    // Start from full list
    let items = transactions.slice();

     /* ----- Text search ----- */
     if(query !== ""){
      items = items.filter(function(tx){

        let category ="";
        if(tx.category){
          category = tx.category.toLowerCase();
        }

        let note ="";
        if(tx.note){
          note = tx.note.toLowerCase();
        }

        if(category.indexOf(query) !== -1){
          return true;
        }

        if(note.indexOf(query) !== -1){
          return true;
        }

        return false;
      });
     }


    // // Search (category or note)
    // if (q) {
    //   items = items.filter(function (tx) {
    //     const cat = (tx.category || "").toLowerCase();
    //     const note = (tx.note || "").toLowerCase();
    //     return cat.indexOf(q) !== -1 || note.indexOf(q) !== -1;
    //   });
    // }

    /* ----- Month filter ----- */
    if(selectedMonth !== "all"){
     items = items.filter(function(tx){

        const isoDate = toISODate(tx.date);

        if(isoDate === ""){
          return false;
        }

        const yearMonth = isoDate.substring(0,7);
        return(yearMonth === selectedMonth)
        
      });
    }

    items = applyModeFilter(items, mode);


    // // Month select (quick filter)
    // if (monthVal && monthVal !== "all") {
    //   items = items.filter(function (tx) {
    //     const iso = toISODate(tx.date); // yyyy-mm-dd
    //     if (!iso) return false;
    //     return iso.substring(0, 7) === monthVal; // yyyy-mm
    //   });
    // }

    // // Mode filters
    // items = applyModeFilter(items, mode);

    // Sort by date DESC
    items.sort(function (a, b) {
      return parseDMY(b.date) - parseDMY(a.date);
    });

    filtered = items;

    renderList(filtered);
    updateSummary(filtered);
  }

/* =====================================================
     RENDER LIST
  ===================================================== */

  function renderList(items) {

    txList.innerHTML = "";

    if (!items || items.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    for (let i = 0; i < items.length; i++) {
      const txItem = createTxItem(items[i]);
      txList.appendChild(txItem);
    }
  }



// //////////////////////////////////////////////////////////////////////////// old


  function applyModeFilter(items, mode) {
    if (!mode || mode === "all") return items;

    // Read dynamic inputs
    const dailyDate = document.getElementById("dailyDate");
    const monthlyMonth = document.getElementById("monthlyMonth");
    const yearlyYear = document.getElementById("yearlyYear");
    const fromDate = document.getElementById("fromDate");
    const toDate = document.getElementById("toDate");

    if (mode === "daily" && dailyDate && dailyDate.value) {
      const target = dailyDate.value; // yyyy-mm-dd
      return items.filter(function (tx) {
        return toISODate(tx.date) === target;
      });
    }

    if (mode === "monthly" && monthlyMonth && monthlyMonth.value) {
      const targetMonth = monthlyMonth.value; // yyyy-mm
      return items.filter(function (tx) {
        const iso = toISODate(tx.date);
        return iso && iso.substring(0, 7) === targetMonth;
      });
    }

    if (mode === "yearly" && yearlyYear && yearlyYear.value) {
      const y = yearlyYear.value; // yyyy
      return items.filter(function (tx) {
        const iso = toISODate(tx.date);
        return iso && iso.substring(0, 4) === y;
      });
    }

    if (mode === "range" && fromDate && toDate && fromDate.value && toDate.value) {
      const from = new Date(fromDate.value + "T00:00:00");
      const to = new Date(toDate.value + "T23:59:59");

      return items.filter(function (tx) {
        const iso = toISODate(tx.date);
        if (!iso) return false;
        const d = new Date(iso + "T00:00:00");
        return d >= from && d <= to;
      });
    }

    return items;
  }

  /* ========= DYNAMIC INPUTS UI ========= */
  function buildModeInputs(mode, allItems) {
    if (!modeInputs) return;
    modeInputs.innerHTML = "";

    // Helper: create a field wrapper
    function field(labelText, inputEl) {
      const wrap = document.createElement("div");
      wrap.className = "filter-field";

      const lab = document.createElement("label");
      lab.textContent = labelText;

      wrap.appendChild(lab);
      wrap.appendChild(inputEl);
      return wrap;
    }

    if (mode === "daily") {
      const inp = document.createElement("input");
      inp.type = "date";
      inp.id = "dailyDate";
      inp.className = "input";
      modeInputs.appendChild(field("Day", inp));
    }

    if (mode === "monthly") {
      const inp = document.createElement("input");
      inp.type = "month";
      inp.id = "monthlyMonth";
      inp.className = "input";
      modeInputs.appendChild(field("Month", inp));
    }

    if (mode === "yearly") {
      const sel = document.createElement("select");
      sel.id = "yearlyYear";
      sel.className = "input";

      const optAll = document.createElement("option");
      optAll.value = "";
      optAll.textContent = "Choose year";
      sel.appendChild(optAll);

      const years = extractYears(allItems);
      for (let i = 0; i < years.length; i++) {
        const o = document.createElement("option");
        o.value = years[i];
        o.textContent = years[i];
        sel.appendChild(o);
      }

      modeInputs.appendChild(field("Year", sel));
    }

    if (mode === "range") {
      const from = document.createElement("input");
      from.type = "date";
      from.id = "fromDate";
      from.className = "input";

      const to = document.createElement("input");
      to.type = "date";
      to.id = "toDate";
      to.className = "input";

      modeInputs.appendChild(field("From", from));
      modeInputs.appendChild(field("To", to));
    }
  }

  function extractYears(items) {
    const set = {};
    for (let i = 0; i < items.length; i++) {
      const iso = toISODate(items[i].date);
      if (!iso) continue;
      const y = iso.substring(0, 4);
      set[y] = true;
    }
    const years = Object.keys(set);
    years.sort(function (a, b) { return Number(b) - Number(a); });
    return years;
  }

  /* ========= MONTH SELECT ========= */
  function initMonthSelect(items) {
    if (!monthSelect) return;

    // keep "All"
    monthSelect.innerHTML = "";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All";
    monthSelect.appendChild(allOpt);

    const set = {};
    for (let i = 0; i < items.length; i++) {
      const iso = toISODate(items[i].date);
      if (!iso) continue;
      const ym = iso.substring(0, 7);
      set[ym] = true;
    }

    const months = Object.keys(set);
    months.sort(); // ascending yyyy-mm

    for (let j = 0; j < months.length; j++) {
      const o = document.createElement("option");
      o.value = months[j];
      o.textContent = months[j];
      monthSelect.appendChild(o);
    }
  }

  /* ========= RENDER ========= */
  function renderList(items) {
    txList.innerHTML = "";

    if (!items || items.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }
    emptyState.classList.add("hidden");

    for (let i = 0; i < items.length; i++) {
      const tx = items[i];
      txList.appendChild(createTxItem(tx));
    }
  }

  function createTxItem(tx) {

    const li = document.createElement("li");
    if(tx.type === "income"){
      li.className = "tx-item tx--income";
    } else{
      li.className ="tx-item tx--expense";
    }
   
    // icon
    const icon = document.createElement("div");
    icon.className = "tx-icon";
    icon.setAttribute("aria-hidden", "true");
    if(tx.type === "income"){
      icon.textContent = "↗";
    } else{
      icon.textContent ="↘";
    }
    let isIncome = false;
    if (tx.type === "income") {
      isIncome = true;
    }

    // text
    const text = document.createElement("div");
    
    const title = document.createElement("div");
    title.className = "tx-title";
    title.textContent = tx.note ? tx.note : tx.category;

    const sub = document.createElement("div");
    sub.className = "tx-sub";
    sub.textContent = (tx.date || "") + " • " + (tx.category || "");

    text.appendChild(title);
    text.appendChild(sub);

    // amount
    const amount = document.createElement("div");
    amount.className = "tx-amount";
    let amountValue = 0;
    if (tx.amount) {
      amountValue = Number(tx.amount);}
     if (tx.type === "income") {
      amount.textContent = "+ $" + amountValue.toLocaleString();
    } else {
      amount.textContent = "- $" + amountValue.toLocaleString();
    }

    // delete (optional UI only)
    const delBtn = document.createElement("button");
    delBtn.className = "tx-delete";
    delBtn.type = "button";
    delBtn.setAttribute("aria-label", "Delete transaction");
    delBtn.textContent = "🗑️";

    delBtn.addEventListener("click", function () {
      li.remove();
      // Note: this removes only from UI, not from JSON
      if (txList.children.length === 0) emptyState.classList.remove("hidden");
      resultsCount.textContent = txList.children.length;
    });

    li.appendChild(icon);
    li.appendChild(text);
    li.appendChild(amount);
    li.appendChild(delBtn);
    return li;
  }

  function updateSummary(items) {
    resultsCount.textContent = items.length;
  }

  /* ========= CSV EXPORT ========= */
  function exportFilteredToCSV(items) {
    if (!items || items.length === 0) {
      alert("Nothing to export.");
      return;
    }

    // Header
    let csv = "id,date,type,category,amount,note\n";

    for (let i = 0; i < items.length; i++) {
      const t = items[i];
      const note = t.note ? String(t.note) : "";
      csv +=
        safeCSV(t.id) + "," +
        safeCSV(t.date) + "," +
        safeCSV(t.type) + "," +
        safeCSV(t.category) + "," +
        safeCSV(t.amount) + "," +
        safeCSV(note) + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "MoneyBuddy_Export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }
function safeCSV(val) {
  if (val === null || val === undefined) {
    return '""';
  }

  var text = String(val);

  // If there are no double quotes, just wrap with quotes
  if (text.indexOf('"') === -1) {
    return '"' + text + '"';
  }

  // Replace " with "" using split/join (no regex)
  var newText = text.split('"').join('""');

  return '"' + newText + '"';
}

  function parseDMY(dateStr) {
  // supports both: DD-MM-YYYY and YYYY-MM-DD
  if (!dateStr) return new Date(0);

  const parts = dateStr.split("-");
  if (parts.length !== 3) return new Date(0);

  // YYYY-MM-DD
  if (parts[0].length === 4) {
    return new Date(dateStr);
  }

  // DD-MM-YYYY
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

  function toISODate(dateStr) {
  // supports both: DD-MM-YYYY and YYYY-MM-DD
  if (!dateStr) return "";

  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";

  // already YYYY-MM-DD
  if (parts[0].length === 4) return dateStr;

  // DD-MM-YYYY -> YYYY-MM-DD
  const dd = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const yy = parts[2];

  return yy + "-" + mm + "-" + dd;
  }
})
  