import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Calendar, User, Clock } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card animate-fade"
      onClick={() => onClick(task)}
    >
      <style>{`
        .task-card {
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: grab;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }
        .task-card:hover {
          border-color: var(--primary);
          background: rgba(30, 41, 59, 0.6);
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .task-card:active {
          cursor: grabbing;
        }
      `}</style>
      
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>
          {task.title}
        </h4>
        {task.description && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent)', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
            <Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        
        {task.assignee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            <span style={{ width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>
              {task.assignee.name?.charAt(0).toUpperCase()}
            </span>
            {task.assignee.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
