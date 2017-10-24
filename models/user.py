from . import base_model
from database import db


class User(db.Model, base_model.BaseModel):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fb_id = db.Column(db.String(255), index=True)
    name = db.Column(db.String(255), index=True)
