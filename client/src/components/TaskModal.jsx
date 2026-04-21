import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Calendar, User, AlignLeft, Trash2 } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, columnId, task, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        assigneeId: task.assigneeId || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ title: '', description: '', assigneeId: '', dueDate: '' });
    }
    fetchUsers();
  }, [task, isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, formData);
      } else {
        await api.post('/tasks', { ...formData, columnId });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div className="glass animate-fade" style={{
        padding: '0', borderRadius: '24px', width: '600px', maxWidth: '95%',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="btn" style={{ background: 'none', padding: '8px' }}>
            <X size={24} color="var(--text-secondary)" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Task Title
            </label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Design Landing Page"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{ fontSize: '18px', fontWeight: '600' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              <AlignLeft size={16} /> Description
            </label>
            <textarea 
              rows="4"
              placeholder="Add more details about this task..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: '16px', fontSize: '14px', resize: 'none', height: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <User size={16} /> Assignee
              </label>
              <select value={formData.assigneeId} onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                <Calendar size={16} /> Due Date
              </label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
            {task && (
              <button 
                type="button" 
                onClick={handleDelete} 
                className="btn btn-danger"
                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
              >
                <Trash2 size={18} /> Delete Task
              </button>
            )}
            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
