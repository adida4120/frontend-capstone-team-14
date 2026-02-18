💰 MoneyBuddy - Personal Finance Planner
MoneyBuddy is a responsive, accessible, and user-friendly web application designed to help users track expenses, visualize spending habits, and manage their budget -    	    all stored locally on the device for maximum privacy.
________________________________________
📖System Description
MoneyBuddy solves the problem of complex finance tracking by offering a simple, client-side solution. It allows users to log daily transactions, view a history of their financial activities, and analyze their spending through visual charts. The system persists data using the browser's Local Storage, ensuring data remains available even after refreshing the page.
________________________________________
✨ Key Features
📊 Interactive Dashboard: Visual analytics using  Chart.js  to track spending trends and category mixes.
💸 Transaction Management: Add, remove, and categorize income and expense     transactions.
🔒Local Privacy: All data is stored in the browser's Local Storage(no server required).
📱Fully Responsive: Optimized for desktop, tablet, and mobile devices.
♿ Accessible Design: Built with semantic HTML and ARIA standards.
⚡Real-time Updates: Balance and charts update immediately upon adding a  transaction.
________________________________________
🛠Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)
Libraries: [Chart.js](https://www.chartjs.org/) (Data Visualization), [SweetAlert2](https://sweetalert2.github.io/) (Popups)
Storage: Local Storage API
Design: CSS Grid & Flexbox, Inter Font
________________________________________
⚙️ Getting Started
To get a local copy of MoneyBuddy up and running on your machine, please follow these simple steps.
Prerequisites
Before you begin, ensure you have the following:
•	A modern web browser (Google Chrome, Edge, Firefox, or Safari).
•	A code editor, such as VS Code (recommended for the best experience).
________________________________________
📥 Installation
You can download the project using one of the following methods:
Option 1: Clone via Git (Recommended for Developers)
1.	Open your terminal or command prompt.
2.	Run the following command to clone the repository:
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
3.	Navigate to the project directory:
cd YOUR-REPO-NAME
Option 2: Download ZIP
1.	Go to the GitHub repository page.
2.	Click the green Code button.
3.	Select Download ZIP.
4.	Extract the ZIP file to a folder on your computer.
________________________________________
🏃‍♂️ Running the Application
To ensure all features work correctly—specifically the loading of initial data from data.json—it is highly recommended to run the project using a local server rather than opening the file directly.
Recommended Method (VS Code Live Server):
1.	Open the project folder in Visual Studio Code.
2.	Install the Live Server extension (if not already installed).
3.	Right-click on the index.html file in the file explorer.
4.	Select "Open with Live Server".
5.	The application will automatically launch in your default browser at http://127.0.0.1:5500.
Alternative Method:
•	You can double-click index.html to open it in your browser.
•	Note: Some browsers may block the loading of local JSON data due to CORS security policies. If the data does not load, please use the Live Server method above.
________________________________________
📂 Project Structure
```text
/
├── index.html              # Landing Page
├── dashboard-planner.html  # Analytics Dashboard
├── transaction.html        # Add New Transactions
├── expense-history.html    # Full History List
├── contact.html            # Contact Form
├── css/
│   ├── stylesheet.css      # Global styles & Variables
│   ├── transaction.css     # Transaction page styles
│   └── dashboard.css       # Dashboard specific styles
├── js/
│   ├── common.js           # Shared logic
│   ├── transaction.js      # Transaction logic (Add/Delete)
│   └── dashboard.js        # Chart.js configuration
└── data/
    └── data.json           # Initial dummy data
