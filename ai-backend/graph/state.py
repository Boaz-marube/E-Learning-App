# graph/state.py

from typing import List, TypedDict, Annotated, Optional, Dict, Any
from langchain_core.messages import BaseMessage
from typing_extensions import TypedDict


class GraphState(TypedDict):
    """
    Represents the state of our graph for a student/tutor system.

    Attributes:
        messages: The conversation history.
        user_type: The role of the user ('student' or 'instructor').
        user_id: Unique identifier for the user.
        student_level: Learning level for students ('beginner', 'intermediate', 'advanced').
        request_type: Type of request (e.g., 'tutoring', 'quiz_generation', 'content_creation', 'assessment', 'analytics').
        retrieved_docs: Documents retrieved from the RAG pipeline.
        generated_content: Content created by the generator node (e.g., a quiz).
        assessment_mode: Whether we're in assessment/quiz mode.
        conversation_context: Additional context about the conversation.
        error_message: Error information if something goes wrong.
        learning_progress: Track topics covered and performance.
        route_decision: The routing decision made by the router node.
    """
    # The `Annotated` type is a new LangGraph standard for managing message history
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]
    user_type: str  # 'student' or 'instructor'
    user_id: Optional[str]
    student_level: Optional[str]  # 'beginner', 'intermediate', 'advanced'
    request_type: Optional[str]  # 'tutoring', 'quiz_generation', 'content_creation', 'assessment', 'analytics', etc. (reserved for future use)
    retrieved_docs: Optional[List[str]]
    generated_content: Optional[str]
    assessment_mode: Optional[bool]
    conversation_context: Optional[Dict[str, Any]]
    error_message: Optional[str]
    learning_progress: Optional[Dict[str, Any]]
    route_decision: Optional[str]