"""WSGI entry point for cloud deployment (Render, Heroku, Railway)"""
from app import app

if __name__ == "__main__":
    app.run()
