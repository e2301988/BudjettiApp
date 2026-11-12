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

const savedTransactions = localStorage.getItem("budgetTransactions");
const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];

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
        category: category
    };

    transactions.push(transaction);

    saveTransactions();
    showTransactions();
    updateSummary();

    form.reset();
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

        text.textContent = transaction.description + " – " +
            transaction.category + " – " + typeText + ": " + amountText;

        deleteButton.textContent = "Poista";
        deleteButton.type = "button";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            transactions.splice(index, 1);

            saveTransactions();
            showTransactions();
            updateSummary();
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

function formatMoney(amount) {
    return amount.toFixed(2).replace(".", ",") + " €";
}

showTransactions();
updateSummary();
