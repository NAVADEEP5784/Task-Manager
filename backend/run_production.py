#!/usr/bin/env python
"""
Production server runner using Waitress WSGI server.
This script runs the Flask application in production mode with Waitress.
"""

import os
import sys

# Set production environment
os.environ['FLASK_ENV'] = 'production'

from app import app
from waitress import serve

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    threads = int(os.environ.get('THREADS', 4))
    
    print(f'Starting production server on 0.0.0.0:{port}')
    print(f'Using {threads} worker threads')
    print(f'Press CTRL+C to stop the server')
    print(f'Server is accessible at http://localhost:{port}')
    
    try:
        serve(
            app, 
            host='0.0.0.0', 
            port=port, 
            threads=threads,
            _quiet=False
        )
    except KeyboardInterrupt:
        print('\nServer stopped')
        sys.exit(0)
