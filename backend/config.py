# backend/config.py

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/smartdoer")
    OPENAI_KEY = os.getenv("OPENAI_KEY")
    GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "")


# Initialize MongoDB client using Config
client = MongoClient(Config.MONGO_URI)
db = client.smartdoer
