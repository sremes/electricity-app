"""Main entrypoint for the web app created in this file."""

from flask import Flask, render_template


app = Flask(__name__)


@app.route("/")
def root():
    """Render the templated index.html"""
    return render_template("index.html")


if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)
