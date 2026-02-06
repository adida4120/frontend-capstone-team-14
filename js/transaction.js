document.addEventListener('DOMContentLoaded', () => {
    
    // --- תאריך נוכחי-מעודכן---
    const dateInput = document.getElementById('activity-date');
    if (dateInput) {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        dateInput.value = `${year}-${month}-${day}`;
        
        console.log("Date initialized to:", `${day}/${month}/${year}`);
    }

    // --- סינון קטגוריאלי---
    const typeSelect = document.getElementById('type-select');
    const activityTypeSelect = document.getElementById('activity-type');
    const incomeGroup = document.getElementById('group-income');
    const expenseGroup = document.getElementById('group-expense');
    const transactionForm = document.querySelector('form');

    // 1. הגדרת תאריך אוטומטי (מה שעבד לנו קודם)
    const dateInput = document.getElementById('activity-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // 2. לוגיקת הסינון - שיטה בטוחה יותר (display)
    if (typeSelect && incomeGroup && expenseGroup) {
        typeSelect.addEventListener('change', () => {
            const val = typeSelect.value;
            console.log("Selected Type:", val);

            if (val === 'income') {
                incomeGroup.style.display = '';
                expenseGroup.style.display = 'none';
            } else if (val === 'expense') {
                incomeGroup.style.display = 'none';
                expenseGroup.style.display = '';
            }
            
            activityTypeSelect.value = ""; // מאפס את הבחירה בתיבה השנייה
        });
    }

    // 3. מניעת ריענון הדף בלחיצה על הכפתור (חשוב מאוד!)
    if (transactionForm) {
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Form submitted! (Refreshing prevented)");
            alert("Action captured! We are ready to save.");
        });
    }
});