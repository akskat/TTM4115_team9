from flask import Flask
from app import create_app
from flask_cors import cross_origin

app = create_app()


@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(debug=True)
