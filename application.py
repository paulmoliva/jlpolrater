import flask
import os
import json
from flask_cors import CORS

from database import db
from models import user

application = flask.Flask(__name__)

CORS(application)

application.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL') or \
    'mysql+pymysql://cranklogic:cranklogic@127.0.0.1/jlpolrater'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
application.secret_key = os.getenv('SECRET_KEY') or 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

db.init_app(application)


@application.errorhandler(404)
def page_not_found(e):
    return flask.render_template('index.html')


@application.route('/')
def index():
    return flask.render_template('index.html')


@application.route('/login', methods=['POST'])
def login():
    resp = flask.request.json
    the_user = user.User.query.filter(user.User.fb_id == resp['id']).first()
    if not the_user:
        the_user = user.User()
        the_user.fb_id = resp['id']
        the_user.name = resp['name']
        db.session.add(the_user)
        db.session.commit()
    return json.dumps(the_user.as_dict())


if __name__ == '__main__':
    application.run(debug=True)
