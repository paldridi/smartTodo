import openai

# Set the API key
openai.api_key = "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"


def test_openai():
    try:
        # Using the ChatCompletion API with the gpt-3.5-turbo model
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": "Suggest a quick plan to finish a task efficiently.",
                },
            ],
            max_tokens=50,
            temperature=0.7,
        )
        print("Recommendation:", response["choices"][0]["message"]["content"].strip())
    except Exception as e:
        print("Error:", e)


test_openai()
