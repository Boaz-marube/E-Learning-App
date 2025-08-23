# graph/assessment.py

import os
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .state import GraphState
from .llm_config import get_assessment_llm
import json

# Load environment variables
load_dotenv()

def assessment_node(state: GraphState):
    """
    Handles student assessments, quiz responses, and provides feedback.
    """
    print("---NODE: ASSESSMENT---")
    messages = state["messages"]
    student_level = state.get("student_level", "beginner")
    last_user_message = messages[-1].content

    prompt = ChatPromptTemplate.from_template(
        """You are an AI assessment specialist for a {student_level} student learning web development and Python.

Student response: "{user_message}"

Your tasks:
1. Evaluate the student's response if it's an answer to a question
2. Provide constructive feedback
3. Explain correct concepts if needed
4. Suggest next learning steps
5. Maintain an encouraging tone

If the student is asking for help during an assessment:
- Provide hints rather than direct answers
- Guide them to think through the problem
- Encourage problem-solving skills

Format your response to be helpful and educational while maintaining assessment integrity."""
    )

    model = get_assessment_llm(temperature=0.4)  # Centralized LLM for student assessment
    chain = prompt | model
    
    assessment_response = chain.invoke({
        "user_message": last_user_message,
        "student_level": student_level
    }).content

    print("Generated assessment feedback.")
    
    return {
        "generated_content": assessment_response,
        "assessment_mode": True
    }

def progress_tracking_node(state: GraphState):
    """
    Tracks and reports on student learning progress.
    """
    print("---NODE: PROGRESS TRACKING---")
    messages = state["messages"]
    user_type = state.get("user_type", "student")
    student_level = state.get("student_level", "beginner")
    learning_progress = state.get("learning_progress", {})

    if user_type == "instructor":
        prompt_template = """You are helping an INSTRUCTOR track student progress.

Request: "{user_message}"
Available progress data: {progress_data}

Provide insights on:
- Overall class performance
- Individual student progress
- Areas needing attention
- Recommendations for instruction

Present data in a clear, actionable format for educators."""
    else:
        prompt_template = """You are helping a {student_level} STUDENT track their learning progress.

Student request: "{user_message}"
Current progress: {progress_data}

Provide a motivating progress report including:
- Topics mastered and areas of strength
- Current learning goals and next steps
- Achievements and milestones reached
- Personalized recommendations for continued learning
- Encouragement and celebration of progress

Keep it positive and motivating while being honest about areas for improvement."""

    prompt = ChatPromptTemplate.from_template(prompt_template)
    model = get_assessment_llm(temperature=0.6)  # Centralized LLM for progress tracking
    chain = prompt | model
    
    progress_response = chain.invoke({
        "user_message": messages[-1].content,
        "student_level": student_level,
        "progress_data": json.dumps(learning_progress, indent=2) if learning_progress else "No progress data available yet."
    }).content

    print(f"Generated progress report for {user_type}.")
    
    return {"generated_content": progress_response}

def analytics_node(state: GraphState):
    """
    Provides analytics and insights for instructors.
    """
    print("---NODE: ANALYTICS---")
    messages = state["messages"]
    last_user_message = messages[-1].content

    prompt = ChatPromptTemplate.from_template(
        """You are an educational analytics AI assistant for INSTRUCTORS.

Instructor request: "{user_message}"

Provide analytical insights on:
- Student performance patterns
- Curriculum effectiveness
- Learning outcome trends
- Engagement metrics
- Recommendations for course improvement

Present data-driven insights that help instructors make informed decisions about their teaching approach."""
    )

    model = get_assessment_llm(temperature=0.3)  # Centralized LLM for instructor analytics
    chain = prompt | model
    
    analytics_response = chain.invoke({"user_message": last_user_message}).content
    print("Generated analytics insights.")
    
    return {"generated_content": analytics_response}

def admin_node(state: GraphState):
    """
    Handles administrative tasks for instructors.
    """
    print("---NODE: ADMIN---")
    messages = state["messages"]
    last_user_message = messages[-1].content

    prompt = ChatPromptTemplate.from_template(
        """You are an administrative AI assistant for INSTRUCTORS managing their courses.

Instructor request: "{user_message}"

Help with:
- Course organization and structure
- Content management guidance
- Student enrollment and grouping
- Scheduling and planning
- Resource allocation
- Communication templates
- Administrative workflows

Provide practical, actionable guidance for effective course administration."""
    )

    model = get_assessment_llm(temperature=0.4)  # Centralized LLM for administrative tasks
    chain = prompt | model
    
    admin_response = chain.invoke({"user_message": last_user_message}).content
    print("Generated administrative guidance.")
    
    return {"generated_content": admin_response}

def error_handler_node(state: GraphState):
    """
    Handles errors and provides fallback responses.
    """
    print("---NODE: ERROR HANDLER---")
    error_message = state.get("error_message", "An unexpected error occurred.")
    user_type = state.get("user_type", "student")
    
    if user_type == "instructor":
        fallback_message = f"""I apologize, but I encountered an issue: {error_message}

As your educational AI assistant, I'm still here to help. You can try:
- Rephrasing your request
- Asking about curriculum content
- Creating educational materials
- Getting student analytics

How else can I assist you with your teaching today?"""
    else:
        fallback_message = f"""Oops! I ran into a small problem: {error_message}

Don't worry - I'm still here to help you learn! You can:
- Ask me to explain any concept
- Request practice questions
- Get help with your studies
- Check your learning progress

What would you like to explore next?"""

    return {
        "generated_content": fallback_message,
        "error_message": None  # Clear the error
    }
