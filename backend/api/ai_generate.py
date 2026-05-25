from flask import Blueprint, request, jsonify

ai_generate = Blueprint("ai_generate", __name__)

@ai_generate.route("/ai/generate", methods=["POST"])
def generate():

    data = request.get_json()
    prompt = data.get("prompt", "")

    nodes = []

    if "login" in prompt.lower():

        nodes = [
            {"type":"text","text":"Email","x":100,"y":100},
            {"type":"text","text":"Password","x":100,"y":200},
            {"type":"rect","text":"Login Button","x":100,"y":300}
        ]

    elif "dashboard" in prompt.lower():

        nodes = [
            {"type":"rect","text":"Sidebar","x":50,"y":50},
            {"type":"rect","text":"Chart","x":250,"y":100}
        ]

    else:

        nodes = [
            {"type":"text","text":"AI Node","x":100,"y":100}
        ]

    return jsonify({
        "status":"ok",
        "nodes":nodes
    })
