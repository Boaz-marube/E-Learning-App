# graph/synthesizer.py

import os
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .state import GraphState
from .llm_config import get_educational_llm
from langchain_core.messages import AIMessage

# Load environment variables
load_dotenv()

def response_synthesizer_node(state: GraphState):
    """
    Enhanced synthesizer that creates personalized responses based on user type, level, and context.
    Returns 'messages', 'response', and 'route_taken' for API usage.
    """
    print("---NODE: ENHANCED SYNTHESIZER---")
    
    messages = state.get("messages", [])
    retrieved_docs = state.get("retrieved_docs", [])
    generated_content = state.get("generated_content")
    user_type = state.get("user_type", "student")
    student_level = state.get("student_level", "beginner")
    assessment_mode = state.get("assessment_mode", False)
    conversation_context = state.get("conversation_context", {})

    # Build personalized context based on user type and level
    if user_type == "instructor":
        base_context = """You are the DirectEd AI Assistant for INSTRUCTORS. You help educators with:
- Curriculum content and explanations
- Creating educational materials and assessments
- Student progress insights
- Course management guidance

Maintain a professional, knowledgeable tone suitable for educators."""
    else:  # Student
        if student_level == "beginner":
            base_context = """You are the DirectEd AI Tutor for BEGINNER students. You are:
- Patient and encouraging
- Use simple, clear explanations
- Provide step-by-step guidance
- Celebrate small wins and progress
- Offer plenty of examples and analogies"""
        elif student_level == "intermediate":
            base_context = """You are the DirectEd AI Tutor for INTERMEDIATE students. You:
- Provide detailed explanations with practical examples
- Challenge students appropriately
- Connect concepts to real-world applications
- Encourage exploration and experimentation
- Support skill-building progression"""
        else:  # advanced
            base_context = """You are the DirectEd AI Tutor for ADVANCED students. You:
- Offer comprehensive, in-depth explanations
- Present complex scenarios and challenges
- Encourage critical thinking and analysis
- Provide professional-level insights
- Support mastery and specialization"""

    # Add assessment context if in assessment mode
    if assessment_mode:
        base_context += "\n\nYou are currently in ASSESSMENT MODE. Provide constructive feedback, explanations for correct/incorrect answers, and learning guidance."

    # Add curriculum or generated content context
    if retrieved_docs:
        content_context = "\n\nAnswer using ONLY the following curriculum information:\n\n---\n"
        content_context += "\n\n".join(retrieved_docs)
        content_context += "\n---\n\nIf the information isn't in the provided content, say so and suggest where the student might find more information."
        base_context += content_context
    elif generated_content:
        content_context = "\n\nPresent the following generated educational content to the user in an engaging and helpful way:\n\n---\n"
        content_context += generated_content
        content_context += "\n---\n\nProvide any additional context or guidance that would be helpful."
        base_context += content_context

    # Create the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", base_context),
        ("human", "{user_message}")
    ])

    # Use different temperatures based on user type
    temperature = 0.5 if user_type == "instructor" else 0.7
    model = get_educational_llm("synthesis", temperature=temperature)

    chain = prompt | model

    # Ensure there is at least one user message
    last_user_message = messages[-1].content if messages else state.get("message", "")
    
    # Generate AI response
    final_response = chain.invoke({"user_message": last_user_message}).content

    print(f"Generated {user_type}-personalized response.")

    # Return state keys expected by FastAPI
    return {
        "messages": [AIMessage(content=final_response)],  # Update conversation history
        "response": final_response,                      # For API reply
        "route_taken": "synthesizer"                     # For debugging / routing info
    }
