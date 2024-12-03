# backend/routes/tasks.py

from flask import Blueprint, request, jsonify
from models import todos_collection, buckets_collection
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

tasks_blueprint = Blueprint("tasks", __name__)
logging.basicConfig(level=logging.INFO)


def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    doc["_id"] = str(doc["_id"])
    return doc


# Route to get all tasks across all buckets for the authenticated user
@tasks_blueprint.route("", methods=["GET"])
@jwt_required()
def get_all_tasks():
    user_id = get_jwt_identity()
    tasks = [
        serialize_doc(task) for task in todos_collection.find({"user_id": user_id})
    ]
    return jsonify(tasks), 200


# Route to get all buckets for the authenticated user
@tasks_blueprint.route("/buckets", methods=["GET"])
@jwt_required()
def get_buckets():
    user_id = get_jwt_identity()
    buckets = [
        serialize_doc(bucket)
        for bucket in buckets_collection.find({"user_id": user_id})
    ]
    return jsonify(buckets), 200


# Route to create a new bucket for the authenticated user
@tasks_blueprint.route("/buckets", methods=["POST"])
@jwt_required()
def create_bucket():
    user_id = get_jwt_identity()
    data = request.json
    data["user_id"] = user_id  # Associate bucket with the logged-in user
    result = buckets_collection.insert_one(data)
    return (
        jsonify(
            {"message": "Bucket created successfully", "id": str(result.inserted_id)}
        ),
        201,
    )


# Route to update a specific bucket for the authenticated user
@tasks_blueprint.route("/buckets/<bucket_id>", methods=["PATCH"])
@jwt_required()
def update_bucket(bucket_id):
    user_id = get_jwt_identity()
    data = request.json
    result = buckets_collection.update_one(
        {"_id": ObjectId(bucket_id), "user_id": user_id}, {"$set": data}
    )
    if result.matched_count:
        return jsonify({"message": "Bucket updated successfully"}), 200
    return jsonify({"error": "Bucket not found"}), 404


# Route to delete a specific bucket and associated tasks for the authenticated user
@tasks_blueprint.route("/buckets/<bucket_id>", methods=["DELETE"])
@jwt_required()
def delete_bucket(bucket_id):
    user_id = get_jwt_identity()
    todos_collection.delete_many(
        {"bucket_id": bucket_id, "user_id": user_id}
    )  # Delete associated tasks
    result = buckets_collection.delete_one(
        {"_id": ObjectId(bucket_id), "user_id": user_id}
    )  # Delete the bucket

    if result.deleted_count > 0:
        return (
            jsonify({"message": "Bucket and associated tasks deleted successfully"}),
            200,
        )
    return jsonify({"error": "Bucket not found"}), 404


# Route to get all tasks for a specific bucket for the authenticated user
@tasks_blueprint.route("/<bucket_id>/tasks", methods=["GET"])
@jwt_required()
def get_tasks_by_bucket(bucket_id):
    user_id = get_jwt_identity()
    tasks = [
        serialize_doc(task)
        for task in todos_collection.find({"bucket_id": bucket_id, "user_id": user_id})
    ]
    return jsonify(tasks), 200


# Route to create a new task for the authenticated user
@tasks_blueprint.route("/todos", methods=["POST"])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.json
    data["user_id"] = user_id  # Associate task with the logged-in user
    result = todos_collection.insert_one(data)
    task = todos_collection.find_one({"_id": result.inserted_id})
    return jsonify(serialize_doc(task)), 201


# Route to update a specific task for the authenticated user
@tasks_blueprint.route("/todos/<task_id>", methods=["PATCH"])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid data format. Expected JSON object."}), 400

    result = todos_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id}, {"$set": data}
    )
    if result.matched_count:
        updated_task = todos_collection.find_one({"_id": ObjectId(task_id)})
        return jsonify(serialize_doc(updated_task)), 200
    return jsonify({"error": "Task not found"}), 404


# Route to delete a specific task for the authenticated user
@tasks_blueprint.route("/todos/<task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    result = todos_collection.delete_one({"_id": ObjectId(task_id), "user_id": user_id})
    if result.deleted_count > 0:
        return jsonify({"message": "Task deleted successfully"}), 200
    return jsonify({"error": "Task not found"}), 404


# Route to reorder buckets for the authenticated user
@tasks_blueprint.route("/buckets/reorder", methods=["PATCH"])
@jwt_required()
def reorder_buckets():
    user_id = get_jwt_identity()
    data = request.json
    bucket_order = data.get("bucketOrder")

    if not bucket_order:
        return jsonify({"error": "No bucketOrder provided"}), 400

    try:
        # Update each bucket's order in the database
        for index, bucket_id in enumerate(bucket_order):
            buckets_collection.update_one(
                {"_id": ObjectId(bucket_id), "user_id": user_id},
                {"$set": {"order": index}},
            )

        return jsonify({"message": "Bucket order updated successfully"}), 200
    except Exception as e:
        logging.error(f"Error updating bucket order: {e}")
        return jsonify({"error": "Failed to update bucket order"}), 500
