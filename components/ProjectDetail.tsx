
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

      <div className="container mx-auto px-6 py-12 bg-white rounded-[4rem] text-black mt-8 shadow-2xl overflow-hidden relative">
        <div className="grid grid-cols-12 gap-10 p-10">
          
          {/* LEFT COLUMN: Sticky Navigation & Interactions */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="sticky top-40">
              <nav className="space-y-0.5">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={`block w-full text-left px-4 py-2 text-[13px] font-black transition-all border-l-4 ${
                        activeSection === item.id 
                          ? 'border-blue-600 text-blue-600 bg-blue-50' 
                          : 'border-transparent text-slate-500 hover:text-black'
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
                      : 'border-slate-200 text-slate-500 hover:border-black hover:text-black'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 mr-2 ${project.isLikedByUser ? 'fill-blue-600' : ''}`} />
                  <span className="text-xs font-black">{project.likes}</span>
                </button>
                <button className="flex-1 flex items-center justify-center py-4 rounded-lg border border-slate-200 text-slate-500 hover:border-black hover:text-black transition-all">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: Main Content Flow */}
          <main className="col-span-12 lg:col-span-7 space-y-12">
            <div id="overview" className="space-y-8 scroll-mt-40">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-xl bg-[#6b1e8e] overflow-hidden border border-slate-200">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${project.author}&backgroundColor=${AVATAR_BG}`} 
                      alt={project.author} 
                      className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-black hover:text-blue-600 cursor-pointer transition-colors">{project.author}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Published {project.publishedAt}</span>
                 </div>
              </div>

              <h1 className="text-5xl font-black text-black leading-tight tracking-tight uppercase italic">
                {project.title}
              </h1>

              <p className="text-xl text-black leading-relaxed font-bold italic border-l-8 border-yellow-400 pl-8 bg-slate-50 py-6 rounded-r-3xl">
                "{project.description}"
              </p>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100">
                 <div className="flex items-center space-x-2 text-[12px] font-black text-orange-600 uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-orange-600" />
                    <span>{project.difficulty}</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[12px] font-black text-black uppercase tracking-widest">
                    <Clock className="w-4 h-4" />
                    <span>{project.duration}</span>
                 </div>
                 <div className="flex items-center space-x-2 text-[12px] font-black text-black uppercase tracking-widest">
                    <Eye className="w-4 h-4" />
                    <span>{project.views}</span>
                 </div>
              </div>

              <div className="rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl aspect-video bg-slate-100">
                 <img src={project.thumbnail} className="w-full h-full object-cover" alt={project.title} />
              </div>
            </div>

            <section id="hardware" className="space-y-8 pt-12 border-t border-slate-100 scroll-mt-40">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">Hardware used in this mission</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {project.hardware.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] flex items-center border border-slate-100 hover:border-black transition-all group shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-2xl flex-shrink-0 mr-6 overflow-hidden p-2 shadow-inner border border-slate-100">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-black text-black group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</p>
                      <a href={item.link} target="_blank" className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-1 flex items-center hover:text-black">
                        Procurement Link <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="story" className="space-y-10 pt-12 border-t border-slate-100 scroll-mt-40">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">Mission Log (Story)</h2>
              <div className="space-y-24">
                {project.steps.map((step, idx) => (
                  <div key={idx} id={`step-${step.title.replace(/\s+/g, '-').toLowerCase()}`} className="space-y-8 scroll-mt-40">
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl font-black text-xl italic">{idx + 1}</div>
                       <h3 className="text-3xl font-black text-black tracking-tight uppercase italic">{step.title}</h3>
                    </div>
                    <p className="text-black text-lg leading-relaxed font-bold">
                      {step.content}
                    </p>
                    {step.media && step.media.length > 0 && (
                      <div className="rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-xl bg-slate-100 group">
                         <img src={step.media[0].url} className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="schematics" className="space-y-6 pt-12 border-t border-slate-100 scroll-mt-40 text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                <Layers className="w-12 h-12 text-black mx-auto mb-4" />
                <h2 className="text-xl font-black text-black uppercase tracking-widest">Wiring & Schematics</h2>
                <p className="text-black text-sm max-w-sm mx-auto uppercase tracking-tighter font-black">Detailed circuit diagrams are being prepared for this mission module.</p>
            </section>

            <section id="code" className="space-y-8 pt-12 border-t border-slate-100 scroll-mt-40">
               <h2 className="text-2xl font-black text-black uppercase tracking-tight">Code Logic</h2>
               <div className="bg-slate-900 rounded-[3rem] p-16 space-y-8 text-center shadow-2xl">
                 <div className="inline-flex p-5 bg-white/10 rounded-full mb-4">
                    <Code className="w-10 h-10 text-yellow-400" />
                 </div>
                 <div className="max-w-md mx-auto space-y-4">
                   <h4 className="text-xl font-black text-white uppercase italic">Interactive Source Code</h4>
                   <p className="text-white/60 text-sm leading-relaxed font-bold">
                     This project utilizes Microsoft MakeCode for block-based and JavaScript logic. Click below to view the actual code in the official editor.
                   </p>
                 </div>
                 {project.makecodeUrl ? (
                   <div className="pt-6">
                      <a 
                        href={project.makecodeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-yellow-400 text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:bg-white active:scale-95 group"
                      >
                        <ExternalLink className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" /> 
                        Launch MakeCode Editor
                      </a>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-8 truncate">
                        {project.makecodeUrl}
                      </p>
                   </div>
                 ) : (
                   <div className="bg-black/40 p-10 rounded-2xl border border-white/5">
                      <Terminal className="w-8 h-8 text-white/10 mx-auto mb-4" />
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No MakeCode link provided for this specific mission.</p>
                   </div>
                 )}
               </div>
            </section>

            <section id="comments" className="space-y-10 pt-12 border-t border-slate-100 scroll-mt-40 pb-40">
               <h2 className="text-2xl font-black text-black uppercase tracking-tight">Discussion ({comments.length})</h2>
               <form onSubmit={handleAddComment} className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-100 shadow-inner">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or share your build notes..."
                    className="w-full bg-transparent border-none outline-none text-black placeholder:text-slate-400 min-h-[100px] resize-none text-lg font-bold"
                  />
                  <div className="flex justify-end mt-4">
                    <button className="bg-black text-white px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-lg">Transmit Signal</button>
                  </div>
               </form>
               <div className="space-y-12 mt-12">
                  {comments.map(c => (
                    <div key={c.id} className="flex space-x-6 group">
                       <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-white border border-slate-200 overflow-hidden shadow-sm group-hover:rotate-3 transition-transform p-1">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${c.author}&backgroundColor=${AVATAR_BG}`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="flex-grow space-y-3">
                          <div className="flex items-center justify-between">
                             <span className="font-black text-black text-base uppercase tracking-tight">{c.author}</span>
                             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{c.timestamp}</span>
                          </div>
                          <p className="text-black text-lg leading-relaxed font-bold italic opacity-90">"{c.text}"</p>
                          <div className="flex items-center space-x-4">
                            <button onClick={() => handleLikeComment(c.id)} className="flex items-center space-x-2 text-[10px] font-black uppercase text-slate-500 hover:text-pink-600 transition-colors">
                               <ThumbsUp className={`w-3.5 h-3.5 ${likedComments.has(c.id) ? 'fill-pink-600 text-pink-600' : ''}`} />
                               <span>{c.likes}</span>
                            </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </main>

          <aside className="col-span-12 lg:col-span-3 space-y-10">
            <div className="space-y-6 bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-4">Mission Classification</h3>
              <div className="flex flex-wrap gap-2">
                {['robotics', 'iot', 'automation', 'esp32', 'coding', 'smart home'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white text-black text-[10px] font-black rounded-xl uppercase tracking-wider border border-slate-200 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black p-10 rounded-[3rem] shadow-2xl space-y-4 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                  <Trophy size={150} className="text-white" />
               </div>
               <div className="relative z-10">
                  <h4 className="text-2xl font-black uppercase italic leading-none text-yellow-400">Mission Reward</h4>
                  <p className="text-[12px] font-black text-white/60 leading-relaxed mt-6">Complete this mission to unlock your hardware certification on your profile.</p>
                  <button className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-yellow-400 shadow-xl active:scale-95">Claim Reward</button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
