# ingestion/ingest.py

import os
import chromadb
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

# --- Configuration ---
load_dotenv()
KNOWLEDGE_BASE_DIR = "../knowledge_base"  # Assumes this script is run from inside the ingestion/ directory
CHROMA_PATH = "../chroma_db"

def main():
    """
    Main function to ingest data into the vector store.
    - Loads documents from the knowledge base directory.
    - Splits documents into manageable chunks.
    - Creates embeddings for the chunks using ChromaDB's default model (all-MiniLM-L6-v2).
    - Stores the chunks and their embeddings in ChromaDB.
    """
    print("--- Starting RAG Ingestion Pipeline ---")

    # 1. Load Documents
    print(f"Loading documents from: {KNOWLEDGE_BASE_DIR}")
    # Using a simple TextLoader for markdown/text files with UTF-8 encoding.
    # In a real scenario, you'd have more complex loaders for different file types.
    def create_text_loader(file_path):
        return TextLoader(file_path, encoding='utf-8')
    
    loader = DirectoryLoader(KNOWLEDGE_BASE_DIR, glob="**/*.md", loader_cls=create_text_loader, show_progress=True)
    documents = loader.load()
    if not documents:
        print("No documents found. Please add markdown files to the knowledge_base directory.")
        return
    print(f"Loaded {len(documents)} documents.")

    # 2. Split Documents into Chunks
    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    # 3. Create Embeddings and Store in ChromaDB
    print("Creating embeddings and storing in ChromaDB...")
    
    # Initialize ChromaDB with default embedding function (all-MiniLM-L6-v2)
    # No API key required - uses local Sentence Transformers model

    # Initialize the ChromaDB client with persistence
    db = chromadb.PersistentClient(path=CHROMA_PATH)

    # Create or get the collection
    # We clear the collection each time to ensure a fresh start.
    # In a production system, you might want to update it instead.
    collection_name = "direct_ed_curriculum"
    if collection_name in [c.name for c in db.list_collections()]:
        print(f"Clearing old collection: {collection_name}")
        db.delete_collection(name=collection_name)
    
    collection = db.create_collection(name=collection_name)

    # Generate embeddings for all chunks
    print("Generating embeddings using ChromaDB's default model (all-MiniLM-L6-v2)...")
    chunk_texts = [chunk.page_content for chunk in chunks]
    
    # Add chunks to the collection - ChromaDB will automatically generate embeddings
    # using its default embedding function (all-MiniLM-L6-v2)
    collection.add(
        ids=[str(i) for i in range(len(chunks))], # IDs must be strings
        documents=chunk_texts,
        metadatas=[chunk.metadata for chunk in chunks]
        # No embeddings parameter needed - ChromaDB generates them automatically
    )

    print("\n--- RAG Ingestion Pipeline Complete! ---")
    print(f"Vector store created at: {CHROMA_PATH}")

if __name__ == "__main__":
    main()