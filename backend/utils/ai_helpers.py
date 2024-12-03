import openai
from config import Config
import logging

# Set up OpenAI API key
openai.api_key = Config.OPENAI_KEY
logging.basicConfig(level=logging.DEBUG)


def generate_task_recommendation(title, description, deadline, status):
    prompt = f"""
    Task title: {title}
    Task description: {description}
    Deadline: {deadline}
    Status: {"Completed" if status else "Pending"}
    
    Provide a brief, actionable plan to complete this task efficiently, broken down into 2-4 concise steps.
    Make sure the response is specific to the given task details, considering the deadline and current status.
    """

    try:
        logging.info("Sending request to OpenAI API for recommendation.")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides concise, actionable steps.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=200,  # Limited to 100 tokens for brevity
            temperature=0.5,  # Lower temperature for deterministic responses
        )
        recommendation = response.choices[0].message.content.strip()
        logging.info(f"Recommendation received: {recommendation}")
        return recommendation
    except Exception as e:
        logging.error(f"Error generating task recommendation: {e}")
        return "Unable to generate recommendation at this time."
