# 💸 Tracker.io - Expense Tracker Web Application 💰

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=image/svg+xml;base64,...&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

**Tracker.io** is a modern, responsive, and feature-rich front-end web application. It allows users to manage and monitor their personal finances, track incomes and expenses in real-time, and securely store data using browser local storage. 📊

> 📜 **Certification Context:** This project was developed as the final submission for the **Front-End Web for Beginners** class in the **Dicoding** program.  
> [![Dicoding Certificate - Page 1](certificate/certificate-page1.png)](Front-End-Web-for-Beginners.pdf)

---

## 📺 Demo Video
[![Watch the video](https://img.youtube.com/vi/W-BuxlQszYU/hqdefault.jpg)](https://youtu.be/W-BuxlQszYU)

---

## ✨ Features & Capabilities 🚀

* **💼 Financial Summary Dashboard**: Automatically calculates and displays real-time Current Balance, Total Income, and Total Expenses based on recorded transactions.
* **📝 Transaction Management (CRUD)**: Add, edit, delete, and switch transaction categories (Income ⟷ Expense) effortlessly.
* **🔍 Dynamic Search & Filtering**: Instantly search transactions by title (*live search*) with automated list filtering.
* **💾 Local Persistence**: Client-side data storage leveraging browser `localStorage` ensuring your records remain saved across sessions.
* **⚙️ Custom Event Architecture**: Implements custom JavaScript events (`transaction:updated`) for clean state synchronization and reactive UI rendering.
* **📱 Fully Responsive Design**: Fluid layouts optimized for Desktop, Tablet, and Mobile devices using CSS Flexbox, Grid, and media queries.
* **♿ Accessibility Focused**: Includes proper semantic markup and screen-reader-only utility classes (`.visually-hidden`) for enhanced web accessibility.

---

## 🛠️ Technology Stack 💻

* **Markup**: HTML5 (Semantic elements & testing attributes `data-testid`)
* **Styling**: CSS3 (BEM Methodology, CSS Custom Properties / Variables, Responsive Design)
* **Scripting**: Vanilla JavaScript (ES6+, DOM Manipulation, LocalStorage API, Event-Driven Architecture)
* **Fonts**: Google Fonts (`Outfit`)

---

## 📂 Project Structure 🗂️

```text
├── index.html       # Main application markup & structure
├── style.css        # Styling sheet adhering to BEM naming conventions
└── main.js          # Core application logic, event handlers & state management

```

---

## 🚀 Getting Started  

To run or evaluate this project locally on your machine, follow these simple steps:

1. **Navigate** into the project directory:
    ```bash
    cd expense-tracker-app

    ```


2. **Open** `index.html` directly in your preferred web browser, or use a local development server extension (like **Live Server** in VS Code / Antigravity).

---

## 💡 Usage Guide 🪙

1. **Adding a Transaction**: Fill in the title/description, amount in Rupiah (IDR), select the transaction date, choose the classification (*Uang Masuk* or *Uang Keluar*), and click **Simpan** 📥/📤.
2. **Managing Transactions**:
    * Click **Ubah Tipe** to quickly toggle a transaction between income and expense.
    * Click **Edit** to load transaction details back into the form for modifications ✍️.
    * Click **Hapus** to remove a transaction record permanently 🗑️.


3. **Searching**: Type keywords into the search input to instantly filter transaction histories 🔎.

---


