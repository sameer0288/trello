import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';

const Column = ({ column, tasks, onAddTask, onEditTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`column-container ${isOver ? 'column-over' : ''}`}
      style={{
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '28px',
        width: '320px',
        minWidth: '320px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 160px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 4px 24px -2px rgba(0, 0, 0, 0.2)'
      }}
    >
      <style>{`
        .column-over {
          border-color: var(--primary) !important;
          background: rgba(99, 102, 241, 0.05) !important;
          transform: translateY(-8px);
          box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.4);
        }
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .task-list {
          overflow-y: auto;
          flex: 1;
          padding-right: 10px;
          margin-right: -10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .task-list::-webkit-scrollbar {
          width: 5px;
        }
        .add-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .add-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          transform: scale(1.1) rotate(90deg);
          box-shadow: 0 0 15px var(--primary-glow);
        }
      `}</style>
      
      <div className="column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '8px', 
            height: '24px', 
            background: column.title.toUpperCase().includes('DONE') ? 'var(--success)' : 
                       column.title.toUpperCase().includes('PROGRESS') ? 'var(--primary)' : 'var(--text-secondary)',
            borderRadius: '4px'
          }}></div>
          <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'white' }}>
            {column.title}
          </h3>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: '700',
            background: 'rgba(255,255,255,0.08)', 
            padding: '2px 10px', 
            borderRadius: '20px', 
            color: 'var(--text-secondary)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask(column.id)}
          className="add-btn"
          title="Add Task"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onEditTask} />
        ))}
        {tasks.length === 0 && (
          <div style={{ 
            border: '2px dashed rgba(255,255,255,0.05)', 
            borderRadius: '20px', 
            padding: '40px 20px', 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{ opacity: 0.5 }}>No tasks here</div>
            <button 
              onClick={() => onAddTask(column.id)}
              style={{ 
                background: 'transparent', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'var(--text-secondary)',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              + Create First
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
