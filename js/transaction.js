document.addEventListener('DOMContentLoaded', () => {
    let savedData = JSON.parse(localStorage.getItem('moneyBuddyData'));

    if (!savedData || savedData.length === 0) {
        console.log("No local data found. Importing from DATA.js...");
        localStorage.setItem('moneyBuddyData', JSON.stringify(initialData));
        savedData = initialData;
    }
    // --- 1. תאריך נוכחי מעודכן ---
    const dateInput = document.getElementById('activity-date');
    if (dateInput) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        dateInput.value = `${year}-${month}-${day}`;
    }

    // --- 2. סינון קטגוריאלי ---
    const typeSelect = document.getElementById('type-select');
    const activityTypeSelect = document.getElementById('activity-type');
    const incomeGroup = document.getElementById('group-income');
    const expenseGroup = document.getElementById('group-expense');
    const transactionForm = document.querySelector('form');

    if (typeSelect && incomeGroup && expenseGroup) {
        typeSelect.addEventListener('change', () => {
            const val = typeSelect.value;
            if (val === 'income') {
                incomeGroup.style.display = '';
                expenseGroup.style.display = 'none';
            } else if (val === 'expense') {
                incomeGroup.style.display = 'none';
                expenseGroup.style.display = '';
            }
            activityTypeSelect.value = ""; 
        });
    }

    // --- 3. שמירת נתונים ומניעת ריענון ---
    if (transactionForm) {
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // איסוף הנתונים
            const newAction = {
                description: document.querySelector('input[name="description"]').value,
                amount: document.querySelector('input[name="amount"]').value,
                type: typeSelect.value,
                category: activityTypeSelect.value,
                date: dateInput.value,
                id: Date.now()
            };

            // שמירה ל-localStorage
            const existingData = JSON.parse(localStorage.getItem('moneyBuddyData')) || [];
            existingData.push(newAction);
            localStorage.setItem('moneyBuddyData', JSON.stringify(existingData));

            // עדכון התצוגה וניקוי הטופס
            renderRecentActivity();
            transactionForm.reset();
            dateInput.value = new Date().toISOString().split('T')[0]; // החזרת תאריך להיום
            
            alert("Action saved to MoneyBuddy!");
        });
    }

    // --- 4. פונקציית רינדור הרשימה ---
    function renderRecentActivity() {
        const activityContainer = document.getElementById('activity-list');
        if (!activityContainer) return;

        // שליפת הנתונים (תיקון: localStorage במקום data)
        const data = JSON.parse(localStorage.getItem('moneyBuddyData')) || [];

        activityContainer.innerHTML = '';

        // 10 פעולות אחרונות
        const recentData = data.slice(-10).reverse();

        recentData.forEach(item => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item-card';
            
            const typeClass = item.type === 'income' ? 'text-success' : 'text-danger';
            const symbol = item.type === 'income' ? '+' : '-';

            activityItem.innerHTML = `
                <div class="activity-info">
                    <strong>${item.description}</strong>
                    <small>${item.category} | ${item.date}</small>
                </div>
                <div class="activity-amount ${typeClass}">
                    ${symbol}$${item.amount}
                </div>
            `;
            activityContainer.appendChild(activityItem);
        });
    }

    // **הפעלה ראשונית של הרשימה בטעינת הדף**
    renderRecentActivity();
});