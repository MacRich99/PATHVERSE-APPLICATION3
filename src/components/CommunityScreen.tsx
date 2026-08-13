import React, { useState, useEffect, useRef } from 'react';
import { Users, Heart, Award, Globe, Sparkles, MessageSquare, ThumbsUp, ShieldCheck, DollarSign, Compass, Filter, PlusCircle, Image, Send, Camera, Trash2, CheckCircle2 } from 'lucide-react';
import { LearnerUser, UserProfile, CommunityPost } from '../types';
import { FIELDS_OF_STUDY, AVAILABLE_YEAR_BADGES } from '../data/yearBadges';
import { YearBadgeModal } from './YearBadgeModal';

interface CommunityScreenProps {
  user: UserProfile;
  onSendKudos?: () => void;
  onJoinYearBadge?: (yearBadge: string, fieldOfStudy: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ user, onSendKudos, onJoinYearBadge }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'learners'>('feed');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [learners, setLearners] = useState<LearnerUser[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingLearners, setLoadingLearners] = useState(true);
  
  // Create Post State
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'Project Share' | 'Milestone' | 'Question' | 'Discussion'>('Discussion');
  const [postImage, setPostImage] = useState<string>('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const postImageInputRef = useRef<HTMLInputElement>(null);

  // Comment input per post: postId -> comment text
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingCommentFor, setSubmittingCommentFor] = useState<string | null>(null);

  // Filter State
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('All');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('All Fields');
  const [isYearModalOpen, setIsYearModalOpen] = useState<boolean>(false);
  const [kudosMap, setKudosMap] = useState<Record<string, boolean>>({});

  // Fetch Posts & Learners
  useEffect(() => {
    fetchPosts();
    fetchLearners();
  }, []);

  const fetchPosts = () => {
    setLoadingPosts(true);
    fetch('/api/community/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
      })
      .catch((err) => console.error('Failed to load community posts:', err))
      .finally(() => setLoadingPosts(false));
  };

  const fetchLearners = () => {
    setLoadingLearners(true);
    fetch('/api/community/learners')
      .then((res) => res.json())
      .then((data) => {
        setLearners(data.learners || []);
      })
      .catch((err) => console.error('Failed to load community learners:', err))
      .finally(() => setLoadingLearners(false));
  };

  // Image Upload for New Post
  const handlePostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish Post
  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    setIsSubmittingPost(true);
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          authorName: user.name,
          authorEmail: user.email,
          authorAvatarUrl: user.avatarUrl || '',
          authorRole: user.role || 'user',
          authorYearBadge: user.yearBadge || 'League of 2026',
          authorFieldOfStudy: user.fieldOfStudy || 'Tech & AI',
          content: postContent.trim(),
          imageUrl: postImage,
          category: postCategory,
        }),
      });

      const data = await response.json();
      if (data.success && data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setPostContent('');
        setPostImage('');
      }
    } catch (err) {
      console.error('Error publishing post:', err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Like Post
  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email }),
      });
      const data = await response.json();

      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              const email = user.email.toLowerCase();
              const likedBy = p.likedByEmails || [];
              const hasLiked = likedBy.includes(email);
              const newLikedBy = hasLiked ? likedBy.filter((e) => e !== email) : [...likedBy, email];
              return {
                ...p,
                likesCount: data.likesCount,
                likedByEmails: newLikedBy,
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Submit Comment
  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setSubmittingCommentFor(postId);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: user.name,
          authorAvatarUrl: user.avatarUrl || '',
          text,
        }),
      });
      const data = await response.json();

      if (data.success && data.comment) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                comments: [...p.comments, data.comment],
              };
            }
            return p;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingCommentFor(null);
    }
  };

  const handleKudos = (learnerId: string) => {
    const isGivingKudos = !kudosMap[learnerId];

    setKudosMap((prev) => ({
      ...prev,
      [learnerId]: isGivingKudos,
    }));

    setLearners((prev) =>
      prev.map((l) => {
        if (l.id === learnerId) {
          return {
            ...l,
            kudosCount: isGivingKudos ? l.kudosCount + 1 : l.kudosCount - 1,
          };
        }
        return l;
      })
    );

    if (isGivingKudos && onSendKudos) {
      onSendKudos();
    }
  };

  const activeYearBadge = user.yearBadge ? user.yearBadge.replace('Class of', 'League of') : 'League of 2026';
  const activeField = user.fieldOfStudy || 'Tech & AI';

  const filteredLearners = learners.filter((learner) => {
    const matchesYear = selectedYearFilter === 'All' || (learner.yearBadge && learner.yearBadge.includes(selectedYearFilter));
    const matchesField = selectedFieldFilter === 'All Fields' || learner.fieldOfStudy === selectedFieldFilter;
    return matchesYear && matchesField;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Banner & Cohort Header */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase tracking-widest mb-1">
              <Users className="w-4 h-4 text-[#F2AF29]" />
              <span>PathVerse Global Community</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Learner Feed & Global Cohorts
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md opacity-80 mt-1">
              Share your milestones, ask questions, and engage with young scholars across all fields.
            </p>
          </div>

          <button
            onClick={() => setIsYearModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#F2AF29]/20 cursor-pointer shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Join / Change Cohort</span>
          </button>
        </div>

        {/* User's Current Cohort Status */}
        <div className="bg-[#0B0D17] border border-[#F2AF29]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1C1F37] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] font-bold text-lg shadow-md shrink-0">
              {activeYearBadge.replace('Class of ', '').slice(-2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold text-[#F2AF29] tracking-wider">Your Official Cohort Badge</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">Active</span>
              </div>
              <p className="text-sm font-bold text-white leading-tight">
                {activeYearBadge} • {activeField} Cohort
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsYearModalOpen(true)}
            className="text-[11px] text-[#F2AF29] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Cohort Directory</span>
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation: Feed vs Learner Directory */}
      <div className="grid grid-cols-2 bg-[#1C1F37] p-1.5 rounded-2xl border border-white/10 text-xs font-semibold shadow-lg">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-2.5 rounded-xl transition-all uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'feed'
              ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Community Feed ({posts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('learners')}
          className={`py-2.5 rounded-xl transition-all uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'learners'
              ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Explorer Directory</span>
        </button>
      </div>

      {/* TAB 1: COMMUNITY FEED */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post Card */}
          <form onSubmit={handlePublishPost} className="bg-[#1C1F37] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] font-bold text-sm shrink-0 overflow-hidden shadow-md">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Share with Community</span>
                  {user.role === 'admin' && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase">
                      ADMIN
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-slate-400">Post updates, progress, questions, or project links visible to everyone.</p>
              </div>
            </div>

            {/* Post Content Input */}
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`What's on your mind, ${user.name}? Share a milestone, question, or project update...`}
              rows={3}
              className="w-full p-3.5 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#F2AF29] transition-colors resize-none"
            />

            {/* Image Preview if Uploaded */}
            {postImage && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-48 bg-[#0B0D17]">
                <img src={postImage} alt="Post attachment" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPostImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={postImageInputRef}
              onChange={handlePostImageUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Selector */}
                <div className="flex items-center gap-1 bg-[#0B0D17] p-1 rounded-xl border border-white/10 text-[10px]">
                  {(['Discussion', 'Milestone', 'Project Share', 'Question'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPostCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        postCategory === cat
                          ? 'bg-[#F2AF29] text-[#0B0D17] shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Attach Image Button */}
                <button
                  type="button"
                  onClick={() => postImageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 hover:text-white hover:border-[#F2AF29] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#F2AF29]" />
                  <span>{postImage ? 'Change Image' : 'Attach Photo'}</span>
                </button>
              </div>

              {/* Submit Post Button */}
              <button
                type="submit"
                disabled={isSubmittingPost || !postContent.trim()}
                className="px-5 py-2 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] disabled:opacity-50 text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#F2AF29]/20"
              >
                {isSubmittingPost ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#0B0D17] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Publish Post</span>
              </button>
            </div>
          </form>

          {/* Posts Feed */}
          {loadingPosts ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#F2AF29] border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Loading community updates...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-[#F2AF29] mx-auto opacity-50" />
              <p className="text-xs text-slate-300 font-bold">No community posts yet!</p>
              <p className="text-[11px] text-slate-400">Be the first to share your learning milestone above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const userEmail = user.email.toLowerCase();
                const isLikedByMe = (post.likedByEmails || []).includes(userEmail);

                return (
                  <div
                    key={post.id}
                    className="bg-[#1C1F37] border border-white/10 hover:border-[#F2AF29]/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl transition-all"
                  >
                    {/* Author Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] font-bold text-base shadow-md shrink-0 overflow-hidden">
                          {post.authorAvatarUrl ? (
                            <img src={post.authorAvatarUrl} alt={post.authorName} className="w-full h-full object-cover" />
                          ) : (
                            post.authorName.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white">{post.authorName}</h4>
                            {post.authorRole === 'admin' ? (
                              <span className="px-2 py-0.2 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>Admin</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#F2AF29] bg-[#F2AF29]/10 border border-[#F2AF29]/30 px-2 py-0.2 rounded-full font-bold">
                                {post.authorYearBadge || 'League of 2026'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {post.authorFieldOfStudy || 'Explorer'} • {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      {/* Category Tag */}
                      <span className="px-2.5 py-1 rounded-xl bg-[#0B0D17] border border-white/10 text-[#F2AF29] text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>

                    {/* Post Text Content */}
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* Attached Image if any */}
                    {post.imageUrl && (
                      <div className="rounded-2xl overflow-hidden border border-white/10 max-h-80 bg-[#0B0D17]">
                        <img src={post.imageUrl} alt="Attached content" className="w-full h-full object-cover max-h-80" />
                      </div>
                    )}

                    {/* Action Buttons: Like & Comments */}
                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isLikedByMe
                            ? 'bg-[#F2AF29] border-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                            : 'bg-[#0B0D17] border-white/10 text-slate-300 hover:text-white hover:border-[#F2AF29]/40'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLikedByMe ? 'fill-[#0B0D17] text-[#0B0D17]' : 'text-[#F2AF29]'}`} />
                        <span>{post.likesCount || 0} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <MessageSquare className="w-3.5 h-3.5 text-[#F2AF29]" />
                        <span>{post.comments?.length || 0} Comments</span>
                      </div>
                    </div>

                    {/* Comments Thread */}
                    <div className="bg-[#0B0D17] p-3.5 rounded-2xl border border-white/5 space-y-3">
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-2.5 border-b border-white/5 pb-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                              <div className="w-6 h-6 rounded-lg bg-[#1C1F37] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] text-[10px] font-bold shrink-0 overflow-hidden">
                                {comment.authorAvatarUrl ? (
                                  <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-full h-full object-cover" />
                                ) : (
                                  comment.authorName.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="bg-[#1C1F37] p-2.5 rounded-xl border border-white/5 flex-1">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                                  <span className="text-white">{comment.authorName}</span>
                                  <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-slate-300 leading-snug">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Write a comment..."
                          className="flex-1 px-3 py-1.5 rounded-xl bg-[#1C1F37] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#F2AF29]"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingCommentFor === post.id || !commentInputs[post.id]?.trim()}
                          className="px-3 py-1.5 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] disabled:opacity-40 text-[#0B0D17] font-bold text-xs transition-all cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPLORER DIRECTORY */}
      {activeTab === 'learners' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-[#1C1F37] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-white border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Filter className="w-4 h-4 text-[#F2AF29]" />
                <span>Filter Cohort Directory</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Showing {filteredLearners.length} Learners
              </span>
            </div>

            {/* Year Badge Filter Pills */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Year Cohort:</p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['All', '2026', '2025', '2027', '2028', '2024'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYearFilter(yr)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedYearFilter === yr
                        ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                        : 'bg-[#0B0D17] text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {yr === 'All' ? 'All League Badges' : `League of ${yr}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Field of Study Filter Pills */}
            <div className="space-y-1 pt-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Field of Study:</p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {FIELDS_OF_STUDY.map((field) => (
                  <button
                    key={field}
                    onClick={() => setSelectedFieldFilter(field)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      selectedFieldFilter === field
                        ? 'bg-white/10 text-[#F2AF29] border border-[#F2AF29]/50 font-bold'
                        : 'bg-[#0B0D17] text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Learners List */}
          {loadingLearners ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#F2AF29] border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400">Loading cohort directory...</p>
            </div>
          ) : filteredLearners.length === 0 ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-3">
              <Award className="w-8 h-8 text-[#F2AF29] mx-auto opacity-50" />
              <p className="text-xs text-slate-300 font-bold">No learners found in this specific filter selection.</p>
              <p className="text-[11px] text-slate-400">Try selecting "All League Badges" or "All Fields" to see everyone!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLearners.map((learner) => {
                const hasSentKudos = kudosMap[learner.id];

                return (
                  <div
                    key={learner.id}
                    className="bg-[#1C1F37] border border-white/10 hover:border-[#F2AF29]/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] font-bold text-base shadow-md shrink-0">
                        {learner.firstName.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">
                            {learner.firstName}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-[#0B0D17] px-2 py-0.5 rounded-full border border-white/10">
                            {learner.country}
                          </span>
                          <span className="text-[10px] text-[#F2AF29] bg-[#F2AF29]/10 border border-[#F2AF29]/30 px-2 py-0.5 rounded-full font-bold">
                            {learner.yearBadge || 'League of 2026'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                          <span>Field: <strong className="text-[#F2AF29]">{learner.fieldOfStudy || 'Tech & AI'}</strong></span>
                          <span>•</span>
                          <span className="text-slate-400">{learner.chosenPath}</span>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <Award className="w-3 h-3 text-[#F2AF29]" />
                          <span>{learner.stageLevel} Stage</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleKudos(learner.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                        hasSentKudos
                          ? 'bg-[#F2AF29] border-[#F2AF29] text-[#0B0D17] font-bold'
                          : 'bg-[#0B0D17] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasSentKudos ? 'fill-[#0B0D17] text-[#0B0D17]' : 'text-[#F2AF29]'}`} />
                      <span>{learner.kudosCount}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal for Joining / Selecting Year Badge */}
      {onJoinYearBadge && (
        <YearBadgeModal
          user={user}
          isOpen={isYearModalOpen}
          onClose={() => setIsYearModalOpen(false)}
          onJoinYearBadge={(badge, field) => {
            onJoinYearBadge(badge, field);
          }}
        />
      )}
    </div>
  );
};
