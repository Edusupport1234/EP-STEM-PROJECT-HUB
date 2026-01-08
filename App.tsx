
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ProjectEditor from './components/ProjectEditor';
import CommunityView from './components/CommunityView';
import LiveSpaceBackground from './components/LiveSpaceBackground';
import { MOCK_PROJECTS, CATEGORIES, AVATAR_BG } from './constants';
import { AppState, Project, CommunityPost, User, InteractiveProject, Comment } from './types';
import { Sparkles, Search, Calendar, Play, Star, Monitor, ChevronDown, Trophy, Shield, Key, ArrowRight, User as UserIcon, X, Check, Cpu } from 'lucide-react';
import { db } from './services/firebase';
import { ref, onValue, set, push, update, remove } from "firebase/database";

const AVATAR_SEEDS = Array.from({ length: 24 }, (_, i) => `Robot-${i + 1}`);

const LoginForm: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SEEDS[0]);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${AVATAR_BG}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const trimmedUser = username.trim();
      const finalAvatarUrl = getAvatarUrl(selectedAvatar);
      
      if (trimmedUser === 'EPSUPPORT1234' && password === 'EP1234@$#') {
        onLogin({ username: 'EPSUPPORT1234', role: 'admin', avatarSeed: finalAvatarUrl });
      } else if (password === 'EP1234@') {
        onLogin({ username: trimmedUser || 'Cadet', role: 'user', avatarSeed: finalAvatarUrl });
      } else {
        setError('Invalid Security Code. Contact Instructor.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 z-0">
        <LiveSpaceBackground />
      </div>
      
      <div className="bg-white/10 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] w-full max-w-xl relative z-10 animate-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-baseline space-x-1">
               <span className="text-[#f43f5e] font-black text-5xl italic drop-shadow-lg">S</span>
               <span className="text-[#fbbf24] font-black text-5xl italic drop-shadow-lg">T</span>
               <span className="text-[#10b981] font-black text-5xl italic drop-shadow-lg">E</span>
               <span className="text-[#0ea5e9] font-black text-5xl italic drop-shadow-lg">M</span>
            </div>
            <div className="bg-[#0ea5e9] px-4 py-1.5 mt-2 rounded-lg">
               <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">MISSION CONTROL</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Enter the Hub</h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Initialize Security Protocols</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col items-center mb-8">
            <button 
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group focus:outline-none"
            >
              <div className="w-28 h-28 rounded-[2rem] bg-white/10 border-4 border-white/20 overflow-hidden transition-all group-hover:scale-110 group-hover:border-yellow-400 shadow-2xl">
                <img 
                  src={getAvatarUrl(selectedAvatar)} 
                  alt="Selected Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-blue-900 p-2 rounded-xl shadow-lg border-2 border-white group-hover:rotate-12 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center">
              <UserIcon className="w-3 h-3 mr-2" /> Username / Call Sign
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-8 text-white text-xl font-bold focus:border-yellow-400 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
              placeholder="e.g. RobotMaster99"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2 flex items-center">
              <Key className="w-3 h-3 mr-2" /> Security Key
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-5 px-8 text-white text-xl font-bold focus:border-yellow-400 focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center space-x-3 animate-in shake duration-500">
               <Shield className="w-5 h-5 text-red-500" />
               <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-[#6b1e8e] py-6 rounded-2xl font-black text-lg uppercase tracking-[0.3em] shadow-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-[#6b1e8e]/30 border-t-[#6b1e8e] rounded-full animate-spin" />
            ) : (
              <>
                JOIN MISSION <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white/10 border border-white/20 w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">CHOOSE YOUR ROBOT</h3>
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mt-1">Select your academy profile identity</p>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-4 bg-white/5 rounded-2xl hover:bg-red-500 transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => {
                      setSelectedAvatar(seed);
                      setIsAvatarModalOpen(false);
                    }}
                    className={`relative rounded-2xl border-4 transition-all group overflow-hidden ${
                      selectedAvatar === seed 
                        ? 'bg-yellow-400 border-white shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-110' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={getAvatarUrl(seed)} 
                      className="w-full aspect-square object-cover"
                      alt={seed}
                    />
                    {selectedAvatar === seed && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white p-1 rounded-full shadow-lg">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-4 px-6 py-3 border border-white/20 rounded-xl bg-[#1a1a2e]/60 backdrop-blur-md text-[13px] font-bold text-white hover:border-yellow-400/50 hover:bg-[#1a1a2e]/80 transition-all min-w-[180px] justify-between shadow-2xl"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-400' : 'text-white/40'}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[100] py-3 animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-2xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-[#6b1e8e] transition-all ${
                value === opt ? 'text-yellow-400 bg-white/5' : 'text-white/60 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<InteractiveProject[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [state, setState] = useState<AppState>({
    currentView: 'grid',
    selectedProjectId: null,
    searchQuery: '',
    activeCategory: 'All projects',
    activeDifficulty: 'All difficulties',
    activeSort: 'Trending',
    user: null,
  });

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Fetch Projects from Firebase
  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
          comments: data[key].comments ? Object.values(data[key].comments) : [],
          hardware: data[key].hardware || [],
          steps: data[key].steps || [],
        }));
        setProjects(projectList);
      } else {
        setProjects(MOCK_PROJECTS);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Community Posts from Firebase
  useEffect(() => {
    const postsRef = ref(db, 'communityPosts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postList = Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
        setCommunityPosts(postList);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => {
      const title = p.title ?? "";
      const description = p.description ?? "";
      const search = state.searchQuery.toLowerCase();
      
      const matchesSearch = title.toLowerCase().includes(search) ||
                            description.toLowerCase().includes(search);
                            
      const matchesCategory = state.activeCategory === 'All' || state.activeCategory === 'All projects' || p.category === state.activeCategory;
      const matchesDifficulty = state.activeDifficulty === 'All difficulties' || p.difficulty === state.activeDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (state.activeSort === 'Trending') {
      result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (state.activeSort === 'Most Liked') {
      result = [...result].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (state.activeSort === 'Newest') {
      result = [...result].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [state.searchQuery, state.activeCategory, state.activeDifficulty, state.activeSort, projects]);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === state.selectedProjectId);
  }, [state.selectedProjectId, projects]);

  const projectToEdit = useMemo(() => {
    return projects.find(p => p.id === editingProjectId);
  }, [editingProjectId, projects]);

  const handleProjectClick = (id: string) => {
    const projectRef = ref(db, `projects/${id}`);
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) {
      update(projectRef, { views: (currentProject.views || 0) + 1 });
    }
    setState(prev => ({ ...prev, currentView: 'detail', selectedProjectId: id }));
    window.scrollTo(0, 0);
  };

  const handleToggleLike = (id: string) => {
    const projectRef = ref(db, `projects/${id}`);
    const currentProject = projects.find(p => p.id === id);
    if (currentProject) {
      const currentlyLiked = currentProject.isLikedByUser || false;
      update(projectRef, {
        likes: currentlyLiked ? Math.max(0, (currentProject.likes || 0) - 1) : (currentProject.likes || 0) + 1,
      });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, isLikedByUser: !currentlyLiked } : p));
    }
  };

  const handleSaveProject = async (newProject: Project) => {
    if (editingProjectId) {
      const projectRef = ref(db, `projects/${editingProjectId}`);
      const existing = projects.find(p => p.id === editingProjectId);
      await set(projectRef, { 
        ...newProject, 
        id: editingProjectId,
        views: existing?.views || 0,
        likes: existing?.likes || 0 
      });
      setEditingProjectId(null);
    } else {
      const projectsRef = ref(db, 'projects');
      const newProjectRef = push(projectsRef);
      await set(newProjectRef, { ...newProject, id: newProjectRef.key });
    }
    setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleDeleteProject = async (id: string) => {
    const projectRef = ref(db, `projects/${id}`);
    await remove(projectRef);
    setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleHome = () => {
    setEditingProjectId(null);
    setState(prev => ({ ...prev, currentView: 'grid', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleCreate = () => {
    setEditingProjectId(null);
    setState(prev => ({ ...prev, currentView: 'create', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleEdit = (id: string) => {
    setEditingProjectId(id);
    setState(prev => ({ ...prev, currentView: 'create', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleCommunity = () => {
    setState(prev => ({ ...prev, currentView: 'community', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleChallenges = () => {
    setState(prev => ({ ...prev, currentView: 'challenges', selectedProjectId: null }));
    window.scrollTo(0, 0);
  };

  const handleAddCommunityPost = async (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'timestamp'> & { id?: string }) => {
    if (post.id) {
      const postRef = ref(db, `communityPosts/${post.id}`);
      const current = communityPosts.find(p => p.id === post.id);
      await update(postRef, {
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category
      });
    } else {
      const postsRef = ref(db, 'communityPosts');
      const newPostRef = push(postsRef);
      await set(newPostRef, {
        ...post,
        id: newPostRef.key,
        likes: 0,
        commentsCount: 0,
        timestamp: new Date().toLocaleDateString(),
        authorAvatar: user?.avatarSeed
      });
    }
  };

  const handleDeleteCommunityPost = async (id: string) => {
    const postRef = ref(db, `communityPosts/${id}`);
    await remove(postRef);
  };

  const handlePostVote = async (postId: string, direction: 1 | -1) => {
    const postRef = ref(db, `communityPosts/${postId}`);
    const currentPost = communityPosts.find(p => p.id === postId);
    if (currentPost) {
      await update(postRef, {
        likes: (currentPost.likes || 0) + direction
      });
    }
  };

  const handleAddProjectComment = async (projectId: string, comment: Comment) => {
    const commentsRef = ref(db, `projects/${projectId}/comments`);
    const newCommentRef = push(commentsRef);
    await set(newCommentRef, { ...comment, id: newCommentRef.key });
  };

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <Layout 
      onSearch={(val) => setState(prev => ({ ...prev, searchQuery: val }))}
      onHome={handleHome}
      onCreate={handleCreate}
      onCommunity={handleCommunity}
      onChallenges={handleChallenges}
      onLogout={() => setUser(null)}
      activeView={state.currentView}
      user={user}
    >
      {state.currentView === 'grid' && (
        <div className="pb-40 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <section className="relative overflow-hidden py-32 px-4">
            <div className="container mx-auto max-w-5xl text-center relative z-10">
              <h1 className="text-6xl md:text-9xl font-black mb-12 text-white uppercase tracking-tighter drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-top-10 duration-1000">
                LEARN NEW <br className="hidden md:block" /> SKILLS NOW
              </h1>
              <div className="relative max-w-3xl mx-auto mb-10 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-yellow-400 to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-700"></div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search projects, hardware, or lessons..."
                    className="w-full bg-white border-none rounded-full py-7 px-14 text-slate-900 text-2xl shadow-2xl focus:ring-4 focus:ring-yellow-400/50 outline-none placeholder:text-slate-400 font-bold tracking-tight"
                    onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  />
                  <Search className="absolute right-10 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-purple-600 transition-colors" />
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 mt-10 relative z-10">
            <div className="bg-[#0a0118]/80 backdrop-blur-3xl rounded-[4rem] p-12 lg:p-20 border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.7)]">
              <div className="mb-14">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">Explore projects</h2>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-yellow-400/50 via-white/10 to-transparent mb-12" />
                <div className="flex flex-wrap items-center gap-5">
                  <FilterDropdown 
                    label="Trending" 
                    value={state.activeSort} 
                    options={['Trending', 'Newest', 'Most Liked']} 
                    onChange={(val) => setState(prev => ({ ...prev, activeSort: val }))}
                  />
                  <FilterDropdown 
                    label="All difficulties" 
                    value={state.activeDifficulty} 
                    options={['All difficulties', 'Beginner', 'Intermediate', 'Advanced']} 
                    onChange={(val) => setState(prev => ({ ...prev, activeDifficulty: val }))}
                  />
                  <FilterDropdown 
                    label="All projects" 
                    value={state.activeCategory} 
                    options={['All projects', ...CATEGORIES.filter(c => c !== 'All')]} 
                    onChange={(val) => setState(prev => ({ ...prev, activeCategory: val }))}
                  />
                </div>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 mt-16">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={handleProjectClick}
                      onToggleLike={handleToggleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-48 bg-white/5 rounded-[4rem] border border-white/5 mt-12 flex flex-col items-center">
                   <div className="bg-white/5 w-28 h-28 rounded-[3rem] flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
                      <Search className="w-12 h-12 text-white/20" />
                   </div>
                   <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">No Projects found</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {state.currentView === 'community' && (
        <CommunityView 
          posts={communityPosts}
          onAddPost={handleAddCommunityPost}
          onDeletePost={handleDeleteCommunityPost}
          onVote={handlePostVote}
          onBack={handleHome}
          user={user}
        />
      )}

      {state.currentView === 'challenges' && (
        <div className="container mx-auto px-4 py-32 text-center">
           <div className="bg-[#0a0118]/90 backdrop-blur-3xl rounded-[5rem] p-24 md:p-32 border border-white/10 max-w-5xl mx-auto shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-yellow-400 to-blue-500"></div>
              <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-14 animate-bounce drop-shadow-[0_0_50px_rgba(250,204,21,0.5)]" />
              <h1 className="text-7xl md:text-9xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none">COMING <br/> SOON!</h1>
              <button onClick={handleHome} className="mt-16 bg-white text-[#6b1e8e] px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-yellow-400 hover:scale-110 active:scale-95 transition-all">
                Return to Mission Control
              </button>
           </div>
        </div>
      )}

      {state.currentView === 'detail' && selectedProject && (
        <div className="bg-slate-50 min-h-screen text-slate-900 relative z-10 animate-in fade-in zoom-in-95 duration-500">
           <ProjectDetail 
            project={selectedProject} 
            onBack={handleHome}
            onToggleLike={() => handleToggleLike(selectedProject.id)}
            onAddComment={(comment) => handleAddProjectComment(selectedProject.id, comment)}
            user={user}
            onEdit={() => handleEdit(selectedProject.id)}
            onDelete={() => handleDeleteProject(selectedProject.id)}
          />
        </div>
      )}

      {state.currentView === 'create' && user.role === 'admin' && (
        <div className="bg-slate-50 min-h-screen text-slate-900 relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-500">
          <ProjectEditor 
            onSave={handleSaveProject}
            onCancel={handleHome}
            initialProject={projectToEdit}
          />
        </div>
      )}
    </Layout>
  );
};

export default App;
