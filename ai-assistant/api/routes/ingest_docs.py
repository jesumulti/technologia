import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/")
async def ingest_docs_route(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Ensure the uploads directory exists
    upload_dir = "api/vector-data/docs/uploads"  # Relative to the project root
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    # Save the uploaded file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    print(f"Saved file: {file.filename}")

    return JSONResponse(
        status_code=200, content={"message": "File uploaded successfully", "filename": file.filename}
    )