const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const categoryFilter = document.getElementById("categoryFilter");
const transactionList = document.getElementById("transactionList");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const balance = document.getElementById("balance");

const budgetForm = document.getElementById("budgetForm");
const monthlyBudgetInput = document.getElementById("monthlyBudget");
const budgetMonth = document.getElementById("budgetMonth");
const budgetAmount = document.getElementById("budgetAmount");
const budgetSpent = document.getElementById("budgetSpent");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgress = document.getElementById("budgetProgress");
const budgetMessage = document.getElementById("budgetMessage");

const savedTransactions = localStorage.getItem("budgetTransactions");
const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];

const savedBudget = localStorage.getItem("monthlyBudget");
let monthlyBudget = savedBudget ? Number(savedBudget) : 0;

function getCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return year + "-" + month;
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (description === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Täytä tiedot oikein.");
        return;
    }

    const transaction = {
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: getCurrentDate()
    };

    transactions.push(transaction);

    saveTransactions();
    showTransactions();
    updateSummary();
    updateBudget();

    form.reset();
});

budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const amount = Number(monthlyBudgetInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Anna kelvollinen budjetti.");
        return;
    }

    monthlyBudget = amount;

    localStorage.setItem("monthlyBudget", monthlyBudget);

    updateBudget();
    budgetForm.reset();
});

categoryFilter.addEventListener("change", function() {
    showTransactions();
});

function saveTransactions() {
    localStorage.setItem("budgetTransactions", JSON.stringify(transactions));
}

function showTransactions() {
    transactionList.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const filteredTransactions = transactions.filter(function(transaction) {
        return selectedCategory === "all" ||
            transaction.category === selectedCategory;
    });

    filteredTransactions.forEach(function(transaction) {
        const index = transactions.indexOf(transaction);

        const listItem = document.createElement("li");
        const text = document.createElement("span");
        const deleteButton = document.createElement("button");

        const typeText = transaction.type === "income" ? "Tulo" : "Meno";
        const amountText = formatMoney(transaction.amount);
        const dateText = transaction.date || "Ei päivämäärää";

        text.textContent = dateText + " – " +
            transaction.description + " – " +
            transaction.category + " – " +
            typeText + ": " + amountText;

        deleteButton.textContent = "Poista";
        deleteButton.type = "button";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            transactions.splice(index, 1);

            saveTransactions();
            showTransactions();
            updateSummary();
            updateBudget();
        });

        listItem.appendChild(text);
        listItem.appendChild(deleteButton);

        transactionList.appendChild(listItem);
    });
}

function updateSummary() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(function(transaction) {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expenses += transaction.amount;
        }
    });

    const currentBalance = income - expenses;

    totalIncome.textContent = formatMoney(income);
    totalExpenses.textContent = formatMoney(expenses);
    balance.textContent = formatMoney(currentBalance);
}

function updateBudget() {
    const currentMonth = getCurrentMonth();

    let spent = 0;

    transactions.forEach(function(transaction) {
        if (
            transaction.type === "expense" &&
            transaction.date &&
            transaction.date.startsWith(currentMonth)
        ) {
            spent += transaction.amount;
        }
    });

    const remaining = monthlyBudget - spent;
    const percentage = monthlyBudget > 0
        ? (spent / monthlyBudget) * 100
        : 0;

    budgetMonth.textContent = "Kuukausi: " + currentMonth;
    budgetAmount.textContent = formatMoney(monthlyBudget);
    budgetSpent.textContent = formatMoney(spent);
    budgetRemaining.textContent = formatMoney(remaining);

    budgetProgress.style.width = Math.min(percentage, 100) + "%";

    if (monthlyBudget === 0) {
        budgetProgress.style.backgroundColor = "#22c55e";
        budgetMessage.textContent = "Aseta kuukausibudjetti aloittaaksesi.";
    } else if (remaining < 0) {
        budgetProgress.style.backgroundColor = "#ef4444";
        budgetMessage.textContent = "Kuukausibudjetti on ylitetty!";
    } else {
        budgetProgress.style.backgroundColor = "#22c55e";
        budgetMessage.textContent = "Budjettia on vielä jäljellä.";
    }
}

function formatMoney(amount) {
    return amount.toFixed(2).replace(".", ",") + " €";
}

showTransactions();
updateSummary();
updateBudget();
