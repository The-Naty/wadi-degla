import React, { useState } from 'react';
import './LoginForm.css';
import { Modal } from 'antd';

const LoginForm = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://wadidegla-q264.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log('Login successful');
                window.location.reload();

            } else {
                console.error('Login failed');
                Modal.error({
                    title: "Invalid Email or Password",
                    
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

   

    const token = localStorage.getItem('token') || null;
    return (
        <div className='loginFormContainer'>
        <title>Login - Wadi Degla</title>
        <form className='loginForm' onSubmit={handleSubmit}>
         <h1>Welcome</h1>
            <input
                className='formInput'
                type='text'
                required
                name='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className='formInput'
                type='password'
                required
                name='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className='formButton' type='submit'>Login</button>
        </form>
        </div>
    );
};

export default LoginForm;
