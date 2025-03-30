import json
        
from langchain_ollama import ChatOllama

# Use a local model like llama2 via Ollama
llm = ChatOllama(model="llama2")

# Handle structured data queries
async def handle_data_query(query: str) -> str:
    try:
        # Force model to output only JSON using a stricter prompt
        system_prompt = (
            "You are a data-only agent. For the following query, respond ONLY with a raw JSON object.\n"
            "Do NOT include any explanation, markdown, code block formatting, or comments.\n"
            "Output must be strictly a valid JSON object. No quotes around the entire object. No extra text.\n"
            "If a value includes a percent, return it as a number only (e.g., use 4.5 instead of 4.5%)."
        )

        full_prompt = f"{system_prompt}\n\nQuery: {query}"
        response = llm.invoke(full_prompt)

        # Attempt to find and clean JSON block from output
        cleaned = response.content.strip()

        # Optional: Validate it's valid JSON
        json.loads(cleaned)  # Throws if it's invalid

        return cleaned

    except Exception as e:
        return f"Error while processing data query: {str(e)}"
