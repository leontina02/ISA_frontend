import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignBook = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:8080/api/books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setBooks(response.data);
        }).catch(error => {
            console.error('Error fetching books', error);
        });

        axios.get('http://localhost:8080/api/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data);
        }).catch(error => {
            console.error('Error fetching users', error);
        });
    }, [token]);

    const handleAssign = () => {
        if (selectedBook && selectedUser) {
            axios.post(`http://localhost:8080/api/books/${selectedBook}/assign`, null, {
                params: { username: selectedUser },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                alert('Book assigned successfully');
            }).catch(error => {
                console.error('Error assigning book', error);
            });
        } else {
            alert('Please select a book and a user');
        }
    };

    return (
        <div>
            <h1>Assign Book to User</h1>
            <div>
                <label>Select Book:</label>
                <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
                    <option value="">Select a book</option>
                    {books.map(book => (
                        <option key={book.id} value={book.id}>{book.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Select User:</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select a user</option>
                    {users.map(user => (
                        <option key={user.id} value={user.username}>{user.username}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleAssign}>Assign</button>
        </div>
    );
};

export default AssignBook;
