from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from typing import Dict
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from app.core.config import settings
class JournalEvaluationAgent:
    def __init__(self, llm):
        self.llm = llm
        # Define severe keywords categories
        self.severe_keywords = {
            'suicide_related': [
                'tự tử', 'chết', 'suicide', 'death', 'kill', 'end life', 'không muốn sống',
                'muốn chết', 'kết thúc', 'tôi sẽ chết', 'không còn ý nghĩa', 'buông xuôi',
                'từ bỏ', 'giải thoát', 'kết thúc tất cả'
            ],
            'self_harm': [
                'tự làm đau', 'cắt tay', 'đau đớn', 'tự hại', 'self harm', 'hurt myself',
                'đập đầu', 'tự đâm', 'tự cắt'
            ],
            'severe_depression': [
                'tuyệt vọng', 'vô dụng', 'không xứng đáng', 'không ai yêu', 'không còn hy vọng',
                'không thể chịu được', 'quá mệt mỏi', 'không muốn thức dậy', 'không còn muốn tiếp tục'
            ],
            'severe_anxiety': [
                'hoảng loạn', 'không thở được', 'tim đập nhanh', 'sợ hãi tột độ',
                'không kiểm soát', 'run rẩy', 'đau ngực', 'chóng mặt nặng'
            ]
        }
        
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
            Ví dụ 4:
            Input: ""
            Output: {{
                "sentiment": "TRUNG TÍNH",
                "emotions": [],
                "themes": []
            }}
            """),
            ("user", "{input}")
        ])
        
        self.chain = self.evaluation_prompt | llm | StrOutputParser()
    
    async def _send_alert_email(self, user, journal_content: str, detected_keywords: Dict[str, list]):
        """Send alert email when severe content is detected"""
        try:
            # Email configuration - should be moved to environment variables
            smtp_server = settings.SMTP_SERVER
            smtp_port = settings.SMTP_PORT
            sender_email = settings.EMAIL_USER
            sender_password = settings.EMAIL_PASS
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = user.emergency_contact_email
            msg['Subject'] = f"URGENT: Mental Health Alert for {user.user_name}"
            
            # Prepare email body
            body = f"""
            URGENT: Mental Health Alert

            User: {user.user_name}
            Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
            
            Detected concerning content in user's journal:
            """
            
            for category, keywords in detected_keywords.items():
                if keywords:
                    body += f"\n{category}:\n- {', '.join(keywords)}"
            
            body += f"\n\nJournal Content:\n{journal_content}"
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Send email
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender_email, sender_password)
                server.send_message(msg)
                
        except Exception as e:
            print(f"Failed to send alert email: {e}")

    def _check_severity(self, text: str, emotions: list, themes: list) -> Dict[str, list]:
        """Check content for severe keywords"""
        detected = {}
        combined_text = f"{text} {' '.join(emotions)} {' '.join(themes)}".lower()
        
        for category, keywords in self.severe_keywords.items():
            found_keywords = [keyword for keyword in keywords if keyword in combined_text]
            if found_keywords:
                detected[category] = found_keywords
                
        return detected

    async def evaluate(self, journal_content: str, user) -> Dict:
        """Evaluates journal content and returns structured analysis"""
        try:
            result = await self.chain.ainvoke({"input": journal_content})
            analysis = json.loads(result)
            
            # Check for severe content
            detected_keywords = self._check_severity(
                journal_content,
                analysis.get('emotions', []),
                analysis.get('themes', [])
            )
            
            # If severe content detected, send alert
            if detected_keywords:
                await self._send_alert_email(user, journal_content, detected_keywords)
                analysis['severity_alert'] = True
                analysis['detected_concerns'] = detected_keywords
            
            return analysis
            
        except Exception as e:
            print(f"Lỗi trong quá trình đánh giá: {e}")
            return {
                "sentiment": "TRUNG TÍNH",
                "emotions": [],
                "themes": []
            }