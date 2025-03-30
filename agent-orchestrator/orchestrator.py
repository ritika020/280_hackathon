from agents.web_agent import handle_web_query
from agents.clinical_agent import handle_clinical_query
from agents.food_agent import handle_food_query
from agents.data_agent import handle_data_query

# Simple keyword-based classification (you can improve this later)
def classify_query(query: str) -> str:
    q = query.lower()
    if "json format" in q or "json structure" in q:
        print("[Orchestrator] Routing to DATA agent")
        return "data"
    elif any(word in q for word in ["heart", "clinical", "covid"]):
        print("[Orchestrator] Routing to CLINICAL agent")
        return "clinical"
    elif any(word in q for word in ["hunger", "gdp", "malnutrition", "co2", "agriculture"]):
        print("[Orchestrator] Routing to FOOD SECURITY agent")
        return "food_security"
    else:
        print("[Orchestrator] Routing to Web agent")
        return "web"

async def handle_query(query: str) -> str:
    agent_type = classify_query(query)
    if agent_type == "data":
        return await handle_data_query(query)
    elif agent_type == "clinical":
        return await handle_clinical_query(query)
    elif agent_type == "food_security":
        return await handle_food_query(query)
    else:
        return await handle_web_query(query)