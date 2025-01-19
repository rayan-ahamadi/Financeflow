import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TransactionContext } from '../../context/TransactionContext';
import { UserContext } from '../../context/UserContext';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modal.css';
import Select from 'react-select';

function ModalTransaction({showModal, setShowModal}) {
    const { user } = useContext(AuthContext);
    const { transactionForm , setTransactionForm: setTransaction } = useContext(TransactionContext);
    const { fetchTransactions } = useContext(TransactionContext);
    const { fetchUserData } = useContext(UserContext);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [selectSubCategories, setSelectSubCategories] = useState(false);
    const selectCatégorie = useRef(null);
    const selectSubCatégorie = useRef(null);
    const selectType = useRef(null);
    const text = transactionForm.id_transaction ? 'Modifier' : 'Ajouter';

    const handleChange = (e) => {
        setTransaction({
            ...transactionForm,
            [e.target.name]: e.target.value,
        });
    };

    // Note : React Select n'a pas les même gestion des événements que les inputs classiques
    // ici target est un objet qui contient value 
    const handleTypeChange = (e) => {
        setTransaction({
            ...transactionForm,
            type_transaction: e.target.value
        });
    
        if(e.target.name === 'type_transaction' && e.target.value === 'revenu'){
            selectCatégorie.current.setValue({ value: 6, label: 'Revenus' });
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const transactionData = {...transactionForm, id_user: user};
        const apiRoute = transactionData.id_transaction ? `/api/transactions/${transactionData.id_transaction}` : '/api/transactions';
        const apiMethod = transactionData.id_transaction ? 'PUT' : 'POST';
        
        fetch(apiRoute, {
            method: apiMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.message === "La transaction a été ajouté avec succès"){
                alert("Transaction ajoutée avec succès");
                fetchTransactions(); // Mettre à jour les transactions après l'ajout
            } else if(data.message === "La transaction a été modifié avec succès"){
                alert("Transaction modifiée avec succès");
                fetchTransactions(); // Mettre à jour les transactions après la modification
                fetchUserData(); // Mettre à jour les transactions après la modification
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
        const selectedCategory = categories.find(cat => cat.id_category === parseInt(e.target.value));
        if (selectedCategory) {
            setCategory({ id_category: e.target.value, name_category: selectedCategory.name_category });
            setTransaction({...transactionForm, list_category: [selectedCategory.id_category]});
        }
        setTransaction({...transactionForm, list_category: [selectedCategory.id_category]});
    };

    useEffect(() => { 
        
        if(category && category.name_category !== 'Revenus'){
            selectType.current.setValue({ value: 'dépense', label: 'Dépense' });
        } else if (category) {
            selectType.current.setValue({ value: 'revenu', label: 'Revenu' });
        }  
          
    }, [category]);

    // Affiche les sous-catégories si une catégorie parent est sélectionnée
    useEffect(() => {

        // Pour l'édit de transaction, list_category est un objet (voir readme.md de l'API backend)
        if (typeof transactionForm.list_category === 'object' && !Array.isArray(transactionForm.list_category)) {
            const idCategory = categories.filter(category => category.name_category === transactionForm.list_category.category)[0].id_category;
            const idSubCategories = [];
            transactionForm.list_category.subcategories.forEach(subcategory => { 
                idSubCategories.push(categories.filter(cat => cat.name_category === subcategory)[0].id_category);
            });

            if(idSubCategories.length > 0 || category){
                setSelectSubCategories(
                    <div className="form-group">
                        <label htmlFor="subcategory">Sous-catégories</label>
                        <Select
                            isMulti
                            name="list_category"
                            ref={selectSubCatégorie}
                            options={categories
                                .filter(category => category.parent_id === parseInt(transactionForm.list_category[0]))
                                .map(category => ({
                                    value: category.id_category,
                                    label: category.name_category
                                }))
                            }
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions.map(option => option.value);
                                setTransaction({...transactionForm, list_category: [transactionForm.list_category[0], ...selectedIds]});
                            }}
                            required
                        />
                    </div>
                );
            }

            setTransaction({...transactionForm, list_category: [idCategory, ...idSubCategories]});
            if (selectSubCatégorie.current && idSubCategories.length > 0) {
                selectSubCatégorie.current.setValue(idSubCategories.map(id => ({ value: id, label: categories.find(cat => cat.id_category === id).name_category })));
            }
            
        }
        
        
    }, [transactionForm, categories, setTransaction,selectSubCategories]);

    // Si des catégories sont déjà défini dans la transaction, on clique et affiche les sous-catégories
    useEffect(() => {
        const selectedCategory = categories.find(cat => cat.id_category === parseInt(transactionForm.list_category[0]));
        if (selectedCategory) {
            setCategory({ id_category: transactionForm.list_category[0], name_category: selectedCategory.name_category });
        }
    }, [transactionForm.list_category, categories]);
    
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
                <h3>{text} une transaction</h3>
                <span className='close-modal' onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <form>
                    <div className="form-group">
                        <label htmlFor="title">Titre</label>
                        <input type="text" name="title" id="title" placeholder='Titre de votre transaction' value={transactionForm.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <Select
                            name="type_transaction"
                            value={transactionForm.type_transaction ? { value: transactionForm.type_transaction, label: transactionForm.type_transaction.charAt(0).toUpperCase() + transactionForm.type_transaction.slice(1) } : null}
                            options={[
                                { value: 'revenu', label: 'Revenu' },
                                { value: 'dépense', label: 'Dépense' }
                            ]}
                            onChange={(selectedOption) => handleTypeChange({ target : { value: selectedOption.value, name: selectedOption.name } })}
                            ref={selectType}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Montant (€)</label>
                        <input type="number" name="amount" id="amount" value={transactionForm.amount}  onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id="date" value={transactionForm.date} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="place">Lieu</label>
                        <input type="text" name="place" id="place" value={transactionForm.place} onChange={handleChange} required/>
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
                            onChange={(selectedOption) => handleCategory({ target: { value: selectedOption.value, name: selectedOption.name } })}
                            required
                        />
                    </div>
                    {selectSubCategories}
                </form>
            </div>
            <div className="modal-footer">
                <button onClick={handleSubmit}>{text}</button>
            </div>
        </div>
    );
}
ModalTransaction.propTypes = {
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired,
};

export { ModalTransaction };