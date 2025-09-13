// Mock-wired Course Player page. Replace mock imports with real API hooks when backend is ready.
import React, { useMemo, useState } from 'react';
import { PlayerLayout, CourseOutline, VideoPlayer, CourseTabs, SidebarSummary } from '../../components';
import { courseSample } from '../../data/course-sample';

const CoursePlayerPage: React.FC = () => {
  const course = courseSample;
  const allLessons = useMemo(() => {
    return course.chapters.flatMap((c) => c.lessons);
  }, [course.chapters]);

  const [currentLessonId, setCurrentLessonId] = useState(allLessons[0]?.id);
  const currentLesson = useMemo(() => allLessons.find((l) => l.id === currentLessonId) || allLessons[0], [allLessons, currentLessonId]);

  return (
    <div className="bg-[#FAF8F6] min-h-screen">
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-[#134E4A]" style={{ width: `${course.progressPct}%` }} />
      </div>
      <PlayerLayout
        left={
          <CourseOutline
            chapters={course.chapters}
            currentLessonId={currentLessonId}
            onSelectLesson={setCurrentLessonId}
          />
        }
        center={
          <div className="space-y-6">
            <VideoPlayer
              currentLesson={currentLesson}
              instructor={course.instructor}
              onEnded={() => {
                const idx = allLessons.findIndex((l) => l.id === currentLessonId);
                const next = allLessons[idx + 1];
                if (next) setCurrentLessonId(next.id);
              }}
            />
            <CourseTabs course={course} />
          </div>
        }
        right={<SidebarSummary course={course} />}
      />
    </div>
  );
};

export default CoursePlayerPage;


