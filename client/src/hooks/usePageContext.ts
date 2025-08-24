import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QuickAction } from '../types/assistant';

export const useAssistantContext = (): { 
  userId: string;
  userType: 'student' | 'instructor';
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
  quickActions: QuickAction[];
} => {
  const { user } = useAuth();

  const getUserType = (): 'student' | 'instructor' => {
    return user?.role === 'instructor' ? 'instructor' : 'student';
  };

  const getStudentLevel = (): 'beginner' | 'intermediate' | 'advanced' => {
    return 'beginner';
  };

  const getQuickActions = (): QuickAction[] => {
    const userType = getUserType();
    
    if (userType === 'instructor') {
      return [
        { id: '1', label: 'Course creation tips', message: 'Give me tips for creating engaging courses' },
        { id: '2', label: 'Student engagement', message: 'How can I better engage my students?' }
      ];
    }
    
    return [
      { id: '1', label: 'Learning tips', message: 'Give me some effective learning tips' },
      { id: '2', label: 'Study help', message: 'How can I improve my study habits?' }
    ];
  };

  return {
    userId: user?._id || 'anonymous',
    userType: getUserType(),
    studentLevel: getStudentLevel(),
    quickActions: getQuickActions()
  };
};