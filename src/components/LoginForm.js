import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; // Import the CSS file

const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/login', { username, password })
            .then(response => {
                console.log(response.data); // Dodajemo logovanje za odgovor da proverimo strukturu
                const token = response.data; // Ako je odgovor direktno token, koristimo response.data
                localStorage.setItem('token', token);
                onLogin(token);
            })
            .catch(error => {
                console.error('Error during login', error);
            });
    };

    return (
        <div className="login-container">
            <img src="https://static.vecteezy.com/system/resources/previews/004/852/937/large_2x/book-read-library-study-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg" alt="Library Logo" className="logo" />
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Korisničko ime:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Šifra:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="login-button">Prijavi se</button>
            </form>
        </div>
    );
};

export default LoginForm;
