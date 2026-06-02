function saveBalance(balance){
    localStorage.setItem("balance", balance);
}

function loadBalance(){
    return Number(localStorage.getItem("balance")) || 0;
}

function saveTransactions(transactions){
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function loadTransactions(){
    return JSON.parse(
        localStorage.getItem("transactions")
    ) || [];
}