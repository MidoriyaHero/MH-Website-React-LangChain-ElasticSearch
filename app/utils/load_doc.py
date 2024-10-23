from fastapi import UploadFile
import app.config.ES as vector
from PyPDF2 import PdfReader
from langchain_core.documents import Document
from typing import List

vector_store = vector.Vectordb()
def load(file: UploadFile):
    documents = []
    try:
        # Extract content
        pdf_reader = PdfReader(file.file)
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            document = Document(
                page_content=text,
                metadata={
                    "filename": file.filename,
                    "page_number": page_num
                }
            )
            documents.append(document)

    except Exception as e:
        print(f"Error loading file {file.filename}: {e}")

# Add all documents in batch
    vector_store.add_doc(documents)
