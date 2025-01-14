import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Modal.css';

function ModalTransaction({showModal, setShowModal}) {
    const [transaction, setTransaction] = useState({
        title: "",
        amount: 0,
        type_transaction: "revenu",
        date: "",
        place: "",
        list_category: [],
    });
    const [categories, setCategories] = useState(localStorage.getItem('categories') ? JSON.parse(localStorage.getItem('categories')) : []);

    const handleChange = (e) => {
        setTransaction({
            ...transaction,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(transaction);
        setShowModal(false);
    };

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
            console.log('Categories already cached');
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
                        <input type="text" name="title" id="title" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Montant</label>
                        <input type="number" name="amount" id="amount" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select name="type_transaction" id="type" onChange={handleChange}>
                            <option value="revenu">Revenu</option>
                            <option value="dépense">Dépense</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id="date" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="place">Lieu</label>
                        <input type="text" name="place" id="place" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Catégorie</label>
                        <select name="list_category[]" id="category" onChange={handleChange}>
                            {categories.filter(category => category.parent_id === null).map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subcategory">Sous-catégories</label>
                        <select name="list_category[]" id="subcategory" onChange={handleChange}>
                            {categories.filter(category => category.parent_id !== null).map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
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
