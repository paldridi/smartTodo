# backend/models.py

from config import db
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError

# Collections
buckets_collection = db["buckets"]
todos_collection = db["todos"]
users_collection = db["users"]
settings_collection = db["settings"]

# Ensure an index for unique usernames
users_collection.create_index("username", unique=True)


# Insert new user document with duplicate username handling
def insert_user(name, username, password, email=None):
    password_hash = generate_password_hash(password)  # Hash password for security
    user = {
        "name": name,
        "username": username,
        "password": password_hash,
        "email": email,
    }
    try:
        users_collection.insert_one(user)
        return {
            "message": "User created successfully"
        }, 201  # Explicitly return 201 status for clarity
    except DuplicateKeyError:
        # Log and return an error response if username already exists
        return {
            "error": "Username already exists"
        }, 409  # HTTP status code 409 for conflicts


# Verify user credentials
def verify_user(username, password):
    user = users_collection.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        return user
    return None
