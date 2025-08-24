# graph/ContentGenerator.py

import os
import chromadb
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .state import GraphState
from .llm_config import get_generation_llm

# Load environment variables
load_dotenv()

CHROMA_PATH = "./chroma_db"
COLLECTION_NAME = "direct_ed_curriculum"

def content_generator_node(state: GraphState):
    """
    Advanced educational content generator that creates personalized learning materials
    based on curriculum content, user type, learning level, and educational context.
    Integrates with curriculum database for contextually relevant content creation.
    """
    print("---NODE: CONTENT GENERATOR---")
    messages = state["messages"]
    user_type = state.get("user_type", "student")
    student_level = state.get("student_level", "beginner")
    retrieved_docs = state.get("retrieved_docs", [])
    
    last_user_message = messages[-1].content

    # Retrieve curriculum context if not already present for content generation
    curriculum_context = ""
    if not retrieved_docs:
        try:
            print("Content generator retrieving curriculum context...")
            db = chromadb.PersistentClient(path=CHROMA_PATH)
            collection = db.get_collection(name=COLLECTION_NAME)
            results = collection.query(
                query_texts=[last_user_message],
                n_results=6  # More context for comprehensive content generation
            )
            retrieved_docs = results['documents'][0]
            print(f"Content generator retrieved {len(retrieved_docs)} curriculum documents for context.")
        except Exception as e:
            print(f"Warning: Content generator could not retrieve curriculum context: {e}")
            retrieved_docs = []

    if retrieved_docs:
        # Escape curly braces in retrieved content to prevent template variable conflicts
        escaped_docs = []
        for doc in retrieved_docs:
            escaped_doc = doc.replace('{', '{{').replace('}', '}}')
            escaped_docs.append(escaped_doc)
        
        curriculum_context = f"\n\nCurriculum Reference Materials:\n{'='*50}\n" + "\n\n".join(escaped_docs) + f"\n{'='*50}\n"

    # Advanced content generation prompts based on educational roles
    if user_type == "instructor":
        prompt_template = f"""You are an advanced EDUCATIONAL CONTENT GENERATOR for INSTRUCTORS.
Create professional, pedagogically sound educational materials for web development and Python instruction.

Instructor request: "{{user_message}}"
{curriculum_context}

INSTRUCTOR CONTENT STANDARDS:
- Create comprehensive, well-structured educational materials
- Include clear learning objectives and outcomes
- Provide detailed assessment criteria and rubrics
- Offer multiple difficulty levels and differentiation options
- Include instructor guidance and teaching notes
- Reference curriculum standards and learning progressions
- Ensure content is classroom-ready and scalable
- Add extension activities and enrichment options

Generate high-quality instructional content that meets professional educational standards
and supports effective teaching practices."""

    else:  # Student-centered content generation
        # Adaptive content generation based on learning level
        if student_level == "beginner":
            content_approach = {
                "tone": "encouraging, patient, and supportive",
                "complexity": "simple, step-by-step instructions with basic concepts",
                "examples": "clear, relatable examples with detailed explanations",
                "practice": "guided practice with immediate feedback",
                "structure": "small, manageable chunks with frequent check-ins"
            }
        elif student_level == "intermediate":
            content_approach = {
                "tone": "motivating and detailed",
                "complexity": "moderate difficulty with practical applications",
                "examples": "real-world scenarios and varied use cases",
                "practice": "independent practice with guided reflection",
                "structure": "connected concepts with project-based learning"
            }
        else:  # advanced
            content_approach = {
                "tone": "challenging and comprehensive",
                "complexity": "complex scenarios with advanced concepts",
                "examples": "industry-standard practices and cutting-edge techniques",
                "practice": "autonomous exploration with peer collaboration",
                "structure": "integrated learning with capstone projects"
            }

        # Build the template string without f-string to avoid variable conflicts
        prompt_template = """You are an adaptive EDUCATIONAL CONTENT GENERATOR for """ + student_level.upper() + """ STUDENTS.
Create personalized, engaging learning materials for web development and Python.

Student request: "{user_message}"
Learning level: """ + student_level + """
""" + curriculum_context + """

ADAPTIVE CONTENT GENERATION GUIDELINES:
- Tone: """ + content_approach['tone'] + """
- Complexity: """ + content_approach['complexity'] + """
- Examples: """ + content_approach['examples'] + """
- Practice: """ + content_approach['practice'] + """
- Structure: """ + content_approach['structure'] + """

STUDENT CONTENT FEATURES:
- Make content interactive and engaging
- Include helpful tips and common mistake warnings
- Provide immediate feedback opportunities
- Connect to real-world applications and career relevance
- Use curriculum content as educational foundation
- Add gamification elements where appropriate
- Include progress indicators and achievement milestones
- Encourage exploration and creative problem-solving

Generate personalized educational content perfectly tailored to this """ + student_level + """ student's learning needs."""

    prompt = ChatPromptTemplate.from_template(prompt_template)
    model = get_generation_llm()  # Centralized LLM configuration for content generation
    chain = prompt | model
    
    generated_content = chain.invoke({"user_message": last_user_message}).content
    print(f"Content generator created {user_type}-specific educational materials.")
    
    return {
        "generated_content": generated_content,
        "retrieved_docs": retrieved_docs  # Update state with curriculum context used
    }
