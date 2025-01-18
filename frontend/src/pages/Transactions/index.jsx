import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Loader } from "../../components/Loader";
import { Header } from "../../components/Header";
import { Balance } from "../../components/Balance";
import { TransactionContainer } from "../../components/TransactionContainer";
import { ModalTransaction } from "../../components/ModalTransaction";
import { useParams } from "react-router-dom";
import "../../styles/TransactionsPage.css";

// Page Transactions
function Transactions() {
    let {modalParam} = useParams()
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (modalParam) {
            setShowModal(true);
        }

    }, [modalParam])

    return (
        <div className="app-container">
            <Header />
            <div className="transactions-container">
                <h1>Transactions</h1>
                <Balance />
                <TransactionContainer page="transactions" setShowModal={setShowModal}  />
            </div>
            <ModalTransaction showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
}

export default Transactions;