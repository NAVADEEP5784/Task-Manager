import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { projectsAPI, tasksAPI } from '../api';
import { ProjectList } from '../components/ProjectList';
import { TasksOverview } from '../components/TasksOverview';

export const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectsAPI.getProjects();
      setProjects(response.data);
      setNewTaskProjectId((currentProjectId) => {
        if (response.data.some((project) => String(project.id) === String(currentProjectId))) {
          return currentProjectId;
        }

        return response.data[0]?.id || '';
      });

      let allTasks = [];
      for (const project of response.data) {
        try {
          const tasksResponse = await tasksAPI.getProjectTasks(project.id);
          allTasks = [...allTasks, ...tasksResponse.data];
        } catch (err) {
          console.error(`Failed to load tasks for project ${project.id}`);
        }
      }
      setTasks(allTasks);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await projectsAPI.createProject(newProjectName, newProjectDesc);
      setNewProjectName('');
      setNewProjectDesc('');
      setShowNewProject(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTaskProjectId) {
      setError('Create a project before adding tasks');
      return;
    }

    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await tasksAPI.createTask(
        Number(newTaskProjectId),
        newTaskTitle,
        newTaskDesc,
        newTaskPriority,
        newTaskDueDate || null
      );

      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      setShowNewTask(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Task Manager</h1>
          <div style={styles.userMenu}>
            <span style={styles.userName}>Welcome, {user?.username}</span>
            <button className="btn-secondary" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div style={styles.statsGrid}>
          <div className="card" style={styles.statCard}>
            <h3 style={styles.statValue}>{projects.length}</h3>
            <p style={styles.statLabel}>Active Projects</p>
          </div>
          <div className="card" style={styles.statCard}>
            <h3 style={styles.statValue}>{tasks.length}</h3>
            <p style={styles.statLabel}>Total Tasks</p>
          </div>
          <div className="card" style={styles.statCard}>
            <h3 style={styles.statValue}>{completedTasksCount}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div className="card" style={styles.statCard}>
            <h3 style={styles.statValue}>{pendingTasksCount}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>Projects</h2>
            <button
              className="btn-primary"
              onClick={() => setShowNewProject(!showNewProject)}
            >
              {showNewProject ? 'Cancel' : '+ New Project'}
            </button>
          </div>

          {showNewProject && (
            <form onSubmit={handleCreateProject} style={styles.newProjectForm}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Project description (optional)"
                  rows="3"
                />
              </div>
              <button type="submit" className="btn-primary">
                Create Project
              </button>
            </form>
          )}

          <ProjectList
            projects={projects}
            onProjectsChange={loadProjects}
          />
        </div>

        <div style={styles.section}>
          <h2>Tasks Overview</h2>
          <div style={styles.taskHeader}>
            <button
              className="btn-primary"
              onClick={() => setShowNewTask(!showNewTask)}
              disabled={projects.length === 0}
            >
              {showNewTask ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {showNewTask && (
            <form onSubmit={handleCreateTask} style={styles.newTaskForm}>
              <div style={styles.taskFormGrid}>
                <div className="form-group">
                  <label htmlFor="taskProject">Project</label>
                  <select
                    id="taskProject"
                    value={newTaskProjectId}
                    onChange={(e) => setNewTaskProjectId(e.target.value)}
                    required
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taskTitle">Task Title</label>
                  <input
                    id="taskTitle"
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="taskPriority">Priority</label>
                  <select
                    id="taskPriority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taskDueDate">Due Date</label>
                  <input
                    id="taskDueDate"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Task description (optional)"
                  rows="3"
                />
              </div>
              <button type="submit" className="btn-primary">
                Create Task
              </button>
            </form>
          )}

          <TasksOverview
            tasks={tasks}
            projects={projects}
            onTasksChange={loadProjects}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f9fafb',
  },
  header: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: 'white',
    padding: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#3b82f6',
    margin: '0 0 8px 0',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '14px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  newProjectForm: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
  },
  newTaskForm: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  taskFormGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
};
