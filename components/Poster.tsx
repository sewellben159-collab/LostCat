import React from 'react';
import { CatProfile } from '../types';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

interface PosterProps {
  data: CatProfile;
  id?: string;
}

export const Poster: React.FC<PosterProps> = ({ data, id }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.lastSeenAddress)}`;
  
  // Create a QR code URL (using a public API for this demo to keep it pure React)
  // In a real production app, we might bundle a QR lib, but this works for the demo.
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(googleMapsUrl)}`;

  return (
    <div 
      id={id}
      className="bg-white text-black w-full aspect-[1/1.414] shadow-2xl overflow-hidden relative flex flex-col items-center p-8 md:p-12 mx-auto max-w-2xl border-t-8 border-red-600"
    >
      {/* Header */}
      <div className="w-full text-center mb-6">
        <h1 className="text-7xl md:text-8xl font-black text-red-600 tracking-tighter uppercase leading-none mb-2">
          Lost Cat
        </h1>
        <div className="w-full h-2 bg-black mb-4"></div>
        <div className="flex justify-between items-end px-4">
            <h2 className="text-4xl md:text-5xl font-bold uppercase truncate max-w-[70%] text-left">
            {data.name}
            </h2>
            <span className="text-gray-500 font-bold uppercase text-xl tracking-widest">Reward? Yes</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 md:h-[500px] border-4 border-black relative bg-gray-100 mb-6 flex items-center justify-center overflow-hidden">
        {data.photoDataUrl ? (
          <img 
            src={data.photoDataUrl} 
            alt="Lost Cat" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <AlertTriangle size={64} />
            <span className="mt-2 text-xl font-bold uppercase">No Photo Available</span>
          </div>
        )}
        
        {/* Banner Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center">
          <p className="text-xl md:text-2xl font-bold uppercase">
            Please Help Bring Me Home
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="w-full flex-grow flex flex-col justify-between space-y-4">
        
        <div className="bg-red-50 p-6 border-l-4 border-red-600">
            <div className="flex items-start gap-4 mb-3">
                <MapPin className="text-red-600 shrink-0 mt-1" size={32} />
                <div>
                    <h3 className="font-bold text-lg uppercase text-gray-700">Last Seen Location</h3>
                    <p className="text-2xl font-black leading-tight">{data.lastSeenAddress}</p>
                    <p className="text-lg text-gray-600 font-medium">Date: {new Date(data.lastSeenDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        <div className="text-center px-4">
            <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-gray-800">
                "{data.description}"
            </p>
            {data.features.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {data.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 bg-black text-white font-bold uppercase text-sm rounded-full">
                            {feature}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {/* Footer / Contact */}
        <div className="w-full mt-auto pt-6 border-t-4 border-black flex flex-row items-center justify-between">
            <div className="flex-1">
                <p className="text-gray-500 uppercase font-bold tracking-widest text-sm mb-1">If seen, please contact:</p>
                <div className="flex items-center gap-3">
                    <Phone className="fill-current text-black" size={42} />
                    <div className="flex flex-col">
                        <span className="text-5xl md:text-6xl font-black tracking-tighter leading-none">{data.phone}</span>
                        <span className="text-xl font-bold uppercase">{data.ownerName}</span>
                    </div>
                </div>
            </div>
            
            {/* QR Code Section */}
            <div className="hidden md:flex flex-col items-center ml-4">
                <img src={qrCodeUrl} alt="Location Map" className="w-24 h-24 border border-gray-300" />
                <span className="text-[10px] font-bold uppercase mt-1 tracking-wider text-gray-500">Scan for Map</span>
            </div>
        </div>
      </div>
    </div>
  );
};