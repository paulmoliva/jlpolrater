from . import base_model
from database import db


class Category(db.Model, base_model.BaseModel):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), index=True)
    superlative = db.Column(db.String(255), index=True)
