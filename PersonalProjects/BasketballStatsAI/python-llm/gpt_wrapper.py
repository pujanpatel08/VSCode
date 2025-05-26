import os
import openai
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Set API key using env variable name
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_stats_from_gpt(prompt: str) -> dict:
    try:
        # Prepare the chat-based prompt
        messages = [
            {"role": "system", "content": "You are a basketball statistician assistant. Always respond in valid JSON with fields like points, assists, rebounds, steals, blocks, etc."},
            {"role": "user", "content": prompt}
        ]

        # Call the OpenAI Chat API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Or "gpt-4" if available
            messages=messages,
            temperature=0.3
        )

        # Extract the assistant's reply
        reply = response['choices'][0]['message']['content']

        # Convert the reply to a Python dict (assumes GPT responds with JSON)
        parsed = json.loads(reply)

        return parsed

    except json.JSONDecodeError:
        return {"error": "Failed to parse GPT response as JSON."}
    except Exception as e:
        return {"error": str(e)}

# ✅ Test manually when running this file directly
if __name__ == "__main__":
    sample_query = "What were Dennis Schroder's stats in the 2025 playoffs?"
    result = get_stats_from_gpt(sample_query)
    print(result)
