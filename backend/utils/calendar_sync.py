from googleapiclient.discovery import build
from models import todos_collection


def fetch_google_calendar_events(credentials):
    service = build("calendar", "v3", credentials=credentials)
    events_result = (
        service.events()
        .list(
            calendarId="primary",
            timeMin="2024-01-01T00:00:00Z",
            maxResults=20,
            singleEvents=True,
            orderBy="startTime",
        )
        .execute()
    )
    events = events_result.get("items", [])

    # Convert events to our format and merge with todos
    events_data = [
        {"title": event["summary"], "date": event["start"]["dateTime"]}
        for event in events
    ]
    todos = list(todos_collection.find())
    return {"google_events": events_data, "todos": todos}
