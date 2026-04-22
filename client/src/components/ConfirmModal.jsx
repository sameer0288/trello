import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
    }}>
      <div className="glass animate-fade" style={{
        padding: '0', borderRadius: '32px', width: '400px', maxWidth: '90%',
        position: 'relative', overflow: 'hidden', border: '1px solid rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--danger)', borderRadius: '50%', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' 
          }}>
            <AlertTriangle size={32} />
          </div>
          
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{title || 'Are you sure?'}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
            {message || 'This action cannot be undone. All related data will be permanently deleted.'}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onClose}
              className="btn"
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="btn"
              style={{ flex: 1, background: 'var(--danger)', color: 'white' }}
            >
              <Trash2 size={18} /> Delete Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
