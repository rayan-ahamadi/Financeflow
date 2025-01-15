import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modal.css';
import Select from 'react-select';

function ModalTransaction({showModal, setShowModal}) {
    const { user } = useContext(AuthContext);
    const { fetchTransactions } = useContext(TransactionContext);
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
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [selectSubCategories, setSelectSubCategories] = useState(false);
    const selectCatégorie = useRef(null);
    const selectType = useRef(null);

    const handleChange = (e) => {
        setTransaction({
            ...transaction,
            [e.target.name]: e.target.value,
        });

        if(e.target.name === 'type_transaction' && e.target.value === 'revenu'){
            selectCatégorie.current.setValue({ value: 6, label: 'Revenus' });
        }

    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const transactionData = {...transaction, id_user: user};
        
        fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.message === "Transaction ajoutée avec succès"){
                alert("Transaction ajoutée avec succès");
                fetchTransactions(); // Mettre à jour les transactions après l'ajout
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
            setSelectSubCategories(false);
            setTransaction({
                title: "",
                amount: 0,
                type_transaction: "revenu",
                date: "",
                place: "",
                currency_code : "EUR",
                currency_symbol : "€",
                list_category: [],
            });
            setShowModal(false);
            
        });       
    };

    // Pour le select des catégories parent
    const handleCategory = (e) => {
        setCategory(categories.find(cat => cat.id_category === parseInt(e.target.value)));
        const selectedCategoryId = parseInt(e.target.value);
        setTransaction({...transaction, list_category: [selectedCategoryId]});

        if(selectedCategoryId !== 6){
            selectType.current.setValue({ value: 'dépense', label: 'Dépense' });
        }
        
    };

    // Affiche les sous-catégories si une catégorie parent est sélectionnée
    useEffect(() => {
        if(transaction.list_category.length > 0){
            setSelectSubCategories(
                <div className="form-group">
                    <label htmlFor="subcategory">Sous-catégories</label>
                    <Select
                        isMulti
                        name="list_category"
                        options={categories
                            .filter(category => category.parent_id === parseInt(transaction.list_category[0]))
                            .map(category => ({
                                value: category.id_category,
                                label: category.name_category
                            }))
                        }
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions.map(option => option.value);
                            setTransaction({...transaction, list_category: [transaction.list_category[0], ...selectedIds]});
                        }}
                        required
                    />
                </div>
            );
        }
    }, [transaction, categories]);
    
    // Récupère les catégories depuis l'API ou le cache
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/api/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            localStorage.setItem('categories', JSON.stringify(data));
            setCategories(data);
        }

        const cachedCategories = localStorage.getItem('categories');
        if (!cachedCategories || cachedCategories === '[]') {
            fetchCategories();
            setCategories(JSON.parse(cachedCategories));
        } else {
            setCategories(JSON.parse(cachedCategories));
        }
    }, []);

    return (
        <div className={showModal ? "modal display-block" : "modal display-none"}>
            <div className="modal-header">
                <h3>Ajouter une transaction</h3>
                <span className='close-modal' onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <form>
                    <div className="form-group">
                        <label htmlFor="title">Titre</label>
                        <input type="text" name="title" id="title" placeholder='Titre de votre transaction' value={transaction.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <Select
                            name="type_transaction"
                            value={transaction.type_transaction ? { value: transaction.type_transaction, label: transaction.type_transaction.charAt(0).toUpperCase() + transaction.type_transaction.slice(1) } : null}
                            options={[
                                { value: 'revenu', label: 'Revenu' },
                                { value: 'dépense', label: 'Dépense' }
                            ]}
                            onChange={(selectedOption) => handleChange({ target: { name: 'type_transaction', value: selectedOption.value } })}
                            ref={selectType}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Montant (€)</label>
                        <input type="number" name="amount" id="amount" value={transaction.amount}  onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id="date" value={transaction.date} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="place">Lieu</label>
                        <input type="text" name="place" id="place" value={transaction.place} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Catégorie</label>
                        <Select
                            name='list_category'
                            value={category ? { value: category.id_category, label: category.name_category } : null}
                            ref={selectCatégorie}
                            options={categories
                                ?.filter(category => category.parent_id === null)
                                .map(category => ({
                                    value: category.id_category,
                                    label: category.name_category
                                }))}
                            onChange={(selectedOption) => handleCategory({ target: { value: selectedOption.value } })}
                            required
                        />
                    </div>
                    {selectSubCategories}
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={handleSubmit}>Ajouter</button>
            </div>
        </div>
    );
}
ModalTransaction.propTypes = {
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired,
};

export { ModalTransaction };