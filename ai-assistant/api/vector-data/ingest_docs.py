import os
from typing import List
from fastapi import UploadFile, HTTPException
from langchain.document_loaders import (
    PyPDFLoader,
    TextLoader,
    JSONLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document as LangchainDocument


def init_chroma_db(tenant_id: str):
    """
    Initializes a ChromaDB instance for a specific tenant, creating it if it doesn't exist.

    Args:
        tenant_id (str): The ID of the tenant.

    Returns:
        Chroma: A ChromaDB instance for the specified tenant.
    """
    # Create a unique persist directory for each tenant
    persist_directory = os.path.join("ai-assistant", "vector-data", "chromadb", tenant_id)
    os.makedirs(persist_directory, exist_ok=True)

    # Use a tenant-specific collection name
    collection_name = f"tenant_{tenant_id}"

    # Initialize embeddings and Chroma with the tenant-specific collection
    embeddings = HuggingFaceInstructEmbeddings(
        model_name="hkunlp/instructor-xl",
        model_kwargs={"device": "cpu"},
    )

    db = Chroma(
        persist_directory=persist_directory, embedding_function=embeddings
        , collection_name=collection_name
    )
    db.persist()
    return db
    

async def process_file(file_content: bytes, file_name: str, tenant_id: str):
    """
    Processes a file by reading it, splitting it into chunks,
    embedding the chunks, and upserting them into ChromaDB.
    """
    try:
        db = init_chroma_db(tenant_id)
        documents: List[LangchainDocument] = []
        
        file_extension = file_name.split(".")[-1].lower()

        # Create a temporary file
        temp_file_path = os.path.join(persist_directory, file_name)
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file_content)

        if file_extension == "md":
            loader = TextLoader(temp_file_path)
            documents = loader.load()
        elif file_extension == "pdf":
            loader = PyPDFLoader(temp_file_path)
            documents = loader.load()
        elif file_extension == "json":
            loader = JSONLoader(
                file_path=temp_file_path,
                jq_schema=".",
                text_content=False,
            )
            documents = loader.load()
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        split_docs = text_splitter.split_documents(documents)

        db.add_documents(split_docs)
        db.persist()
        print(f"File '{file_name}' processed and added to ChromaDB in collection 'tenant_{tenant_id}'.")
        os.remove(temp_file_path)  # Remove the temporary file
        return {"message": f"File '{file_name}' processed and added to ChromaDB."}
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {e}")