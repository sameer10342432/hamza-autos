import React, { useState } from 'react';
import { BlogPost } from '../types';
import { getStoredBlogs } from '../utils/businessLogic';
import { Calendar, Clock, ArrowRight, Tag, HelpCircle, ArrowLeft } from 'lucide-react';

interface BlogViewProps {
  initialSlug?: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, onNavigate, onOpenBooking }) => {
  const [blogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [activePostSlug, setActivePostSlug] = useState<string | null>(initialSlug || null);

  const selectedPost = blogs.find((p) => p.slug === activePostSlug);

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <button
          onClick={() => setActivePostSlug(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Articles
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-red-600 font-bold uppercase">{selectedPost.category}</span>
            <span>·</span>
            <span>{selectedPost.publishedDate}</span>
            <span>·</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {selectedPost.title}
          </h1>

          <div className="text-xs text-slate-600 italic border-l-2 border-red-500 pl-3">
            Written by {selectedPost.author} for motorcycle riders in Badami Bagh and Lahore.
          </div>
        </div>

        {/* Featured Image */}
        {selectedPost.image && (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm aspect-video sm:aspect-21/9 bg-slate-950">
            <img
              src={selectedPost.image}
              alt={selectedPost.imageAlt || selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="whitespace-pre-line">
            {selectedPost.content}
          </div>

          {/* Article Specific FAQs */}
          {selectedPost.faqs && selectedPost.faqs.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-600" />
                Frequently Asked Questions on This Topic
              </h3>
              <div className="space-y-3">
                {selectedPost.faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <h4 className="font-bold text-slate-900 mb-1">{faq.question}</h4>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="pt-4 flex flex-wrap gap-1.5">
            {selectedPost.tags.map((t, idx) => (
              <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Box at Bottom of Article */}
        <div className="bg-gradient-to-r from-red-600 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold">Experiencing this issue with your bike?</h3>
            <p className="text-xs text-red-100">
              Visit Hamza Autos on Abu Bakar Road, Badami Bagh for same-day inspection and honest repair.
            </p>
          </div>
          <button
            onClick={() => onOpenBooking('Inspection from Blog Article')}
            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Book Workshop Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
          Motorcycle Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Motorcycle Maintenance Articles &amp; Riding Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Helpful maintenance guides, fuel economy tips, and technical advice tailored to Pakistani road conditions and Lahore city driving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((post) => (
          <div
            key={post.id}
            onClick={() => setActivePostSlug(post.slug)}
            className="group bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              {post.image && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-red-600 font-bold uppercase">{post.category}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-red-600">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
