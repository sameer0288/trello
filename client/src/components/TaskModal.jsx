import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Calendar, User, AlignLeft, Trash2, Clock, CheckCircle, List } from 'lucide-react';
import toast from 'react-hot-toast';

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
      // Silent error for users load
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, formData);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', { ...formData, columnId });
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
    if (!window.confirm('Permanently delete this task?')) return;
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
              rows="5"
              placeholder="Add more context or details..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: '20px', fontSize: '15px', resize: 'none', background: 'rgba(0,0,0,0.2)', height: '140px', lineHeight: '1.6' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <User size={16} color="var(--text-secondary)" />
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>ASSIGNEE</label>
              </div>
              <select 
                value={formData.assigneeId} 
                onChange={(e) => setFormData({...formData, assigneeId: e.target.value})}
                style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}
              >
                <option value="">No one assigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
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
                style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid var(--glass-border)' }}>
            {task ? (
              <button 
                type="button" 
                onClick={handleDelete} 
                className="btn btn-danger"
                style={{ padding: '12px 24px' }}
              >
                <Trash2 size={18} /> Delete
              </button>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <Clock size={16} /> Ready to publish
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
    </div>
  );
};

export default TaskModal;
