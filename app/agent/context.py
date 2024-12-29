from datetime import datetime, timedelta
from typing import Dict, Optional

class ContextManager:
    def __init__(self):
        self.questionnaire_history = []
        self.chat_history = []
        self.daily_journals = []

    
    def get_latest_context(self) -> Dict:
        latest_questionnaire = self._get_latest_questionnaire()
        latest_journal = self._get_latest_journal()
        
        # Check if context is from today
        today = datetime.now().date()
        print(today)
        print(latest_questionnaire.timestamp.date())
        print(latest_journal.update_at.date())
        context = {
            "latest_questionnaire": {
                "data": latest_questionnaire,
                "is_today": latest_questionnaire and latest_questionnaire.timestamp.date() == today if latest_questionnaire else False
            },
            "latest_journal": {
                "data": latest_journal,
                "is_today": latest_journal and latest_journal.update_at.date() == today if latest_journal else False
            },
            "recent_chat_history": self._get_recent_chat_history()
        }
        return context
    
    def _get_latest_questionnaire(self):
        return self.questionnaire_history[-1] if self.questionnaire_history else None
    
    def _get_latest_journal(self):
        return self.daily_journals[-1] if self.daily_journals else None
    
    def _get_recent_chat_history(self, limit: int = 10):
        return self.chat_history[:] if self.chat_history else []