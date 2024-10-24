# Set up
Create a new environment, then activate and install required libraries
```
conda create -n chatbotRAG
conda activate chatbotRAG
pip install -r requirements.txt
```

Then run these commands:
```
cd app
uvicorn main:app --reload
```
