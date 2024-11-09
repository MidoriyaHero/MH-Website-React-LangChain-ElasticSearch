from fastapi import UploadFile
import app.core.ES as vector
from PyPDF2 import PdfReader
from langchain_core.documents import Document
from typing import List

vector_store = vector.Vectordb()
def load(file: UploadFile):
    documents = []
    if file.filename.endswith('.pdf'):
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
    elif file.filename.endswith('.txt'):
        pass
    else:
        print(f"Unsupported file format: {file.filename}")
# Add all documents in batch
    vector_store.add_doc(documents)
