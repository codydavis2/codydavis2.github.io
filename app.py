from flask import Flask, send_file

app = Flask(__name__, static_folder='.', static_url_path='')


@app.route('/')
def index():
    return send_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
