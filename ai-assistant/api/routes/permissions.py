from fastapi import APIRouter, HTTPException, Request
from ai_assistant.api.services.permission_manager import PermissionManager
from pydantic import BaseModel

router = APIRouter()
permission_manager = PermissionManager()

class Permissions(BaseModel):
    permissions: dict

@router.post("/save-permissions/{org_id}")
async def save_permissions(org_id: str, permissions: Permissions):
    try:
        permission_manager.save_permissions(org_id, permissions.permissions)
        return {"message": "Permissions saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-permissions/{org_id}")
async def get_permissions(org_id: str):
    try:
        permissions = permission_manager.get_permissions(org_id)
        return permissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))