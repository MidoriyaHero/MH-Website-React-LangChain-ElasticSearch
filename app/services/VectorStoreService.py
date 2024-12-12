import os
from typing import List
from fastapi import UploadFile
from PyPDF2 import PdfReader

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_elasticsearch import ElasticsearchStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader

from app.core.config import settings


class Vectordb_service:
    #set up for using gg embeding model
    def __init__(self):
        if settings.EMBEDING_MODEL == 'models/embedding-001':
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small",openai_api_key=settings.OPENAI_API_KEY)

            self.vector_store = ElasticsearchStore(
                index_name=settings.INDEX_NAME,
                embedding=embeddings, 
                es_url=settings.ES_URL,
            )
            self.vector_store
        else:
            raise Exception('Invalid embedding model')
        
    def as_retriever(self):
        return self.vector_store.as_retriever(search_type="mmr", 
                                              search_kwargs={'k': 6, 'lambda_mult': 0.25})
    
    def search(self, query: str) -> List:
        retriever = self.vector_store.as_retriever(
            search_type="mmr", search_kwargs={'k': 6, 'lambda_mult': 0.25}
        )
        context = retriever.invoke(query)
        return context
    #Old versions for testing
    def load_doc(self, document: str)-> Document:
        self.loader = PyPDFLoader(file_path = document, extract_images = True,) #document can be path or file in DB
        self.document = self.loader.load_and_split()
        return self.document
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
                            "chunk_start": i,
                            "chunk_end": i + len(chunk),
                        }
                    )
                    documents.append(document)
                
                # Add all documents in batch
                self.vector_store.add_documents(documents)
            except Exception as e:
                print(f"Error loading file {file.filename}: {e}")

        elif file.filename.endswith('.txt'):
            # Implement handling for .txt files if needed
            pass
        else:
            print(f"Unsupported file format: {file.filename}")

    def add_message():
        #todo add message history to es
        pass
    def retrieve_messages(session_id):
        #todo retrieve top k relevant messages from es to add to prompt
        pass