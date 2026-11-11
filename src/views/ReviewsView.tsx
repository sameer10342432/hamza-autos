import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, ExternalLink, ThumbsUp } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';
import { CustomerReview } from '../types';
import { getStoredReviews, saveStoredReviews, getStoredSettings } from '../utils/businessLogic';

export const ReviewsView: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => getStoredReviews());
  const settings = getStoredSettings();
  const [authorName, setAuthorName] = useState('');
  const [area, setArea] = useState('Badami Bagh');
  const [bikeModel, setBikeModel] = useState('');
  const [serviceReceived, setServiceReceived] = useState('Bike Tuning & Servicing');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      authorName: authorName.trim(),
      area: area.trim(),
      bikeModel: bikeModel.trim() || 'Motorcycle',
      rating,
      date: 'Just now',
      serviceReceived,
      comment: comment.trim(),
      isVerifiedCustomer: true
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
    setSubmittedFeedback(true);
    setAuthorName('');
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Verified Customer Feedback
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Customer Reviews &amp; Testimonials
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Read genuine repair experiences from local motorcycle owners in Badami Bagh, Shadbagh, Misri Shah, Ravi Road, and across Lahore.
        </p>
      </div>

      {/* Review Submission & Google Business Profile Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Customer Reviews ({reviews.length})
            </h2>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>5.0 Average Workshop Rating</span>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rev.authorName}</h3>
                    <span className="text-xs text-slate-500">
                      {rev.area} · <strong className="text-slate-700">{rev.bikeModel}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-red-600 bg-red-50/70 px-2.5 py-1 rounded-md inline-block">
                  Service: {rev.serviceReceived}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Reviewed on {rev.date}</span>
                  {rev.isVerifiedCustomer && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Workshop Customer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submit A Review & Google Maps Rating Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-slate-900">Leave Your Workshop Review</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have you recently repaired your motorcycle at Hamza Autos on Abu Bakar Road? Share your genuine feedback with other Lahore riders.
            </p>

            {submittedFeedback ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                <ThumbsUp className="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-900">Thank You For Your Review!</h4>
                <p className="text-[11px] text-emerald-700">
                  Your feedback has been posted and will help other motorcycle owners make informed choices.
                </p>
                <button
                  onClick={() => setSubmittedFeedback(false)}
                  className="text-xs text-emerald-800 font-bold underline mt-2 cursor-pointer"
                >
                  Write another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Area in Lahore</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Badami Bagh / Shadbagh"
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Motorcycle Model</label>
                    <input
                      type="text"
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      placeholder="e.g. CD 70 / CG 125"
                      className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Received</label>
                  <input
                    type="text"
                    value={serviceReceived}
                    onChange={(e) => setServiceReceived(e.target.value)}
                    placeholder="e.g. Engine Overhaul / Oil Change"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-slate-500 text-[11px] ml-2">({rating} / 5 Stars)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Review Details *</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the repair went, bike performance, mechanic attitude..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Customer Review
                </button>
              </form>
            )}
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold">Google Maps Review Profile</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You can also leave a review directly on Google Maps to help boost our local business ranking in Badami Bagh.
            </p>
            <a
              href={BUSINESS_INFO.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 underline"
            >
              Open Hamza Autos on Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
