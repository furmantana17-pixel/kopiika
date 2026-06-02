let balance = loadBalance();

if(localStorage.getItem("theme") === "true"){
    document.body.classList.add("dark");
}

let operationType = "";
let transactions = loadTransactions();

document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

updateBalance();
updateStats();
renderTransactions();

function updateBalance(){
    document.getElementById("balance").textContent =
        balance + " грн";
}

function updateStats(){

    let income = 0;
    let expense = 0;

    transactions.forEach(item => {

        if(item.type === "income"){
            income += item.amount;
        }else{
            expense += item.amount;
        }

    });

    document.getElementById("incomeTotal").textContent =
        income + " грн";

    document.getElementById("expenseTotal").textContent =
        expense + " грн";
}

function renderTransactions(){

    const list =
        document.getElementById("transactions");

    list.innerHTML = "";

    transactions.slice().reverse().forEach((item,index) => {

        const realIndex =
            transactions.length - 1 - index;

        const div =
            document.createElement("div");

        div.className =
            "transaction " + item.type;

        div.innerHTML = `
            <div>
                <strong>${item.title}</strong><br>
                <small>${item.date || ""}</small>
            </div>

            <span>${item.amount} грн</span>

            <button onclick="editTransaction(${realIndex})">
                ✏️
            </button>

            <button onclick="deleteTransaction(${realIndex})">
                🗑️
            </button>
        `;

        list.appendChild(div);

    });

}

document.getElementById("incomeBtn")
.addEventListener("click", () => {

    operationType = "income";

    document.getElementById("modalTitle")
    .textContent = "Додати дохід";

    document.getElementById("modal")
    .style.display = "flex";

});

document.getElementById("expenseBtn")
.addEventListener("click", () => {

    operationType = "expense";

    document.getElementById("modalTitle")
    .textContent = "Додати витрату";

    document.getElementById("modal")
    .style.display = "flex";

});

document.getElementById("closeModal")
.addEventListener("click", () => {

    document.getElementById("modal")
    .style.display = "none";

});

document.getElementById("saveOperation")
.addEventListener("click", () => {

    const title =
        document.getElementById("category").value;

    const amount =
        Number(document.getElementById("amount").value);

    const date =
        document.getElementById("date").value;

    if(amount <= 0) return;

    if(operationType === "income"){
        balance += amount;
    }else{
        balance -= amount;
    }

    transactions.push({
        type: operationType,
        title: title,
        amount: amount,
        date: date
    });

    saveBalance(balance);
    saveTransactions(transactions);

    updateBalance();
    updateStats();
    renderTransactions();

    document.getElementById("modal")
    .style.display = "none";

    document.getElementById("amount").value = "";

    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

});

function editTransaction(index){

    const item = transactions[index];

    const newTitle =
        prompt("Категорія", item.title);

    if(newTitle === null) return;

    const newAmount =
        Number(prompt("Сума", item.amount));

    if(isNaN(newAmount) || newAmount <= 0) return;

    if(item.type === "income"){
        balance -= item.amount;
        balance += newAmount;
    }else{
        balance += item.amount;
        balance -= newAmount;
    }

    item.title = newTitle;
    item.amount = newAmount;

    saveBalance(balance);
    saveTransactions(transactions);

    updateBalance();
    updateStats();
    renderTransactions();
}

function deleteTransaction(index){

    const item = transactions[index];

    if(item.type === "income"){
        balance -= item.amount;
    }else{
        balance += item.amount;
    }

    transactions.splice(index,1);

    saveBalance(balance);
    saveTransactions(transactions);

    updateBalance();
    updateStats();
    renderTransactions();
}

const themeBtn =
    document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );

});

document.getElementById("showReport")
.addEventListener("click", () => {

    const month =
        document.getElementById("reportMonth").value;

    if(!month) return;

    let income = 0;
    let expense = 0;

    const categories = {};

    transactions.forEach(item => {

        if(!item.date) return;

        if(item.date.startsWith(month)){

            if(item.type === "income"){
                income += item.amount;
            }else{

                expense += item.amount;

                categories[item.title] =
                    (categories[item.title] || 0)
                    + item.amount;
            }
        }

    });

    document.getElementById("reportResult")
    .innerHTML = `
        <p>🟢 Доходи: ${income} грн</p>
        <p>🔴 Витрати: ${expense} грн</p>
        <p>💰 Результат: ${income - expense} грн</p>
    `;

    let categoryHtml =
        "<h3>📊 Витрати по категоріях</h3>";

    if(Object.keys(categories).length === 0){

        categoryHtml +=
            "<p>Немає витрат за цей місяць</p>";

    }else{

        for(const category in categories){

            categoryHtml += `
                <p>
                    ${category} —
                    ${categories[category]} грн
                </p>
            `;
        }
    }

    document.getElementById("categoryReport")
    .innerHTML = categoryHtml;

});