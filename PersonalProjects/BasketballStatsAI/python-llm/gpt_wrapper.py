import os
from dotenv import load_dotenv
from groq import Groq
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_stats_from_gpt(prompt: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",  # Groq supports LLaMA 3
            messages=[
                {"role": "system", "content": "You are a basketball statistician assistant. "
                "Always respond in valid JSON with fields like points, assists, rebounds, steals, blocks, etc."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        reply = response.choices[0].message.content
        parsed = json.loads(reply)
        return parsed

    except json.JSONDecodeError:
        return {"error": "Failed to parse JSON"}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    prompt = "What were Dennis Schroder's stats in the 2025 playoffs?"
    print(get_stats_from_gpt(prompt))
