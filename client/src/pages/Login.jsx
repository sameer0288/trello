import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Layout, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
      background: 'var(--bg-main)', position: 'relative', overflow: 'hidden',
      padding: '20px'
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
        .login-card {
          padding: 48px;
          border-radius: 40px;
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(24px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
            border-radius: 32px;
          }
          h2 { font-size: 28px !important; }
        }
        input {
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
      <div className="blob" style={{ top: '5%', left: '5%', width: '400px', height: '400px', background: 'var(--primary)', animationDelay: '0s' }}></div>
      <div className="blob" style={{ bottom: '10%', right: '5%', width: '350px', height: '350px', background: 'var(--accent)', animationDelay: '-5s' }}></div>
      <div className="blob" style={{ top: '40%', right: '20%', width: '250px', height: '250px', background: '#ec4899', animationDelay: '-10s' }}></div>

      <div className="login-card animate-fade">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            width: '54px', 
            height: '54px', 
            background: 'linear-gradient(135deg, #6366f1, #818cf8)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 12px', 
            boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)',
          }}>
            <Layout size={26} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px', color: 'white' }}>Welcome Back</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>Login to manage your workspace</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#fca5a5', 
            padding: '10px 14px', 
            borderRadius: '10px', 
            marginBottom: '20px', 
            fontSize: '12px', 
            border: '1px solid rgba(239, 68, 68, 0.15)', 
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Email Address</label>
            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail className="input-icon" size={18} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ 
                  paddingLeft: '48px', 
                  height: '46px', 
                  fontSize: '14px', 
                  background: '#f1f5f9', 
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '500',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'white', paddingLeft: '2px' }}>Password</label>
            <div className="input-group" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock className="input-icon" size={18} style={{ position: 'absolute', left: '16px', color: 'rgba(0,0,0,0.2)', zIndex: 5, pointerEvents: 'none' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ 
                  paddingLeft: '48px', 
                  paddingRight: '48px', 
                  height: '46px', 
                  fontSize: '14px', 
                  background: '#f1f5f9', 
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '500',
                  width: '100%'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.3)'; }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '2px' }}>
            <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer', borderRadius: '4px' }} />
            <label htmlFor="remember" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontWeight: '500' }}>Remember this device</label>
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px', gap: '8px', background: 'var(--primary)', boxShadow: '0 4px 12px var(--primary-glow)' }}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '500' }}>
            New user? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
