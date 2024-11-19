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

#todo create prompt for chat history - this part need to sumarize more specific
prompt_history = """
Here is conservation 20 messages between AI and Human, your task is to summarize this conservation into paragraphs \
with 250 words. 1 paragraph for  AI messages, 1 paragraph for Human messages.
{messages_history}
"""

#todo create prompt for evaluate journal
journal_evaluate_prompt = """
Base on the checklist {checklist}, your task is to evaluate these daily journals of patient. Focus on:\


"""
#todo create prompt for evaluate response
response_evaluate_prompt = """
you are an expert in bioethic. Your task is to evaluate this response base on bioethic aspects and mental health aspect\
{response}

"""