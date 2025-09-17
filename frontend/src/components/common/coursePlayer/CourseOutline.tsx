// Left sticky outline with accessible accordions. Replace with live course structure when integrating API.
import React, { useState } from 'react';

type Lesson = {
  id: string;
  title: string;
  duration: string;
  // Accept strict known types plus any string coming from mock/backends
  type: 'video' | 'audio' | 'article' | string;
};

type Chapter = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type Props = {
  chapters: Chapter[];
  currentLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
};

const iconFor = (type: Lesson['type']) => {
  if (type === 'video') return '▶';
  if (type === 'audio') return '🔊';
  return '📄';
};

const CourseOutline: React.FC<Props> = ({ chapters, currentLessonId, onSelectLesson }) => {
  const [openId, setOpenId] = useState<string | null>(chapters[0]?.id ?? null);

  return (
    <div className="bg-neutral-900 text-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <button className="text-sm text-white/80 hover:text-white" aria-label="Back to Courses">← Back to Courses</button>
      </div>
      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-base font-semibold leading-tight">Course Outline</h2>
      </div>

      <nav className="max-h-[70vh] overflow-auto pr-1">
        {chapters.map((ch) => {
          const expanded = openId === ch.id;
          return (
            <div key={ch.id} className="border-b border-white/10">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#134E4A]"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : ch.id)}
              >
                <span className="font-medium">{ch.title}</span>
                <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>⌄</span>
              </button>
              <div className={`overflow-hidden transition-all ${expanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <ul className="pb-2">
                  {ch.lessons.map((ls) => {
                    const active = ls.id === currentLessonId;
                    return (
                      <li key={ls.id}>
                        <button
                          onClick={() => onSelectLesson(ls.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#134E4A] ${active ? 'bg-white/10' : ''}`}
                          aria-current={active ? 'true' : undefined}
                        >
                          <span className="shrink-0" aria-hidden>{iconFor(ls.type)}</span>
                          <span className="flex-1 text-left line-clamp-1">{ls.title}</span>
                          <span className="text-white/60 shrink-0">{ls.duration}</span>
                          {active && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-emerald-400" aria-hidden />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default CourseOutline;


