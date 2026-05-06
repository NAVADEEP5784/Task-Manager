from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task, Project, User
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@tasks_bp.route('/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_tasks(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if project.owner_id != current_user_id:
        return jsonify({'error': 'Insufficient permissions'}), 403
    
    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        project_id = data.get('project_id')
        title = data.get('title')
        description = data.get('description', '')
        priority = data.get('priority', 'medium')
        due_date_str = data.get('due_date')
        
        if not project_id or not title:
            return jsonify({'error': 'Missing required fields'}), 400
        
        project = Project.query.get(project_id)
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        if project.owner_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        if priority not in ['low', 'medium', 'high']:
            return jsonify({'error': 'Invalid priority level'}), 400
        
        due_date = None
        if due_date_str:
            try:
                due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
            except:
                return jsonify({'error': 'Invalid date format'}), 400
        
        task = Task(
            title=title,
            description=description,
            project_id=project_id,
            priority=priority,
            due_date=due_date,
            status='pending'
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Task created successfully',
            'task': task.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create task: {str(e)}'}), 500

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    current_user_id = int(get_jwt_identity())
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    project = task.project
    
    if project.owner_id != current_user_id:
        return jsonify({'error': 'Insufficient permissions'}), 403
    
    return jsonify(task.to_dict()), 200

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    try:
        current_user_id = int(get_jwt_identity())
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        project = task.project
        
        if project.owner_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        if 'title' in data and data['title']:
            task.title = data['title']
        
        if 'description' in data:
            task.description = data['description']
        
        if 'status' in data and data['status'] in ['pending', 'in_progress', 'completed']:
            task.status = data['status']
        
        if 'priority' in data and data['priority'] in ['low', 'medium', 'high']:
            task.priority = data['priority']
        
        if 'assigned_to' in data:
            if data['assigned_to']:
                user = User.query.get(data['assigned_to'])
                if not user:
                    return jsonify({'error': 'User not found'}), 404
            task.assigned_to = data['assigned_to']
        
        if 'due_date' in data:
            if data['due_date']:
                try:
                    task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
                except:
                    return jsonify({'error': 'Invalid date format'}), 400
            else:
                task.due_date = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Task updated successfully',
            'task': task.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update task: {str(e)}'}), 500

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    try:
        current_user_id = int(get_jwt_identity())
        task = Task.query.get(task_id)
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        project = task.project
        
        if project.owner_id != current_user_id:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete task: {str(e)}'}), 500
