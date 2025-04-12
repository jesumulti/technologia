import json
import os
from typing import Dict

class ThemeManager:
    """
    Manages the saving and retrieval of theme data for different tenants.
    """

    def __init__(self, data_dir: str = "ai-assistant/api/theme_data"):
        """
        Initializes the ThemeManager with a directory to store theme data.

        Args:
            data_dir (str): The directory where theme files will be stored.
        """
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)  # Create directory if it doesn't exist

    def save_theme(self, tenant_id: str, theme_data: Dict):
        """
        Saves the theme data for a given tenant to a JSON file.

        Args:
            tenant_id (str): The ID of the tenant.
            theme_data (Dict): The theme data to save.
        """
        file_path = os.path.join(self.data_dir, f"theme_{tenant_id}.json")
        try:
            with open(file_path, "w") as f:
                json.dump(theme_data, f, indent=4)
        except Exception as e:
            print(f"Error saving theme for tenant {tenant_id}: {e}")

    def get_theme(self, tenant_id: str) -> Dict:
        """
        Retrieves the theme data for a given tenant from a JSON file.

        Args:
            tenant_id (str): The ID of the tenant.

        Returns:
            Dict: The theme data, or a default theme if the file does not exist.
        """
        file_path = os.path.join(self.data_dir, f"theme_{tenant_id}.json")
        default_theme = {
            "primaryColor": "#007bff",  # Example default color
            "secondaryColor": "#6c757d",
            "fontFamily": "Arial, sans-serif",
        }
        try:
            with open(file_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return default_theme  # Return default theme if file not found
        except Exception as e:
            print(f"Error getting theme for tenant {tenant_id}: {e}")
            return default_theme