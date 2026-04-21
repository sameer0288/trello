import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import Column from '../components/Column';
import TaskCard from '../components/TaskCard';
import { ArrowLeft, Loader2, Filter, User as UserIcon, Search } from 'lucide-react';
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
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px', width: '240px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px' }}>
              <button 
                className={`btn ${filterUser === 'all' ? 'btn-primary' : ''}`}
                onClick={() => setFilterUser('all')}
                style={{ padding: '8px 16px' }}
              >
                All
              </button>
              <button 
                className={`btn ${filterUser === user.id ? 'btn-primary' : ''}`}
                onClick={() => setFilterUser(user.id)}
                style={{ padding: '8px 16px' }}
              >
                My Tasks
              </button>
              
              {user.role === 'ADMIN' && (
                <div style={{ marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <select 
                    value={filterUser} 
                    onChange={(e) => setFilterUser(e.target.value)}
                    style={{ 
                      width: '160px', 
                      background: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid var(--primary)', 
                      fontSize: '14px',
                      color: 'white'
                    }}
                  >
                    <option value="all">Filter by Member...</option>
                    {users.map(u => <option key={u.id} value={u.id} style={{ background: '#1e293b' }}>{u.name}</option>)}
                  </select>
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
