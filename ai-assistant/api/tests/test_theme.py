# test_theme.py
import json
import os
from fastapi.testclient import TestClient
from ai_assistant.api.main import app

client = TestClient(app)

def test_get_and_save_theme():
    """
    Test saving and retrieving a theme for a tenant using /save-theme and /get-theme endpoints.
    """
    tenant_id = "test-tenant-theme"  # Define a test tenant ID
    theme_data = {"mainColor": "#00FF00"}  # Define test theme data

    # Save the theme
    response_save = client.post(
        "/save-theme",
        headers={"X-API-Key": tenant_id},
        json=theme_data
    )
    assert response_save.status_code == 200, f"Save theme failed: {response_save.text}"

    # Get the theme
    response_get = client.get(
        "/get-theme",
        headers={"X-API-Key": tenant_id}
    )
    assert response_get.status_code == 200, f"Get theme failed: {response_get.text}"

    # Check if the retrieved theme matches the saved theme
    retrieved_theme = response_get.json()
    assert retrieved_theme == theme_data, "Retrieved theme does not match saved theme"
    
    # Clean up: Remove the test theme file (optional)
    theme_file_path = f"ai-assistant/api/themes/theme_{tenant_id}.json"
    if os.path.exists(theme_file_path):
        os.remove(theme_file_path)

    # Test default theme
    response_get_default = client.get(
        "/get-theme",
        headers={"X-API-Key": "non-existent-tenant"}
    )
    assert response_get_default.status_code == 200, f"Get default theme failed: {response_get_default.text}"
    assert response_get_default.json() == {"mainColor": "#0000FF"}, "Default theme is incorrect"