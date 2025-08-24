# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from langchain_core.messages import HumanMessage, AIMessage

from graph.graph import create_enhanced_graph
from graph.synthesizer import response_synthesizer_node
from memory.session_manager import session_manager

app = FastAPI(title="DirectEd AI Tutor API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://e-learning-app-seven.vercel.app",
        "https://*.vercel.app",  # Allow all Vercel preview deployments
        "http://localhost:3000",  # Local development
        "http://localhost:5173",  # Vite dev server
        "http://localhost:8080",  # Alternative local dev port
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize the compiled graph
graph_app = create_enhanced_graph()
if graph_app is None:
    raise RuntimeError("Failed to initialize the educational graph.")

class ChatRequest(BaseModel):
    user_id: str
    user_type: str  # "student" or "instructor"
    message: str
    student_level: Optional[str] = "beginner"  # optional, default beginner

class ChatResponse(BaseModel):
    reply: str
    route_taken: Optional[str] = None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Get or create user session
        session = session_manager.get_or_create_session(
            user_id=request.user_id,
            user_type=request.user_type,
            student_level=request.student_level
        )
        
        # Add user message to session
        user_message = HumanMessage(content=request.message)
        session_manager.add_message(request.user_id, user_message)
        
        # Get conversation history (last 10 messages for context)
        conversation_history = session_manager.get_conversation_history(
            request.user_id, 
            limit=10
        )
        
        # Construct the initial state for the graph with conversation history
        state = {
            "messages": conversation_history,  # Now includes conversation history
            "user_id": request.user_id,
            "user_type": request.user_type,
            "student_level": request.student_level,
            # Optional keys for nodes
            "assessment_mode": False,
            "conversation_context": session.conversation_context,
        }

        # If the graph fails to return a response, fallback to synthesizer
        result_state = graph_app.invoke(state)

        # Extract response safely
        reply = result_state.get("response")
        route_taken = result_state.get("route_taken")

        # If the graph returned nothing, call synthesizer directly
        if not reply:
            fallback = response_synthesizer_node(state)
            reply = fallback.get("response", "Sorry, I couldn't process your request.")
            route_taken = fallback.get("route_taken", "synthesizer")

        # Save AI response to session memory
        ai_message = AIMessage(content=reply)
        session_manager.add_message(request.user_id, ai_message)
        
        # Update session context if available
        if result_state.get("conversation_context"):
            session_manager.update_session_context(
                request.user_id, 
                result_state["conversation_context"]
            )
        
        # Update learning progress if available
        if result_state.get("learning_progress"):
            session_manager.update_learning_progress(
                request.user_id,
                result_state["learning_progress"]
            )

        return ChatResponse(reply=reply, route_taken=route_taken)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "DirectEd AI Tutor API is running. Use /chat to interact with the tutor."}

@app.get("/session/{user_id}")
async def get_session_info(user_id: str):
    """Get session information for a specific user."""
    session_info = session_manager.get_session_info(user_id)
    if session_info:
        return session_info
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.delete("/session/{user_id}")
async def clear_session(user_id: str):
    """Clear a user's session."""
    success = session_manager.clear_session(user_id)
    if success:
        return {"message": f"Session cleared for user {user_id}"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.get("/memory/stats")
async def get_memory_stats():
    """Get memory manager statistics."""
    return session_manager.get_stats()

@app.post("/memory/cleanup")
async def force_cleanup():
    """Force cleanup of expired sessions."""
    session_manager.force_cleanup()
    return {"message": "Memory cleanup completed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
