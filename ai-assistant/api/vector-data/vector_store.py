import chromadb
from chromadb.utils import embedding_functions
import os

class VectorStore:
    """
    Manages interactions with a ChromaDB vector store.
    """

    def __init__(self, persist_directory: str = "ai-assistant/api/vector-data/chroma"):
        """
        Initializes the ChromaDB client and collection.

        Args:
            persist_directory (str): The directory to persist ChromaDB data.
        """
        try:
            self.persist_directory = persist_directory
            self.chroma_client = chromadb.PersistentClient(path=self.persist_directory)
            self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
        except Exception as e:
            raise Exception(f"Error initializing ChromaDB client: {e}")

    def query(self, query: str, tenant_id: str, n_results: int = 5):
        """
        Queries the ChromaDB collection for the most relevant documents.

        Args:
            query (str): The query string.
            tenant_id (str): The ID of the tenant to query.
            n_results (int): The number of results to return.

        Returns:
            list: A list of matching documents.

        Raises:
            Exception: If there's an error during the query process.
        """
        try:
            collection_name = f"tenant_{tenant_id}"
            if collection_name not in self.chroma_client.list_collections():
                return []
            collection = self.chroma_client.get_collection(name=collection_name, embedding_function=self.embedding_function)
            # Perform the query on the collection
            results = collection.query(
                query_texts=[query],
                n_results=n_results
            )
            # Extract and return only the document texts as an array
            documents = results.get("documents", [])
            if documents:
                return documents[0]  # Return the list of texts for the single query
            else:
                return []
        except Exception as e:
            raise Exception(f"Error querying ChromaDB: {e}")