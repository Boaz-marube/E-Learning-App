import { useState, useEffect } from 'react';
import type { Lesson, LessonCourse } from '../types/lesson';

// Mock lesson data
const mockLessons = {
  "1": {
    "1": {
      id: "1",
      title: "Introduction to HTML",
      description: "Learn the basics of HTML and how to structure web pages.",
      videoUrl: "/api/placeholder/800/450",
      duration: "45 min",
      transcript: "Welcome to Introduction to HTML. In this lesson, we'll cover the fundamentals of HTML and how to create structured web pages. HTML, or HyperText Markup Language, is the backbone of every website you see on the internet today.",
      notes: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. Key concepts: Elements, Tags, Attributes, Document Structure.",
      completed: false,
    },
    "2": {
      id: "2",
      title: "HTML Structure and Semantics",
      description: "Understanding HTML document structure and semantic elements.",
      videoUrl: "/api/placeholder/800/450",
      duration: "60 min",
      transcript: "In this lesson, we'll dive deeper into HTML structure and learn about semantic elements that give meaning to your content.",
      notes: "Semantic HTML elements: header, nav, main, article, section, aside, footer. These elements provide meaning and structure to your content.",
      completed: false,
    },
  },
};

const mockCourses = {
  "1": {
    id: "1",
    title: "Introduction to Web Development",
    lessons: [
      { id: "1", title: "Introduction to HTML", duration: "45 min", completed: false },
      { id: "2", title: "HTML Structure and Semantics", duration: "60 min", completed: false },
      { id: "3", title: "HTML Practice Exercise", duration: "30 min", completed: false },
      { id: "4", title: "Introduction to CSS", duration: "50 min", completed: false },
    ],
  },
};

export const useLessonData = (courseId: string, lessonId: string) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<LessonCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get lesson data
        const lessonData = mockLessons[courseId as keyof typeof mockLessons]?.[lessonId as keyof typeof mockLessons[courseId]];
        const courseData = mockCourses[courseId as keyof typeof mockCourses];
        
        if (!lessonData || !courseData) {
          setError('Lesson or course not found');
          return;
        }
        
        setLesson(lessonData);
        setCourse(courseData);
      } catch (err) {
        setError('Failed to fetch lesson data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchData();
    }
  }, [courseId, lessonId]);

  return { lesson, course, loading, error };
};