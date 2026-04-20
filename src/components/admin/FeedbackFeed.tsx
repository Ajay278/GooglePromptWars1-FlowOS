import { Star, Move } from 'lucide-react';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  location: string;
  timestamp?: { toDate: () => Date };
}

interface FeedbackFeedProps {
  feedbacks: Feedback[];
}

export default function FeedbackFeed({ feedbacks }: FeedbackFeedProps) {
  return (
    <section className="mb-6">
      <h3 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/80 flex items-center gap-2">
        Live Fan Intelligence
      </h3>
      <div className="space-y-3">
        {feedbacks.length === 0 ? (
          <p className="text-xs text-white/40 italic text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
            Waiting for live feedback...
          </p>
        ) : (
          feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={10} className={i <= fb.rating ? 'text-yellow-400' : 'text-white/10'} fill={i <= fb.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-[9px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  {fb.timestamp?.toDate ? fb.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium leading-relaxed mb-2">{fb.comment}</p>
              <div className="flex items-center gap-1.5 opacity-60">
                <Move size={10} className="text-blue-300" />
                <span className="text-[10px] text-white font-bold">{fb.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
