import os
import json
from fastapi.testclient import TestClient
from ai_assistant.api.main import app  # Import your FastAPI app

client = TestClient(app)

def test_get_escalations():
    """
    Test the /get-escalations endpoint to ensure it returns the correct escalations data.
    """
    # Create a test escalation file
    tenant_id = "test-tenant"
    test_escalations = [
        {"message": "Test escalation 1", "response": "Response 1", "date": "2024-01-01"},
        {"message": "Test escalation 2", "response": "Response 2", "date": "2024-01-02"},
    ]
    escalation_file = f"ai-assistant/api/escalations/esc_{tenant_id}.json"
    os.makedirs(os.path.dirname(escalation_file), exist_ok=True)
    with open(escalation_file, "w") as f:
        json.dump(test_escalations, f)

    # Make a request to the /get-escalations endpoint
    headers = {"X-API-Key": "test-key"}
    response = client.get("/get-escalations", headers=headers)

    # Assert that the response is successful
    assert response.status_code == 200

    # Assert that the response data matches the test data
    assert response.json() == test_escalations

    # Clean up the test escalation file
    os.remove(escalation_file)

    # Test with no file
    response = client.get("/get-escalations", headers=headers)
    assert response.status_code == 200
    assert response.json() == []