import app.config.ES as vector

vector_store = vector.Vectordb()
def load(file):
    docs = vector_store.load_docs(file)
    vector_store.add_doc(documents = docs)