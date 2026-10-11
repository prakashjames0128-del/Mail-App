import { useMemo, useState } from 'react';
import { api } from '../api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Compose({ onSent }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [raw, setRaw] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  const { valid, invalid } = useMemo(() => {
    const all = [...new Set(raw.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))];
    return { valid: all.filter((e) => EMAIL_RE.test(e)), invalid: all.filter((e) => !EMAIL_RE.test(e)) };
  }, [raw]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (invalid.length) return setMsg({ type: 'err', text: `Fix invalid addresses: ${invalid.slice(0, 3).join(', ')}` });
    if (!valid.length) return setMsg({ type: 'err', text: 'Add at least one recipient.' });
    setSending(true);
    try {
      const { message } = await api('/mail/send', { method: 'POST', body: { subject, body, recipients: valid } });
      setMsg({ type: 'ok', text: message });
      setSubject(''); setBody(''); setRaw('');
      setTimeout(onSent, 1200);
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally { setSending(false); }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <label>Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} required /></label>
      <label>Message<textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} required /></label>
      <label>Recipients
        <textarea rows={5} value={raw} onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste addresses separated by commas, spaces or new lines" />
      </label>
      <p className="muted">
        {valid.length} valid{invalid.length > 0 && <span className="bad"> · {invalid.length} invalid: {invalid.slice(0, 3).join(', ')}</span>}
      </p>
      {msg && <div className={`msg ${msg.type}`} role="alert">{msg.text}</div>}
      <button className="primary" disabled={sending}>{sending ? 'Sending…' : `Send to ${valid.length} recipients`}</button>
    </form>
  );
}
