# graph/error_handler.py
"""
Simple error handling for the educational graph system.
Handles cases where user input is missing, RAG system fails, or LLM fails.
"""

import logging
import time
from typing import Optional, Any, Dict
from langchain_core.messages import AIMessage

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def handle_missing_user_input(state: Dict[str, Any]) -> Dict[str, Any]:
    """Handle case where user input is missing or empty."""
    error_message = "I didn't receive any input from you. Could you please ask me a question or tell me what you'd like help with?"
    
    logger.warning("No user input provided")
    
    return {
        **state,
        "messages": state.get("messages", []) + [AIMessage(content=error_message)],
        "error_message": "Missing user input"
    }

def handle_rag_failure(state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
    """Handle case where RAG system fails."""
    user_type = state.get("user_type", "student")
    
    if user_type == "instructor":
        error_message = (
            "I'm having trouble accessing the curriculum database right now. "
            "I can still help you create content, but it won't be grounded in the specific curriculum materials. "
            "Would you like me to proceed anyway?"
        )
    else:
        error_message = (
            "I'm having trouble accessing the learning materials right now. "
            "Let me try to help you with your question using my general knowledge instead."
        )
    
    logger.error(f"RAG system failed: {str(error)}")
    
    return {
        **state,
        "messages": state.get("messages", []) + [AIMessage(content=error_message)],
        "error_message": f"RAG failure: {str(error)}",
        "retrieved_docs": []  # Empty docs to indicate failure
    }

def handle_llm_failure(state: Dict[str, Any], error: Exception, retry_count: int = 0) -> Dict[str, Any]:
    """Handle case where LLM fails."""
    max_retries = 2
    
    # Check if it's a rate limit error
    error_str = str(error).lower()
    if "429" in error_str or "quota" in error_str or "rate limit" in error_str:
        if retry_count < max_retries:
            wait_time = (retry_count + 1) * 5  # 5, 10, 15 seconds
            logger.warning(f"Rate limit hit, waiting {wait_time}s before retry {retry_count + 1}")
            time.sleep(wait_time)
            return state  # Return state unchanged to trigger retry
        else:
            error_message = (
                "I'm currently experiencing high demand and need to slow down my responses. "
                "Please try your question again in a moment, or consider asking a simpler question."
            )
    else:
        error_message = (
            "I'm experiencing some technical difficulties right now. "
            "Please try asking your question again, or rephrase it if possible."
        )
    
    logger.error(f"LLM failed after {retry_count} retries: {str(error)}")
    
    return {
        **state,
        "messages": state.get("messages", []) + [AIMessage(content=error_message)],
        "error_message": f"LLM failure: {str(error)}"
    }

def validate_user_input(state: Dict[str, Any]) -> bool:
    """Validate that user input exists and is not empty."""
    messages = state.get("messages", [])
    
    if not messages:
        return False
    
    last_message = messages[-1]
    content = getattr(last_message, 'content', '')
    
    if not content or content.strip() == "":
        return False
    
    return True

def safe_llm_call(llm_func, *args, max_retries: int = 2, **kwargs):
    """Safely call an LLM function with retry logic."""
    for attempt in range(max_retries + 1):
        try:
            return llm_func(*args, **kwargs)
        except Exception as e:
            error_str = str(e).lower()
            
            # Rate limit error - wait and retry
            if ("429" in error_str or "quota" in error_str or "rate limit" in error_str) and attempt < max_retries:
                wait_time = (attempt + 1) * 5
                logger.warning(f"Rate limit hit, waiting {wait_time}s (attempt {attempt + 1})")
                time.sleep(wait_time)
                continue
            
            # Other errors or max retries reached
            logger.error(f"LLM call failed (attempt {attempt + 1}): {str(e)}")
            if attempt == max_retries:
                raise e
    
    # Should never reach here
    raise Exception("Unexpected error in safe_llm_call")

def create_fallback_response(state: Dict[str, Any], error_type: str) -> Dict[str, Any]:
    """Create a fallback response when systems fail."""
    user_type = state.get("user_type", "student")
    
    fallback_messages = {
        "rag": {
            "student": "I can't access the specific learning materials right now, but I'm happy to help explain concepts using my general knowledge. What would you like to learn about?",
            "instructor": "The curriculum database is temporarily unavailable. I can still assist with general teaching strategies and content creation. How can I help?"
        },
        "llm": {
            "student": "I'm having trouble generating a response right now. Could you try asking your question in a different way?",
            "instructor": "I'm experiencing technical difficulties. Please try your request again, or break it into smaller parts."
        },
        "general": {
            "student": "Something went wrong, but I'm here to help! Please try asking your question again.",
            "instructor": "I encountered an issue processing your request. Please try again or rephrase your question."
        }
    }
    
    message_type = fallback_messages.get(error_type, fallback_messages["general"])
    message = message_type.get(user_type, message_type["student"])
    
    return {
        **state,
        "messages": state.get("messages", []) + [AIMessage(content=message)],
        "error_message": f"Fallback response due to {error_type} error"
    }
