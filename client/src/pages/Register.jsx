import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, User, Shield, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      background: 'var(--bg-main)', position: 'relative', overflow: 'hidden',
      padding: '40px 20px'
    }}>
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 0;
          animation: float 15s infinite ease-in-out;
        }
        .register-card {
          padding: 48px;
          border-radius: 40px;
          width: 100%;
          max-width: 500px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(24px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        @media (max-width: 480px) {
          .register-card {
            padding: 32px 24px;
            border-radius: 32px;
          }
          h2 { font-size: 28px !important; }
        }
        input, select {
          height: 52px;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        .input-icon {
          transition: color 0.3s ease;
        }
        .input-group:focus-within .input-icon {
          color: var(--primary) !important;
        }
      `}</style>

      {/* Dynamic background elements */}
      <div className="blob" style={{ bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'var(--primary)', animationDelay: '0s' }}></div>
      <div className="blob" style={{ top: '10%', left: '10%', width: '350px', height: '350px', background: 'var(--accent)', animationDelay: '-5s' }}></div>

      <div className="register-card animate-fade">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, var(--primary), #818cf8)', 
            borderRadius: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px', 
            boxShadow: '0 10px 20px -5px var(--primary-glow)',
          }}>
            <Layout size={30} color="white" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '8px', color: 'white' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Start your journey with Mini Trello</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.08)', 
            color: '#fca5a5', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            marginBottom: '24px', 
            fontSize: '13px', 
            border: '1px solid rgba(239, 68, 68, 0.15)', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Full Name</label>
              <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User className="input-icon" size={16} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  style={{ 
                    paddingLeft: '44px', 
                    height: '46px', 
                    fontSize: '13px', 
                    background: '#f1f5f9', 
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Account Role</label>
              <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Shield className="input-icon" size={16} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ 
                    paddingLeft: '44px', 
                    height: '46px', 
                    fontSize: '13px', 
                    background: '#f1f5f9', 
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '500',
                    width: '100%',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="USER" style={{ background: 'white' }}>User</option>
                  <option value="ADMIN" style={{ background: 'white' }}>Admin</option>
                </select>
                <div style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: 'rgba(0,0,0,0.2)', display: 'flex' }}>
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Email Address</label>
            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail className="input-icon" size={16} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
              <input 
                type="email" 
                placeholder="name@company.com"
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
                style={{ 
                  paddingLeft: '44px', 
                  height: '46px', 
                  fontSize: '13px', 
                  background: '#f1f5f9', 
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '500',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Password</label>
            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock className="input-icon" size={16} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Min. 8 characters"
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
                style={{ 
                  paddingLeft: '44px', 
                  paddingRight: '44px', 
                  height: '46px', 
                  fontSize: '13px', 
                  background: '#f1f5f9', 
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '500',
                  width: '100%'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '50px', fontSize: '15px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', gap: '8px', background: 'var(--primary)', boxShadow: '0 4px 12px var(--primary-glow)' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '500' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
