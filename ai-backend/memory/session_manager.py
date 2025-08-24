# memory/session_manager.py
"""
In-memory session management for DirectEd AI Educational System.
Stores conversation history and session context per user.
"""

import time
from typing import Dict, List, Optional, Any
from threading import Lock
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import logging

logger = logging.getLogger(__name__)

class SessionData:
    """Data structure for storing session information."""
    
    def __init__(self, user_id: str, user_type: str, student_level: Optional[str] = None):
        self.user_id = user_id
        self.user_type = user_type
        self.student_level = student_level
        self.messages: List[BaseMessage] = []
        self.conversation_context: Dict[str, Any] = {}
        self.learning_progress: Dict[str, Any] = {}
        self.created_at = time.time()
        self.last_activity = time.time()
        self.session_count = 0
    
    def add_message(self, message: BaseMessage):
        """Add a message to the conversation history."""
        self.messages.append(message)
        self.last_activity = time.time()
        self.session_count += 1
    
    def get_recent_messages(self, limit: int = 10) -> List[BaseMessage]:
        """Get the most recent messages."""
        return self.messages[-limit:] if self.messages else []
    
    def update_context(self, context: Dict[str, Any]):
        """Update conversation context."""
        self.conversation_context.update(context)
        self.last_activity = time.time()
    
    def update_progress(self, progress: Dict[str, Any]):
        """Update learning progress."""
        self.learning_progress.update(progress)
        self.last_activity = time.time()
    
    def is_expired(self, timeout_seconds: int = 3600) -> bool:
        """Check if session has expired (default 1 hour)."""
        return time.time() - self.last_activity > timeout_seconds
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert session data to dictionary for logging/debugging."""
        return {
            "user_id": self.user_id,
            "user_type": self.user_type,
            "student_level": self.student_level,
            "message_count": len(self.messages),
            "session_count": self.session_count,
            "created_at": self.created_at,
            "last_activity": self.last_activity,
            "conversation_context": self.conversation_context,
            "learning_progress": self.learning_progress
        }

class InMemorySessionManager:
    """
    In-memory session manager for storing user conversations and context.
    Thread-safe with automatic cleanup of expired sessions.
    """
    
    def __init__(self, 
                 session_timeout: int = 3600,  # 1 hour default
                 max_messages_per_session: int = 50,
                 cleanup_interval: int = 300):  # 5 minutes
        
        self.sessions: Dict[str, SessionData] = {}
        self.session_timeout = session_timeout
        self.max_messages_per_session = max_messages_per_session
        self.cleanup_interval = cleanup_interval
        self.last_cleanup = time.time()
        self.lock = Lock()  # Thread safety for concurrent requests
        
        logger.info(f"InMemorySessionManager initialized with {session_timeout}s timeout")
    
    def get_or_create_session(self, 
                            user_id: str, 
                            user_type: str, 
                            student_level: Optional[str] = None) -> SessionData:
        """Get existing session or create a new one."""
        with self.lock:
            self._cleanup_expired_sessions()
            
            if user_id in self.sessions:
                session = self.sessions[user_id]
                session.last_activity = time.time()  # Update activity
                logger.debug(f"Retrieved existing session for user {user_id}")
                return session
            else:
                session = SessionData(user_id, user_type, student_level)
                self.sessions[user_id] = session
                logger.info(f"Created new session for user {user_id} ({user_type})")
                return session
    
    def add_message(self, user_id: str, message: BaseMessage) -> bool:
        """Add a message to user's session."""
        with self.lock:
            if user_id in self.sessions:
                session = self.sessions[user_id]
                session.add_message(message)
                
                # Trim messages if too many
                if len(session.messages) > self.max_messages_per_session:
                    # Keep the most recent messages
                    session.messages = session.messages[-self.max_messages_per_session:]
                    logger.debug(f"Trimmed messages for user {user_id} to {self.max_messages_per_session}")
                
                return True
            return False
    
    def get_conversation_history(self, user_id: str, limit: int = 10) -> List[BaseMessage]:
        """Get conversation history for a user."""
        with self.lock:
            if user_id in self.sessions:
                return self.sessions[user_id].get_recent_messages(limit)
            return []
    
    def update_session_context(self, user_id: str, context: Dict[str, Any]) -> bool:
        """Update session context for a user."""
        with self.lock:
            if user_id in self.sessions:
                self.sessions[user_id].update_context(context)
                return True
            return False
    
    def update_learning_progress(self, user_id: str, progress: Dict[str, Any]) -> bool:
        """Update learning progress for a user."""
        with self.lock:
            if user_id in self.sessions:
                self.sessions[user_id].update_progress(progress)
                return True
            return False
    
    def get_session_info(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get session information for debugging/monitoring."""
        with self.lock:
            if user_id in self.sessions:
                return self.sessions[user_id].to_dict()
            return None
    
    def clear_session(self, user_id: str) -> bool:
        """Clear a specific user's session."""
        with self.lock:
            if user_id in self.sessions:
                del self.sessions[user_id]
                logger.info(f"Cleared session for user {user_id}")
                return True
            return False
    
    def _cleanup_expired_sessions(self):
        """Remove expired sessions (internal method)."""
        current_time = time.time()
        
        # Only cleanup if enough time has passed
        if current_time - self.last_cleanup < self.cleanup_interval:
            return
        
        expired_users = []
        for user_id, session in self.sessions.items():
            if session.is_expired(self.session_timeout):
                expired_users.append(user_id)
        
        for user_id in expired_users:
            del self.sessions[user_id]
            logger.info(f"Cleaned up expired session for user {user_id}")
        
        self.last_cleanup = current_time
        if expired_users:
            logger.info(f"Cleaned up {len(expired_users)} expired sessions")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get memory manager statistics."""
        with self.lock:
            total_messages = sum(len(session.messages) for session in self.sessions.values())
            return {
                "active_sessions": len(self.sessions),
                "total_messages": total_messages,
                "session_timeout": self.session_timeout,
                "max_messages_per_session": self.max_messages_per_session,
                "last_cleanup": self.last_cleanup
            }
    
    def force_cleanup(self):
        """Force cleanup of expired sessions."""
        with self.lock:
            self.last_cleanup = 0  # Force cleanup on next call
            self._cleanup_expired_sessions()

# Global session manager instance
session_manager = InMemorySessionManager()
