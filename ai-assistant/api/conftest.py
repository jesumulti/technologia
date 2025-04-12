# conftest.py
import pytest
from fastapi.testclient import TestClient
from ..main import app  # Import the FastAPI app instance
import os
import shutil

@pytest.fixture(scope="session")
def client():
    """
    Fixture that provides a TestClient instance for testing the FastAPI app.
    The scope is set to session, meaning the TestClient will be created once per test session.
    """
    return TestClient(app)

@pytest.fixture(autouse=True)
def clean_up_files():
    """
    Fixture that automatically cleans up files in the specified directories before and after each test.
    This fixture runs before each test to clean up any existing files, and then yields to allow the test to run.
    After the test completes, it cleans up again.
    """
    directories_to_clean = [
        "ai-assistant/api/vector-data/chromadb",
        "ai-assistant/api/vector-data/uploads",
        "ai-assistant/api/escalations",
        "ai-assistant/api/themes",
    ]
    
    # Clean up before test
    for directory in directories_to_clean:
        if os.path.exists(directory):
          shutil.rmtree(directory)
        os.makedirs(directory)
    
    yield  # Yield to allow the test to run

    # Clean up after test
    for directory in directories_to_clean:
      if os.path.exists(directory):
        shutil.rmtree(directory)