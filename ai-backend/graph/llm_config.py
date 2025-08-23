# graph/llm_config.py
"""
Centralized LLM configuration for the educational graph system.

This module provides a single source of truth for LLM configuration,
ensuring consistency across all components while making it easy to
switch models, adjust parameters, or modify behavior system-wide.
"""

import os
import logging
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import time
from functools import wraps

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global configuration constants
MAX_RETRIES = 3
REQUEST_TIMEOUT = 30
ENABLE_LLM_CACHING = True
ENABLE_LLM_LOGGING = True

class LLMError(Exception):
    """Base exception for LLM-related errors."""
    pass

class LLMConfigurationError(LLMError):
    """Raised when LLM configuration is invalid."""
    pass

class LLMAPIError(LLMError):
    """Raised when LLM API calls fail."""
    pass

class LLMRateLimitError(LLMError):
    """Raised when rate limits are exceeded."""
    pass

class LLMConfig:
    """Centralized configuration for all LLM instances in the educational system."""
    
    # Default model configuration
    DEFAULT_MODEL = "gemini-1.5-flash"
    DEFAULT_TEMPERATURE = 0.7
    ROUTING_TEMPERATURE = 0.1  # Lower temperature for consistent routing decisions
    
    # Model variants for different use cases
    MODELS = {
        "default": "gemini-1.5-flash",          # General purpose, balanced performance
        "routing": "gemini-1.5-flash",          # For routing decisions (consistency important)
        "generation": "gemini-1.5-flash",       # For content generation
        "assessment": "gemini-1.5-flash",       # For assessments and evaluations
        "synthesis": "gemini-1.5-flash"        # For response synthesis
    }
    
    @classmethod
    def validate_configuration(cls):
        """Validate LLM configuration before use."""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise LLMConfigurationError(
                "GOOGLE_API_KEY environment variable is required. "
                "Please check your .env file or environment settings."
            )
        
        if len(api_key.strip()) < 10:
            raise LLMConfigurationError(
                "GOOGLE_API_KEY appears to be invalid (too short). "
                "Please verify your API key."
            )
        
        return True
    
    @classmethod
    def get_llm(cls, use_case: str = "default", temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
        """
        Get a configured LLM instance for a specific use case with error handling.
        
        Args:
            use_case: The use case for the LLM ('default', 'routing', 'generation', 'assessment', 'synthesis')
            temperature: Override temperature for this instance (optional)
            
        Returns:
            Configured ChatGoogleGenerativeAI instance
            
        Raises:
            LLMConfigurationError: If configuration is invalid
            LLMError: For other LLM-related errors
        """
        try:
            # Validate configuration
            cls.validate_configuration()
            
            # Validate use case
            valid_use_cases = list(cls.MODELS.keys()) + ["default"]
            if use_case not in valid_use_cases:
                logger.warning(f"Unknown use case '{use_case}', falling back to 'default'")
                use_case = "default"
            
            # Validate temperature
            if temperature is not None:
                if not (0.0 <= temperature <= 2.0):
                    logger.warning(f"Temperature {temperature} outside recommended range [0.0, 2.0], using default")
                    temperature = None
            
            # Get API key
            api_key = os.getenv("GOOGLE_API_KEY")
            
            # Select model for use case
            model = cls.MODELS.get(use_case, cls.DEFAULT_MODEL)
            
            # Set temperature based on use case or override
            if temperature is not None:
                temp = temperature
            elif use_case == "routing":
                temp = cls.ROUTING_TEMPERATURE  # Low temperature for consistent routing
            else:
                temp = cls.DEFAULT_TEMPERATURE
            
            logger.info(f"Creating LLM for use case '{use_case}' with model '{model}' and temperature {temp}")
            
            return ChatGoogleGenerativeAI(
                model=model,
                temperature=temp,
                google_api_key=api_key
            )
            
        except Exception as e:
            if isinstance(e, LLMError):
                raise
            else:
                raise LLMError(f"Failed to create LLM instance: {str(e)}") from e
    
    @classmethod
    def get_routing_llm(cls) -> ChatGoogleGenerativeAI:
        """Get an LLM optimized for routing decisions (low temperature, consistent)."""
        return cls.get_llm("routing")
    
    @classmethod
    def get_generation_llm(cls) -> ChatGoogleGenerativeAI:
        """Get an LLM optimized for content generation."""
        return cls.get_llm("generation")
    
    @classmethod
    def get_assessment_llm(cls, temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
        """Get an LLM optimized for assessments and evaluations."""
        return cls.get_llm("assessment", temperature)
    
    @classmethod
    def get_synthesis_llm(cls) -> ChatGoogleGenerativeAI:
        """Get an LLM optimized for response synthesis."""
        return cls.get_llm("synthesis")

def with_retry_and_error_handling(max_retries: int = 3, backoff_factor: float = 1.0):
    """
    Decorator to add retry logic and error handling to LLM calls.
    
    Args:
        max_retries: Maximum number of retry attempts
        backoff_factor: Exponential backoff factor for delays
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                    
                except Exception as e:
                    last_exception = e
                    error_message = str(e).lower()
                    
                    # Handle specific API errors
                    if "429" in error_message or "quota" in error_message or "rate limit" in error_message:
                        if attempt < max_retries:
                            wait_time = (backoff_factor * (2 ** attempt)) + 5  # Extra delay for rate limits
                            logger.warning(f"Rate limit hit, waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                            time.sleep(wait_time)
                            continue
                        else:
                            raise LLMRateLimitError(
                                f"Rate limit exceeded after {max_retries} retries. "
                                f"Consider using a different model or upgrading your API quota."
                            ) from e
                    
                    elif "401" in error_message or "unauthorized" in error_message or "api key" in error_message:
                        raise LLMConfigurationError(
                            "Authentication failed. Please check your GOOGLE_API_KEY."
                        ) from e
                    
                    elif "400" in error_message or "invalid" in error_message:
                        raise LLMConfigurationError(
                            f"Invalid request configuration: {str(e)}"
                        ) from e
                    
                    else:
                        if attempt < max_retries:
                            wait_time = backoff_factor * (2 ** attempt)
                            logger.warning(f"LLM call failed, retrying in {wait_time}s: {str(e)}")
                            time.sleep(wait_time)
                            continue
                        else:
                            raise LLMAPIError(
                                f"LLM call failed after {max_retries} retries: {str(e)}"
                            ) from e
            
            # This should never be reached, but just in case
            raise LLMAPIError(f"Unexpected error after retries: {str(last_exception)}") from last_exception
        
        return wrapper
    return decorator

# Enhanced convenience functions with error handling
@with_retry_and_error_handling(max_retries=MAX_RETRIES, backoff_factor=1.5)
def get_educational_llm(use_case: str = "default", temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
    """
    Convenience function to get a configured educational LLM with error handling.
    
    Args:
        use_case: The use case for the LLM
        temperature: Override temperature
        
    Returns:
        Configured LLM instance
        
    Raises:
        LLMError: For various LLM-related errors
    """
    return LLMConfig.get_llm(use_case, temperature)

@with_retry_and_error_handling(max_retries=MAX_RETRIES, backoff_factor=1.0)
def get_routing_llm() -> ChatGoogleGenerativeAI:
    """Get an LLM optimized for routing decisions with error handling."""
    return LLMConfig.get_routing_llm()

@with_retry_and_error_handling(max_retries=MAX_RETRIES, backoff_factor=1.5)
def get_generation_llm() -> ChatGoogleGenerativeAI:
    """Get an LLM optimized for content generation with error handling."""
    return LLMConfig.get_generation_llm()

@with_retry_and_error_handling(max_retries=MAX_RETRIES, backoff_factor=1.2)
def get_assessment_llm(temperature: Optional[float] = None) -> ChatGoogleGenerativeAI:
    """Get an LLM optimized for assessments with error handling."""
    return LLMConfig.get_assessment_llm(temperature)

@with_retry_and_error_handling(max_retries=MAX_RETRIES, backoff_factor=1.0)
def get_synthesis_llm() -> ChatGoogleGenerativeAI:
    """Get an LLM optimized for response synthesis with error handling."""
    return LLMConfig.get_synthesis_llm()

def validate_system_configuration():
    """
    Validate the entire LLM system configuration.
    
    Returns:
        bool: True if configuration is valid
        
    Raises:
        LLMConfigurationError: If configuration is invalid
    """
    try:
        LLMConfig.validate_configuration()
        
        # Test a simple LLM creation
        test_llm = LLMConfig.get_llm("routing")
        logger.info("✅ LLM system configuration validated successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ LLM system configuration validation failed: {str(e)}")
        raise
