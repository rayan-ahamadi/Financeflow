import { useContext } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext";
import { Transaction } from "../Transaction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import "../../styles/TransactionContainer.css";


function TransactionContainer({limit = null}) {
    const { transactions } = useContext(TransactionContext);

    let newTransactions = [];
    if (limit) {
        newTransactions = transactions.slice(0, limit);
    } else {
        newTransactions = transactions;
    }

    const emptyMessage = newTransactions.length === 0 ? <p className="empty-transaction">Aucune transaction pour le moment</p> : null;

    return (
        <div className="transaction-container">
            <div className="transaction-head">
                <h3>Transactions</h3>
                <div className="action">
                    <Link to="/transactions">Tout afficher</Link>
                    <Link to="/transactions"><FontAwesomeIcon icon={faCirclePlus} /></Link>
                </div>
            </div>
            <div className="transaction-content">
               <ul>
                    {emptyMessage || newTransactions.map((transaction) => (
                        <li key={transaction.id}>
                            <Transaction transaction={transaction} />
                        </li>
                    ))}
                </ul> 
            </div>
            
        </div>
    );
}


TransactionContainer.propTypes = {
    limit: PropTypes.number,
};

export { TransactionContainer };
