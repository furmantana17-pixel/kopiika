let balance = loadBalance();
if(localStorage.getItem("theme") === "true"){
    document.body.classList.add("dark");
}

updateBalance();

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
            <span>${item.title} - ${item.amount} грн</span>

            <button onclick="deleteTransaction(${realIndex})">
                🗑️
            </button>
        `;

        list.appendChild(div);

    });
}
function deleteTransaction(index){

    const item = transactions[index];

    if(item.type === "income"){
        balance -= item.amount;
    } else {
        balance += item.amount;
    }

    transactions.splice(index,1);

    saveBalance(balance);
    saveTransactions(transactions);

    updateBalance();
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
    renderTransactions();
}
function editTransaction(index){

    const item = transactions[index];

    const newTitle =
        prompt(
            "Категорія",
            item.title
        );

    if(!newTitle) return;

    const newAmount =
        Number(
            prompt(
                "Сума",
                item.amount
            )
        );

    if(newAmount <= 0) return;

    if(item.type === "income"){
        balance -= item.amount;
        balance += newAmount;
    }else{
        balance += item.amount;
        balance -= newAmount;
    }

    transactions[index].title =
        newTitle;

    transactions[index].amount =
        newAmount;

    saveBalance(balance);
    saveTransactions(transactions);

    updateBalance();
    renderTransactions();
}