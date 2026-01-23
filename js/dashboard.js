"use strict";

let currentMonth = 0; 
let currentYear = 2026;
let allTransactions = [];
let myChart = null;

async function loadData() {
    try {
        let response = await fetch('../data/data.json'); 
        if (!response.ok) throw new Error("Failed to load data"); 
        
        allTransactions = await response.json(); 
        console.log("נתונים נטענו בהצלחה:", allTransactions);
        renderTrendChart(allTransactions);
        updateDashboard(); 
    } catch (error) {
        console.error("שגיאה:", error); 
    }
}

function updateDashboard() {
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    let dateLabel = document.getElementById("currentDateDisplay");
    if (dateLabel) dateLabel.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    
    let stats = calculateMonthlyStats(allTransactions, currentYear, currentMonth);
    
    
    document.querySelector("#balance h3").innerText = `$${(stats.totalIncome - stats.totalExpenses).toLocaleString()}`;
    document.querySelector("#income h3").innerText = `$${stats.totalIncome.toLocaleString()}`;
    document.querySelector("#expenses h3").innerText = `$${stats.totalExpenses.toLocaleString()}`;

    
    renderChart(stats.categories);
    renderBarChart(stats.categories);
}

function calculateMonthlyStats(transactions, year, month) {
    let filtered = transactions.filter(tx => {
        let dateParts = tx.date.split("-");
        let d;
       
        if (dateParts[0].length === 4) {
            d = new Date(tx.date); 
        } else {
            d = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        }
        return d.getFullYear() === year && d.getMonth() === month;
    });

    let stats = { totalIncome: 0, totalExpenses: 0, categories: {} };

    filtered.forEach(tx => {
        if (tx.type === 'income') {
            stats.totalIncome += tx.amount;
        } else {
            stats.totalExpenses += tx.amount;
            stats.categories[tx.category] = (stats.categories[tx.category] || 0) + tx.amount;
        }
    });
    return stats;
}
document.addEventListener('DOMContentLoaded', loadData);
document.getElementById("prevMonth").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateDashboard(); 
});


document.getElementById("nextMonth").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateDashboard(); 
});


//CHARTS//

//PIE CHART//
function renderChart(categoryData) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#2d46b9', 
                    '#4e83f1', 
                    '#54b48b', 
                    '#e9a143', 
                    '#e44e61'  
                ],
                borderWidth: 2, 
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true, 
                        padding: 25, 
                        font: {
                            family: 'Inter', 
                            size: 13,
                            weight: '500'
                        },
                        color: '#4b5563' 
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#111827',
                    bodyColor: '#111827',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: (context) => ` $${context.raw.toLocaleString()}`
                    }
                }
            },
            cutout: '70%', 
            layout: {
                padding: 10
            }
        }
    });
}
let topCategoriesChart = null; 


//TOP CATEGORIES CHART//
function renderBarChart(categoryData) {
    const canvas = document.getElementById('topCategoriesChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (topCategoriesChart) topCategoriesChart.destroy();

   
    const sortedLabels = Object.keys(categoryData).sort((a, b) => categoryData[b] - categoryData[a]);
    const sortedValues = sortedLabels.map(label => categoryData[label]);

    topCategoriesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedLabels,
            datasets: [{
                data: sortedValues,
                backgroundColor: '#4e83f1', 
                borderRadius: 10,
                barThickness: 15, 
            }]
        },
        options: {
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }, 
                tooltip: {
                    callbacks: {
                        label: (context) => ` $${context.raw.toLocaleString()}`
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    beginAtZero: true
                },
                y: {
                    grid: { display: false }, 
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 14,
                            weight: '600'
                        },
                        color: '#374151'
                    }
                }
            }
        }
    });
}
let trendChart = null;


//6 MONTH TREND CHART//
function renderTrendChart(transactions) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) trendChart.destroy();

    
    const monthNames = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = [0, 0, 0, 0, 0, 0]; 

    
    transactions.forEach(tx => {
        if (tx.type === 'expense') {
            const dateParts = tx.date.split("-");
            const d = (dateParts[0].length === 4) ? 
                      new Date(tx.date) : 
                      new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            
            const monthIndex = d.getMonth(); 
            
            
            if (monthIndex >= 6 && monthIndex <= 11) {
                monthlyTotals[monthIndex - 6] += tx.amount;
            }
        }
    });

    
    trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyTotals,
                backgroundColor: '#e44e61', 
                borderRadius: 8,
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => '$' + value.toLocaleString(),
                        font: { family: 'Inter' }
                    },
                    grid: { color: '#f3f4f6' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', weight: '500' } }
                }
            }
        }
    });
}

