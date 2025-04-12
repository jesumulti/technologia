# test_main.py
import json
from fastapi.testclient import TestClient
from ..main import app  # Assuming your main FastAPI app is in main.py
import os

from ..config import settings

# Create a TestClient instance
client = TestClient(app)


def test_list_orgs():
    """
    Test the /list-orgs endpoint to check if it returns the correct data.
    """
    # Define the expected data
    expected_orgs = [
        {"name": "org1", "id": "org1-id"},
        {"name": "org2", "id": "org2-id"},
    ]

    # Ensure that the orgs.json file exists with the correct content
    orgs_file = "ai-assistant/admin-portal/pages/api/orgs.json"
    os.makedirs(os.path.dirname(orgs_file), exist_ok=True)  # Create the directory if it doesn't exist

    with open(orgs_file, "w") as f:
        json.dump(expected_orgs, f, indent=4)

    # Make a GET request to the /list-orgs endpoint
    response = client.get("/list-orgs")

    # Check if the response status code is 200 OK
    assert response.status_code == 200

    # Check if the response data matches the expected data
    assert response.json() == expected_orgs


def test_list_files():
    """
    Test the /list-files endpoint to check if it returns the correct data.
    """

    # Define a sample tenant ID for testing. This should ideally be unique for the test.
    tenant_id = "test_tenant"

    # Create a test file for the tenant to ensure there is data to list.
    upload_dir = os.path.join(
        settings.root_path, "ai-assistant", "api", "vector-data", "uploads", tenant_id
    )
    os.makedirs(upload_dir, exist_ok=True)  # Create the directory if it doesn't exist
    test_file_path = os.path.join(upload_dir, "test_file.txt")
    with open(test_file_path, "w") as f:
        f.write("This is a test file.")

    # Make a GET request to the /list-files endpoint with the tenant ID in the headers.
    response = client.get("/list-files", headers={"X-API-Key": tenant_id})

    # Check if the response status code is 200 OK.
    assert response.status_code == 200

    # Check if the response contains the test file.
    files = response.json().get("files", [])
    assert any(file["name"] == "test_file.txt" for file in files)

    # Clean up the test file and directory after the test.
    os.remove(test_file_path)
    os.rmdir(upload_dir)