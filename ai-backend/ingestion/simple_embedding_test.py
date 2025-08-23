# simple_embedding_test.py
# Simple test to verify embeddings

import chromadb

def quick_test():
    print("=== Quick Embedding Test ===")
    
    # Connect to ChromaDB
    db = chromadb.PersistentClient(path="../chroma_db")
    collection = db.get_collection(name="direct_ed_curriculum")
    
    # Basic info
    count = collection.count()
    print(f"✅ Collection exists with {count} documents")
    
    # Get a sample with embeddings
    sample = collection.get(limit=1, include=["documents", "embeddings"])
    
    if sample['embeddings'] is not None and len(sample['embeddings']) > 0:
        embedding_dim = len(sample['embeddings'][0])
        print(f"✅ Embeddings exist! Dimension: {embedding_dim} (all-MiniLM-L6-v2)")
        
        # Test search
        results = collection.query(
            query_texts=["Python programming basics"],
            n_results=2
        )
        print(f"✅ Search works! Found {len(results['ids'][0])} results")
        print("✅ All tests passed - embeddings are working correctly!")
    else:
        print("❌ No embeddings found")

if __name__ == "__main__":
    quick_test()
