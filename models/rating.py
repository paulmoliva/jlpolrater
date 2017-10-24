from . import base_model
from database import db


class Rating(db.Model, base_model.BaseModel):
    __tablename__ = 'ratings'
    id = db.Column(db.Integer, primary_key=True)
    winner_id = db.Column(db.Integer, db.ForeignKey('politicians.id'), index=True, nullable=True)
    loser_id = db.Column(db.Integer, db.ForeignKey('politicians.id'), index=True, nullable=True)

