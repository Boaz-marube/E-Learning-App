# langserve_routes.py
from fastapi import APIRouter
from langserve import add_routes
from graph_instance import graph_app  

router = APIRouter()

# Add LangServe routes (accessible at /graph)
add_routes(router, graph_app, path="/graph")
