import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Star, X, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function RatingModal({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleStarHover = (star) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (description.trim() === '') {
      toast.error('Please provide a description');
      return;
    }
    if (description.trim().length > 200) {
      toast.error('Description must be 200 characters or less');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        rating,
        description: description.trim(),
        name: user ? `${user.firstName} ${user.lastName}` : 'Anonymous'
      };

      const response = await fetch('https://restyle-backend123.vercel.app/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast.success('Thank you for your review!');
        setRating(0);
        setDescription('');
        onClose();
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-xl relative border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Rate Our Website
          </h2>
          <p className="text-gray-900 mt-2">Help us improve with your feedback</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black mb-3">Your Rating</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="focus:outline-none transform transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current drop-shadow-lg'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-black mt-2">
              {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              Your Thoughts
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-black text-black"
              placeholder="Tell us about your experience..."
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-600">
                Share your experience...
              </span>
              <span className={`text-xs font-medium ${
                description.length > 180 ? 'text-red-500' : 'text-black'
              }`}>
                {description.length}/200
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}