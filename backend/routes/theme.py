# backend/routes/theme.py

from flask import Blueprint, request, jsonify
from models import settings_collection
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

theme_blueprint = Blueprint("theme", __name__)
logging.basicConfig(level=logging.INFO)


@theme_blueprint.route("/theme", methods=["GET"])
@jwt_required()
def get_theme():
    user_id = get_jwt_identity()
    theme_setting = settings_collection.find_one({"user_id": user_id, "name": "theme"})
    if theme_setting:
        return jsonify({"name": "theme", "value": theme_setting["value"]}), 200
    else:
        return jsonify({"name": "theme", "value": "light"}), 200


@theme_blueprint.route("/theme", methods=["POST"])
@jwt_required()
def set_theme():
    user_id = get_jwt_identity()
    data = request.json
    theme_value = data.get("value")
    if theme_value not in ["light", "dark"]:
        return jsonify({"error": "Invalid theme value"}), 400

    settings_collection.update_one(
        {"user_id": user_id, "name": "theme"},
        {"$set": {"value": theme_value}},
        upsert=True,
    )
    return jsonify({"message": "Theme updated successfully"}), 200
