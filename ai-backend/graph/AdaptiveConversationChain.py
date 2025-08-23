# graph/AdaptiveConversationChain.py

import os
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .state import GraphState
from .llm_config import get_routing_llm
from .error_handler import validate_user_input, handle_missing_user_input, handle_llm_failure, safe_llm_call

# Load environment variables
load_dotenv()

def adaptive_conversation_chain_node(state: GraphState):
    """
    Adaptive conversation chain that intelligently routes educational conversations
    based on user type, learning level, context, and conversation history.
    With error handling for missing input and LLM failures.
    """
    print("---NODE: ADAPTIVE CONVERSATION CHAIN---")
    
    # Validate user input first
    if not validate_user_input(state):
        print("No valid user input provided")
        return handle_missing_user_input(state)
    
    try:
        messages = state["messages"]
        user_type = state.get("user_type", "student")
        student_level = state.get("student_level", "beginner")
        assessment_mode = state.get("assessment_mode", False)
        
        last_user_message = messages[-1].content
        conversation_history = [msg.content for msg in messages[-3:]]  # Last 3 messages for context

        # Adaptive prompts based on educational context
        if user_type == "instructor":
            prompt = ChatPromptTemplate.from_template(
                """You are routing an INSTRUCTOR's educational query.
                Consider their teaching needs and curriculum management requirements.
                
    Instructor message: "{user_message}"
    Context: {conversation_history}

    Educational routing options:
    - 'rag': For curriculum research, finding teaching materials, or content exploration
    - 'generate': For creating original lesson plans, activities, or educational content
    - 'analytics': For student performance analysis, progress tracking, or assessment insights
    - 'admin': For course organization, curriculum management, or administrative workflows
    - 'chat': For general educational discussion, brainstorming, or clarifications

    Consider the educational context and instructor's immediate needs.
    Return only one word: 'rag', 'generate', 'analytics', 'admin', or 'chat'."""
            )
        else:  # Student adaptive pathways
            if assessment_mode:
                prompt = ChatPromptTemplate.from_template(
                    """You are routing a STUDENT currently in ASSESSMENT MODE.
                    Provide supportive guidance while maintaining assessment integrity.
                    
    Student message: "{user_message}"
    Student level: {student_level}
    Assessment context: {conversation_history}

    Assessment routing options:
    - 'assess': For quiz responses, test answers, or evaluation submissions
    - 'rag': For requesting help, concept clarification, or learning support during assessment
    - 'chat': For encouragement, assessment navigation, or mode changes

    Prioritize learning support while maintaining assessment validity.
    Return only one word: 'assess', 'rag', or 'chat'."""
                )
            else:
                # Adaptive learning pathways for different student levels
                if student_level == "beginner":
                    learning_focus = "foundational concepts, step-by-step guidance, and confidence building"
                    pathway_options = "basic explanations, simple practice, and encouragement"
                elif student_level == "intermediate":
                    learning_focus = "practical applications, skill development, and problem-solving"
                    pathway_options = "detailed explanations, varied practice, and project guidance"
                else:  # advanced
                    learning_focus = "complex concepts, mastery, and advanced applications"
                    pathway_options = "comprehensive analysis, challenging practice, and expert insights"

                prompt = ChatPromptTemplate.from_template(
                    f"""You are an adaptive conversation chain for {student_level.upper()} STUDENTS.
                    Focus on {learning_focus}.
                    
    Student message: "{{user_message}}"
    Student level: {{student_level}}
    Learning context: {{conversation_history}}

    Adaptive learning pathways:
    - 'rag': For concept explanations, learning materials, or knowledge questions
    - 'generate': For creating personalized study materials, practice questions, or learning aids
    - 'practice': For starting skill practice, interactive learning, or assessment preparation
    - 'progress': For checking learning advancement, achievements, or next learning steps
    - 'chat': For motivation, learning strategy discussion, or general educational support

    Prioritize {pathway_options} for this {student_level} learner.
    Return only one word: 'rag', 'generate', 'practice', 'progress', or 'chat'."""
                )

        # Using optimized model for educational routing decisions
        model = get_routing_llm()  # Centralized LLM configuration with low temperature for consistent routing
        
        chain = prompt | model
        
        # Safe LLM call with error handling
        try:
            decision = safe_llm_call(
                chain.invoke,
                {
                    "user_message": last_user_message,
                    "student_level": student_level,
                    "conversation_history": str(conversation_history)
                }
            ).content.strip().lower()
        except Exception as llm_error:
            print(f"LLM routing failed: {str(llm_error)}")
            return handle_llm_failure(state, llm_error)
        
        print(f"Adaptive conversation chain routed {user_type} ({student_level if user_type == 'student' else 'N/A'}) to: {decision}")

        # Update conversation context with adaptive decision
        return {
            "conversation_context": {
                "last_route": decision,
                "user_type": user_type,
                "student_level": student_level,
                "assessment_mode": assessment_mode,
                "timestamp": "now"  # In real app, use actual timestamp
            },
            "route_decision": decision  # Store decision in state for conditional edges
        }
        
    except Exception as e:
        print(f"Adaptive conversation chain error: {str(e)}")
        return handle_llm_failure(state, e)


def get_adaptive_route_decision(state: GraphState):
    """Helper function to extract adaptive routing decision for conditional edges."""
    return state.get("route_decision", "chat")
