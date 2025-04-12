import json
from typing import Dict


class ApiParser:
    def is_valid_json(self, json_string: str) -> bool:
        """
        Checks if a given string is a valid JSON.

        Args:
            json_string (str): The string to check.

        Returns:
            bool: True if the string is valid JSON, False otherwise.
        """
        try:
            json.loads(json_string)
            return True
        except json.JSONDecodeError:
            return False

    def parse_openapi(self, json_string: str) -> Dict | None:
        """
        Parses an OpenAPI specification from a JSON string and extracts key information.

        Args:
            json_string (str): The JSON string containing the OpenAPI specification.

        Returns:
            Dict: A dictionary containing a summary of the API, including title, version,
                  and a list of endpoints with their methods, URLs, and descriptions.
                  Returns None if the input is not a valid OpenAPI specification or if
                  an error occurs during parsing.
        """
        if not self.is_valid_json(json_string):
            return {"error": "Invalid JSON string provided."}

        try:
            openapi_spec = json.loads(json_string)

            # Check for required OpenAPI keys
            if "openapi" not in openapi_spec or "info" not in openapi_spec or "paths" not in openapi_spec:
                return {"error": "Invalid OpenAPI specification format."}

            info = openapi_spec["info"]
            paths = openapi_spec["paths"]

            # Extract API summary information
            api_summary = {
                "title": info.get("title", "No title"),
                "version": info.get("version", "No version"),
                "endpoints": [],
            }

            # Extract endpoint information
            for path, methods in paths.items():
                for method, details in methods.items():
                    api_summary["endpoints"].append({
                        "method": method.upper(),
                        "url": path,
                        "description": details.get("summary", details.get("description", "No description")),
                    })

            return api_summary
        except (json.JSONDecodeError, KeyError) as e:
            return {"error": f"An error occurred during parsing: {str(e)}"}