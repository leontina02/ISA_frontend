import React from 'react';

const LogoutButton = ({ onLogout }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
