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
        gad7_responses = [q for q in self.questionnaire_history if q.questionnaire_type == "GAD7"]
        if not gad7_responses:
            return None
        return sorted(gad7_responses, key=lambda x: x.timestamp, reverse=True)[0]
    
    def get_latest_phq9_score(self) -> Optional[dict]:
        phq9_responses = [q for q in self.questionnaire_history if q.questionnaire_type == "PHQ9"]
        if not phq9_responses:
            return None
        return sorted(phq9_responses, key=lambda x: x.timestamp, reverse=True)[0]
    
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
    
    def should_recommend_phq9(self) -> bool:
        latest_phq9 = self.get_latest_phq9_score()
        if not latest_phq9:
            return True
        return (datetime.now() - latest_phq9.timestamp).days >= 7

class PersonalizedChatAgent:
    def __init__(self, llm, user):
        self.llm = llm
        self.user = user
        self.context_manager = ContextManager()
        
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", """
            Bạn là trợ lý hỗ trợ sức khỏe tâm thần. Bạn chỉ có kiến thức về lĩnh vực tâm lý và các phương pháp hỗ trợ tâm lý. Khi được hỏi về các lĩnh vực khác hãy trả lời "Tôi không biết về lĩnh vực đó".
            Mục tiêu của bạn là phản hồi với sự đồng cảm, thấu hiểu và lời khuyên thực tế và đề xuất các hành động hoặc nguồn lực tích cực. 
            Duy trì giọng điệu thân thiện, chuyên nghiệp và không được phán xét. 
            đây là tóm tắt của 3 nhật ký gần nhất (có thể so sánh ngày trong nhật ký với hôm nay: {today}) {emotional_context}. bạn có thể dựa vào đây để đưa lời khuyên hoăc giải pháp tích cực. Tránh chẩn đoán hoặc kê đơn điều trị, mà hãy hướng dẫn nhẹ nhàng.
            khi 'điểm đánh giá lo âu/trầm cảm' vượt quá 14 hoặc trong 'cảm xúc'/ 'từ khóa' tóm tắt từ nhật ký có các triệu chứng tiêu cực nặng nề. LẬP TỨC đề cập tới vấn đề họ đang đối mặt và đề xuất các đường dây nóng: 115 hoặc 1900 1267 và yêu cầu người dùng tìm sự giúp đỡ.
            ### Thông tin người dùng:
            - Tên: {user_name}
            - Các đề xuất cần thiết: {recommendations}
            - Nội dung cuộc trò chuyện trước đó: {chat_history}

            ### Hướng dẫn:
            **trích nguồn:** Khi đưa ra bất kỳ lời khuyên hoặc gợi ý có thể giúp giảm triệu chứng, bắt buộc phải bao gồm nguồn thông tin rõ ràng. ví dụ: **[Theo tổ chức y tế thế giới WHO]: bạn nên...**
            **đề xuất:** khi người dùng cảm thấy không ổn có thể đề xuất họ dựa trên đề xuất cần thiết.
            **Thông tin từ trạng thái cảm xúc:** tham khảo và kết nối thông tin từ "Trạng thái cảm xúc gần đây" của họ để cá nhân hóa câu trả lời. 
            **Ngôn ngữ:** Luôn trả lời bằng tiếng Việt và điều chỉnh phong cách phù hợp với lứa tuổi thanh thiếu niên.
            **Thời gian hiện tại:** Bao gồm thông tin hôm nay là ngày {today} để cá nhân hóa tương tác.
            Trả lời ngắn gọn nhất có thể.
            Gọi người dùng bằng tên của họ khi phù hợp để tạo sự thân mật.
                        """),
            ("user", """{query}""")
        ])
        
        self.chain = LLMChain(llm=llm, prompt=self.chat_prompt)
    
    def _build_emotional_context(self) -> str:
        context = []
        context.append("Theo nghiên cứu từ Hiệp hội Tâm lý Hoa Kỳ (APA), viết nhật ký có thể giúp giảm căng thẳng và cải thiện sức khỏe tâm lý.")

        # Add GAD-7 and PHQ-9 information
        latest_gad7 = self.context_manager.get_latest_gad7_score()
        latest_phq9 = self.context_manager.get_latest_phq9_score()
        
        if latest_gad7:
            context.append(f"Điểm đánh giá lo âu gần nhất: {latest_gad7.total_score} ({latest_gad7.timestamp.date()})")
        
        if latest_phq9:
            context.append(f"Điểm đánh giá trầm cảm gần nhất: {latest_phq9.total_score} ({latest_phq9.timestamp.date()})")
        
        # Add recent journal information
        recent_journals = self.context_manager.get_recent_journals()
        if recent_journals:
            context.append("\tóm tắt nhật ký gần đây:")
            for journal in recent_journals[-3:]:  # Last 3 journals
                context.append(f"- {journal.create_at.date()}: {journal.sentiment_analysis}")
                if journal.emotions:
                    context.append(f"  'Cảm xúc': {', '.join(journal.emotions)}")
                if journal.themes:  # Add theme if it exists
                    context.append(f"  'Từ khóa': {', '.join(journal.themes)}")
        return "\n".join(context)
    
    def _build_recommendations(self) -> str:
        recommendations = []
        
        if self.context_manager.should_recommend_journal():
            recommendations.append("Gợi ý viết nhật ký cảm xúc hôm nay. Theo Hiệp hội Tâm lý Hoa Kỳ (APA), viết nhật ký giúp giảm căng thẳng và cải thiện tâm trạng.")
            
        if self.context_manager.should_recommend_gad7():
            recommendations.append("Đề xuất làm bảng câu hỏi đánh giá lo âu. Dựa trên hướng dẫn của Tổ chức Y tế Thế giới (WHO), việc đánh giá thường xuyên giúp theo dõi sức khỏe tâm thần.")
        
        if self.context_manager.should_recommend_phq9():
            recommendations.append("Đề xuất làm bảng câu hỏi đánh giá trầm cảm. Theo khuyến nghị của Tổ chức Y tế Thế giới (WHO), việc đánh giá định kỳ giúp phát hiện sớm dấu hiệu trầm cảm.")
        
        return "\n".join(recommendations) if recommendations else "Không có đề xuất nào"

    
    async def run(self, query: str) -> str:
        chat_history = "\n".join([f"{msg.role}: {msg.content}" for msg in self.context_manager.chat_history[-5:]])
        
        # Get user's preferred name
        user_name = self.user.full_name if (self.user.first_name and self.user.last_name) else self.user.user_name
        
        # Create the input dictionary
        input_dict = {
            "user_name": user_name,
            "today": datetime.now().strftime("%d/%m/%Y"),
            "emotional_context": self._build_emotional_context(),
            "recommendations": self._build_recommendations(),
            "chat_history": chat_history,
            "query": query
        }
        response = await self.chain.ainvoke(input_dict)
        response_text = response["text"]
    
        return response_text
