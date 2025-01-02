from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from typing import Dict
import json

class JournalEvaluationAgent:
    def __init__(self, llm):
        self.evaluation_prompt = ChatPromptTemplate.from_messages([
            ("system", """Bạn là một chuyên gia phân tích tâm lý và đánh giá cảm xúc. 
            Hãy đọc và phân tích nội dung nhật ký dưới đây, sau đó cung cấp:
            1. Trạng thái cảm xúc chung (TÍCH CỰC, TIÊU CỰC, hoặc TRUNG TÍNH)
            2. Các cảm xúc chính được thể hiện trong bài viết
            3. Các chủ đề chính được đề cập

            LƯU Ý QUAN TRỌNG: Chỉ trả về kết quả dưới dạng JSON như mẫu, không thêm bất kỳ nội dung nào khác.
            
            Định dạng JSON:
            {{
                "sentiment": "TÍCH CỰC/TIÊU CỰC/TRUNG TÍNH",
                "emotions": ["cảm xúc 1", "cảm xúc 2", ...],
                "themes": ["chủ đề 1", "chủ đề 2", ...]
            }}

            Ví dụ 1:
            Input: "Hôm nay thật tuyệt vời! Tôi đã hoàn thành dự án quan trọng và được sếp khen ngợi. Về nhà, cả gia đình cùng ăn tối và trò chuyện vui vẻ. Lâu rồi tôi mới cảm thấy hạnh phúc và tự hào về bản thân như vậy."
            Output: {{
                "sentiment": "TÍCH CỰC",
                "emotions": ["hạnh phúc", "tự hào", "vui vẻ", "phấn khởi"],
                "themes": ["thành công công việc", "gia đình", "thành tựu cá nhân"]
            }}

            Ví dụ 2:
            Input: "Dạo này tôi cảm thấy rất mệt mỏi và căng thẳng. Công việc ngày càng nhiều, deadline dồn dập. Đêm nào cũng trằn trọc không ngủ được, cứ lo nghĩ về công việc. Tôi không biết mình có thể chịu đựng được bao lâu nữa."
            Output: {{
                "sentiment": "TIÊU CỰC",
                "emotions": ["mệt mỏi", "căng thẳng", "lo lắng", "bất an"],
                "themes": ["áp lực công việc", "vấn đề giấc ngủ", "sức khỏe tinh thần"]
            }}

            Ví dụ 3:
            Input: "Hôm nay là một ngày bình thường. Sáng đi làm, trưa ăn cơm với đồng nghiệp, chiều họp hành, tối về nhà. Không có gì đặc biệt xảy ra."
            Output: {{
                "sentiment": "TRUNG TÍNH",
                "emotions": ["bình thản", "điềm đạm"],
                "themes": ["công việc thường ngày", "sinh hoạt hàng ngày"]
            }}
            """),
            ("user", "{input}")
        ])
        
        self.chain = self.evaluation_prompt | llm | StrOutputParser()
    
    async def evaluate(self, journal_content: str) -> Dict:
        """Evaluates journal content and returns structured analysis"""
        try:
            result = await self.chain.ainvoke({"input": journal_content})
            return json.loads(result)
        except Exception as e:
            print(f"Lỗi trong quá trình đánh giá: {e}")
            return {
                "sentiment": "TRUNG TÍNH",
                "emotions": [],
                "themes": []
            }