from langchain.chains.summarize import load_summarize_chain
from langchain_core.language_models import BaseLanguageModel

class JournalSummarizer:
    def __init__(self, llm: BaseLanguageModel):
        self.llm = llm
        self.chain = load_summarize_chain(llm, chain_type="map_reduce")
    
    def summarize(self, journal_text: str) -> str:
        return self.chain.run(journal_text)