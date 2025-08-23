[ ] 1. Define the State:
[ ] In graph/state.py, define the GraphState TypedDict. It must include fields for messages, retrieved_docs, generated_content, etc.
[ ] 2. Implement the Nodes:
[ ] In graph/retriever.py, implement the retriever_node. This function will take the state, query ChromaDB, and update the state with the results. (Fulfills EducationalRetriever component).
[ ] In graph/generator.py, implement the content_generator_node. This function will generate quizzes or flashcards based on the user's request. (Fulfills ContentGenerator component).
[ ] In graph/router.py, implement the router_node. This function will classify the user's intent and decide the next action. (Part of the LearningAnalyzer component).
[ ] In graph/synthesizer.py, implement the response_synthesizer_node. This function will generate the final AI message based on the complete state.
[ ] 3. Assemble the Graph:
[ ] In graph/graph.py, import the state and all node functions.
[ ] Instantiate the StateGraph with your GraphState.
[ ] Add each function as a node to the graph.
[ ] Define the conditional edge that connects the router_node to the other specialist nodes.
[ ] Define the unconditional edges that lead to the response_synthesizer_node.
[ ] Set the entry and end points for the graph.
[ ] Compile the graph and expose it via a single function. This fulfills the LangChain System Design and Unified Workflow requirements.
Phase 3: Expose the Brain via API (FastAPI)
[ ] 1. Set Up the Server:
[ ] In main.py, create the FastAPI app instance.
[ ] Import your compiled graph from graph.graph.
[ ] (Bonus) Implement Swagger UI by adding metadata to the FastAPI instance.
[ ] 2. Define API Endpoints:
[ ] Create the POST /api/assistant/chat endpoint.
[ ] Use Pydantic models to define the expected request body (e.g., user message, conversation ID) and the structured JSON response. This fulfills the JSON API Format requirement.
[ ] The endpoint logic should simply invoke your compiled LangGraph with the user's input.
[ ] 3. Configure Security & CORS:
[ ] In main.py, implement CORS middleware to allow requests from the frontend's URL. This is a critical security step.
Phase 4: Containerize & Deploy
