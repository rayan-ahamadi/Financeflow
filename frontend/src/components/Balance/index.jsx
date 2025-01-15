import { UserContext } from "../../context/UserContext";
import { TransactionContext } from "../../context/TransactionContext";
import { useContext } from "react";
import { Loader } from "../Loader";
import "../../styles/Balance.css";

function Balance() {
    const { userData } = useContext(UserContext);
    const { transactions,transactionLoading } = useContext(TransactionContext);

    const totalIncome = transactions
        .filter((transaction) => transaction.type_transaction === "revenu")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0)
        .toFixed(2);
    const totalExpense = transactions
        .filter((transaction) => transaction.type_transaction === "dépense")
        .reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0)
        .toFixed(2);


    return (
        <div className="balance-container">
            <div className="total-balance">
                <p>Solde total</p>
                <p className="amount-text">{userData?.balance}€</p>
            </div>
            <div className="total-income">
                <p>Revenus</p> 
                {transactionLoading ? <Loader /> : <p className="amount-text">{totalIncome}€</p>}
            </div>
            <div className="total-expense">
                <p>Dépenses</p>
                {transactionLoading ? <Loader/> : <p className="amount-text">{totalExpense}€</p>}
            </div>
        </div>
    );
}

export { Balance };