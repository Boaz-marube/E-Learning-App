# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware 
# from graph_router import router 
from langserve_routes import router as langserve_router

from graph.graph import create_enhanced_graph
from graph.synthesizer import response_synthesizer_node
from graph_instance import graph_app  
from langserve import add_routes  


app = FastAPI(title="DirectEd AI Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],      # Allow all HTTP methods
    allow_headers=["*"],      # Allow all headers
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
        # Initialize messages list if not present
        messages = [HumanMessage(content=request.message)]

        # Construct the initial state for the graph
        state = {
            "messages": messages,
            "user_id": request.user_id,
            "user_type": request.user_type,
            "student_level": request.student_level,
            # Optional keys for nodes
            "assessment_mode": False,
            "conversation_context": {},
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

        return ChatResponse(reply=reply, route_taken=route_taken)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")


add_routes(app, graph_app, path="/graph")
    

@app.get("/")
async def root():
    return {"message": "DirectEd AI Tutor API is running. Use /chat to interact with the tutor."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
