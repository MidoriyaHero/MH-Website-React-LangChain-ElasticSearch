import os
from fastapi import UploadFile
import app.config.ES as vector
import shutil

vector_store = vector.Vectordb()

def load(file: UploadFile):
    try:
        # Save the file to a temporary location
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
        
        # Load the document and add it to the vector store
        vector_store.load_doc(temp_file_path)
        vector_store.add_doc()
        
        # Clean up the temporary file after loading
        os.remove(temp_file_path)
        
    except Exception as e:
        print(f"Error loading file: {e}")
        raise e
