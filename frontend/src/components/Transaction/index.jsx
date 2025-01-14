import "../../styles/Transaction.css";
import PropTypes from 'prop-types';

function Transaction({transaction}) {

    const transactionTypeSign = transaction.type_transaction === "revenu" ? "+" : "-";

    return (
        <div className="transaction">
            <div className="transaction-amount">{transactionTypeSign}{transaction.amount}{transaction.currency_symbol}</div>
            <div className="transaction-date">{transaction.date}</div>
            <div className="transaction-place">{transaction.place}</div>
            <div className="transaction-category">{transaction.list_category.category}</div>
        </div>
    );
}
Transaction.propTypes = {
    transaction: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
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
