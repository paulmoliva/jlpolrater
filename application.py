import flask
import os
import json
import random

from flask_cors import CORS

from database import db
from models import politician, category, user

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

NUM_POLS = 60
NUM_CATS = 16


@application.route('/requestPair')
def requestPair():
    pol_ids = random.sample(range(1, NUM_POLS), 2)
    pol_one_id = pol_ids[0]
    pol_two_id = pol_ids[1]
    cat_id = random.sample(range(1, NUM_CATS), 1)[0]
    return json.dumps({
        'politicianOne': politician.Politician.query.get(pol_one_id).as_dict(),
        'politicianTwo': politician.Politician.query.get(pol_two_id).as_dict(),
        'category': category.Category.query.get(cat_id).as_dict()
    })


if __name__ == '__main__':
    application.run(debug=True)
