import { useState } from 'react';
import Login from './pages/Login.jsx';
import Compose from './pages/Compose.jsx';
import History from './pages/History.jsx';

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [tab, setTab] = useState('compose');

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const logout = () => { localStorage.removeItem('token'); setAuthed(false); };

  return (
    <div className="shell">
      <header className="top">
        <h1>Bulk Mail</h1>
        <nav>
          <button className={tab === 'compose' ? 'on' : ''} onClick={() => setTab('compose')}>Compose</button>
          <button className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>History</button>
          <button onClick={logout}>Sign out</button>
        </nav>
      </header>
      <main>{tab === 'compose' ? <Compose onSent={() => setTab('history')} /> : <History />}</main>
    </div>
  );
}
