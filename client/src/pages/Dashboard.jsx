import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Layout, LogOut, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const res = await api.post('/boards', { title: newBoardTitle });
      setBoards([...boards, res.data]);
      setNewBoardTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBoard = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this board?')) return;
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <header className="glass" style={{ padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px var(--primary-glow)' }}>
            <Layout size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Mini Trello</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className={`badge-${user?.role?.toLowerCase()}`}>
            {user?.role} Account
          </div>
          <button className="btn btn-danger" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '0 60px 60px' }}>
        <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Your Boards</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Total of {boards.length} active boards</p>
            </div>
            
            {user?.role === 'ADMIN' && (
              <form onSubmit={createBoard} style={{ display: 'flex', gap: '12px', width: '400px' }}>
                <input 
                  type="text" 
                  placeholder="Board Name..." 
                  value={newBoardTitle} 
                  onChange={(e) => setNewBoardTitle(e.target.value)} 
                />
                <button className="btn btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={20} /> Create Board
                </button>
              </form>
            )}
          </div>

          {boards.length === 0 ? (
            <div className="glass" style={{ padding: '100px', borderRadius: '32px', textAlign: 'center', borderStyle: 'dashed' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Layout size={40} color="var(--text-secondary)" />
              </div>
              <h3>No Boards Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                {user?.role === 'ADMIN' ? 'Start by creating your first board above.' : 'Ask admin to assign'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {boards.map(board => (
                <div 
                  key={board.id} 
                  className="glass animate-fade" 
                  onClick={() => navigate(`/board/${board.id}`)}
                  style={{ 
                    padding: '32px', 
                    borderRadius: '24px', 
                    cursor: 'pointer', 
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '14px' }}>
                      <Layout size={24} color="white" />
                    </div>
                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={(e) => deleteBoard(board.id, e)}
                        className="btn"
                        style={{ padding: '8px', background: 'none', color: 'rgba(255,255,255,0.2)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{board.title}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>{board.columns?.length || 3} Columns</span>
                    <span>•</span>
                    <span>{board.columns?.reduce((acc, c) => acc + (c.tasks?.length || 0), 0) || 0} Tasks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
