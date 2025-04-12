import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.routing import APIRoute
import json
from starlette.status import HTTP_401_UNAUTHORIZED
from typing import Annotated

app = FastAPI()

def get_tenant_id(request: Request):
    return request.state.tenant_id


async def api_key_middleware(request: Request, call_next):
    api_key = request.headers.get("X-API-Key")
    if not api_key:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, detail="Missing API Key"
        )
    
    if api_key == "test-key":
        request.state.tenant_id = "test-tenant"
    else:
        request.state.tenant_id = api_key  # Assuming API key is the tenant ID for now
    
    response = await call_next(request)
    return response

app.middleware("http")(api_key_middleware)

from .routes import chat, ingest_docs  # Import after middleware setup

app.include_router(chat.router)
app.include_router(ingest_docs.router)

from .services.api_parser import ApiParser
from .vector_data.ingest_docs import process_file

@app.get("/list-files")
async def list_files(request: Request):
    tenant_id = get_tenant_id(request)
    upload_dir = os.path.join(os.getcwd(), "ai-assistant", "api", "vector-data", "uploads", tenant_id)
    if not os.path.exists(upload_dir):
        return {"files": []}
    try:
        files = [{"name": f, "size": os.path.getsize(os.path.join(upload_dir, f))} for f in os.listdir(upload_dir) if os.path.isfile(os.path.join(upload_dir, f))]
    except FileNotFoundError:
        return {"files": []}
    return {"files": files}

@app.post("/ingest-docs")
async def ingest_docs_endpoint(request: Request):
    form_data = await request.form()
    file = form_data["file"]
    file_content = await file.read()
    file_name = file.filename

    # Check if the uploaded file is a JSON file (likely an API spec)
    if file_name.endswith(".json"):
        api_parser = ApiParser()
        try:
            # Attempt to parse the file content as an OpenAPI specification
            parsed_api = api_parser.parse_openapi(file_content.decode())
            if "error" not in parsed_api:
                # If parsing was successful, save the parsed API summary to a new JSON file
                tenant_id = get_tenant_id(request)
                parsed_file_name = f"parsed_api_{os.path.splitext(file_name)[0]}.json"  # Create a new file name
                upload_dir = os.path.join(os.getcwd(), "ai-assistant", "api", "vector-data", "uploads", tenant_id)
                os.makedirs(upload_dir, exist_ok=True) # Ensure the directory exists
                file_path = os.path.join(upload_dir, parsed_file_name)
                with open(file_path, "w") as f:
                    json.dump(parsed_api, f, indent=4)  # Save the parsed API data as JSON
                return {"message": f"Successfully parsed and saved API specification from {file_name}", "api_summary": parsed_api}
            else:
                return {"error": f"Failed to parse OpenAPI specification from {file_name}: {parsed_api.get('error')}"}
        except Exception as e:
            return {"error": f"An unexpected error occurred while parsing {file_name}: {str(e)}"}

    return await process_file(file_content, file_name, get_tenant_id(request)) # If not a JSON or parsing fails, process normally

from .routes import permissions
app.include_router(permissions.router)

@app.get("/list-orgs")
async def list_orgs():
    orgs_file = "ai-assistant/admin-portal/pages/api/orgs.json"
    if os.path.exists(orgs_file):
        with open(orgs_file, "r") as f:
            orgs = json.load(f)
        return orgs
    return []
# Import the ThemeManager class
from .services.theme_manager import ThemeManager

# Initialize the ThemeManager
theme_manager = ThemeManager()

# Define an endpoint to save the theme for a specific tenant.
class ThemeData(BaseModel):
    theme: dict

@app.post("/save-theme")
async def save_theme(request: Request, theme_data: ThemeData):
    """
    Saves the theme data for a specific tenant.
    The tenant ID is extracted from the request's state, which should be
    populated by the api_key_middleware.
    Args:
        theme_data (dict): The theme data to be saved.
    Returns:
        A success message if the theme data is saved successfully.
        An HTTP exception with a 500 status code if there is an error.
    """
    tenant_id = get_tenant_id(request)
    try:
        theme_manager.save_theme(tenant_id, theme_data.theme)
        return {"message": f"Theme saved successfully for tenant {tenant_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving theme: {str(e)}")

# Define an endpoint to retrieve the theme for a specific tenant.
@app.get("/get-theme")
async def get_theme(request: Request):
    """
    Retrieves the theme data for a specific tenant.
    """
    tenant_id = get_tenant_id(request)
    return theme_manager.get_theme(tenant_id)
# Define an endpoint to retrieve escalations for a specific tenant.
@app.get("/get-escalations")
async def get_escalations(request: Request):
    """
    Retrieves the list of escalations for a specific tenant.
    The tenant ID is extracted from the request's state, which should be
    populated by the api_key_middleware.
    Returns:
        A list of escalation records for the tenant, or an empty list if
        no escalations are found or if the file does not exist.
    """
    tenant_id = get_tenant_id(request)
    escalation_file = f"ai-assistant/api/escalations/esc_{tenant_id}.json"
    if os.path.exists(escalation_file):
        try:
            with open(escalation_file, "r") as f:
                escalations = json.load(f)
            return escalations
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Error reading escalations file.")
    return []

