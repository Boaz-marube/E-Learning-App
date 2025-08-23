# test_embeddings.py
# Script to test if embeddings were created successfully

import chromadb
import os

# Configuration
CHROMA_PATH = "../chroma_db"
COLLECTION_NAME = "direct_ed_curriculum"

def test_embeddings():
    """
    Test if embeddings were created successfully in ChromaDB.
    """
    print("=== Testing ChromaDB Embeddings ===\n")
    
    try:
        # 1. Connect to the existing ChromaDB instance
        print(f"Connecting to ChromaDB at: {CHROMA_PATH}")
        db = chromadb.PersistentClient(path=CHROMA_PATH)
        
        # 2. Check if collection exists
        collections = db.list_collections()
        collection_names = [c.name for c in collections]
        print(f"Available collections: {collection_names}")
        
        if COLLECTION_NAME not in collection_names:
            print(f"❌ Collection '{COLLECTION_NAME}' not found!")
            return False
        
        # 3. Get the collection
        collection = db.get_collection(name=COLLECTION_NAME)
        print(f"✅ Collection '{COLLECTION_NAME}' found!")
        
        # 4. Get collection info
        count = collection.count()
        print(f"📊 Number of documents in collection: {count}")
        
        if count == 0:
            print("❌ No documents found in collection!")
            return False
        
        # 5. Test retrieval of a few documents
        print("\n--- Sample Data Test ---")
        sample_results = collection.get(limit=3, include=["documents", "metadatas", "embeddings"])
        
        print(f"Retrieved {len(sample_results['ids'])} sample documents")
        
        # Check if embeddings exist
        if sample_results.get('embeddings') is not None and len(sample_results['embeddings']) > 0:
            embedding_dim = len(sample_results['embeddings'][0])
            print(f"✅ Embeddings found! Dimension: {embedding_dim}")
            print(f"Sample embedding (first 5 values): {sample_results['embeddings'][0][:5]}")
        else:
            print("❌ No embeddings found in the results!")
            return False
        
        # 6. Test semantic search
        print("\n--- Semantic Search Test ---")
        test_query = "What is Python programming?"
        search_results = collection.query(
            query_texts=[test_query],
            n_results=3,
            include=["documents", "distances"]
        )
        
        print(f"Query: '{test_query}'")
        print(f"Found {len(search_results['ids'][0])} results:")
        
        for i, (doc, distance) in enumerate(zip(search_results['documents'][0], search_results['distances'][0])):
            print(f"  {i+1}. Distance: {distance:.4f}")
            print(f"     Content: {doc[:100]}...")
            print()
        
        # 7. Test with different query
        print("--- Another Search Test ---")
        test_query2 = "machine learning algorithms"
        search_results2 = collection.query(
            query_texts=[test_query2],
            n_results=2,
            include=["documents", "distances"]
        )
        
        print(f"Query: '{test_query2}'")
        print(f"Found {len(search_results2['ids'][0])} results:")
        
        for i, (doc, distance) in enumerate(zip(search_results2['documents'][0], search_results2['distances'][0])):
            print(f"  {i+1}. Distance: {distance:.4f}")
            print(f"     Content: {doc[:100]}...")
            print()
        
        print("✅ All tests passed! Embeddings are working correctly.")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False

def embedding_stats():
    """
    Get detailed statistics about the embeddings.
    """
    print("\n=== Embedding Statistics ===")
    
    try:
        db = chromadb.PersistentClient(path=CHROMA_PATH)
        collection = db.get_collection(name=COLLECTION_NAME)
        
        # Get all data
        all_data = collection.get(include=["documents", "metadatas", "embeddings"])
        
        if not all_data['embeddings'] or len(all_data['embeddings']) == 0:
            print("No embeddings found!")
            return
        
        # Calculate stats
        total_docs = len(all_data['documents'])
        embedding_dim = len(all_data['embeddings'][0])
        
        # Calculate average document length
        doc_lengths = [len(doc) for doc in all_data['documents']]
        avg_doc_length = sum(doc_lengths) / len(doc_lengths)
        
        print(f"📊 Total documents: {total_docs}")
        print(f"🔢 Embedding dimension: {embedding_dim}")
        print(f"📝 Average document length: {avg_doc_length:.1f} characters")
        print(f"📝 Min document length: {min(doc_lengths)}")
        print(f"📝 Max document length: {max(doc_lengths)}")
        
        # Show some metadata stats
        if all_data['metadatas']:
            sources = [meta.get('source', 'unknown') for meta in all_data['metadatas']]
            unique_sources = set(sources)
            print(f"📁 Unique sources: {len(unique_sources)}")
            
            # Count documents per source
            from collections import Counter
            source_counts = Counter(sources)
            print("📊 Documents per source:")
            for source, count in source_counts.most_common(5):
                print(f"   {source}: {count} documents")
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")

if __name__ == "__main__":
    success = test_embeddings()
    if success:
        embedding_stats()
    else:
        print("\n❌ Embedding test failed!")
