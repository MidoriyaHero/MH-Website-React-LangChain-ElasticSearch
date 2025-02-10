import os
import json
from typing import List, Optional, Dict
from fastapi import UploadFile
from PyPDF2 import PdfReader
from elasticsearch import Elasticsearch

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_elasticsearch import ElasticsearchStore
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader

from app.core.config import settings


class VectorStoreService:
    def __init__(self):
        try:
            # Initialize Elasticsearch client
            self.es_client = Elasticsearch([settings.ES_URL])
            
            # Initialize embeddings
            self.embeddings = OpenAIEmbeddings(
                model="text-embedding-3-small",
                openai_api_key=settings.OPENAI_API_KEY
            )
            
            # Initialize vector store
            self.vector_store = ElasticsearchStore(
                index_name=settings.INDEX_NAME,
                embedding=self.embeddings,
                es_connection=self.es_client,
                
            )
        except Exception:
            return None
    def search(self, query: str, k: int = 3) -> List[Dict]:
        try:
            retriever = self.vector_store.as_retriever(
                search_type="similarity_score_threshold", search_kwargs={"score_threshold": 0.6}
            )
            results = retriever.invoke(query)
            relevant_docs = []
            for i,res in enumerate(results):
                if i == 3: 
                    break
                relevant_docs.append({"content": res.metadata["content"]})
            return relevant_docs
        except:
            return None

    def as_retriever(self, search_type="similarity", **kwargs):
        """Get a langchain retriever interface"""
        return self.vector_store.as_retriever(
            search_type=search_type,
            **kwargs
        )

    def load(self, file: UploadFile, chunk_size: int = 5000, overlap: int = 100):
        documents = []
        if file.filename.endswith('.pdf'):
            try:
                # Extract content from all pages and concatenate
                pdf_reader = PdfReader(file.file)
                all_text = ""
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        all_text += text
                
                # Split concatenated text into chunks
                for i in range(0, len(all_text), chunk_size - overlap):
                    chunk = all_text[i:i + chunk_size]
                    
                    # Create a document for each chunk
                    document = Document(
                        page_content=chunk,
                        metadata={
                            "filename": file.filename,
                            "content":chunk
                        }
                    )
                    documents.append(document)
                
                # Add all documents in batch
                self.vector_store.add_documents(documents)
                return {"status": "success", "message": f"Loaded {len(documents)} pdf documents"}
            except Exception as e:
                print(f"Error loading file {file.filename}: {e}")

        elif file.filename.endswith('.json'):
            try:
                json_data = json.load(file.file)
                documents = []
                document = Document(
                    page_content=str(json_data["key"]),
                    metadata={
                        "filename": file.filename,
                        "content":json_data["content"]
                        }
                )
                documents.append(document)
                if documents:
                    try:
                        self.vector_store.add_documents(documents)
                        return {"status": "success", "message": f"Loaded {len(documents)} json documents"}
                    except Exception as e:
                        return {"status": "error", "message": str(e)}
                return {"status": "error", "message": "No valid documents found in JSON"}
                
            except Exception as e:
                return {"status": "error", "message": f"Error loading JSON: {str(e)}"}
        else:
            print(f"Unsupported file format: {file.filename}")

    def add_message():
        #todo add message history to es
        pass
    def retrieve_messages(session_id):
        #todo retrieve top k relevant messages from es to add to prompt
        pass