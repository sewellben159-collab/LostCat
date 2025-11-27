import React, { useState, useRef } from 'react';
import { CatProfile, AppStep } from './types';
import { Poster } from './components/Poster';
import { generateOptimizedDescription } from './services/geminiService';
import { 
  Cat, 
  MapPin, 
  Camera, 
  Share2, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  ChevronLeft,
  AlertCircle,
  Download
} from 'lucide-react';

const INITIAL_STATE: CatProfile = {
  name: '',
  breed: '',
  color: '',
  lastSeenAddress: '',
  lastSeenDate: new Date().toISOString().split('T')[0],
  ownerName: '',
  phone: '',
  description: '',
  photoDataUrl: null,
  features: []
};

function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [data, setData] = useState<CatProfile>(INITIAL_STATE);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, photoDataUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleAiGenerate = async () => {
    if (!data.name || !data.lastSeenAddress) {
        alert("Please provide at least a name and location for the AI to work.");
        return;
    }
    setIsAiLoading(true);
    try {
      const desc = await generateOptimizedDescription(data);
      setData(prev => ({ ...prev, description: desc }));
    } catch (e) {
      console.error(e);
      alert("AI Generation failed. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform: 'whatsapp' | 'facebook') => {
    const text = `Help! My cat ${data.name} is lost. Last seen at ${data.lastSeenAddress}. Please share!`;
    const url = window.location.href; // In a real app, this would be a permalink
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        // Facebook requires a real URL, so we just open a generic share for demo
       window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://github.com/Bashlostcat/lostcat")}&quote=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // --- RENDER STEPS ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gradient-to-b from-red-50 to-white">
      <div className="bg-red-100 p-6 rounded-full mb-8 animate-pulse">
        <Cat size={64} className="text-red-600" />
      </div>
      <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
        LOST <span className="text-red-600">CAT</span>?
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
        Don't panic. Create a professional, high-visibility poster and social media campaign in seconds. 
        Free and open source.
      </p>
      <button 
        onClick={() => setStep(AppStep.DETAILS)}
        className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-5 px-10 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center gap-3"
      >
        Start Campaign <ArrowRight />
      </button>
      
      <div className="mt-12 flex gap-8 text-gray-400">
        <div className="flex flex-col items-center">
            <Printer className="mb-2" />
            <span className="text-sm">Print Ready</span>
        </div>
        <div className="flex flex-col items-center">
            <MapPin className="mb-2" />
            <span className="text-sm">Smart Maps</span>
        </div>
        <div className="flex flex-col items-center">
            <Share2 className="mb-2" />
            <span className="text-sm">Instant Share</span>
        </div>
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => setStep(AppStep.LANDING)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft />
        </button>
        <h2 className="text-3xl font-bold text-gray-900">The Essentials</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cat's Name</label>
                <input 
                    name="name" 
                    value={data.name} 
                    onChange={handleInputChange}
                    placeholder="e.g. Whiskers"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Breed / Type</label>
                <input 
                    name="breed" 
                    value={data.breed} 
                    onChange={handleInputChange}
                    placeholder="e.g. Tabby, Siamese"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Last Seen Address</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                    name="lastSeenAddress" 
                    value={data.lastSeenAddress} 
                    onChange={handleInputChange}
                    placeholder="Full street address, City, Zip"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 pl-10 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date Missing</label>
                <input 
                    type="date"
                    name="lastSeenDate" 
                    value={data.lastSeenDate} 
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Distinctive Features</label>
                <div className="flex gap-2">
                    <input 
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                        placeholder="e.g. White paws, Blue collar"
                        className="flex-1 border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                    />
                    <button 
                        onClick={addFeature}
                        className="bg-gray-900 text-white px-4 rounded-lg font-bold"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.features.map((f, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">{f}</span>
                    ))}
                </div>
            </div>
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
                <input 
                    name="ownerName" 
                    value={data.ownerName} 
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Phone</label>
                <input 
                    name="phone" 
                    value={data.phone} 
                    onChange={handleInputChange}
                    placeholder="(555) 000-0000"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                />
            </div>
        </div>

        <button 
            onClick={() => setStep(AppStep.PHOTO)}
            disabled={!data.name || !data.lastSeenAddress}
            className="w-full bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg mt-6 flex justify-center items-center gap-2"
        >
            Next: Add Photo <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderPhotoAndDescription = () => (
    <div className="max-w-2xl mx-auto py-12 px-6">
       <div className="mb-8 flex items-center gap-4">
        <button onClick={() => setStep(AppStep.DETAILS)} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft />
        </button>
        <h2 className="text-3xl font-bold text-gray-900">Photo & Details</h2>
      </div>

      <div className="space-y-8">
        {/* Photo Upload */}
        <div className="border-4 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-400 transition-colors bg-gray-50 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
            />
            {data.photoDataUrl ? (
                <div className="relative">
                    <img src={data.photoDataUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-md" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <p className="text-white font-bold flex items-center gap-2"><Camera /> Change Photo</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-red-500 transition-colors">
                    <Camera size={48} className="mb-4" />
                    <p className="text-lg font-bold">Upload a clear photo</p>
                    <p className="text-sm">Tap to browse</p>
                </div>
            )}
        </div>

        {/* AI Description */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Description</label>
                <button 
                    onClick={handleAiGenerate}
                    disabled={isAiLoading}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-purple-200 transition-colors"
                >
                    <Sparkles size={12} /> {isAiLoading ? 'Writing...' : 'Write with AI'}
                </button>
            </div>
            <textarea 
                name="description" 
                value={data.description} 
                onChange={handleInputChange}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Describe the situation..."
            />
            <p className="text-xs text-gray-500 mt-2">
                Tip: Use the AI button to generate an emotional, high-impact description based on your inputs.
            </p>
        </div>

        <button 
            onClick={() => setStep(AppStep.PREVIEW)}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 rounded-lg shadow-lg flex justify-center items-center gap-2"
        >
            Generate Poster <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-4 flex justify-between items-center">
         <button onClick={() => setStep(AppStep.PHOTO)} className="text-gray-600 font-bold flex items-center gap-2 text-sm md:text-base">
            <ChevronLeft /> Edit
        </button>
        <span className="font-black text-red-600 text-xl tracking-tight hidden md:inline">LOSTCAT</span>
        <div className="flex gap-2">
            <button onClick={() => handleShare('whatsapp')} className="p-2 md:px-4 md:py-2 bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-600">
                <Share2 size={18} /> <span className="hidden md:inline">WhatsApp</span>
            </button>
            <button onClick={handlePrint} className="p-2 md:px-4 md:py-2 bg-gray-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-black">
                <Printer size={18} /> <span className="hidden md:inline">Print / PDF</span>
            </button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            {/* The Poster */}
            <div className="w-full lg:w-auto shadow-2xl">
                <Poster id="printable-poster" data={data} />
            </div>

            {/* Sidebar Actions */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="text-red-500" /> Sighting Map
                    </h3>
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                         {/* Placeholder for map visual */}
                         <div className="absolute inset-0 flex items-center justify-center bg-blue-50 text-blue-300">
                            <MapPin size={48} />
                         </div>
                         <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            style={{ border: 0, opacity: 0.8 }}
                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(data.lastSeenAddress)}`}
                            // Note: Without a real key, this might show an error or gray box, handled by UI fallback above visually
                            // For the demo, we rely on the direct link below
                            onLoad={(e) => (e.target as HTMLIFrameElement).style.opacity = '1'}
                         ></iframe>
                    </div>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.lastSeenAddress)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        Open Google Maps
                    </a>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="text-orange-500" /> Next Steps
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Print 20 copies of this poster.</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Post at eye-level near last seen spot.</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Share the WhatsApp link with neighbors.</li>
                        <li className="flex gap-2"><span className="text-green-500">✓</span> Put their litter box outside (scent helps).</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900 min-h-screen">
      {step === AppStep.LANDING && renderLanding()}
      {step === AppStep.DETAILS && renderDetailsForm()}
      {step === AppStep.PHOTO && renderPhotoAndDescription()}
      {step === AppStep.PREVIEW && renderPreview()}
    </div>
  );
}

export default App;