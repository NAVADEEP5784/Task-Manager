import React, { useState } from 'react';
import { projectsAPI } from '../api';

export const ProjectList = ({ projects, onProjectsChange }) => {
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const handleEditSubmit = async (e, projectId) => {
    e.preventDefault();

    if (!editName.trim()) {
      alert('Project name is required');
      return;
    }

    try {
      setSaving(true);
      await projectsAPI.updateProject(projectId, {
        name: editName,
        description: editDescription,
      });
      cancelEdit();
      onProjectsChange();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setDeleting(projectId);
        await projectsAPI.deleteProject(projectId);
        onProjectsChange();
      } catch (err) {
        alert('Failed to delete project');
      } finally {
        setDeleting(null);
      }
    }
  };

  if (projects.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No projects yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {projects.map((project) => {
        const isEditing = editingId === project.id;

        return (
          <div key={project.id} className="card" style={styles.card}>
            {isEditing ? (
              <form onSubmit={(e) => handleEditSubmit(e, project.id)}>
                <div className="form-group">
                  <label htmlFor={`project-name-${project.id}`}>Project Name</label>
                  <input
                    id={`project-name-${project.id}`}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`project-desc-${project.id}`}>Description</label>
                  <textarea
                    id={`project-desc-${project.id}`}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows="3"
                  />
                </div>
                <div style={styles.actions}>
                  <button
                    type="submit"
                    className="btn-primary btn-small"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-small"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div style={styles.cardHeader}>
                  <h3 style={styles.projectName}>{project.name}</h3>
                  <span style={styles.status}>
                    {project.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </div>

                {project.description && (
                  <p style={styles.description}>{project.description}</p>
                )}

                <div style={styles.meta}>
                  <span>{project.task_count} tasks</span>
                  <span style={styles.date}>
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.actions}>
                  <button
                    type="button"
                    className="btn-secondary btn-small"
                    onClick={() => startEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                  >
                    {deleting === project.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '12px',
    gap: '12px',
  },
  projectName: {
    margin: '0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    overflowWrap: 'anywhere',
  },
  status: {
    background: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  description: {
    color: '#6b7280',
    fontSize: '14px',
    margin: '8px 0',
    minHeight: '40px',
    overflowWrap: 'anywhere',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '12px',
    gap: '16px',
  },
  date: {
    marginLeft: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '8px',
    color: '#6b7280',
  },
};
