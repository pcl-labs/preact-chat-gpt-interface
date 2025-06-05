import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface SupportCaseFormProps {
  caseId: string;
  onFeedbackComplete?: () => void;
}

interface PrefilledData {
  email?: string;
  subject?: string;
  description?: string;
}

// Use the same API base URL logic as in index.tsx
const apiBase = import.meta.env.PROD
  ? 'https://compass-ts.paulchrisluke.workers.dev'
  : 'http://localhost:5173';

const SupportCaseForm: FunctionalComponent<SupportCaseFormProps> = ({ caseId, onFeedbackComplete }) => {
  const [form, setForm] = useState<PrefilledData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load prefilled data
  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/support-case/${caseId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          email: data.email || '',
          subject: data.subject || '',
          description: data.description || ''
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load case details.');
        setLoading(false);
      });
  }, [caseId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/help-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          caseId,
        })
      });
      if (!res.ok) throw new Error('Failed to submit support case.');
      const data = await res.json().catch(() => ({}));
      setSuccessMessage(data.message || 'Your support case has been submitted.');
      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your support case.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async (rating: number) => {
    setFeedback(rating);
    // Immediately submit feedback and end chat
    try {
      await fetch(`${apiBase}/support-case/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          rating,
          comments: feedbackComment
        })
      });
    } catch {}
    setFeedbackSubmitted(true);
    if (typeof onFeedbackComplete === 'function') onFeedbackComplete();
  };

  // --- UI ---
  if (loading) return <div class="card" style={{ width: '100%' }}><div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>;
  if (error) return <div class="card error-message" style={{ width: '100%' }}>{error}</div>;

  return (
    <div class="card support-case-form-card" style={{ width: '100%', padding: '2rem 1.5rem', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {!submitted ? (
        <form class="support-case-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calendar-icon"><rect x="3" y="7" width="18" height="13" rx="2" ry="2"></rect><path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"></path></svg>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Submit a Support Case</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Email<span style={{ color: 'var(--accent-color)' }}>*</span></label>
            <input
              type="email"
              name="email"
              value={form.email || ''}
              onInput={handleChange}
              required
              class="form-input"
              style={{ borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '1rem', background: 'var(--input-bg)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Subject<span style={{ color: 'var(--accent-color)' }}>*</span></label>
            <input
              type="text"
              name="subject"
              value={form.subject || ''}
              onInput={handleChange}
              required
              class="form-input"
              style={{ borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '1rem', background: 'var(--input-bg)' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Description<span style={{ color: 'var(--accent-color)' }}>*</span></label>
            <textarea
              name="description"
              value={form.description || ''}
              onInput={handleChange}
              required
              class="form-input"
              rows={4}
              style={{ borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '1rem', background: 'var(--input-bg)' }}
            />
          </div>
          <button type="submit" class="schedule-button" style={{ marginTop: '0.5rem' }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Support Case'}
          </button>
          {error && <div class="error-message">{error}</div>}
        </form>
      ) : (
        <div class="support-case-confirmation" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="calendar-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M9 16l2 2 4-4"></path></svg>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Thank you!</h3>
            <p style={{ color: 'var(--accent-color)', margin: 0 }}>{successMessage || 'Your support case has been submitted.'}</p>
          </div>
          {!feedbackSubmitted ? (
            <div class="feedback-form" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div class="feedback-label" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>How satisfied were you with your AI support experience?</div>
              <div class="feedback-options" style={{ display: 'flex', gap: '0.5rem' }}>
                {[1,2,3,4,5].map(n => (
                  <button
                    type="button"
                    class={`feedback-emoji${feedback === n ? ' selected' : ''}`}
                    onClick={() => handleFeedback(n)}
                    aria-label={`Rating ${n}`}
                    style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', outline: feedback === n ? '2px solid var(--accent-color)' : 'none', borderRadius: '50%' }}
                  >
                    {['😡','🙁','😐','🙂','😃'][n-1]}
                  </button>
                ))}
              </div>
              <textarea
                class="form-input"
                placeholder="Additional comments (optional)"
                value={feedbackComment}
                onInput={e => setFeedbackComment((e.target as HTMLTextAreaElement).value)}
                rows={2}
                style={{ borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '0.5rem', fontSize: '1rem', background: 'var(--input-bg)', width: '100%' }}
                disabled={feedbackSubmitted}
              />
            </div>
          ) : (
            <div class="feedback-thankyou" style={{ color: 'var(--accent-color)', marginTop: '1rem' }}>Thank you for your feedback!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportCaseForm; 