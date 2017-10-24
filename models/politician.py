from . import base_model
from database import db


class Politician(db.Model, base_model.BaseModel):
    __tablename__ = 'politicians'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True)
    image_url = db.Column(db.String(255), index=True)
