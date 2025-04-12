import json
from typing import Dict
import requests

from ..vector_data.vector_store import VectorStore
class LlmClient:
    """
    A client for interacting with a Large Language Model (LLM), specifically Ollama.
    """

    def __init__(self, model_name: str = "llama2"):
        """
        Initializes the LlmClient with the specified model name.

        Args:
            model_name (str): The name of the model to use with Ollama (default: "llama2").
        """
        self.model_name = model_name
        self.ollama_url = "http://localhost:11434/api/generate"

    def query(self, message: str, context: list[str]) -> str:
        """
        Queries the Ollama LLM with a given message and returns the model's response.

        Args:
            message (str): The message to send to the LLM.

        Returns:
            str: The LLM's response to the message.

        Raises:
            requests.exceptions.RequestException: If there's an error during the HTTP request to Ollama.
            Exception: If there's any other error during processing.
        """        
        # Construct the prompt by combining the context and the message.
        prompt = f"{' '.join(context)}\n\nUser: {message}"

        try:
            # Prepare the request payload for Ollama's API.
            payload = {
                "model": self.model_name,
                "prompt": message,
                "stream": False,
            }
            # Send a POST request to the Ollama API.
            response = requests.post(self.ollama_url, json=payload)
            response.raise_for_status()  # Raise an exception for bad status codes.

            # Parse the response to extract the model's reply.
            response_json = response.json()
            return response_json["response"]

        except requests.exceptions.RequestException as e:
            raise requests.exceptions.RequestException(f"Error communicating with Ollama: {e}")

        except Exception as e:
            raise Exception(f"An unexpected error occurred: {e}")
        
    def get_context(self, tenant_id: str) -> list[str]:
        """
        Retrieves the context for a given tenant ID.

        Args:
            tenant_id (str): The ID of the tenant.

        Returns:
            str: The context for the given tenant ID (currently empty).
        """
        # Initialize the vector store
        vector_store = VectorStore()

        # Retrieve the context for the given tenant ID from the vector store
        context = vector_store.query(query="", tenant_id=tenant_id)

        # Return the context as a string
        return context