import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function History() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(null);

  useEffect(() => { api('/mail/history').then(setRows).catch((e) => setError(e.message)); }, []);

  if (error) return <div className="msg err">{error}</div>;
  if (!rows) return <p className="muted">Loading…</p>;
  if (!rows.length) return <p className="muted">No emails sent yet. Compose one to see it here.</p>;

  return (
    <div className="panel">
      {rows.map((m) => (
        <div key={m._id} className="row">
          <button className="rowhead" onClick={() => setOpen(open === m._id ? null : m._id)}>
            <span className="subj">{m.subject}</span>
            <span className="muted">{new Date(m.createdAt).toLocaleString()}</span>
            <span className={`badge ${m.status}`}>{m.status} · {m.sentCount}/{m.recipients.length}</span>
          </button>
          {open === m._id && (
            <div className="detail">
              <p>{m.body}</p>
              <ul>
                {m.results.map((r) => (
                  <li key={r.email} className={r.ok ? '' : 'bad'}>{r.email}{!r.ok && ` — ${r.error}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
