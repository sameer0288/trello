import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Layout, LogOut, Users, Settings, Mail, Shield, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('boards');
  const [confirmData, setConfirmData] = useState({ isOpen: false, id: null });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (err) {
      toast.error('Could not load boards');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) {
      toast.error('Please enter a board name first!');
      return;
    }
    setIsCreating(true);
    try {
      const res = await api.post('/boards', { title: newBoardTitle });
      setBoards([...boards, res.data]);
      setNewBoardTitle('');
      toast.success('Board created successfully!');
    } catch (err) {
      toast.error('Failed to create board');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteBoard = async () => {
    const id = confirmData.id;
    try {
      await api.delete(`/boards/${id}`);
      setBoards(boards.filter(b => b.id !== id));
      toast.success('Board deleted');
    } catch (err) {
      toast.error('Failed to delete board');
    }
  };

  return (
    <div style={{ padding: '0', minHeight: '100vh' }}>
      <header className="glass" style={{ padding: '24px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px var(--primary-glow)' }}>
            <Layout size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>{user?.role === 'ADMIN' ? 'Admin Hub' : 'Mini Trello'}</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <nav style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '16px', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('boards')}
              className={`btn ${activeTab === 'boards' ? 'btn-primary' : ''}`}
              style={{ background: activeTab === 'boards' ? 'var(--primary)' : 'transparent', border: 'none' }}
            >
              <Layout size={18} /> Boards
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
              style={{ background: activeTab === 'users' ? 'var(--primary)' : 'transparent', border: 'none' }}
            >
              <Users size={18} /> Members
            </button>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className={`badge-${user?.role?.toLowerCase()}`}>
            {user?.role} Mode
          </div>
          <button className="btn btn-danger" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main style={{ padding: '0 60px 60px' }}>
        <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {activeTab === 'boards' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Your Boards</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>You have access to {boards.length} active workspace{boards.length !== 1 ? 's' : ''}</p>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <form onSubmit={createBoard} style={{ display: 'flex', gap: '12px', width: '400px' }}>
                    <input 
                      type="text" 
                      placeholder="Board Name..." 
                      value={newBoardTitle} 
                      onChange={(e) => setNewBoardTitle(e.target.value)} 
                    />
                    <button className="btn btn-primary" type="submit" disabled={isCreating} style={{ whiteSpace: 'nowrap' }}>
                      <Plus size={20} /> {isCreating ? 'Creating...' : 'Create Board'}
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
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '14px' }}>
                          <Layout size={24} color="white" />
                        </div>
                        {user?.role === 'ADMIN' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setConfirmData({ isOpen: true, id: board.id }); }}
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
            </>
          ) : (
            <div className="animate-fade">
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Member Directory</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Managing {allUsers.length} active system users</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {allUsers.map(u => (
                  <div key={u.id} className="glass" style={{ padding: '24px', borderRadius: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: u.role === 'ADMIN' ? 'var(--primary)' : 'var(--success)', border: '4px solid var(--bg-main)', borderRadius: '50%' }}></div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{u.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
                        <Mail size={14} /> {u.email}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                          <Layout size={12} /> {u._count?.boards || 0} Boards
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.05)', padding: '4px 10px', borderRadius: '8px' }}>
                          <BarChart3 size={12} /> {u._count?.tasks || 0} Tasks
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                      <Shield size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal 
        isOpen={confirmData.isOpen} 
        onClose={() => setConfirmData({ ...confirmData, isOpen: false })}
        onConfirm={deleteBoard}
        title="Delete Board?"
        message="This will permanently remove the board and all columns and tasks inside it. This action cannot be undone."
      />
    </div>
  );
};

export default Dashboard;
