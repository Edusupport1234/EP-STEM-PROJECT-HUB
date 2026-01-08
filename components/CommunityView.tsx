
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Plus, X, MoreVertical, Search, Share2, Settings, Bell, Play, RotateCcw, 
  ArrowLeft, Info, Package, Sparkles, Heart, Upload, ChevronUp, ChevronDown, 
  Rocket, ArrowBigUp, ArrowBigDown, Loader2, Tag, Link2Icon, Image as ImageIcon,
  Edit, Trash2
} from 'lucide-react';
import { CommunityPost, User } from '../types';
import { AVATAR_BG, CATEGORIES } from '../constants';
import { uploadFile } from '../services/firebase';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'timestamp'> & { id?: string }) => void;
  onDeletePost: (postId: string) => void;
  onVote: (postId: string, direction: 1 | -1) => void;
  onBack: () => void;
  user: User;
}

type SortOption = 'best' | 'most' | 'least';

const CommunityView: React.FC<CommunityViewProps> = ({ posts, onAddPost, onDeletePost, onVote, onBack, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(posts);
  const [sortOption, setSortOption] = useState<SortOption>('best');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const sortRef = useRef<HTMLDivElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'IoT'
  });

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedPosts = useMemo(() => {
    const p = [...localPosts];
    if (sortOption === 'most') {
      return p.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortOption === 'least') {
      return p.sort((a, b) => (a.likes || 0) - (b.likes || 0));
    }
    return p;
  }, [localPosts, sortOption]);

  const handleVoteLocal = (postId: string, direction: 1 | -1) => {
    const currentVote = userVotes[postId] || 0;
    if (currentVote === direction) return;
    const firebaseDirection = currentVote === 0 ? direction : direction * 2;
    onVote(postId, firebaseDirection as 1 | -1);
    setUserVotes(prev => ({ ...prev, [postId]: direction }));
    setLocalPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + firebaseDirection } : p));
  };

  const handleEdit = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl || '',
      category: post.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (postId: string) => {
    if (confirm("Delete this build? This action is permanent.")) {
      onDeletePost(postId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description) return;
    
    onAddPost({
      ...newPost,
      id: editingPostId || undefined,
      author: user.username
    });
    
    setNewPost({ title: '', description: '', imageUrl: '', category: 'IoT' });
    setEditingPostId(null);
    setIsModalOpen(false);
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'most': return 'MOST LIKES';
      case 'least': return 'LEAST LIKES';
      default: return 'BEST COMMENTS';
    }
  };

  return (
    <div className="min-h-screen relative animate-in fade-in duration-700">
      
      <div className="bg-[#8d4b31] border-b border-black/10">
        <div className="container mx-auto px-6 pt-16 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
             <div className="max-w-3xl">
               <div className="inline-flex items-center space-x-3 mb-8 bg-black/20 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Showcase Your Creations</span>
               </div>
               <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-6 tracking-tighter uppercase italic leading-none">
                 COMMUNITY BOARD
               </h1>
               <p className="text-white text-xl font-bold leading-relaxed italic max-w-2xl border-l-4 border-yellow-400 pl-6">
                 "This is where the magic happens. Share your builds, uploaded objects, and project breakthroughs with the academy."
               </p>
             </div>
             
             <div className="flex items-center space-x-6">
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[160px] shadow-2xl">
                   <p className="text-4xl font-black text-white">{localPosts.length}</p>
                   <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mt-2">Creations</p>
                </div>
                <div className="bg-yellow-400 p-8 rounded-[2.5rem] border-b-8 border-yellow-600 text-center min-w-[160px] shadow-2xl hover:scale-105 transition-transform">
                   <p className="text-4xl font-black text-[#8d4b31]">{localPosts.reduce((acc, p) => acc + (p.likes || 0), 0)}</p>
                   <p className="text-[10px] font-black text-[#8d4b31]/80 uppercase tracking-widest mt-2">Appreciation</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div 
        className="relative pb-48 min-h-[800px]"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/brick-wall.png')`,
          backgroundColor: '#8d4b31',
        }}
      >
        <div className="container mx-auto px-6 py-20">
          
          <div className="flex items-center justify-between mb-12 bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 relative z-50 overflow-visible">
            <div className="flex items-center space-x-4 relative" ref={sortRef}>
               <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center space-x-3 px-6 py-3 bg-white/20 rounded-xl border border-white/20 group cursor-pointer hover:bg-white/30 transition-all shadow-lg active:scale-95"
               >
                  <Rocket className="w-5 h-5 text-white" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">{getSortLabel()}</span>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
               </button>

               {isSortDropdownOpen && (
                 <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-[1.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-none p-3 z-[1000] animate-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => { setSortOption('best'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mb-1 ${sortOption === 'best' ? 'bg-[#8d4b31] text-white shadow-md' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      Best Comments
                    </button>
                    <button 
                      onClick={() => { setSortOption('most'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mb-1 ${sortOption === 'most' ? 'bg-[#8d4b31] text-white shadow-md' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      Most Likes
                    </button>
                    <button 
                      onClick={() => { setSortOption('least'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${sortOption === 'least' ? 'bg-[#8d4b31] text-white shadow-md' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      Least Likes
                    </button>
                 </div>
               )}
            </div>
            <div className="hidden md:flex items-center space-x-2 text-[10px] font-black text-white uppercase tracking-[0.4em]">
               Academy Feed • Live Updates
            </div>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-12 space-y-12">
            {sortedPosts.map((post) => {
              const currentVote = userVotes[post.id] || 0;
              const displayLikes = post.likes === 0 ? 'Vote' : post.likes;
              const avatarUrl = post.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author}&backgroundColor=${AVATAR_BG}`;
              const isOwner = post.author === user.username || user.role === 'admin';
              
              return (
                <div 
                  key={post.id} 
                  className="break-inside-avoid bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden transform transition-all hover:scale-[1.04] hover:-translate-y-3 flex flex-col border-4 border-white group"
                >
                  <div className="h-3 bg-[#fbbf24] w-full" />

                  <div className="p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-white text-lg font-black shadow-inner overflow-hidden border-2 border-slate-100 rotate-3 group-hover:rotate-0 transition-transform p-1">
                         <img 
                          src={avatarUrl} 
                          alt={post.author} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${post.author}&backgroundColor=${AVATAR_BG}`;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-black text-xs uppercase leading-none tracking-wider">{post.author}</h4>
                        <p className="text-[9px] text-slate-700 mt-1.5 font-black uppercase tracking-widest">{post.timestamp}</p>
                      </div>
                    </div>
                    
                    {isOwner ? (
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="p-2 text-slate-900 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit Build"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-slate-900 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Build"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-yellow-600" />
                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">Personal Build</span>
                       </div>
                       <span className="px-3 py-1 bg-slate-100 text-[8px] font-black text-slate-600 rounded-lg uppercase tracking-widest">{post.category}</span>
                    </div>
                    <h3 className="font-black text-black text-3xl mb-5 leading-none tracking-tighter uppercase italic decoration-yellow-400/30 group-hover:underline">
                      {post.title}
                    </h3>
                    
                    {post.imageUrl && (
                      <div className="mb-8 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-2xl bg-slate-100 group/post-img relative">
                        <img src={post.imageUrl} className="w-full h-auto object-cover max-h-[450px] group-hover/post-img:scale-110 transition-transform duration-1000" alt={post.title} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/post-img:opacity-100 transition-opacity" />
                      </div>
                    )}
                    
                    <p className="text-black text-lg leading-relaxed whitespace-pre-wrap font-bold italic border-l-4 border-slate-200 pl-6">
                      "{post.description}"
                    </p>
                  </div>

                  <div className="mt-auto px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex items-center space-x-1 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 group/vote-bar">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleVoteLocal(post.id, 1); }}
                          className={`p-1.5 rounded transition-all flex items-center justify-center ${currentVote === 1 ? 'text-[#ff4500]' : 'text-black hover:bg-slate-50 hover:text-[#ff4500]'}`}
                        >
                          <ArrowBigUp className={`w-7 h-7 ${currentVote === 1 ? 'fill-[#ff4500]' : ''}`} strokeWidth={1.5} />
                        </button>
                        
                        <span className={`text-sm font-black px-2 min-w-[3rem] text-center transition-colors ${currentVote === 1 ? 'text-[#ff4500]' : currentVote === -1 ? 'text-[#7193ff]' : 'text-black'}`}>
                          {displayLikes}
                        </span>

                        <button 
                          onClick={(e) => { e.stopPropagation(); handleVoteLocal(post.id, -1); }}
                          className={`p-1.5 rounded transition-all flex items-center justify-center ${currentVote === -1 ? 'text-[#7193ff]' : 'text-black hover:bg-slate-50 hover:text-[#7193ff]'}`}
                        >
                          <ArrowBigDown className={`w-7 h-7 ${currentVote === -1 ? 'fill-[#7193ff]' : ''}`} strokeWidth={1.5} />
                        </button>
                     </div>

                     <button className="bg-white p-4 rounded-2xl shadow-sm text-black hover:text-[#8d4b31] transition-all hover:shadow-md border border-slate-200">
                        <Info className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Rest of component stays the same */}
      <div className="fixed bottom-12 right-12 flex flex-col items-end space-y-4 z-50">
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-100 animate-in slide-in-from-right-10">
           <p className="text-[11px] font-black text-black uppercase tracking-widest">Share your personal build</p>
        </div>
        <button 
          onClick={() => {
            setEditingPostId(null);
            setNewPost({ title: '', description: '', imageUrl: '', category: 'IoT' });
            setIsModalOpen(true);
          }}
          className="w-28 h-28 bg-[#fbbf24] text-[#8d4b31] rounded-[3rem] flex items-center justify-center shadow-[0_30px_90px_rgba(0,0,0,0.5)] hover:scale-110 hover:-translate-y-3 active:scale-95 transition-all group border-[10px] border-white"
        >
          <Plus className="w-14 h-14 group-hover:rotate-90 transition-transform duration-700" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[5rem] shadow-[0_100px_200px_rgba(0,0,0,0.9)] overflow-hidden border-t-[20px] border-[#fbbf24] animate-in slide-in-from-bottom-40 duration-700">
            <div className="px-16 pt-16 pb-10 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 bg-yellow-400/10 px-4 py-1.5 rounded-full mb-4">
                  <Package className="w-3.5 h-3.5 text-yellow-600" />
                  <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{editingPostId ? 'Edit Build' : 'Build Submission'}</span>
                </div>
                <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{editingPostId ? 'EDIT' : 'UPLOAD'} <br/>OBJECT</h2>
              </div>
              <button 
                onClick={() => {
                   setIsModalOpen(false);
                   setEditingPostId(null);
                }} 
                className="text-slate-900 hover:text-red-500 transition-all p-5 bg-slate-50 hover:bg-red-50 rounded-full"
              >
                <X className="w-10 h-10" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-16 pb-16 space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] ml-2">Object Name / Project Title</label>
                <input 
                  type="text" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full text-4xl font-black text-slate-900 bg-transparent border-b-8 border-slate-100 outline-none placeholder:text-slate-200 focus:border-yellow-400 transition-all pb-4 px-2 relative z-10"
                  placeholder="The Ultimate Drone..."
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] ml-2 flex items-center">
                  <Tag className="w-3 h-3 mr-2 text-black" /> Select Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c !== 'All' && c !== 'All projects').map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPost({...newPost, category: cat})}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newPost.category === cat ? 'bg-yellow-400 text-[#8d4b31] scale-110 shadow-lg' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] ml-2">Object Description & Build Notes</label>
                <textarea 
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                  className="w-full text-slate-900 text-2xl border-none outline-none placeholder:text-slate-200 min-h-[160px] resize-none font-bold leading-relaxed bg-slate-50 p-8 rounded-[3rem] shadow-inner focus:bg-white focus:shadow-2xl transition-all relative z-10"
                  placeholder="Tell us about your build process..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-10 pt-6 border-t border-slate-100">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] ml-2 flex items-center">
                      <Link2Icon className="w-3.5 h-3.5 mr-2 text-black" /> Image URL (ImageKit)
                    </label>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                       <div className="flex-grow w-full">
                          <input 
                            type="url" 
                            value={newPost.imageUrl}
                            onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                            placeholder="Paste link here..."
                            className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] px-8 py-5 text-xl font-bold text-slate-900 outline-none focus:border-yellow-400 transition-all placeholder:text-slate-300"
                          />
                       </div>
                       <div className="w-full md:w-32 h-32 bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-slate-200 relative group/preview shrink-0">
                          {newPost.imageUrl ? (
                            <img 
                              src={newPost.imageUrl} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200?text=Error'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                               <ImageIcon className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-[8px] font-black text-white uppercase">Preview</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col md:flex-row items-center gap-6">
                   <div className="flex-grow w-full">
                     <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-4 block ml-2">Logged in as</label>
                     <div className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] px-10 py-6 flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-900/10 p-1">
                          <img src={user.avatarSeed} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-black text-slate-900 uppercase">{user.username}</span>
                     </div>
                   </div>
                   <button 
                    type="submit"
                    className="w-full md:w-auto self-end bg-yellow-400 text-[#8d4b31] h-[84px] px-20 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] shadow-2xl hover:scale-105 hover:bg-[#8d4b31] hover:text-white transition-all active:scale-95 border-b-8 border-yellow-600"
                  >
                    {editingPostId ? 'UPDATE BUILD' : 'SHARE BUILD'}
                  </button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityView;
