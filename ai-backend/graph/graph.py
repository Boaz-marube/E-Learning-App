# graph/graph.py

from langgraph.graph import StateGraph, END
from .state import GraphState
from .EducationalRetriever import educational_retriever_node
from .AdaptiveConversationChain import adaptive_conversation_chain_node
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
    Creates a compiled LangGraph StateGraph for student/instructor educational workflow.
    """
    workflow = StateGraph(GraphState)

    # Add nodes
    workflow.add_node("adaptive_chain", adaptive_conversation_chain_node)
    workflow.add_node("educational_retriever", educational_retriever_node)
    workflow.add_node("content_generator", content_generator_node)
    workflow.add_node("synthesizer", response_synthesizer_node)
    
    workflow.add_node("assessment", assessment_node)
    workflow.add_node("progress", progress_tracking_node)
    workflow.add_node("analytics", analytics_node)
    workflow.add_node("admin", admin_node)
    workflow.add_node("error_handler", error_handler_node)

    # Conditional routing from adaptive_chain
    def route_after_adaptive_chain(state: GraphState):
        route_decision = state.get("route_decision", "chat")
        user_type = state.get("user_type", "student")
        
        route_mapping = {
            "rag": "educational_retriever",
            "generate": "content_generator", 
            "chat": "synthesizer",
            "practice": "assessment",
            "assess": "assessment",
            "progress": "progress",
            "analytics": "analytics",
            "admin": "admin",
        }
        return route_mapping.get(route_decision, "synthesizer")

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

    # Edges leading to synthesizer
    workflow.add_edge("educational_retriever", "synthesizer")
    workflow.add_edge("content_generator", "synthesizer")
    workflow.add_edge("assessment", "synthesizer") 
    workflow.add_edge("progress", "synthesizer")
    workflow.add_edge("analytics", "synthesizer")
    workflow.add_edge("admin", "synthesizer")
    workflow.add_edge("error_handler", "synthesizer")

    # Entry and end points
    workflow.set_entry_point("adaptive_chain")
    workflow.add_edge("synthesizer", END)

    # Compile the graph and return
    compiled_graph = workflow.compile()
    return compiled_graph
