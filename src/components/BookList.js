import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [newBook, setNewBook] = useState({ title: '', author: '' });
    const [assignData, setAssignData] = useState({ bookId: '', username: '' });
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        if (token) {
            const fetchBooksAndUsers = async () => {
                try {
                    const booksResponse = await axios.get('http://localhost:8080/api/books', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const usersResponse = await axios.get('http://localhost:8080/api/users', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const booksData = booksResponse.data;
                    const usersData = usersResponse.data;

                    const updatedBooks = booksData.map(book => {
                        const user = usersData.find(user => user.books.some(userBook => userBook.id === book.id));
                        return user ? { ...book, user } : book;
                    });

                    setBooks(updatedBooks);
                    setUsers(usersData);
                } catch (error) {
                    console.error('Error fetching books and users:', error);
                }
            };

            fetchBooksAndUsers();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleAssignChange = (e) => {
        const { name, value } = e.target;
        setAssignData({ ...assignData, [name]: value });
    };

    const addBook = () => {
        axios.post('http://localhost:8080/api/books', newBook, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setBooks([...books, response.data]);
            setNewBook({ title: '', author: '' });
        })
        .catch(error => console.error('Error adding book:', error));
    };

    const assignBookToUser = () => {
        const { bookId, username } = assignData;
        axios.post(`http://localhost:8080/api/books/${bookId}/assign?username=${username}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const updatedBooks = books.map(book => book.id === response.data.id ? response.data : book);
            setBooks(updatedBooks);
            setAssignData({ bookId: '', username: '' });
        })
        .catch(error => console.error('Error assigning book to user:', error));
    };

    const updateBook = () => {
        axios.put(`http://localhost:8080/api/books/${editingBook.id}`, editingBook, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const updatedBooks = books.map(book => book.id === editingBook.id ? response.data : book);
            setBooks(updatedBooks);
            setEditingBook(null);
        })
        .catch(error => console.error('Error updating book:', error));
    };

    const deleteBook = (id) => {
        axios.delete(`http://localhost:8080/api/books/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setBooks(books.filter(book => book.id !== id));
        })
        .catch(error => console.error('Error deleting book:', error));
    };

    const startEditingBook = (book) => {
        setEditingBook(book);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingBook({ ...editingBook, [name]: value });
    };

    return (
        <div className="book-list-container">
            <h1 className="book-list-title">Lista knjiga</h1>
            <ul className="book-list">
                {books.map(book => (
                    <li key={book.id} className="book-list-item">
                        {book.title} od {book.author}
                        {book.user && <span> - Dodeljena članu: {book.user.username}</span>}
                        <div className="book-list-buttons">
                            <button onClick={() => startEditingBook(book)} className="book-list-button">Izmeni</button>
                            <button onClick={() => deleteBook(book.id)} className="book-list-button">Ukloni</button>
                        </div>
                    </li>
                ))}
            </ul>
            <h2 className="book-list-title">Dodajte novu knjigu</h2>
            <form className="book-list-form">
                <input
                    type="text"
                    name="title"
                    value={newBook.title}
                    onChange={handleInputChange}
                    placeholder="Naziv knjige"
                    className="book-list-input"
                />
                <input
                    type="text"
                    name="author"
                    value={newBook.author}
                    onChange={handleInputChange}
                    placeholder="Autor"
                    className="book-list-input"
                />
                <button type="button" onClick={addBook} className="book-list-submit">Dodaj</button>
            </form>

            <h2 className="book-list-title">Dodelite knjigu članu</h2>
            <div className="book-list-form">
                <select name="bookId" value={assignData.bookId} onChange={handleAssignChange} className="book-list-select">
                    <option value="">Izaberite knjigu</option>
                    {books.map(book => (
                        <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                </select>
                <select name="username" value={assignData.username} onChange={handleAssignChange} className="book-list-select">
                    <option value="">Izaberite člana</option>
                    {users.map(user => (
                        <option key={user.id} value={user.username}>{user.username}</option>
                    ))}
                </select>
                <button onClick={assignBookToUser} className="book-list-submit">Dodeli</button>
            </div>

            {editingBook && (
                <div className="book-list-form">
                    <h2 className="book-list-title">Izmenite knjigu</h2>
                    <input
                        type="text"
                        name="title"
                        value={editingBook.title}
                        onChange={handleEditChange}
                        placeholder="Naziv knjige"
                        className="book-list-input"
                    />
                    <input
                        type="text"
                        name="author"
                        value={editingBook.author}
                        onChange={handleEditChange}
                        placeholder="Autor"
                        className="book-list-input"
                    />
                    <select
                        name="userId"
                        value={editingBook.user ? editingBook.user.id : ''}
                        className="book-list-select"
                    >
                        <option value="">Izaberite člana</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.username}</option>
                        ))}
                    </select>
                    <button onClick={updateBook} className="book-list-submit">Izmeni</button>
                </div>
            )}
        </div>
    );
};

export default BookList;
