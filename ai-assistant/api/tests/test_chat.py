import pytest
from fastapi.testclient import TestClient
from ai_assistant.api.main import app

client = TestClient(app)


@pytest.mark.parametrize(
    "message, expected_status",
    [
        ("Hello, how are you?", 200),
        ("What can you do?", 200),
        ("Tell me a joke.", 200),
        ("This is a test message.", 200),
    ],
)
def test_chat_endpoint_basic_messages(message: str, expected_status: int):
    """
    Test the /chat endpoint with various basic messages.

    Args:
        message (str): The message to send to the /chat endpoint.
        expected_status (int): The expected HTTP status code of the response.
    """
    response = client.post(
        "/chat", json={"message": message}, headers={"X-API-Key": "test-key"}
    )
    assert response.status_code == expected_status
    assert "response" in response.json()


def test_chat_endpoint_escalation_message():
    """
    Test the /chat endpoint with a message that should trigger an escalation.
    """
    # Assuming "escalation" in the message triggers the escalation logic.
    response = client.post(
        "/chat",
        json={"message": "I need to escalate this issue."},
        headers={"X-API-Key": "test-key"},
    )
    assert response.status_code == 200
    assert "response" in response.json()
    # You might want to add more specific checks here, depending on how
    # your escalation logic is implemented in the /chat endpoint.  For
    # example, if the response contains a specific message or if a log
    # entry is created.


# You can add more tests to cover other scenarios, such as:
# - Empty messages
# - Messages with special characters
# - Very long messages
# - Unauthorized access (missing or invalid API key)
# - etc.