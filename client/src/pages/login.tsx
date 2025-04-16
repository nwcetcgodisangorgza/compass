import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

// Simple login page without relying on UI components
export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setMessage('Logging in...');
    
    try {
      await login(username, password);
      setMessage('Login successful!');
      // Login is handled by the auth hook which will redirect
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Authentication failed. Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto login on page load
  useEffect(() => {
    console.log('Login page loaded, attempting auto-login');
    
    // Auto submit after a small delay
    const timer = setTimeout(() => {
      setIsLoading(true);
      setMessage('Auto-logging in...');
      
      login('admin', 'password').catch(err => {
        console.error('Auto-login failed:', err);
        setMessage('Auto-login failed. Please log in manually.');
        setIsLoading(false);
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '30px'
        }}>
          <div style={{
            height: '50px',
            width: '50px',
            backgroundColor: '#0070f3',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 auto 15px'
          }}>
            NC
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>NWCETC Compass</h1>
          <p style={{
            color: '#666',
            marginBottom: '20px'
          }}>North West CET College Resource Management</p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>Login</h2>
          <p style={{
            color: '#666',
            marginBottom: '20px'
          }}>Enter your credentials to access the system</p>
          
          {message && (
            <div style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: message.includes('failed') ? '#FEE2E2' : '#EFF6FF',
              color: message.includes('failed') ? '#B91C1C' : '#1E40AF',
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500'
              }}>
                Username
              </label>
              <input 
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500'
              }}>
                Password
              </label>
              <input 
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px'
          }}>
            <a href="#forgot" style={{
              fontSize: '14px',
              color: '#666',
              textDecoration: 'none'
            }}>
              Forgot password?
            </a>
            <button 
              onClick={() => {
                setUsername('admin');
                setPassword('password');
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#0070f3',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Demo Login
            </button>
          </div>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginTop: '24px'
        }}>
          © 2023 North West CET College. All rights reserved.
        </p>
      </div>
    </div>
  );
}
