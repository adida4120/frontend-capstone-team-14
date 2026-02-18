document.addEventListener('DOMContentLoaded', () => 
    {
        const dateInput = document.getElementById('activity-date');
        const typeSelect = document.getElementById('type-select');
        const transactionTypeSelect = document.getElementById('transaction-type');
        const incomeGroup = document.getElementById('group-income');
        const expenseGroup = document.getElementById('group-expense');
        const transactionForm = document.querySelector('form');
        const activityContainer = document.getElementById('activity-list');
        const balanceValueEl = document.getElementById('balance-value');
        const incomeValueEl = document.getElementById('income-Value');
        const expenseValueEl = document.getElementById('expense-Value');

        function showToast()
        {
            const toast = document.getElementById('toast');
            if (!toast){
             return;}
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show');
            console.log("Class 'show' removed from toast");
            },1500); 
        }
        window.deleteTransaction = function(id) 
        {
            if (!confirm("האם אתה בטוח שברצונך למחוק פעולה זו?")) return;
            
            let transactions = JSON.parse(localStorage.getItem('moneyBuddyData')) || [];
            transactions = transactions.filter(item => item.id !== id);
            localStorage.setItem('moneyBuddyData', JSON.stringify(transactions));
            showRecentActivity(); 
        };

        function updateSummaryCards(transactions) 
        {
            if (!balanceValueEl || !incomeValueEl || !expenseValueEl) return;
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(item => 
            {
                const amount = parseFloat(item.amount) || 0;
                if (item.type === 'income') { totalIncome += amount; } 
                else if (item.type === 'expense') { totalExpense += amount; }
            });

            const totalBalance = totalIncome - totalExpense;
            incomeValueEl.textContent = `${totalIncome.toLocaleString()}  $`;
            expenseValueEl.textContent = `${totalExpense.toLocaleString()}  $`;

            if (totalBalance >= 0) {
                balanceValueEl.textContent = `${totalBalance.toLocaleString()}  $`;
                balanceValueEl.style.color = '#ffffff';
                balanceValueEl.style.fontWeight = '700';
            }
            else {
                balanceValueEl.textContent = ` ${(totalBalance).toLocaleString()} $`; 
                balanceValueEl.style.color = '#ff4d4d';
                balanceValueEl.style.fontWeight = '900';
            }
        }   

        function showRecentActivity()
        {
            if (!activityContainer) return;
            const transactions = JSON.parse(localStorage.getItem('moneyBuddyData')) || [];
            updateSummaryCards(transactions);
            activityContainer.innerHTML = ''; 

            if (transactions.length === 0)
            {
                activityContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💸</div>
                    <p>No activity yet. </p>
                    <p>Start by adding your first action above!</p>
                </div>`;
                return;
            }
            const recentItems = transactions.slice(-5).reverse();

            recentItems.forEach(item => 
            {
                const activityItem = document.createElement('div');
                activityItem.className = `activity-item-card ${item.type}`;
                const arrowIcon = item.type === 'income' ? '↗' : '↘';
                const typeClass = item.type === 'income' ? 'text-success' : 'text-danger';
                const displayNote = item.note || item.description || 'Action';
                const formattedAmount = Number(item.amount).toLocaleString();
                activityItem.innerHTML =`
                    <div class="activity-left-side">
                        <div class="icon-box ${item.type}">
                            <span class="symbol">${arrowIcon}</span>
                        </div>
                        <div class="activity-info">
                            <div class="action-name"><strong>${displayNote}</strong></div>
                            <div class="action-meta"><small>${item.date} • ${item.category}</small></div>
                        </div>
                    </div>
                    <div class="activity-right-side">
                        <span class="activity-amount ${typeClass}">${item.type === 'income' ? '' : '-'} ${formattedAmount}  $</span>
                        <button onclick="deleteTransaction('${item.id}')" class="btn-delete-icon">🗑️</button>
                    </div>
                    <div class="status-bar ${item.type}"></div>
                `;
                activityContainer.appendChild(activityItem);
            });
        }

        if (!localStorage.getItem('moneyBuddyData')) 
        {
            fetch('../data/data.json').then(res => res.json()).then(jsonData => 
                {
                    localStorage.setItem('moneyBuddyData', JSON.stringify(jsonData));
                    showRecentActivity();
                })
            .catch(err => console.error("Error loading JSON:", err));
        }
        else 
        {
            showRecentActivity();
        }

        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

        if (typeSelect && incomeGroup && expenseGroup) 
        {
            updateTypeVisibility();
            typeSelect.addEventListener('change', () => 
            {
                const val = typeSelect.value;
                incomeGroup.style.display = (val === 'income') ? '' : 'none';
                expenseGroup.style.display = (val === 'expense') ? '' : 'none';
                if (transactionTypeSelect) transactionTypeSelect.value = ""; 
            });
        }

        function updateTypeVisibility() {
            const val = typeSelect.value;
            if (incomeGroup) incomeGroup.style.display = (val === 'income') ? '' : 'none';
            if (expenseGroup) expenseGroup.style.display = (val === 'expense') ? '' : 'none';
        }

        if (typeSelect && incomeGroup && expenseGroup) {
            updateTypeVisibility(); 
            typeSelect.addEventListener('change', () => {
                updateTypeVisibility();
                if (transactionTypeSelect) transactionTypeSelect.value = ""; // Reset sub-category on change
            });
        }
        if (transactionForm) 
        {
            transactionForm.addEventListener('submit', (e) => 
            {
                e.preventDefault(); 
                const amountInput = document.querySelector('input[name="amount"]');
                const descInput = document.querySelector('input[name="description"]');
                const amountVal = parseFloat(amountInput.value) || 0;
                if (amountVal <= 0) 
                {
                    alert("Please enter an amount greater than 0");
                    return; 
                } 

                const newAction = 
                {
                    id: "tx" + Date.now(), 
                    date: dateInput.value,
                    type: typeSelect.value,
                    category: transactionTypeSelect ? transactionTypeSelect.value : 'General',
                    amount: amountVal,
                    note: document.querySelector('input[name="description"]').value
                };
                const data = JSON.parse(localStorage.getItem('moneyBuddyData')) || [];
                data.push(newAction);
                localStorage.setItem('moneyBuddyData', JSON.stringify(data));
                
                showRecentActivity(); 
                showToast();
                transactionForm.reset();
                if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
                updateTypeVisibility();
            });
        }
    });