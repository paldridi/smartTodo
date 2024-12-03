# backend/app.py

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.tasks import tasks_blueprint
from routes.calendar import calendar_blueprint
from routes.ai import ai_blueprint
from routes.theme import theme_blueprint
from routes.auth import auth_blueprint
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-secret-key")

CORS(app, resources={r"/api/*": {"origins": "*"}})
JWTManager(app)

# Register blueprints
app.register_blueprint(auth_blueprint, url_prefix="/api/auth")
app.register_blueprint(tasks_blueprint, url_prefix="/api/tasks")
app.register_blueprint(calendar_blueprint, url_prefix="/api/calendar")
app.register_blueprint(ai_blueprint, url_prefix="/api/ai")
app.register_blueprint(theme_blueprint, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
