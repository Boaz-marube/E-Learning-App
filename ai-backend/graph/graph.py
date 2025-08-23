# graph/graph.py

from langgraph.graph import StateGraph, END
from .state import GraphState
from .EducationalRetriever import educational_retriever_node
from .AdaptiveConversationChain import adaptive_conversation_chain_node, get_adaptive_route_decision
from .ContentGenerator import content_generator_node
from .synthesizer import response_synthesizer_node
from .assessment import (
    assessment_node, 
    progress_tracking_node, 
    analytics_node, 
    admin_node, 
    error_handler_node
)

def create_enhanced_graph():
    """
    Creates an enhanced LangGraph application for a comprehensive student/tutor system.
    Includes specialized nodes for different user types and educational scenarios.
    """
    workflow = StateGraph(GraphState)

    # Add all nodes to the graph with updated names
    workflow.add_node("adaptive_chain", adaptive_conversation_chain_node)
    workflow.add_node("educational_retriever", educational_retriever_node)
    workflow.add_node("content_generator", content_generator_node)
    workflow.add_node("synthesizer", response_synthesizer_node)
    
    # Add specialized educational nodes
    workflow.add_node("assessment", assessment_node)
    workflow.add_node("progress", progress_tracking_node)
    workflow.add_node("analytics", analytics_node)
    workflow.add_node("admin", admin_node)
    workflow.add_node("error_handler", error_handler_node)

    # Enhanced conditional routing based on user type and context
    def route_after_adaptive_chain(state: GraphState):
        """Enhanced routing logic that considers user type and educational context."""
        route_decision = state.get("route_decision", "chat")
        user_type = state.get("user_type", "student")
        
        # Map routes to appropriate educational nodes
        route_mapping = {
            # Common educational routes
            "rag": "educational_retriever",
            "generate": "content_generator", 
            "chat": "synthesizer",
            
            # Student-specific learning routes
            "practice": "assessment",
            "assess": "assessment",
            "progress": "progress",
            
            # Instructor-specific educational routes
            "analytics": "analytics",
            "admin": "admin",
        }
        
        return route_mapping.get(route_decision, "synthesizer")  # Default to synthesizer

    # Define the conditional edges from the adaptive conversation chain
    workflow.add_conditional_edges(
        "adaptive_chain",
        route_after_adaptive_chain,
        {
            "educational_retriever": "educational_retriever",
            "content_generator": "content_generator",
            "synthesizer": "synthesizer",
            "assessment": "assessment",
            "progress": "progress", 
            "analytics": "analytics",
            "admin": "admin",
        },
    )

    # Define edges that lead to the synthesizer (final educational response)
    workflow.add_edge("educational_retriever", "synthesizer")
    workflow.add_edge("content_generator", "synthesizer")
    workflow.add_edge("assessment", "synthesizer") 
    workflow.add_edge("progress", "synthesizer")
    workflow.add_edge("analytics", "synthesizer")
    workflow.add_edge("admin", "synthesizer")
    workflow.add_edge("error_handler", "synthesizer")

    # Set the entry point and the finish point
    workflow.set_entry_point("adaptive_chain")
    workflow.add_edge("synthesizer", END)

    # Compile the enhanced educational graph into a runnable app
    try:
        app = workflow.compile()
        print("Enhanced Educational Graph compiled successfully!")
        print("Components:")
        print("- AdaptiveConversationChain: Intelligent educational routing")
        print("- EducationalRetriever: Curriculum-aware content retrieval") 
        print("- ContentGenerator: Personalized educational material creation")
        print("Available learning pathways:")
        print("- Student: rag → generate → practice → progress")
        print("- Instructor: rag → generate → analytics → admin") 
        return app
    except Exception as e:
        print(f"Error compiling educational graph: {e}")
        return None

def create_graph():
    """Wrapper function to maintain backward compatibility."""
    return create_enhanced_graph()