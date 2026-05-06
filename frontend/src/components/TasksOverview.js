import React, { useState } from 'react';
import { tasksAPI } from '../api';

export const TasksOverview = ({ tasks, projects, onTasksChange }) => {
  const [deleting, setDeleting] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateTask(taskId, { status: newStatus });
      onTasksChange();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        setDeleting(taskId);
        await tasksAPI.deleteTask(taskId);
        onTasksChange();
      } catch (err) {
        alert('Failed to delete task');
      } finally {
        setDeleting(null);
      }
    }
  };

  const getProjectName = (projectId) => {
    return projects.find((project) => project.id === projectId)?.name || 'Unknown Project';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (tasks.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No tasks yet. Use New Task to add one.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table className="table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <strong>{task.title}</strong>
                {task.description && (
                  <div style={styles.description}>{task.description}</div>
                )}
              </td>
              <td>{getProjectName(task.project_id)}</td>
              <td>
                <span
                  style={{
                    color: getPriorityColor(task.priority),
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {task.priority}
                </span>
              </td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  style={styles.statusSelect}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td>
                {task.due_date ? (
                  new Date(task.due_date).toLocaleDateString()
                ) : (
                  <span style={{ color: '#9ca3af' }}>-</span>
                )}
              </td>
              <td>
                <button
                  type="button"
                  className="btn-danger btn-small"
                  onClick={() => handleDelete(task.id)}
                  disabled={deleting === task.id}
                >
                  {deleting === task.id ? '...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '8px',
    overflowX: 'auto',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '8px',
    color: '#6b7280',
  },
  description: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  statusSelect: {
    padding: '6px 8px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
  },
};
