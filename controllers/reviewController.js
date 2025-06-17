const Review = require('../models/review');

exports.addReview = async (req, res) => {
  const review = new Review({ ...req.body, user: req.user.id });
  await review.save();
  res.status(201).json(review);
};

exports.getReviews = async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
  res.json(reviews);
};
