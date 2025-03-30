# def handle_web_agent_query(prompt: str) -> str:
#     # For now, just do something simple or mock
#     # Later, you can integrate a real LLM call, a DB lookup, etc.
#     return f"[WebAgent] This is a response to your prompt: '{prompt}'"

# agents/web_agent.py

# from langchain_community.chat_models import ChatOllama
from langchain_ollama import ChatOllama
# Initialize the LLM (llama2 or mistral)
llm = ChatOllama(model="llama2")

# Handle general queries using the LLM directly
async def handle_web_query(query: str) -> str:
    try:
        response = llm.invoke(query)
        return response
    except Exception as e:
        return f"Error while processing web query: {str(e)}"