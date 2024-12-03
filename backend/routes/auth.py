# backend/routes/auth.py

from flask import Blueprint, request, jsonify
from models import insert_user, verify_user
from flask_jwt_extended import create_access_token
import logging

auth_blueprint = Blueprint("auth", __name__)
logging.basicConfig(level=logging.INFO)


@auth_blueprint.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    username = data.get("username")
    password = data.get("password")
    email = data.get("email", None)

    if not name or not username or not password:
        return jsonify({"error": "Missing required fields"}), 400

    response, status_code = insert_user(name, username, password, email)

    # Return the response with the appropriate status code
    return jsonify(response), status_code


@auth_blueprint.route("/signin", methods=["POST"])
def signin():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = verify_user(username, password)
    if user:
        token = create_access_token(identity=str(user["_id"]))
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
