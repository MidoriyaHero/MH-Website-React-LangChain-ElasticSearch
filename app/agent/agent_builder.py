from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain_core.tools import BaseTool
from langchain_core.language_models import BaseLanguageModel
from typing import List, Dict, Optional, Any
from datetime import datetime
from pydantic import Field

class JournalEvaluationTool(BaseTool):
    name: str = "evaluate_journal"
    description: str = "Evaluates and analyzes user's daily journal entries to understand patterns and insights"
    llm: BaseLanguageModel = Field(exclude=True)
    
    def __init__(self, llm: BaseLanguageModel):
        super().__init__(llm=llm)
        self.llm = llm
    
    def _run(self, journal_text: str) -> str:
        prompt = PromptTemplate.from_template("""
        Analyze the following journal entry and provide insights about:
        1. Overall emotional state
        2. Key concerns or challenges
        3. Notable achievements or positive moments
        4. Potential patterns or recurring themes
        
        Journal entry:
        {journal_text}
        """)
        
        return self.llm.invoke(prompt.format(journal_text=journal_text))

class ContextSuggestionTool(BaseTool):
    name: str = "suggest_context_update"
    description: str = "Suggests user to update their questionnaire or write journal if they're not write today"
    
    def _run(self, context: Dict) -> str:
        suggestions = []
        if not context["latest_questionnaire"]["is_today"]:
            suggestions.append("complete today's questionnaire")
        if not context["latest_journal"]["is_today"]:
            suggestions.append("write today's journal entry")
            
        if not suggestions:
            return ""
            
        return f"I notice you haven't {' and '.join(suggestions)} yet. Would you like to do that first? It would help me provide better support."