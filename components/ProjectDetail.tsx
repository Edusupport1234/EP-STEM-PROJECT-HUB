
import React, { useState, useEffect } from 'react';
import { Project, Comment, User, InteractiveProject } from '../types';
import { 
  ArrowLeft, Cpu, Code, BookOpen, MessageSquare, 
  ExternalLink, Heart, ThumbsUp, Eye, Sparkles, Zap, 
  ChevronRight, Play, Clock, X, Terminal, Bookmark, 
  Share2, Layout as LayoutIcon, Info, Trophy, Tag, Globe,
  Terminal as CodeIcon, Layers, Award, Edit, Trash2
} from 'lucide-react';
import { AVATAR_BG } from '../constants';

interface ProjectDetailProps {
  project: InteractiveProject;
  onBack: () => void;
  onToggleLike: () => void;
  onAddComment: (comment: Comment) => void;
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onToggleLike, onAddComment, user, onEdit, onDelete }) => {
  const [comments, setComments] = useState<Comment[]>(project.comments);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setComments(project.comments);
  }, [project.comments]);

  const handleLikeComment = (commentId: string) => {
    const newLiked = new Set(likedComments);
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        if (newLiked.has(commentId)) {
          newLiked.delete(commentId);
          return { ...c, likes: c.likes - 1 };
        } else {
          newLiked.add(commentId);
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });
    setComments(updatedComments);
    setLikedComments(newLiked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: user.username,
      text: newComment,
      timestamp: 'Just now',
      avatarColor: 'bg-blue-900',
      likes: 0
    };
    onAddComment(comment);
    setNewComment('');
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'hardware', label: 'Hardware' },
    { 
      id: 'story', 
      label: 'Story',
      subItems: project.steps.map(step => ({ id: `step-${step.title.replace(/\s+/g, '-').toLowerCase()}`, label: step.title }))
    },
    { id: 'schematics', label: 'Schematics' },
    { id: 'code', label: 'Code' },
    { id: 'credits', label: 'Credits' },
    { id: 'comments', label: `Comments (${comments.length})` },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      onDelete?.();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0118] text-white">
      {/* Top Breadcrumb/Meta Header */}
      <div className="border-b border-white/5 bg-[#0a0118]/80 backdrop-blur-md sticky top-20 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="flex items-center text-white hover:text-yellow-400 transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                <button 
                  onClick={onEdit}
                  className="flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  <Edit className="w-3.5 h-3.5 mr-2" /> Edit Project
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button 
                  onClick={handleDelete}
                  className="flex items-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </button>
              </div>
            )}
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Project Documentation System</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 bg-white rounded-[4rem] text-black mt-8 shadow-2xl overflow-hidden relative border-t-8 border-yellow-400">
        <div className="grid grid-cols-12 gap-10 p-4 md:p-10">
          
          {/* LEFT COLUMN: Sticky Navigation & Interactions */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="sticky top-40">
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={`block w-full text-left px-4 py-3 text-[13px] font-black transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-600 text-blue-600 bg-blue-50' 
                          : 'border-transparent text-slate-500 hover:text-black hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Interaction Block */}
              <div className="mt-12 flex space-x-2 px-2">
                <button 
                  onClick={onToggleLike}
                  className={`flex flex-1 items-center justify-center py-4 rounded-lg border transition-all ${
                    project.isLikedByUser 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-600' 
                      : 'border-slate-200 text-slate-700 hover:border-black hover:text-black shadow-sm'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 mr-2 ${project.isLikedByUser ? 'fill-blue-600' : ''}`} />
                  <span className="text-xs font-black">{project.likes}</span>
                </button>
                <button className="flex-1 flex items-center justify-center py-4 rounded-lg border border-slate-200 text-slate-700 hover:border-black hover:text-black transition-all shadow-sm">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Main Content Flow */}
          <main className="col-span-12 lg:col-span-7 space-y-12">
            <div id="overview" className="space-y-8 scroll-mt-40">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#6b1e8e] overflow-hidden border-2 border-slate-100 shadow-md">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${project.author}&backgroundColor=${AVATAR_BG}`} 
                      alt={project.author} 
                      className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-black hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-tight">{project.author}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Published {project.publishedAt} | EP STEM HUB</span>
                 </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-black leading-tight tracking-tight uppercase italic drop-shadow-sm">
                {project.title}
              </h1>

              <p className="text-2xl text-black leading-relaxed font-bold italic border-l-[12px] border-yellow-400 pl-10 bg-slate-50 py-10 rounded-r-[3rem] shadow-inner">
                "{project.description}"
              </p>

              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-100">
                 <div className="flex items-center space-x-2 text-[13px] font-black text-orange-600 uppercase tracking-[0.2em]">
                    <Zap className="w-5 h-5 fill-orange-600" />
                    <span>{project.difficulty}</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[13px] font-black text-black uppercase tracking-[0.2em]">
                    <Clock className="w-5 h-5 text-slate-900" />
                    <span>{project.duration}</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[13px] font-black text-black uppercase tracking-[0.2em]">
                    <Eye className="w-5 h-5 text-slate-900" />
                    <span>{project.views} Views</span>
                 </div>
              </div>

              <div className="rounded-[4rem] overflow-hidden border-[12px] border-white shadow-[0_40px_100px_rgba(0,0,0,0.2)] aspect-video bg-slate-100 relative group">
                 <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={project.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <section id="hardware" className="space-y-8 pt-16 border-t border-slate-100 scroll-mt-40">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Mission Inventory</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {project.hardware.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center border-2 border-slate-100 hover:border-black transition-all group shadow-sm">
                    <div className="w-20 h-20 bg-white rounded-3xl flex-shrink-0 mr-8 overflow-hidden p-3 shadow-inner border-2 border-slate-100">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-xl font-black text-black group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</p>
                      <a href={item.link} target="_blank" className="text-[11px] font-black text-slate-800 uppercase tracking-widest mt-2 flex items-center hover:text-black">
                        Hardware Specs <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="story" className="space-y-12 pt-16 border-t border-slate-100 scroll-mt-40">
              <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Technical Briefing</h2>
              <div className="space-y-32">
                {project.steps.map((step, idx) => (
                  <div key={idx} id={`step-${step.title.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-10 scroll-mt-40">
                    <div className="flex items-center space-x-8">
                       <div className="w-16 h-16 bg-black text-yellow-400 flex items-center justify-center rounded-[1.5rem] font-black text-3xl italic shadow-2xl rotate-[-5deg]">{idx + 1}</div>
                       <h3 className="text-4xl font-black text-black tracking-tight uppercase italic">{step.title}</h3>
                    </div>
                    <p className="text-black text-xl leading-relaxed font-bold border-l-4 border-slate-200 pl-10">
                      {step.content}
                    </p>
                    {step.media && step.media.length > 0 && (
                      <div className="rounded-[4rem] overflow-hidden border-[10px] border-slate-50 shadow-2xl bg-slate-100 group">
                         <img src={step.media[0].url} className="w-full h-auto group-hover:scale-110 transition-transform duration-[2000ms]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Rest of components darkened consistently */}
            <section id="code" className="space-y-8 pt-16 border-t border-slate-100 scroll-mt-40">
               <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Source Code Logic</h2>
               <div className="bg-slate-900 rounded-[4rem] p-16 space-y-8 text-center shadow-3xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-pink-600" />
                 <div className="inline-flex p-6 bg-white/10 rounded-full mb-4 shadow-xl">
                    <Code className="w-12 h-12 text-yellow-400" />
                 </div>
                 <div className="max-w-md mx-auto space-y-6">
                   <h4 className="text-2xl font-black text-white uppercase italic">Interactive MakeCode Module</h4>
                   <p className="text-white/70 text-base leading-relaxed font-bold italic">
                     Access the real-time block logic and Javascript backend for this mission.
                   </p>
                 </div>
                 {project.makecodeUrl && (
                   <div className="pt-8">
                      <a 
                        href={project.makecodeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-yellow-400 text-black px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl hover:bg-white hover:scale-105 active:scale-95 group"
                      >
                        <ExternalLink className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform" /> 
                        Launch Mission Control
                      </a>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-10 truncate max-w-sm mx-auto">
                        URL: {project.makecodeUrl}
                      </p>
                   </div>
                 )}
               </div>
            </section>

            <section id="comments" className="space-y-12 pt-16 border-t border-slate-100 scroll-mt-40 pb-48">
               <h2 className="text-3xl font-black text-black uppercase tracking-tight italic">Communications Room ({comments.length})</h2>
               <form onSubmit={handleAddComment} className="bg-slate-50 p-10 rounded-[3rem] border-4 border-slate-100 shadow-inner">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or share your build log..."
                    className="w-full bg-transparent border-none outline-none text-black placeholder:text-slate-400 min-h-[120px] resize-none text-xl font-black italic"
                  />
                  <div className="flex justify-end mt-6">
                    <button className="bg-black text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all shadow-2xl active:scale-95">Transmit Message</button>
                  </div>
               </form>
               <div className="space-y-16 mt-16">
                  {comments.map(c => (
                    <div key={c.id} className="flex space-x-8 group">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black text-white border-2 border-slate-200 overflow-hidden shadow-sm group-hover:rotate-6 transition-transform p-1.5">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${c.author}&backgroundColor=${AVATAR_BG}`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="flex-grow space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="font-black text-black text-lg uppercase tracking-tight italic">{c.author}</span>
                             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{c.timestamp}</span>
                          </div>
                          <p className="text-black text-xl leading-relaxed font-bold italic opacity-95">"{c.text}"</p>
                          <div className="flex items-center space-x-6 pt-2">
                            <button onClick={() => handleLikeComment(c.id)} className="flex items-center space-x-2 text-[11px] font-black uppercase text-slate-600 hover:text-pink-600 transition-colors">
                               <ThumbsUp className={`w-4 h-4 ${likedComments.has(c.id) ? 'fill-pink-600 text-pink-600' : 'text-slate-400'}`} />
                               <span>{c.likes} Appreciation</span>
                            </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </main>

          <aside className="col-span-12 lg:col-span-3 space-y-12">
            <div className="space-y-8 bg-slate-50 p-12 rounded-[3rem] border-2 border-slate-100 shadow-sm">
              <h3 className="text-[12px] font-black text-black uppercase tracking-[0.3em] border-b-2 border-slate-200 pb-6">Classification</h3>
              <div className="flex flex-wrap gap-3">
                {['robotics', 'iot', 'automation', 'esp32', 'coding', 'smart home'].map(tag => (
                  <span key={tag} className="px-5 py-2.5 bg-white text-black text-[11px] font-black rounded-xl uppercase tracking-widest border-2 border-slate-100 shadow-sm hover:border-black transition-all cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black p-12 rounded-[4rem] shadow-3xl space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-transform duration-1000">
                  <Trophy size={180} className="text-white" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-3xl font-black uppercase italic leading-none text-yellow-400">Mission Reward</h4>
                  <p className="text-[13px] font-black text-white/50 leading-relaxed mt-8 uppercase tracking-widest">Seal this mission log to verify your hardware certification profile.</p>
                  <button className="w-full mt-12 bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-yellow-400 shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:scale-95">Secure Credentials</button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
