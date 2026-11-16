import React, { useState } from 'react';
import { BlogPost } from '../types';
import { getStoredBlogs } from '../utils/businessLogic';
import { Calendar, Clock, ArrowRight, Tag, HelpCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { staggerContainerVariants, staggerItemVariants, buttonPressProps } from '../utils/motion';
import { SectionBackground } from '../components/backgrounds';

interface BlogViewProps {
  initialSlug?: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenBooking: (serviceName?: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, onNavigate, onOpenBooking }) => {
  const [blogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [activePostSlug, setActivePostSlug] = useState<string | null>(initialSlug || null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const selectedPost = blogs.find((p) => p.slug === activePostSlug);

  if (selectedPost) {
    return (
      <div className="relative overflow-hidden">
        <SectionBackground variant="blog" opacity={0.18} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Reading Progress Indicator Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E50914] to-red-500 z-50 origin-left"
          style={{ scaleX }}
        />

        <motion.button
          {...buttonPressProps}
          onClick={() => setActivePostSlug(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#E50914] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-[#E50914] font-bold uppercase">{selectedPost.category}</span>
            <span>·</span>
            <span>{selectedPost.publishedDate}</span>
            <span>·</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight font-heading">
            {selectedPost.title}
          </h1>

          <div className="text-xs text-slate-600 italic border-l-2 border-[#E50914] pl-3">
            Written by {selectedPost.author} for motorcycle riders in Badami Bagh and Lahore.
          </div>
        </motion.div>

        {/* Featured Image */}
        {selectedPost.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-automotive aspect-video sm:aspect-21/9 bg-slate-950"
          >
            <img
              src={selectedPost.image}
              alt={selectedPost.imageAlt || selectedPost.title}
              width={1200}
              height={675}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </motion.div>
        )}

        {/* Article Body */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-automotive space-y-6 text-sm text-slate-700 leading-relaxed"
        >
          <div className="whitespace-pre-line">
            {selectedPost.content}
          </div>

          {/* Article Specific FAQs */}
          {selectedPost.faqs && selectedPost.faqs.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                <HelpCircle className="w-4 h-4 text-[#E50914]" />
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
              <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                #{t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA Box at Bottom of Article */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-[#E50914] to-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold font-heading">Experiencing this issue with your bike?</h3>
            <p className="text-xs text-red-100">
              Visit Hamza Autos on Abu Bakar Road, Badami Bagh for same-day inspection and honest repair.
            </p>
          </div>
          <motion.button
            {...buttonPressProps}
            onClick={() => onOpenBooking('Inspection from Blog Article')}
            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Book Workshop Inspection
          </motion.button>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <SectionBackground variant="blog" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
          Motorcycle Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
          Motorcycle Maintenance Articles &amp; Riding Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Helpful maintenance guides, fuel economy tips, and technical advice tailored to Pakistani road conditions and Lahore city driving.
        </p>
      </motion.div>

      <motion.div 
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {blogs.map((post) => (
          <motion.div
            key={post.id}
            variants={staggerItemVariants}
            whileHover={{ y: -5 }}
            onClick={() => setActivePostSlug(post.slug)}
            className="group bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-automotive hover:shadow-automotive-hover hover:border-red-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-4">
              {post.image && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    width={600}
                    height={338}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-[#E50914] font-bold uppercase">{post.category}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#E50914] transition-colors leading-snug font-heading">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-[#E50914]">
              <span>Read Full Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </div>
  );
};
