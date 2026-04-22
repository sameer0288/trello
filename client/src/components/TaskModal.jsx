import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Calendar, User as UserIcon, AlignLeft, Trash2, Clock, CheckCircle, List, ChevronDown, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ isOpen, onClose, columnId, task, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ 
        title: '', 
        description: '', 
        assigneeId: isAdmin ? '' : user?.id, 
        dueDate: '' 
      });
    }
    fetchUsers();
  }, [task, isOpen, user, isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      // Slient
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submissionData = {
      ...formData,
      assigneeId: isAdmin ? formData.assigneeId : user?.id
    };

    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, submissionData);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', { ...submissionData, columnId });
        toast.success('Task created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Could not save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Task deleted');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className="glass animate-fade" style={{
        padding: '0', borderRadius: '32px', width: '640px', maxWidth: '95%',
        position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Style tag for custom select styling */}
        <style>{`
          .custom-select {
            appearance: none;
            cursor: pointer;
          }
          .custom-select option {
            background-color: #0f172a !important;
            color: white !important;
            padding: 12px;
          }
          .readonly-assignee {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--glass-border);
            padding: 12px 16px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-primary);
            font-weight: 500;
          }
        `}</style>

        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <List size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{task ? 'Edit Task' : 'New Task'}</h2>
              {task && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>ID: {task.id.slice(0,8)}</p>}
            </div>
          </div>
          <button onClick={onClose} className="btn" style={{ background: 'none', padding: '8px', opacity: 0.6 }}>
            <X size={24} color="var(--text-primary)" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
          <div style={{ marginBottom: '32px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={16} color="var(--primary)" />
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>TASK TITLE</label>
             </div>
            <input 
              type="text" 
              required 
              placeholder="What needs to be done?"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ fontSize: '20px', fontWeight: '600', padding: '16px', background: 'rgba(0,0,0,0.2)' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <AlignLeft size={16} color="var(--text-secondary)" />
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>DESCRIPTION</label>
             </div>
            <textarea 
              rows="4"
              placeholder="Add more context or details..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: '20px', fontSize: '15px', resize: 'none', background: 'rgba(0,0,0,0.2)', height: '120px', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <UserIcon size={16} color="var(--text-secondary)" />
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>ASSIGNEE</label>
              </div>
              
              {isAdmin ? (
                <div style={{ position: 'relative' }}>
                  <select 
                    className="custom-select"
                    value={formData.assigneeId} 
                    onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}
                    style={{ background: 'rgba(15, 23, 42, 0.8)', borderRadius: '14px', paddingRight: '40px' }}
                  >
                    <option value="">No one assigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} {u.id === user?.id ? '(Me)' : ''}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                </div>
              ) : (
                <div className="readonly-assignee">
                  <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name} (Auto-assigned)</span>
                  <ShieldCheck size={14} style={{ marginLeft: 'auto', color: 'var(--primary)', opacity: 0.8 }} />
                </div>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Calendar size={16} color="var(--text-secondary)" />
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>DUE DATE</label>
              </div>
              <input 
                type="date" 
                value={formData.dueDate} 
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})} 
                style={{ background: 'rgba(15, 23, 42, 0.8)', borderRadius: '14px', colorScheme: 'dark' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid var(--glass-border)' }}>
            {task ? (
              <button 
                type="button" 
                onClick={() => setIsConfirmOpen(true)} 
                className="btn btn-danger"
                style={{ padding: '12px 24px' }}
              >
                <Trash2 size={18} /> Delete
              </button>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <Clock size={16} /> Created by you
                </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="btn" 
                style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 32px', minWidth: '160px' }}>
                {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task?"
        message="This will permanently remove this task. You cannot undo this action."
      />
    </div>
  );
};

export default TaskModal;
