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
        borderRadius: '24px',
        width: '320px',
        minWidth: '320px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 160px)',
        border: '1px solid var(--glass-border)',
        transition: 'all 0.3s ease',
      }}
    >
      <style>{`
        .column-over {
          border-color: var(--primary);
          background: rgba(15, 23, 42, 0.6) !important;
          transform: translateY(-4px);
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
          padding-right: 8px;
          margin-right: -8px;
        }
        .task-list::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
      
      <div className="column-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {column.title}
          </h3>
          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
            {tasks.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onAddTask(column.id)}
            className="btn"
            style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
          >
            <Plus size={18} color="var(--text-primary)" />
          </button>
        </div>
      </div>
      
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onEditTask} />
        ))}
        {tasks.length === 0 && (
          <div style={{ border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
