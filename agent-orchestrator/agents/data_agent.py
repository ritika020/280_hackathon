import json
import re

from langchain_ollama import ChatOllama

# Use a local model like llama2 via Ollama
llm = ChatOllama(model="llama2")


# def extract_json(text):
#     try:
#         print("[DEBUG] Raw LLM output:\n", text)
#         match = re.search(r"\{[\s\S]*\}", text)
#         if not match:
#             raise ValueError("No JSON object found in response.")
#         return json.loads(match.group())
#     except Exception as e:
#         raise ValueError(f"Failed to extract JSON: {str(e)}")



async def handle_data_query(query: str) -> dict:
    try:
        system_prompt = (
            "You are a data-only agent. For the following query, respond ONLY with a raw JSON object.\n"
            "Do NOT include any explanation, markdown, code block formatting, or comments.\n"
            "Output must be strictly a valid JSON object. No quotes around the entire object. No extra text.\n"
            "If a value includes a percent, return it as a number only (e.g., use 4.5 instead of 4.5%).\n"
            "Return all responses in the following JSON structure:\n"
            "{ \"data\": [ { \"label\": \"Labrador Retriever\", \"value\": 0.2 }, ... ] }\n"
            "Do NOT return dictionaries or arrays directly. Always wrap in this format."
        )

        full_prompt = f"{system_prompt}\n\nQuery: {query}"
        response = llm.invoke(full_prompt)
        cleaned = response.content.strip()
        parsed = json.loads(cleaned)

        # Add "type": "chart" to the response
        return {
            "type": "chart",
            "data": parsed.get("data", [])
        }

    except Exception as e:
        return {
            "type": "error",
            "data": f"Error while processing query: {str(e)}"
        }

# Handle structured data queries
# async def handle_data_query(query: str) -> str:
#     try:
#         # Force model to output only JSON using a stricter prompt
#         # system_prompt = (
#         #     "You are a data-only agent. For the following query, respond ONLY with a raw JSON object.\n"
#         #     "Do NOT include any explanation, markdown, code block formatting, or comments.\n"
#         #     "Output must be strictly a valid JSON object. No quotes around the entire object. No extra text.\n"
#         #     "If a value includes a percent, return it as a number only (e.g., use 4.5 instead of 4.5%).\n"
#         #     "Return all responses in the following JSON structure:\n"
#         #     "{ \"data\": [ { \"label\": \"Labrador Retriever\", \"value\": 0.2 }, ... ] }\n"
#         #     "Do NOT return dictionaries or arrays directly. Always wrap in this format."
#         # )       
        
#         full_prompt = f"{system_prompt}\n\nQuery: {query}"
#         response = llm.invoke(full_prompt)

#         # Attempt to find and clean JSON block from output
#         cleaned = response.content.strip()
#         if cleaned.startswith("```json"):
#             cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        
#         parsed = extract_json(cleaned)
#         data_items = parsed.get("data", [])

#         # Check if all values are int or float
#         all_numeric = all(
#             "value" in item and isinstance(item["value"], (int, float))
#             for item in data_items
#         )

#         if all_numeric:
#             return {
#                 "type": "chart",
#                 "data": data_items
#             }
#         else:
#             # If values aren't all numeric, return plain JSON string
#             return {
#                 "type": "text",
#                 "data": json.dumps(parsed, indent=2)
#             }

#     except Exception as e:
#         return {
#             "type": "error",
#             "data": f"Error while processing query: {str(e)}"
#         }


#     #     return {
#     #         "type": "chart",
#     #         "data": parsed.get("data", [])
#     #     }
    

#     # except Exception as e:
#     #     return {
#     #         "type": "error",
#     #         "data": f"Error while processing data query: {str(e)}"
#     #     }
    
#     #     # Optional: Validate it's valid JSON
#     #     json.loads(cleaned)  # Throws if it's invalid

#     #     return cleaned

#     # except Exception as e:
#     #     return f"Error while processing data query: {str(e)}"
