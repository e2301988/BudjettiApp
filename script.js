const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transactionList");

const transactions = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (description === "" || !Number.isFinite(amount) || amount <= 0) {
        alert("Täytä tiedot oikein.");
        return;
    }

    const transaction = {
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);

    showTransactions();

    form.reset();
});

function showTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(transaction) {
        const listItem = document.createElement("li");

        const typeText = transaction.type === "income" ? "Tulo" : "Meno";
        const amountText = transaction.amount.toFixed(2).replace(".", ",");

        listItem.textContent = transaction.description + " – " +
            typeText + ": " + amountText + " €";

        transactionList.appendChild(listItem);
    });
}