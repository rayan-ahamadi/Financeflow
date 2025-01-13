import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import "../../styles/Balance.css";

function Balance() {
    const { userData } = useContext(UserContext);

    return (
        <div className="balance-container">
            <div className="total-balance">
                <p>Solde total</p>
                <p className="amount-text">{userData?.balance}€</p>
            </div>
            <div className="total-income">
                <p>Revenus</p>
                <p className="amount-text">0.00€</p>
            </div>
            <div className="total-expense">
                <p>Dépenses</p>
                <p className="amount-text">0.00€</p>
            </div>
        </div>
    );
}

export { Balance };