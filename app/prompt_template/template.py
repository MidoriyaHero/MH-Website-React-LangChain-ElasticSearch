TEMPLATE="""
You are an assistant for question answering tasks.
Use the following context to answer the question.
If you don't know the answer, just say you don't know.
Question: {question}
Context: {context}
Answer:
"""

standalone_system_prompt = """
Given a chat history and a follow-up question, rephrase the follow-up question to be a standalone question. \
Do NOT answer the question, just reformulate it if needed, otherwise return it as is. \
Only return the final standalone question. \
"""