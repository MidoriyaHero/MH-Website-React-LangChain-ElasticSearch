from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import List, ClassVar

class GAD7Questions(BaseModel):
    questions: ClassVar[List[str]] = [
        "Cảm thấy căng thẳng, lo lắng hoặc bất an",
        "Không thể ngưng hoặc kiểm soát lo lắng",
        "Lo lắng quá mức về nhiều thứ",
        "Khó thư giãn",
        "Bứt rứt đến mức khó ngồi yên",
        "Trở nên dễ bực bội hoặc cáu kỉnh",
        "Cảm thấy lo lắng như thể điều gì khủng khiếp có thể xảy ra"
    ]

class PHQ9Questions(BaseModel):
    questions: ClassVar[List[str]] = [
        "Ít hoặc không cảm thấy hứng thú, vui vẻ trong hầu hết các hoạt động diễn ra hàng ngày",
        "Cảm thấy tâm trạng buồn bực, chán nản, mệt mỏi, tuyệt vọng",
        "Cơ thể luôn trong trạng thái mệt mỏi, thiếu sức sống, thiếu năng lượng",
        "Mất ngủ, khó ngủ, ngủ không sâu giấc hoặc buồn ngủ, ngủ không kiểm soát",
        "Chán ăn, ăn không ngon miệng, thường xuyên bỏ bữa hoặc ăn quá nhiều",
        "Cảm thấy vô cùng thất vọng về khả năng của bản thân, cho rằng mình là kẻ vô dụng, bất tài",
        "Mất tập trung, không thể làm việc hiệu quả",
        "Lười vận động, di chuyển chậm chạp, không muốn nói chuyện, giao tiếp với mọi người xung quanh",
        "Suy nghĩ tiêu cực, nghĩ về cái chết, có ý định tự làm hại bản thân"
    ]

class QuestionnaireResponse(BaseModel):
    responses: List[int]

class QuestionnaireResult(BaseModel):
    response_id: UUID
    questionnaire_type: str
    total_score: int
    severity: str
    timestamp: datetime
    responses: List[int]