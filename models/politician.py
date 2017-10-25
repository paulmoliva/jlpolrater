from . import base_model, rating
from database import db

from sqlalchemy import and_


class Politician(db.Model, base_model.BaseModel):
    __tablename__ = 'politicians'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True)
    image_url = db.Column(db.String(255), index=True)

    def category_wins(self, category_id):
        return rating.Rating.query.filter(
            and_(
                rating.Rating.winner_id == self.id,
                rating.Rating.category_id == category_id,
            )
        ).count()

    def category_losses(self, category_id):
        return rating.Rating.query.filter(
            and_(
                rating.Rating.loser_id == self.id,
                rating.Rating.category_id == category_id,
            )
        ).count()

    def category_score(self, category_id):
        num_wins = self.category_wins(category_id)
        num_losses = self.category_losses(category_id)
        total = num_wins + num_losses
        if total == 0:
            return None
        return round(((num_wins / total) * 100), 2)


