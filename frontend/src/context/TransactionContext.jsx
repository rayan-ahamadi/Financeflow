import { createContext, useState,useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

const TransactionContext = createContext();

const TransactionProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token && user) {
            fetch(`/api/transactions/user/${user}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response.json())
            .then((data) => {
                if(data.message === "Cet utilisateur n'a pas de transactions"){
                    data = [];

                    setTimeout(() => {
                        alert("Vous n'avez pas encore de transactions, il est temps d'en ajouter ! ;)");
                    }, 1000)
                }

                setTransactions(data);
                return data;
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                setTransactionLoading(false);
            });
        }
    }, [user]);

    
    return (
        <TransactionContext.Provider value={{ transactions, setTransactions, transactionLoading }}>
            {children}
        </TransactionContext.Provider>
    );
};

TransactionProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { TransactionContext, TransactionProvider };