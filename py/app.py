from flask import Flask, request, jsonify
from flask_cors import CORS
from services.chatService import get_bot_response
from services.documentationService import run_documentation_generator

app = Flask(__name__)
# CORS(app, resources={r"/chat": {"origins": "http://localhost:4200"}})
CORS(app)
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "Missing 'question' in request body"}), 400

    response = get_bot_response(question)
    return jsonify({"response": response})

if __name__ == '__main__':

    paths_to_scan = [
        "G:/project/Stage4to5/application/FrontEnd/src/app/components",
        "G:/project/Stage4to5/application/FrontEnd/src/app/services",
        "G:/project/Stage4to5/application/FrontEnd/src/app/app-routing.module.ts"
    ]

    run_documentation_generator(paths_to_scan)
    app.run(debug=True, port=5000)
