# test_retriever.py
# Test script for the retriever module

import sys
import os

# Add the parent directory to the path so we can import from graph
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from graph.retriever import retriever_node
from graph.state import GraphState
from langchain_core.messages import HumanMessage

def test_retriever():
    """
    Test the retriever with various queries to ensure it's working with ChromaDB's default embeddings.
    """
    print("=== Testing Retriever with ChromaDB Default Embeddings ===\n")
    
    # Test queries
    test_queries = [
        "What is .dump()?"
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"--- Test {i}: '{query}' ---")
        
        # Create a mock state with the test query
        test_state = {
            "messages": [HumanMessage(content=query)]
        }
        
        try:
            # Call the retriever
            result = retriever_node(test_state)
            
            # Display results
            retrieved_docs = result["retrieved_docs"]
            print(f"✅ Successfully retrieved {len(retrieved_docs)} documents")
            
            # Show the content of retrieved documents
            for j, doc in enumerate(retrieved_docs, 1):
                print(f"\nDocument {j} (first 200 chars):")
                print(f"  {doc[:200]}...")
                
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("-" * 80)
        print()

def test_retriever_detailed():
    """
    Detailed test showing the full retrieval process.
    """
    print("=== Detailed Retriever Test ===\n")
    
    query = "What is Python programming and how do I get started?"
    print(f"Query: {query}\n")
    
    # Create test state
    test_state = {
        "messages": [HumanMessage(content=query)]
    }
    
    try:
        result = retriever_node(test_state)
        retrieved_docs = result["retrieved_docs"]
        
        print(f"✅ Retrieved {len(retrieved_docs)} documents")
        print("\n=== Full Retrieved Documents ===")
        
        for i, doc in enumerate(retrieved_docs, 1):
            print(f"\n--- Document {i} ---")
            print(doc)
            print("-" * 60)
            
        # Test different query
        print("\n=== Testing Different Query ===")
        query2 = "machine learning and data science"
        test_state2 = {
            "messages": [HumanMessage(content=query2)]
        }
        
        result2 = retriever_node(test_state2)
        retrieved_docs2 = result2["retrieved_docs"]
        
        print(f"Query: {query2}")
        print(f"✅ Retrieved {len(retrieved_docs2)} documents")
        
        for i, doc in enumerate(retrieved_docs2, 1):
            print(f"\nDocument {i} (first 300 chars):")
            print(f"  {doc[:300]}...")
            
    except Exception as e:
        print(f"❌ Error during detailed test: {e}")
        import traceback
        traceback.print_exc()

def validate_retriever_setup():
    """
    Validate that the retriever is properly set up.
    """
    print("=== Validating Retriever Setup ===\n")
    
    try:
        # Test imports
        from graph.retriever import retriever_node, CHROMA_PATH, COLLECTION_NAME
        from graph.state import GraphState
        print("✅ Imports successful")
        
        # Test ChromaDB connection
        import chromadb
        db = chromadb.PersistentClient(path=CHROMA_PATH)
        collections = db.list_collections()
        collection_names = [c.name for c in collections]
        
        print(f"✅ ChromaDB connected at: {CHROMA_PATH}")
        print(f"✅ Available collections: {collection_names}")
        
        if COLLECTION_NAME in collection_names:
            collection = db.get_collection(name=COLLECTION_NAME)
            doc_count = collection.count()
            print(f"✅ Target collection '{COLLECTION_NAME}' found with {doc_count} documents")
            
            # Test a simple query
            test_result = collection.query(
                query_texts=["test query"],
                n_results=1
            )
            if test_result['documents']:
                print("✅ ChromaDB query works - embeddings are functional")
                print("✅ Retriever setup validation passed!")
            else:
                print("❌ ChromaDB query returned no results")
        else:
            print(f"❌ Target collection '{COLLECTION_NAME}' not found")
            
    except Exception as e:
        print(f"❌ Validation failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Run validation first
    validate_retriever_setup()
    print("\n" + "="*80 + "\n")
    
    # Run basic tests
    test_retriever()
    print("\n" + "="*80 + "\n")
    
    # Run detailed test
    test_retriever_detailed()
