# graph/EducationalRetriever.py

import chromadb
from .state import GraphState
from .error_handler import validate_user_input, handle_missing_user_input, handle_rag_failure

CHROMA_PATH = "./chroma_db" # Assumes the app runs from the root directory
COLLECTION_NAME = "direct_ed_curriculum"

def educational_retriever_node(state: GraphState):
    """
    Advanced educational retriever that finds relevant curriculum content 
    based on the user's query, user type, and learning context.
    Uses ChromaDB's default embedding function (all-MiniLM-L6-v2) for consistency with ingestion.
    With error handling for missing input and RAG system failures.
    """
    print("---NODE: EDUCATIONAL RETRIEVER---")
    
    # Validate user input first
    if not validate_user_input(state):
        print("No valid user input provided to retriever")
        return handle_missing_user_input(state)
    
    try:
        messages = state["messages"]
        user_type = state.get("user_type", "student")
        student_level = state.get("student_level", "beginner")
        last_user_message = messages[-1].content

        # Initialize ChromaDB client (uses default embedding function automatically)
        try:
            db = chromadb.PersistentClient(path=CHROMA_PATH)
            collection = db.get_collection(name=COLLECTION_NAME)
        except Exception as db_error:
            print(f"ChromaDB connection failed: {str(db_error)}")
            return handle_rag_failure(state, db_error)

        # Adjust retrieval parameters based on user type and level
        if user_type == "instructor":
            # Instructors need comprehensive information
            n_results = 5
            print("Retrieving comprehensive curriculum content for instructor...")
        else:
            # Students need focused, level-appropriate content
            if student_level == "beginner":
                n_results = 2  # Focused, simple content
            elif student_level == "intermediate":
                n_results = 3  # Moderate detail
            else:  # advanced
                n_results = 4  # More comprehensive
            
            print(f"Retrieving {student_level}-level content for student...")

        # Perform educational content similarity search
        try:
            results = collection.query(
                query_texts=[last_user_message],
                n_results=n_results
            )
            
            retrieved_documents = results['documents'][0]
            
            print(f"Educational retriever found {len(retrieved_documents)} relevant curriculum documents.")
            
            # Update the state with the retrieved educational content
            return {"retrieved_docs": retrieved_documents}
            
        except Exception as search_error:
            print(f"ChromaDB search failed: {str(search_error)}")
            return handle_rag_failure(state, search_error)
            
    except Exception as e:
        print(f"Educational retriever error: {str(e)}")
        return handle_rag_failure(state, e)
