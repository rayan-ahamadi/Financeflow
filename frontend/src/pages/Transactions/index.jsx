import { useContext,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../../components/Loader";
import { Header } from "../../components/Header";
import { Balance } from "../../components/Balance";
import { TransactionContainer } from "../../components/TransactionContainer";
import { ModalTransaction } from "../../components/ModalTransaction";
import "../../styles/TransactionsPage.css";

// Page Transactions
function Transactions() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Champs de la modal par défaut
    const [transaction, setTransaction] = useState({
        title: "",
        amount: 0,
        type_transaction: "revenu",
        date: "",
        place: "",
        currency_code : "EUR",
        currency_symbol : "€",
        list_category: [],
    });

    return (
        <div className="app-container">
            <Header />
            <div className="transactions-container">
                <h1>Transactions</h1>
                <Balance />
                <TransactionContainer page="transactions" setShowModal={setShowModal} setTransaction={setTransaction}  />
            </div>
            <ModalTransaction showModal={showModal} setShowModal={setShowModal} transaction={transaction} setTransaction={setTransaction} />
        </div>
    );
}

export default Transactions;