# test_ingest_docs.py
import os
import json
from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)

def test_ingest_docs_endpoint():
    """
    Tests the /ingest-docs endpoint to ensure it handles file uploads correctly.
    """
    # Create a dummy JSON file for testing
    test_file_path = "test_api_spec.json"
    test_data = {"openapi": "3.0.0", "info": {"title": "Test API", "version": "1.0.0"}}
    with open(test_file_path, "w") as f:
        json.dump(test_data, f)

    # Prepare the file for upload
    with open(test_file_path, "rb") as f:
        files = {"file": (test_file_path, f, "application/json")}
        
        # Send a POST request to the /ingest-docs endpoint with the test file
        response = client.post("/ingest-docs", files=files, headers={"X-API-Key": "test-key"})

    # Assert that the request was successful
    assert response.status_code == 200

    # Assert the response content
    assert "message" in response.json()
    assert "Successfully parsed and saved API specification" in response.json()["message"]
    assert "api_summary" in response.json()
    assert response.json()["api_summary"]["title"] == "Test API"

    # Clean up the test file
    os.remove(test_file_path)
    
    #check if the file was saved.
    upload_dir = os.path.join(os.getcwd(), "ai-assistant", "api", "vector-data", "uploads", "test-tenant")
    parsed_file_name = f"parsed_api_test_api_spec.json"
    file_path = os.path.join(upload_dir, parsed_file_name)
    assert os.path.exists(file_path)
    os.remove(file_path)