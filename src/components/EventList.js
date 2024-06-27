import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventList.css';

const EventList = ({ token }) => {
    const [events, setEvents] = useState([]);
    const [books, setBooks] = useState([]);
    const [newEvent, setNewEvent] = useState({ name: '' });
    const [selectedBooks, setSelectedBooks] = useState([]);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8080/api/events', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error fetching events:', error));

            axios.get('http://localhost:8080/api/books/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => setBooks(response.data))
            .catch(error => console.error('Error fetching books:', error));
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleCheckboxChange = (bookId) => {
        setSelectedBooks(prevSelectedBooks => {
            if (prevSelectedBooks.includes(bookId)) {
                return prevSelectedBooks.filter(id => id !== bookId);
            } else {
                return [...prevSelectedBooks, bookId];
            }
        });
    };

    const addEvent = () => {
        axios.post('http://localhost:8080/api/events', newEvent, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setEvents([...events, response.data]);
            setNewEvent({ name: '' });
        })
        .catch(error => console.error('Error adding event:', error));
    };

    return (
        <div className="event-container">
            <h1 className="event-title">List dogadjaja</h1>
            <ul className="event-list">
                {events && events.map(event => (
                    <li key={event.id} className="event-item">
                        {event.name}
                        <ul className="book-list">
                            {event.books && event.books.map(book => (
                                <li key={book.id} className="book-item">{book.title} od {book.author}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <h2 className="event-subtitle">Dodajte novi dogadjaj</h2>
            <form className="event-form">
                <input
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                    placeholder="Event Name"
                    className="event-input"
                />
                <button type="button" onClick={addEvent} className="event-button">Dodaj</button>
            </form>

            <h2 className="event-subtitle">Izaberite knjige za dogadjaj</h2>
            <ul className="book-selection-list">
                {books && books.map(book => (
                    <li key={book.id} className="book-selection-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedBooks.includes(book.id)}
                                onChange={() => handleCheckboxChange(book.id)}
                                className="book-checkbox"
                            />
                            {book.title} od {book.author}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
