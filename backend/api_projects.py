from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')

@projects_bp.route('/', methods=['GET'])
@jwt_required()
def get_projects():
    current_user_id = int(get_jwt_identity())
    projects = Project.query.filter_by(owner_id=current_user_id).all()
    return jsonify([project.to_dict() for project in projects]), 200

@projects_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    name = data.get('name')
    description = data.get('description', '')
    
    if not name or not name.strip():
        return jsonify({'error': 'Project name is required'}), 400
    
    if len(name) > 120:
        return jsonify({'error': 'Project name must be less than 120 characters'}), 400
    
    try:
        project = Project(
            name=name,
            description=description,
            owner_id=current_user_id,
            status='active'
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Project created successfully',
            'project': project.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if project.owner_id != current_user_id:
        return jsonify({'error': 'Insufficient permissions'}), 403
    
    return jsonify(project.to_dict()), 200

@projects_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if project.owner_id != current_user_id:
        return jsonify({'error': 'Insufficient permissions'}), 403
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    if 'name' in data and data['name']:
        if len(data['name']) > 120:
            return jsonify({'error': 'Project name must be less than 120 characters'}), 400
        project.name = data['name']
    
    if 'description' in data:
        project.description = data['description']
    
    if 'status' in data and data['status'] in ['active', 'archived']:
        project.status = data['status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Project updated successfully',
        'project': project.to_dict()
    }), 200

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    if project.owner_id != current_user_id:
        return jsonify({'error': 'Insufficient permissions'}), 403
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message': 'Project deleted successfully'}), 200
