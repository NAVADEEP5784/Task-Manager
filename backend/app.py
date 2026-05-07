import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from auth import auth_bp
from api_users import users_bp
from api_projects import projects_bp
from api_tasks import tasks_bp

frontend_build = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'))

app = Flask(__name__, static_folder=frontend_build, static_url_path='')
app.config.from_object(Config)
app.url_map.strict_slashes = False

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(users_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(tasks_bp)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Endpoint not found'}), 404

    if app.static_folder is None:
        return jsonify({'message': 'Build the frontend first with npm run build'}), 200

    file_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')

    return jsonify({'message': 'Build the frontend first with npm run build'}), 200

@app.errorhandler(404)
def not_found(error):
    if getattr(error, 'description', '') == 'Endpoint not found':
        return jsonify({'error': 'Endpoint not found'}), 404

    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV', 'production') == 'development'
    
    if debug:
        # Development mode with Flask development server
        app.run(debug=True, host='0.0.0.0', port=port)
    else:
        # Production mode with Gunicorn (handled by Procfile/Railway/Render)
        print(f'Starting production server on port {port}...')
