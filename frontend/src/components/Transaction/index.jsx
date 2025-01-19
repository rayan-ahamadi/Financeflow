import "../../styles/Transaction.css";
import PropTypes from 'prop-types';
import  { useContext } from 'react';
import { TransactionContext } from '../../context/TransactionContext';
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";

function Transaction({transaction, setShowModal}) {
    const { setTransactionForm, fetchTransactions } = useContext(TransactionContext);
    const { fetchUserData } = useContext(UserContext);
    const location = useLocation();
    const transactionTypeSign = transaction.type_transaction === "revenu" ? "+" : "-";

    const handleEditClick = () => {

        if (location.pathname !== "/transactions") {
            window.location.href = "/transactions/"
            return;
        }

        setTransactionForm({ ...transaction, id_transaction: transaction.id_transaction });
        setShowModal(true);
    }

    const handleDelete = () => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
            return;
        }

        fetch(`/api/transactions/${transaction.id_transaction}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "La transaction a été supprimé avec succès") {
                fetchTransactions();
                fetchUserData();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    }

    return (
        <div className="transaction">
            <div className="transaction-title">{transaction.title}</div>
            <div className="transaction-amount">{transactionTypeSign}{transaction.amount}{transaction.currency_symbol}</div>
            <div className="transaction-date">{transaction.date}</div>
            <div className="transaction-place">{transaction.place}</div>
            <div className="transaction-category">{transaction.list_category.category}</div>
            <div className="transaction-action">
                <span className="transaction-edit" onClick={handleEditClick} ><FontAwesomeIcon icon={faPencil} /></span>
                <span className="transaction-delete" onClick={handleDelete}><FontAwesomeIcon icon={faTrashCan} /></span>
            </div>
        </div>
    );
}
Transaction.propTypes = {
    setShowModal: PropTypes.func.isRequired,
    transaction: PropTypes.shape({
        id_transaction: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        type_transaction: PropTypes.string.isRequired,
        currency_symbol: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        place: PropTypes.string.isRequired,
        list_category: PropTypes.shape({
            category: PropTypes.string.isRequired,
            subcategories: PropTypes.arrayOf(PropTypes.string).isRequired
        }).isRequired
    }).isRequired
};

export {Transaction};
