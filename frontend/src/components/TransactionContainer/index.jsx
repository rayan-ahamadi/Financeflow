import { useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext";
import { Transaction } from "../Transaction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import "../../styles/TransactionContainer.css";


function TransactionContainer({limit = null, page = "home", setShowModal}) {
    const { transactions } = useContext(TransactionContext);

    let newTransactions = [];
    if (limit) {
        newTransactions = transactions.slice(0, limit);
    } else {
        newTransactions = transactions;
    }

    const emptyMessage = newTransactions.length === 0 ? <p className="empty-transaction">Aucune transaction pour le moment</p> : null;
    // Montre le bouton "Tout afficher" si on est sur la page d'accueil
    const showAction = page === "home" ? true : false;
    const addTransaction = <div className="addTransaction" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faCirclePlus}  /></div> 

    return (
        <div className="transaction-container">
            <div className="transaction-head">
                <h3>Transactions</h3>
                <div className="action">
                    {!showAction || <Link to="/transactions">Tout afficher</Link>}
                    {showAction ? <Link to="/transactions" state={{showModal:true}} aria-label="Ajouter une transaction"><FontAwesomeIcon icon={faCirclePlus} /></Link> : addTransaction}
                </div>
            </div>
            <div className="transaction-content">
               <ul>
                    {emptyMessage || newTransactions.map((transaction) => (
                        <li key={transaction.id}>
                            <Transaction key={transaction.id} transaction={transaction} />
                        </li>
                    ))}
                </ul> 
            </div>
            
        </div>
    );
}


TransactionContainer.propTypes = {
    limit: PropTypes.number,
    page: PropTypes.string,
    setShowModal: PropTypes.func,
};

export { TransactionContainer };
