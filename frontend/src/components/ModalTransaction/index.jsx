import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modal.css';
import Select from 'react-select';

function ModalTransaction({showModal, setShowModal}) {
    const { user } = useContext(AuthContext);
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
    const [categories, setCategories] = useState(localStorage.getItem('categories') ? JSON.parse(localStorage.getItem('categories')) : []);
    const [category, setCategory] = useState(null);
    const [selectSubCategories, setSelectSubCategories] = useState(false);
    const selectCatégorie = useRef(null);

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
            }
        })
        .catch(error => console.error('Error:', error))
        .finally(() => {
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

    const handleCategory = (e) => {
        setCategory(categories.find(cat => cat.id_category === parseInt(e.target.value)));
        const selectedCategoryId = parseInt(e.target.value);
        setTransaction({...transaction, list_category: [selectedCategoryId]});
        
    };

    // Affiche les sous-catégories si une catégorie parent est sélectionnée
    useEffect(() => {
        console.log(user);
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
        } 
    }, []);

    return (
        <div className={showModal ? "modal display-block" : "modal display-none"}>
            <div className="modal-header">
                <h3>Ajouter une transaction</h3>
                <span className='close-modal' onClick={() => setShowModal(false)}><FontAwesomeIcon icon={faCircleXmark} /></span>
            </div>
            <div className="modal-body">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">Titre</label>
                        <input type="text" name="title" id="title" placeholder='Titre de votre transaction' onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select name="type_transaction" id="type" onChange={handleChange} required>
                            <option value="">Sélectionner un type de transaction</option>
                            <option value="revenu">Revenu</option>
                            <option value="dépense">Dépense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Montant</label>
                        <input type="number" name="amount" id="amount" value={transaction.amount} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id="date" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="place">Lieu</label>
                        <input type="text" name="place" id="place" onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Catégorie</label>
                        <Select
                            name='list_category'
                            value={category ? { value: category.id_category, label: category.name_category } : null}
                            ref={selectCatégorie}
                            options={categories
                                .filter(category => category.parent_id === null)
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
