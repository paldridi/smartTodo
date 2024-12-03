from flask import Blueprint, request, jsonify, session, redirect, url_for
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from utils.calendar_sync import fetch_google_calendar_events
import os

calendar_blueprint = Blueprint("calendar", __name__)

CLIENT_ID = "320666409561-c0ogashgcu93pbkbcim9ihvld906pa78.apps.googleusercontent.com"
API_KEY = "AIzaSyBceYASUaLzsfbr1xkDS-4l0dFkx4G6oPU"
SCOPES = [
    "https://www.googleapis.com/auth/tasks",
    "https://www.googleapis.com/auth/calendar",
]


# Login route for Google OAuth
@calendar_blueprint.route("/login")
def login():
    flow = Flow.from_client_secrets_file(
        os.getenv("GOOGLE_CREDENTIALS_FILE"),
        scopes=SCOPES,
        redirect_uri=url_for("calendar.callback", _external=True),
    )
    auth_url, _ = flow.authorization_url(prompt="consent")
    return redirect(auth_url)


# Callback route
@calendar_blueprint.route("/callback")
def callback():
    flow = Flow.from_client_secrets_file(
        os.getenv("GOOGLE_CREDENTIALS_FILE"),
        scopes=SCOPES,
        redirect_uri=url_for("calendar.callback", _external=True),
    )
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials
    session["credentials"] = credentials_to_dict(credentials)
    return redirect(url_for("calendar.get_events"))


# Fetch events from Google Calendar
@calendar_blueprint.route("/events", methods=["GET"])
def get_events():
    if "credentials" not in session:
        return redirect(url_for("calendar.login"))
    credentials = Credentials(**session["credentials"])
    events = fetch_google_calendar_events(credentials)
    return jsonify(events)


def credentials_to_dict(credentials):
    return {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }
