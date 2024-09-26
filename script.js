document.addEventListener("DOMContentLoaded", () => {
    const entryForm = document.getElementById("entryForm");
    const entryList = document.getElementById("entryList");
    const totalIncomeSpan = document.getElementById("totalIncome");
    const totalExpensesSpan = document.getElementById("totalExpenses");
    const netBalanceSpan = document.getElementById("netBalance");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    updateDisplay();

    entryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.querySelector('input[name="type"]:checked').value;
        const date = new Date().toLocaleString();

        const entry = { description, amount, type, date };
        entries.push(entry);
        localStorage.setItem("entries", JSON.stringify(entries));
        updateDisplay();
        entryForm.reset();
    });

    function updateDisplay() {
        entryList.innerHTML = "";
        let totalIncome = 0, totalExpenses = 0;

        entries.forEach((entry, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${entry.description} - ₹${entry.amount} (${entry.date}) 
                <button onclick="editEntry(${index})">Edit</button> 
                <button onclick="deleteEntry(${index})">Delete</button> 
                <button class="share-button" onclick="shareEntry('${entry.description}', ${entry.amount})">Share</button>`;
            entryList.appendChild(li);

            if (entry.type === "income") {
                totalIncome += entry.amount;
            } else {
                totalExpenses += entry.amount;
            }
        });

        totalIncomeSpan.textContent = totalIncome.toFixed(2);
        totalExpensesSpan.textContent = totalExpenses.toFixed(2);
        netBalanceSpan.textContent = (totalIncome - totalExpenses).toFixed(2);
    }

    window.deleteEntry = function(index) {
        entries.splice(index, 1);
        localStorage.setItem("entries", JSON.stringify(entries));
        updateDisplay();
    };

    window.editEntry = function(index) {
        const entry = entries[index];
        document.getElementById("description").value = entry.description;
        document.getElementById("amount").value = entry.amount;
        document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
        deleteEntry(index);
    };

    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener("change", () => {
            filterEntries(radio.value);
        });
    });

    function filterEntries(type) {
        entryList.innerHTML = "";
        entries.forEach((entry) => {
            if (type === "all" || entry.type === type) {
                const li = document.createElement("li");
                li.innerHTML = `${entry.description} - ₹${entry.amount} (${entry.date}) 
                    <button onclick="editEntry(${entries.indexOf(entry)})">Edit</button> 
                    <button onclick="deleteEntry(${entries.indexOf(entry)})">Delete</button> 
                    <button class="share-button" onclick="shareEntry('${entry.description}', ${entry.amount})">Share</button>`;
                entryList.appendChild(li);
            }
        });
    }
        
    window.shareEntry = function(description, amount) {
        const message = `Check out this expenses: ${description} - ₹${amount}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
});
