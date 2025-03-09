import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:3000/login' : 'http://localhost:3000/register';
    
    try {
      const response = await axios.post(url, {
        username,
        password
      });
      setMessage(response.data.message);
      if (isLogin && response.data.userId) {
        // Handle successful login (e.g., redirect or store token)
        console.log('Logged in with user ID:', response.data.userId);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-box"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLogin ? 'Login' : 'Register'}
          </motion.button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;