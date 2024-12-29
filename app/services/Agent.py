from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.schema import SystemMessage
from app.agent.context import ContextManager
from app.agent.journal_summarize import JournalSummarizer
from app.agent.agent_builder import JournalEvaluationTool, ContextSuggestionTool
from langchain_core.language_models import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder

class PersonalizedAgent:
    def __init__(self, llm: BaseLanguageModel):
        self.llm = llm
        self.context_manager = ContextManager()
        self.journal_summarizer = JournalSummarizer(llm)
        # Update memory configuration with specific input/output keys
        self.memory = ConversationBufferMemory(
            return_messages=True,
            input_key="input",
            output_key="output",
            memory_key="chat_history"
        )
        
        # Initialize tools
        self.tools = [
            JournalEvaluationTool(llm),
            ContextSuggestionTool(),
        ]
        
        # Create the agent
        self.agent = self._create_agent()
    
    def _create_agent(self):
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a personal assistant with access to the user's context.
            
            Current context status:
            - Questionnaire: {questionnaire_status}
            - Journal: {journal_status}
            
            Latest Questionnaire Data: {questionnaire_data}
            Latest Journal Analysis: {journal_analysis}
            Recent Chat History: {chat_history}
            
            Use this context to provide more personalized and relevant responses.
            If the context is not write today, suggest write journal but respect if the user wants to proceed without updating.
            
            Always respond with VietNamese langguage."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        agent = create_openai_functions_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )
        
        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True,
            return_intermediate_steps=True,
            handle_parsing_errors=True
        )
    
    async def run(self, query: str) -> str:
        context = self.context_manager.get_latest_context()
        
        # Format chat history to only include role and content
        chat_history = [
            {"role": msg.role, "content": msg.content}
            for msg in context['recent_chat_history']
        ]
        
        # Format chat history as string
        chat_history_str = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in chat_history
        ])
        
        # Prepare journal analysis
        journal_data = context['latest_journal']['data']
        journal_analysis = None
        if journal_data:
            # Summarize if journal is long
            if len(journal_data.description) > 1000:
                journal_text = self.journal_summarizer.summarize(journal_data.content)
            else:
                journal_text = journal_data.description
            # Evaluate journal
            journal_analysis = self.tools[0]._run(journal_text)
        
        # Format all context into a single input
        formatted_input = f"""User Query: {query}
        
        Context Information:
        - Questionnaire Status: {"Up to date" if context['latest_questionnaire']['is_today'] else "Outdated"}
        - Journal Status: {"Up to date" if context['latest_journal']['is_today'] else "Not write today"}
        - Questionnaire Data: {context['latest_questionnaire']['data']}
        - Journal Analysis: {journal_analysis}
        
        Recent Chat History:
        {chat_history_str}
        """
        
        try:
            response = await self.agent.ainvoke({"input": formatted_input})
            return str(response.get('output', ''))
        except Exception as e:
            print(f"Error in agent execution: {e}")
            return "I apologize, but I encountered an error processing your request."