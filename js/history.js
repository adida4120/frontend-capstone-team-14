document.addEventListener('DOMContentLoaded', function(){
   console.log('history.js loaded');

   const listEl =document.querySelector("#txList");
   const emptyState = document.querySelector("#emptyState");
   

   console.log('listEl:', listEl);
  console.log('emptyState:', emptyState);

   let transactions =[];

   fetch ("../data/data.json")
     .then(function (response){
      return response.json();
     })
     .then(function(data){
      transactions = data;
      renderList(transactions);
     })

     .catch(function(error){
      console.error("Error loading data", error)
     });

   function rederList(items){
      listEl.innerHTML=" ";

      if (!items|| items.length == 0 ){
         emptyState.classList.remove("hidden");
         return;
      }

      emptyState.classList.add("hidden");

      items.forEach(function (tx){
         const li = document.createElement("li");
         li.className = "tx-item";
         li.innerHTML = `
            <div class="tx-main">
               <div class="tx-info">
                  <p class="tx-title">${tx.category}</p>
                  <p class="tx-date">${tx.date}</p>
                  <p class="tx-note">${tx.note}</p>
               </div>

            <div class="tx-amount ${tx.type === 'income' ? 'income' : 'expense'}">
               ${tx.type === 'income' ? '+' : '-'}₪${tx.amount}
            </div>
         </div>
         `;
         listEl.appendChild(li);
      
      });
   }
});
























// /* ==========
//    CONFIG
// ========== */
// const STORAGE_KEY = "transactions";

// /* ==========
//    SEED
// ========== */
// const seedTransactions = [
//     {id: "txt1", date: "05-01-2026", type: "expense", category: "Food", amount: 45, note:"Pizza"},
//     {id: "txt2", date: "10-01-2026", type: "icome", category: "Salary", amount: 10000, note:"December salery"},
//     { id: "tx3", date: "2026-01-12", type: "expense", category: "Transport", amount: 18, note: "Bus" },
//     { id: "tx4", date: "2026-01-19", type: "expense", category: "Shopping", amount: 210, note: "Skincare" }
// ];
// /* ==========
//    DOM
// ========== */
// const exportBtn = document.getElementById("exportBtn");
// const clearBtn = document.getElementById("clearBtn");
// const searchInput = document.getElementById("searchInput");
// const filterMode = document.getElementById("filterMode");

// const rangeWrap = document.getElementById("rangeWrap");
// const fromDate = document.getElementById("fromDate");
// const toDate = document.getElementById("toDate");


// const yearSpan = document.getElementById("yaer");

// /* ==========
//    STATE
// ========== */
// let allTx = [];
// let filteredTx = [];

// /* ==========
//    INIT
// ========== */

// init();

// function init(){
//     setYear();
//     ensureSeed();
//     allTx = loadTransactions();
//     bindEvents();
//     toggleRangeUI();
//     applyFiltersAndRender();


// }

// /* ==========
//    COMMON - take to COMMON.JS
// ========== */
// function setYear(){
//     if (!localStorage.getItem(STORAGE_KEY)){
//         localStorage.setItem(STORAGE_KEY,JASON.stringify(seedTransactions));
//     }
// }

// function ensureSeed() {}

// /* ==========
//    STORAGE
// ========== */


// /* ==========
//    EVENTS
// ========== */




// /* ==========
//    EXPORT CSV
// ========== */



// /* =================
//    NEW TRANSACTION
// ====================*/

