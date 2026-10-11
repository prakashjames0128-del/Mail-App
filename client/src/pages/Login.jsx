import { useState } from 'react';
import { api } from '../api.js';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api('/auth/login', { method: 'POST', body: { email, password } });
      localStorage.setItem('token', token);
      onLogin();
    } catch (err) { setError(err.message); }
  };

  return (
    <form className="panel login" onSubmit={submit}>
      <h1>Bulk Mail</h1>
      <p className="muted">Sign in to send and review campaigns.</p>
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      {error && <div className="msg err" role="alert">{error}</div>}
      <button className="primary">Sign in</button>
    </form>
  );
}
