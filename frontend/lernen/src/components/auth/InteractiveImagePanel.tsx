import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';

export const InteractiveImagePanel: React.FC = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Main Video Frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] group border-4 border-white/20 backdrop-blur-sm bg-gradient-to-br from-teal-600/20 to-emerald-600/20">
                <img 
                    src="https://picsum.photos/seed/teacher/800/600" 
                    alt="Online tutoring session" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all duration-300 transform group-hover:scale-110 cursor-pointer border-4 border-teal-500/30">
                        <FaPlay size={22} className="text-[#0b6459] ml-1" />
                    </button>
                </div>

                {/* Video duration badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <span className="text-white text-xs font-semibold">2:45</span>
                </div>
            </div>

            {/* Floating Tutor Stats Card - Top */}
            <div className="absolute -top-3 left-0 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl flex items-center gap-2 z-20 border border-gray-100">
                <div className="flex -space-x-2">
                    <img src="https://picsum.photos/seed/person1/32/32" alt="Tutor 1" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                    <img src="https://picsum.photos/seed/person2/32/32" alt="Tutor 2" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                    <img src="https://picsum.photos/seed/person3/32/32" alt="Tutor 3" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center border-2 border-white text-white font-bold text-xs shadow-sm">+</div>
                </div>
                <div>
                    <p className="text-gray-800 font-bold text-xs leading-tight">4k+ Tutors</p>
                    <p className="text-gray-500 text-[10px]">Active Now</p>
                </div>
            </div>

            {/* Floating Tutor Profile Card - Bottom Right */}
            <div className="absolute -bottom-4 -right-2 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl flex items-center gap-2.5 z-20 border border-gray-100 max-w-[200px]">
                <div className="relative">
                    <img src="https://picsum.photos/seed/albert/48/48" alt="Albert Flores" className="w-12 h-12 rounded-lg object-cover shadow-md border-2 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-800 truncate">Albert Flores</p>
                    <p className="text-[10px] text-gray-600 truncate">Science Tutor</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <AiFillStar size={12} className="text-orange-500" />
                        <span className="text-xs font-bold text-gray-800">4.8</span>
                        <span className="text-[10px] text-gray-500 ml-1">(120)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};