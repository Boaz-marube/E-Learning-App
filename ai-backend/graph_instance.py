# graph_instance.py
from graph.graph import create_enhanced_graph

# Single shared graph instance
graph_app = create_enhanced_graph()
if graph_app is None:
    raise RuntimeError("Failed to initialize the educational graph.")
