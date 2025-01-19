import { useContext,useState,useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { TransactionContext } from "../../context/TransactionContext";
import { Transaction } from "../Transaction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select'
import "../../styles/TransactionContainer.css";


function TransactionContainer({limit = null, page = "home", setShowModal}) {
    const { transactions } = useContext(TransactionContext);
    const { setTransactionForm } = useContext(TransactionContext);
    const [ filterType, setFilterType ] = useState("tout")
    // array pour le filtrage ou limite d'affiche des transactions
    const [newTransactions,setNewTransactions] = useState([]);

    // Mise à jour des transactions en fonction du filtre et de la limite
    useEffect(() => {
        let updatedTransactions = transactions;
        if (limit) {
            updatedTransactions = transactions.slice(0, limit);
        }
        if (filterType !== "tout") {
            updatedTransactions = updatedTransactions.filter((transaction) => transaction.type_transaction === filterType);
        }
        setNewTransactions(updatedTransactions);
    }, [transactions, limit, filterType]);
        
    const handleAddTransaction = () => {
        setTransactionForm({
            title: "",
            amount: 0,
            type_transaction: "",
            date: "",
            place: "",
            currency_code : "EUR",
            currency_symbol : "€",
            list_category: [],
        });
        setShowModal(true);
    }

    const emptyMessage = newTransactions.length === 0 ? <p className="empty-transaction">Aucune transaction pour le moment</p> : null;
    // Montre le bouton "Tout afficher" si on est sur la page d'accueil
    const showAction = page === "home" ? true : false;
    const addTransaction = <div className="addTransaction" onClick={handleAddTransaction}><FontAwesomeIcon alt="Ajouter une transaction"  icon={faCirclePlus}  /></div> 

    // Select pour filtrer par le type
    const selectType = <Select
        value={filterType}
        onChange={setFilterType}
        options={[
            { value: 'all', label: 'Toutes' },
            { value: 'dépense', label: 'Dépenses' },
            { value: 'revenu', label: 'Revenus' },
        ]}
    />

    return (
        <div className="transaction-container">
            <div className="transaction-head">
                <h3>Transactions</h3>
                <div className="action">
                    { page != "home" && selectType}
                    {!showAction || <Link to="/transactions">Tout afficher</Link>}
                    {showAction ? <Link to="/transactions/:modalParam" aria-label="Ajouter une transaction"><FontAwesomeIcon alt="Ajouter une transaction" icon={faCirclePlus} /></Link> : addTransaction}
                </div>
            </div>
            <div className="transaction-content">
               <ul>
                    {emptyMessage || newTransactions.map((transaction) => (
                        <li key={transaction.id}>
                            <Transaction key={transaction.id} transaction={transaction} setShowModal={setShowModal} />
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
