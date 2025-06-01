from flask import Flask, request, jsonify 
from gpt_wrapper import get_stats_from_gpt
from flask_cors import CORS 

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your frontend/backend

# Route to handle POST requests to /query
@app.route('/query', methods=['POST'])
def query_gpt():
    data = request.get_json()  # Get JSON payload from the request
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({"error": "Missing 'prompt' in request"}), 400

    result = get_stats_from_gpt(prompt)  # Call your Groq wrapper
    return jsonify(result)  # Return the result as JSON

# Run the server on port 5001
if __name__ == '__main__':
    app.run(port=5001, debug=True)
