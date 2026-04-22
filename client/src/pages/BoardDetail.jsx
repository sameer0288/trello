import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import Column from '../components/Column';
import TaskCard from '../components/TaskCard';
import { ArrowLeft, Loader2, Filter, User as UserIcon, Search, Users, Layers, ChevronDown } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [board, setBoard] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [boardRes, usersRes] = await Promise.all([
        api.get('/boards'),
        api.get('/users')
      ]);
      const currentBoard = boardRes.data.find(b => b.id === id);
      setBoard(currentBoard);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = board.columns.flatMap(c => c.tasks).find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    let sourceColumn, targetColumn;
    board.columns.forEach(col => {
      if (col.tasks.find(t => t.id === taskId)) sourceColumn = col;
      if (col.id === overId) targetColumn = col;
      if (col.tasks.find(t => t.id === overId)) targetColumn = col;
    });

    if (targetColumn && sourceColumn.id !== targetColumn.id) {
      try {
        const newColumns = board.columns.map(col => {
          if (col.id === sourceColumn.id) {
            return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
          }
          if (col.id === targetColumn.id) {
            const movingTask = sourceColumn.tasks.find(t => t.id === taskId);
            return { ...col, tasks: [...col.tasks, { ...movingTask, columnId: targetColumn.id }] };
          }
          return col;
        });
        setBoard({ ...board, columns: newColumns });
        await api.put(`/tasks/${taskId}`, { columnId: targetColumn.id });
      } catch (err) {
        console.error(err);
        fetchData();
      }
    }
  };

  const filteredColumns = board?.columns.map(col => ({
    ...col,
    tasks: col.tasks.filter(t => {
      const matchesUser = filterUser === 'all' || t.assigneeId === filterUser;
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesUser && matchesSearch;
    })
  }));

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass" style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => navigate('/')} className="btn btn-danger" style={{ padding: '10px', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{board?.title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {board?.columns.reduce((acc, c) => acc + c.tasks.length, 0)} total tasks
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)', transition: 'color 0.3s ease' }} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingLeft: '44px', 
                  width: '260px', 
                  fontSize: '14px', 
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  height: '46px',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                onFocus={(e) => {
                  e.target.style.width = '320px';
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = 'rgba(30, 41, 59, 0.6)';
                  e.target.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.width = '260px';
                  e.target.style.borderColor = 'var(--glass-border)';
                  e.target.style.background = 'rgba(30, 41, 59, 0.4)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2px', 
              background: '#1a1f2e', 
              padding: '8px 12px', 
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', gap: '8px', paddingRight: '12px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  onClick={() => setFilterUser('all')}
                  style={{ 
                    padding: '10px 24px',
                    borderRadius: '16px',
                    background: filterUser === 'all' ? '#6366f1' : 'transparent',
                    color: filterUser === 'all' ? 'white' : '#94a3b8',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: filterUser === 'all' ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterUser(user.id)}
                  style={{ 
                    padding: '10px 24px',
                    borderRadius: '16px',
                    background: filterUser === user.id ? '#6366f1' : '#f1f5f9',
                    color: filterUser === user.id ? 'white' : '#0f172a',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: filterUser === user.id ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  My Tasks
                </button>
              </div>
              
              {user.role === 'ADMIN' && (
                <div style={{ paddingLeft: '12px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select 
                    value={filterUser} 
                    onChange={(e) => setFilterUser(e.target.value)}
                    style={{ 
                      width: '200px', 
                      background: 'transparent', 
                      border: '1px solid #4f46e5', 
                      fontSize: '16px',
                      color: 'white',
                      padding: '10px 40px 10px 20px',
                      borderRadius: '18px',
                      appearance: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <option value="all" style={{ background: '#1a1f2e' }}>Filter by Member...</option>
                    {users.map(u => <option key={u.id} value={u.id} style={{ background: '#1a1f2e' }}>{u.name}</option>)}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', right: '15px', color: 'white', pointerEvents: 'none' }} />
                </div>
              )}
            </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '32px 40px', overflowX: 'auto', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {filteredColumns?.map(column => (
            <Column 
              key={column.id} 
              column={column} 
              tasks={column.tasks} 
              onAddTask={(colId) => { setTargetColumnId(colId); setEditingTask(null); setIsModalOpen(true); }}
              onEditTask={(task) => { setEditingTask(task); setIsModalOpen(true); }}
            />
          ))}
          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: { opacity: '0.5' },
              },
            }),
          }}>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          columnId={targetColumnId} 
          task={editingTask} 
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default BoardDetail;
