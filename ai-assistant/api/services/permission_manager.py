import json
import os

class PermissionManager:
    def __init__(self):
        self.base_dir = "ai-assistant/api/data/permissions"
        os.makedirs(self.base_dir, exist_ok=True)

    def save_permissions(self, org_id, permissions):
        file_path = os.path.join(self.base_dir, f"{org_id}.json")
        with open(file_path, "w") as f:
            json.dump(permissions, f, indent=4)

    def get_permissions(self, org_id):
        file_path = os.path.join(self.base_dir, f"{org_id}.json")
        try:
            with open(file_path, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {}