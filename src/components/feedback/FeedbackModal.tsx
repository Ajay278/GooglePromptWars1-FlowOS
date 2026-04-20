import { useState } from 'react';
import { X, Star, MessageSquare, Send } from 'lucide-react';
import { triggerHaptic } from '../../utils/a11y';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  onClose: () => void;
}

export default function FeedbackModal({ onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    triggerHaptic('heavy');

    try {
      if (db) {
        await addDoc(collection(db, 'stadium_feedback'), {
          rating,
          comment,
          timestamp: serverTimestamp(),
          location: 'Sector 112', // Mock location
        });
      } else {
        // Mock fallback if Firebase is not connected yet
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Mock Feedback Submitted:", { rating, comment });
      }
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      console.error("Error submitting feedback", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-950/95 backdrop-blur-3xl w-full max-w-sm rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-200">
        
        {submitted ? (
          <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
              <Star size={32} fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-white/80 text-sm font-medium">Your feedback helps us improve the stadium experience.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <MessageSquare size={24} className="text-primary-400" />
                  Rate Visit
                </h2>
                <p className="text-white/60 text-sm font-medium mt-1">We value your input!</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Star Rating */}
              <div className="flex justify-center gap-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => {
                      setRating(star);
                      triggerHaptic('light');
                    }}
                    className="p-1 transition-transform hover:scale-125 active:scale-90"
                  >
                    <Star 
                      size={40} 
                      className={`transition-all duration-300 ${
                        (hoveredRating || rating) >= star 
                          ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]' 
                          : 'text-white/30'
                      }`}
                      fill={(hoveredRating || rating) >= star ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>

              {/* Comment Box */}
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Any suggestions for us?"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none h-32 transition-all shadow-inner"
                />
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`w-full font-bold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg ${
                  rating === 0 
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-600 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
