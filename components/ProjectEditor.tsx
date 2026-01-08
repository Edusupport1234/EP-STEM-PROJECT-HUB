
import React, { useState, useRef, useEffect } from 'react';
import { Project, LessonStep, Hardware } from '../types';
import { 
  ArrowLeft, Plus, Trash2, Image as ImageIcon, 
  Cpu, Layout as LayoutIcon, Type, CheckCircle2, Link as LinkIcon,
  ChevronDown, Code, X, Video, Zap, MousePointer2, Save, Upload, Loader2, Link2Icon, ExternalLink
} from 'lucide-react';
import { uploadFile } from '../services/firebase';

interface ProjectEditorProps {
  onSave: (project: Project) => void;
  onCancel: () => void;
  initialProject?: Project;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ onSave, onCancel, initialProject }) => {
  const [title, setTitle] = useState(initialProject?.title || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [thumbnail, setThumbnail] = useState(initialProject?.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800');
  const [difficulty, setDifficulty] = useState<Project['difficulty']>(initialProject?.difficulty || 'Beginner');
  const [category, setCategory] = useState<Project['category']>(initialProject?.category || 'IoT');
  const [duration, setDuration] = useState(initialProject?.duration || '1 Hour');
  const [mainMakecodeUrl, setMainMakecodeUrl] = useState(initialProject?.makecodeUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  
  const [steps, setSteps] = useState<LessonStep[]>(initialProject?.steps || [
    { title: 'Project Overview', content: 'Describe what your project does here...', media: [] }
  ]);
  
  const [hardware, setHardware] = useState<Hardware[]>(initialProject?.hardware || [
    { name: 'Microcontroller', link: '', image: 'https://picsum.photos/id/1/100/100' }
  ]);

  const [linkEditorOpen, setLinkEditorOpen] = useState<{ isOpen: boolean; index: number | 'main' }>({ isOpen: false, index: 'main' });
  const [tempUrl, setTempUrl] = useState('');

  // Update form if initialProject changes (unlikely in current flow but good for robustness)
  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setDescription(initialProject.description);
      setThumbnail(initialProject.thumbnail);
      setDifficulty(initialProject.difficulty);
      setCategory(initialProject.category);
      setDuration(initialProject.duration);
      setMainMakecodeUrl(initialProject.makecodeUrl || '');
      setSteps(initialProject.steps);
      setHardware(initialProject.hardware);
    }
  }, [initialProject]);

  const addStep = () => {
    setSteps([...steps, { title: 'New Step', content: '', media: [] }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof LessonStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const openLinkEditor = (index: number | 'main', currentVal: string) => {
    setTempUrl(currentVal);
    setLinkEditorOpen({ isOpen: true, index });
  };

  const saveUrl = () => {
    if (linkEditorOpen.index === 'main') {
      setMainMakecodeUrl(tempUrl);
    } else {
      updateStep(linkEditorOpen.index as number, 'makecodeUrl', tempUrl);
    }
    setLinkEditorOpen({ isOpen: false, index: 'main' });
  };

  const addStepMediaLink = (idx: number) => {
    const url = prompt("Enter Image or Video URL (e.g., from ImageKit):");
    if (url) {
      const updatedSteps = [...steps];
      const isVideo = url.includes('.mp4') || url.includes('video');
      updatedSteps[idx].media = [...(updatedSteps[idx].media || []), { 
        url, 
        type: isVideo ? 'video' : 'image' 
      }];
      setSteps(updatedSteps);
    }
  };

  const removeMedia = (stepIndex: number, mediaIndex: number) => {
    const updatedSteps = [...steps];
    const media = [...(updatedSteps[stepIndex].media || [])];
    media.splice(mediaIndex, 1);
    updatedSteps[stepIndex].media = media;
    setSteps(updatedSteps);
  };

  const addHardware = () => {
    setHardware([...hardware, { name: '', link: '', image: 'https://picsum.photos/id/1/100/100' }]);
  };

  const removeHardware = (index: number) => {
    setHardware(hardware.filter((_, i) => i !== index));
  };

  const updateHardware = (index: number, field: keyof Hardware, value: any) => {
    const newHardware = [...hardware];
    newHardware[index] = { ...newHardware[index], [field]: value };
    setHardware(newHardware);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: initialProject?.id || Date.now().toString(),
      title: title || 'Untitled Project',
      description,
      author: initialProject?.author || 'STEM Academy Admin',
      difficulty,
      category,
      thumbnail,
      views: initialProject?.views || 0,
      likes: initialProject?.likes || 0,
      duration,
      hardware,
      software: [],
      steps,
      comments: initialProject?.comments || [],
      publishedAt: initialProject?.publishedAt || new Date().toISOString().split('T')[0],
      makecodeUrl: mainMakecodeUrl
    };
    onSave(newProject);
  };

  const inputClasses = "w-full bg-slate-100 border-2 border-slate-200 focus:border-black focus:bg-white rounded-2xl p-4 text-sm font-black text-black transition-all outline-none h-[58px]";
  const labelClasses = "block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
      
      {linkEditorOpen.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-t-8 border-yellow-400">
              <div className="flex items-center space-x-6 mb-10">
                 <div className="p-4 bg-black text-yellow-400 rounded-2xl shadow-xl">
                    <Code className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight italic">Link MakeCode Logic</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connect your source code</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div>
                    <label className={labelClasses}>Project Logic URL</label>
                    <div className="relative">
                      <input 
                        type="url"
                        autoFocus
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        placeholder="Paste https://makecode.microbit.org/_... here"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-black rounded-2xl p-5 text-sm font-black text-black outline-none transition-all shadow-inner"
                      />
                    </div>
                 </div>
                 
                 <div className="flex space-x-4 pt-4">
                    <button 
                      onClick={saveUrl}
                      className="flex-grow bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-xl flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-3" /> Save Changes
                    </button>
                    <button 
                      onClick={() => setLinkEditorOpen({ isOpen: false, index: 'main' })}
                      className="px-10 bg-slate-100 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200"
                    >
                      Back
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onCancel}
          className="flex items-center text-black font-black text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSubmit}
            className="bg-black text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center hover:bg-yellow-400 hover:text-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> {initialProject ? 'Update Mission' : 'Publish Project'}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border-4 border-slate-100 shadow-sm">
           <div className="flex items-center mb-10">
              <div className="bg-black p-3 rounded-2xl mr-5 shadow-lg">
                 <Type className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">Mission Identity</h2>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Metadata & Fundamentals</p>
              </div>
           </div>
           
           <div className="space-y-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-full md:w-1/3">
                    <label className={labelClasses}>Cover Image URL</label>
                    <div className="space-y-3">
                      <input 
                        type="url" 
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="Paste link..."
                        className={inputClasses}
                      />
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex flex-col items-center justify-center relative shadow-inner">
                         <img 
                          src={thumbnail} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Link'; }}
                         />
                      </div>
                    </div>
                 </div>
                 <div className="flex-grow space-y-8 w-full">
                    <div>
                      <label className={labelClasses}>Project Title</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Mission Name..."
                        className={`${inputClasses} text-xl !h-[72px] uppercase italic`}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Tagline (Brief Objective)</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What are we building today?"
                        className="w-full bg-slate-100 border-2 border-slate-200 focus:border-black focus:bg-white rounded-2xl p-6 text-lg font-bold text-black transition-all outline-none min-h-[120px]"
                      />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Category</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      {['IoT', 'Robotics', 'AI', 'Electronics', '3D Printing'].map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Difficulty</label>
                  <div className="relative">
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Mission Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2 Hours"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-slate-100 border-2 border-slate-200 flex items-center justify-between group hover:border-black transition-all shadow-inner">
                <div className="flex items-center space-x-6">
                   <div className="p-4 bg-black text-yellow-400 rounded-2xl shadow-xl">
                      <Code className="w-8 h-8" />
                   </div>
                   <div className="max-w-[300px]">
                      <h4 className="font-black text-black uppercase tracking-tight leading-none mb-1">MakeCode Source Link</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
                         {mainMakecodeUrl || "Not yet configured"}
                      </p>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => openLinkEditor('main', mainMakecodeUrl)}
                  className="bg-white border-2 border-slate-200 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm"
                >
                   {mainMakecodeUrl ? "Update Link" : "Attach Code"}
                </button>
              </div>
           </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border-4 border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <div className="bg-black p-3 rounded-2xl mr-5">
                   <LayoutIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black uppercase tracking-tight">Mission Protocol (Steps)</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Procedural Logic</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={addStep}
                className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-yellow-400 hover:text-black transition-all shadow-xl active:scale-95"
              >
                <Plus className="w-4 h-4 mr-2" /> New Protocol
              </button>
           </div>

           <div className="space-y-24">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group/step animate-in fade-in slide-in-from-bottom-4">
                  <div className="absolute left-[-32px] md:left-[-48px] top-0 h-full w-2 bg-slate-100 group-hover/step:bg-yellow-400 transition-all rounded-full" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-black text-black opacity-20 italic">#{idx + 1}</span>
                      <input 
                        type="text" 
                        value={step.title}
                        onChange={(e) => updateStep(idx, 'title', e.target.value)}
                        placeholder="Protocol Title..."
                        className="text-2xl font-black text-black bg-transparent border-b-4 border-slate-100 focus:border-black outline-none w-full transition-all pb-2 uppercase italic"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="ml-6 p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>

                  <textarea 
                    value={step.content}
                    onChange={(e) => updateStep(idx, 'content', e.target.value)}
                    placeholder="Provide detailed mission instructions..."
                    className="w-full bg-slate-100 border-2 border-slate-200 focus:border-black focus:bg-white rounded-[2.5rem] p-10 text-xl font-bold text-black transition-all outline-none min-h-[200px] shadow-inner mb-6"
                  />
                  {/* ... Rest of steps UI darkens similarly ... */}
                  <div className="flex flex-wrap gap-4">
                    <button 
                      type="button"
                      onClick={() => addStepMediaLink(idx)}
                      className="flex items-center text-[10px] font-black text-black hover:text-blue-600 uppercase tracking-widest transition-colors"
                    >
                      <Link2Icon className="w-5 h-5 mr-2" /> Link Media Asset
                    </button>
                    <button 
                      type="button"
                      onClick={() => openLinkEditor(idx, step.makecodeUrl || '')}
                      className="flex items-center text-[10px] font-black text-black hover:text-blue-600 uppercase tracking-widest transition-colors"
                    >
                      <Code className="w-5 h-5 mr-2" /> Step Source Code
                    </button>
                  </div>
                </div>
              ))}
           </div>
        </section>
        {/* Hardware section and footer darkened for visibility */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border-4 border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center">
                <div className="bg-black p-3 rounded-2xl mr-5">
                   <Cpu className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-black uppercase tracking-tight">Mission Arsenal</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Hardware Components</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={addHardware}
                className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-yellow-400 hover:text-black transition-all shadow-xl active:scale-95"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Part
              </button>
           </div>

           <div className="space-y-6">
              {hardware.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-6 bg-slate-50 p-6 rounded-[2.5rem] group border-2 border-slate-100 hover:border-black transition-all shadow-sm">
                  <div className="w-20 h-20 bg-white rounded-3xl flex-shrink-0 flex items-center justify-center border-2 border-slate-100 overflow-hidden p-3 shadow-inner">
                     <img src={item.image} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Part Name</span>
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => updateHardware(idx, 'name', e.target.value)}
                        placeholder="e.g. Servo Motor"
                        className="w-full bg-transparent border-none outline-none text-lg font-black text-black placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Procurement URL</span>
                      <input 
                        type="text" 
                        value={item.link}
                        onChange={(e) => updateHardware(idx, 'link', e.target.value)}
                        placeholder="Link to part..."
                        className="w-full bg-transparent border-none outline-none text-[11px] font-black text-black uppercase tracking-widest truncate"
                      />
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeHardware(idx)}
                    className="p-3 text-slate-200 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
           </div>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16">
            <div className="flex items-center space-x-6">
               <div className="w-12 h-12 rounded-3xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                  <Zap className="w-6 h-6 fill-white" />
               </div>
               <p className="text-[11px] font-black text-black uppercase tracking-widest max-w-[240px] leading-relaxed">
                  Mission briefing will be synchronized with the entire STEM Academy grid.
               </p>
            </div>
            <div className="flex items-center space-x-6 w-full md:w-auto">
               <button 
                type="button"
                onClick={onCancel}
                className="flex-grow md:flex-none px-12 py-5 bg-slate-100 text-black border-2 border-slate-200 rounded-3xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
               >
                 Abort
               </button>
               <button 
                type="submit"
                onClick={handleSubmit}
                className="flex-grow md:flex-none px-16 py-6 bg-black text-white rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-yellow-400 hover:text-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center group"
               >
                 <CheckCircle2 className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" /> Commit Mission
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
