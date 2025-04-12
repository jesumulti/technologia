# chat.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
import json, os
from typing import Annotated

# Import necessary services
from ..llm.llm_client import LlmClient

# Create a router instance
router = APIRouter()

# Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    message: str

from ..llm.llm_client import LlmClient
from ..vector_data.vector_store import VectorStore

# Initialize the LLM client and vector store
llm_client = LlmClient()
vector_store = VectorStore()


# Function to check if the LLM response is related to escalation
def is_escalation_related(response: str) -> bool:
    """
    Checks if the LLM response indicates a need for escalation.

    Args:
        response (str): The response string from the LLM.

    Returns:
        bool: True if the response contains the word "escalation", False otherwise.
    """
    # For now, we simply check if the response contains the word "escalation"
    # This can be expanded to include more sophisticated logic
    return "escalation" in response.lower()


# Define the chat endpoint
@router.post("/chat")
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
):
    """
    Chat endpoint that receives a message and returns a response from the LLM,
    incorporating context from the vector store.
    """
    try:
        # Get the tenant ID from the request context
        tenant_id = request.state.tenant_id
        # Get the context using the LLMClient
        context = llm_client.get_context(tenant_id=tenant_id)
        # Query the LLM and get the response
        response = llm_client.query(message=chat_request.message, context=context)

        # Check if the response is related to escalation
        if is_escalation_related(response):
            # Define the path for the escalation log file
            escalation_file = f"ai-assistant/api/escalations/esc_{tenant_id}.json"
            # Create the directory if it doesn't exist
            os.makedirs(os.path.dirname(escalation_file), exist_ok=True)

            # Prepare the escalation data
            escalation_data = {
                "message": chat_request.message,
                "response": response,
                "date": str(datetime.now())  # Using string for simplicity, consider a standard format
            }

            # Load existing escalations, or create a new list if the file doesn't exist
            try:
                with open(escalation_file, "r") as f:
                    escalations = json.load(f)
            except FileNotFoundError:
                escalations = []
            escalations.append(escalation_data)  # Add the new escalation

            # Save the updated escalations back to the file
            with open(escalation_file, "w") as f:
                json.dump(escalations, f, indent=4)  # Use indent for pretty formatting
        # Return the response to the user
        return {"response": response}
    except Exception as e:
        # Handle any exceptions and return an HTTP error
        raise HTTPException(status_code=500, detail=str(e))