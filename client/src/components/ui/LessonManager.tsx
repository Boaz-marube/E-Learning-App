import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video, Clock } from 'lucide-react';
import VideoUpload from './VideoUpload';

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface LessonManagerProps {
  courseId: string;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

const LessonManager: React.FC<LessonManagerProps> = ({ courseId, lessons, onLessonsChange }) => {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0
  });

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.videoUrl) return;
    
    const lesson: Lesson = {
      id: Date.now().toString(),
      ...newLesson,
      order: lessons.length + 1
    };
    
    onLessonsChange([...lessons, lesson]);
    setNewLesson({ title: '', description: '', videoUrl: '', duration: 0 });
    setShowAddLesson(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    onLessonsChange(lessons.filter(l => l.id !== lessonId));
  };

  const handleVideoUpload = (videoUrl: string) => {
    setNewLesson(prev => ({ ...prev, videoUrl }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Lessons</h3>
        <button
          onClick={() => setShowAddLesson(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00693F] text-white rounded-lg hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Lesson
        </button>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00693F] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration} min
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddLesson && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Lesson</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter lesson title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newLesson.description}
                onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Describe what students will learn in this lesson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lesson Video *
              </label>
              {!newLesson.videoUrl ? (
                <VideoUpload onUploadComplete={handleVideoUpload} courseId={courseId} />
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-medium">Video uploaded successfully!</span>
                  </div>
                  <button
                    onClick={() => setNewLesson(prev => ({ ...prev, videoUrl: '' }))}
                    className="text-sm text-green-600 dark:text-green-400 hover:underline mt-1"
                  >
                    Upload different video
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={newLesson.duration}
                onChange={(e) => setNewLesson(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="15"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddLesson(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLesson}
                disabled={!newLesson.title || !newLesson.videoUrl}
                className="px-4 py-2 bg-[#00693F] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManager;