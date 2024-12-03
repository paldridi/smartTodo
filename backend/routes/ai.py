from flask import Blueprint, request, jsonify
from utils.ai_helpers import generate_task_recommendation

ai_blueprint = Blueprint("ai", __name__)


@ai_blueprint.route("/recommendation", methods=["POST"])
def get_task_recommendation():
    data = request.json
    title = data.get("title")
    description = data.get("description")
    deadline = data.get("deadline")
    status = data.get("status", False)

    if not title or not description or not deadline:
        return jsonify({"error": "Missing required fields"}), 400

    recommendation = generate_task_recommendation(title, description, deadline, status)
    return jsonify({"recommendation": recommendation}), 200
