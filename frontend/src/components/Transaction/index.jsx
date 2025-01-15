import "../../styles/Transaction.css";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Transaction({transaction, setTransaction, setShowModal}) {

    const transactionTypeSign = transaction.type_transaction === "revenu" ? "+" : "-";

    const handleEditClick = () => {
        setTransaction({ ...transaction, id_transaction: transaction.id_transaction });
        setShowModal(true);
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
                <span className="transaction-delete" ><FontAwesomeIcon icon={faTrashCan} /></span>
            </div>
        </div>
    );
}
Transaction.propTypes = {
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
