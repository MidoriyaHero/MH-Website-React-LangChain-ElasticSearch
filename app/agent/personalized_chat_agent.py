from datetime import datetime, timedelta
from typing import List, Optional
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

class ContextManager:
    def __init__(self):
        self.questionnaire_history = []
        self.daily_journals = []
        self.chat_history = []
    
    def get_latest_gad7_score(self) -> Optional[dict]:
        if not self.questionnaire_history:
            return None
        return sorted(self.questionnaire_history, key=lambda x: x.timestamp, reverse=True)[0]
    
    def get_recent_journals(self, days: int = 7) -> List:
        cutoff_date = datetime.now() - timedelta(days=days)
        return [j for j in self.daily_journals if j.create_at >= cutoff_date]
    
    def should_recommend_journal(self) -> bool:
        if not self.daily_journals:
            return True
        latest_journal = max(self.daily_journals, key=lambda x: x.create_at)
        return (datetime.now() - latest_journal.create_at).days >= 3
    
    def should_recommend_gad7(self) -> bool:
        latest_gad7 = self.get_latest_gad7_score()
        if not latest_gad7:
            return True
        return (datetime.now() - latest_gad7.timestamp).days >= 7

class PersonalizedChatAgent:
    def __init__(self, llm, user):
        self.llm = llm
        self.user = user
        self.context_manager = ContextManager()
        
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", """Bạn là một trợ lý AI thấu cảm và hỗ trợ sức khỏe tinh thần. 
             hôm nay là ngày {today}

Thông tin người dùng:
Tên: {user_name}

Trạng thái cảm xúc gần đây của người dùng:
{emotional_context}

Các đề xuất cần thiết:
{recommendations}

Nội dung cuộc trò chuyện trước đó:
{chat_history}

Hướng dẫn:
- Gọi người dùng bằng tên của họ khi phù hợp
- Đưa ra lời khuyên và hướng dẫn phù hợp với trạng thái cảm xúc của người dùng dựa vào Cảm xúc từ nhật ký và điểm đánh giá lo âu
- Luôn tôn trọng và đối xử với người dùng như một người bạn thân
- Luôn trả lời bằng tiếng Việt
- Thể hiện sự đồng cảm và hỗ trợ
- Tham khảo thông tin liên quan từ nhật ký của họ khi phù hợp
- Nếu họ đang thể hiện dấu hiệu căng thẳng, hãy ghi nhận cảm xúc của họ
- Duy trì giọng điệu chuyên nghiệp nhưng thân thiện
- Nếu cần đưa ra đề xuất, hãy lồng ghép một cách tự nhiên vào cuộc trò chuyện
- Khi đề cập đến GAD-7, gọi nó là "bảng câu hỏi đánh giá lo âu"
- Khi đề cập đến journal, gọi nó là "nhật ký cảm xúc"
            """),
            ("user", "{query}")
        ])
        
        self.chain = LLMChain(llm=llm, prompt=self.chat_prompt)
    
    def _build_emotional_context(self) -> str:
        context = []
        
        # Add GAD-7 information
        latest_gad7 = self.context_manager.get_latest_gad7_score()
        if latest_gad7:
            context.append(f"Điểm đánh giá lo âu gần nhất: {latest_gad7.total_score} ({latest_gad7.timestamp.date()})")
        
        # Add recent journal information
        recent_journals = self.context_manager.get_recent_journals()
        if recent_journals:
            context.append("\nCảm xúc từ nhật ký gần đây:")
            for journal in recent_journals[-3:]:  # Last 3 journals
                context.append(f"- {journal.create_at.date()}: {journal.sentiment_analysis}")
                if journal.emotions:
                    context.append(f"  Cảm xúc: {', '.join(journal.emotions)}")
        print(context)
        return "\n".join(context)
    
    def _build_recommendations(self) -> str:
        recommendations = []
        
        if self.context_manager.should_recommend_journal():
            recommendations.append("Gợi ý viết nhật ký cảm xúc hôm nay")
            
        if self.context_manager.should_recommend_gad7():
            recommendations.append("Đề xuất làm bảng câu hỏi đánh giá lo âu")
        print(recommendations)
        return "\n".join(recommendations) if recommendations else "Không có đề xuất nào"
    
    async def run(self, query: str) -> str:
        chat_history = "\n".join([f"{msg.role}: {msg.content}" for msg in self.context_manager.chat_history[-5:]])
        
        # Get user's preferred name (full name if available, otherwise username)
        user_name = self.user.full_name if (self.user.first_name and self.user.last_name) else self.user.user_name
        
        response = await self.chain.ainvoke({
            "user_name": user_name,
            "today": datetime.now().strftime("%d/%m/%Y"),
            "emotional_context": self._build_emotional_context(),
            "recommendations": self._build_recommendations(),
            "chat_history": chat_history,
            "query": query
        })
        
        return response["text"] 