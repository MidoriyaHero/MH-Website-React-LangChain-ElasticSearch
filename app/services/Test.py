from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.documents import Document
from openai import OpenAI

from typing import List
import os
from uuid import UUID

from app.prompt_template.template import build_prompt, evaluate_prompt, evaluateJournal, fine_response
from app.models.UserModel  import User
from app.core.config import settings
from app.schemas.ResponseSchema import Message
from app.models.HistoryModel import HistoryMessage, Session


class ChatService:
    @staticmethod
    async def listChatSession(user: User) -> list[Session]:
        sessions = await Session.find(Session.owner.id == user.id).to_list()
        return sessions
    
    @staticmethod
    async def retrieveChatfromSession(sessionid: UUID, user: User) -> list[HistoryMessage]:
        session = await ChatService.retrieveSession(sessionid, user)
        messages = await HistoryMessage.find(HistoryMessage.session.id == session.id).to_list()
        return messages
    
    @staticmethod
    async def createSession(user: User, session_name:str) -> Session:
        session = Session(session_name=session_name, owner=user)
        return await session.insert()
    
    @staticmethod
    async def retrieveSession(sessionid: UUID, user: User)-> Session:
        session = await Session.find_one(Session.session_id == sessionid, Session.owner.id == user.id)
        return session
    
    @staticmethod
    async def updateSessionName( user: User, sessionid: UUID, name: str) -> Session:
        session = await ChatService.retrieveSession(user=user,sessionid= sessionid)
        await session.update({"$set": {"session_name": name}})
        await session.save()
        return session
    
    @staticmethod 
    async def deleteChat(user: User, sessionid: UUID) -> HistoryMessage:
        messages = await ChatService.retrieveChatfromSession(sessionid=sessionid, user= user)
        for message in messages:
            await message.delete()

    @staticmethod
    async def deleteSession(user:User, sessionid: UUID)-> Session:
        session = await ChatService.retrieveSession(sessionid=sessionid,user=user)
        if session:
            await ChatService.deleteChat(user=user,sessionid=sessionid)
            await session.delete()
        else:
            return None
        
    @staticmethod
    async def createMessage(session: Session, role: str, content: str) -> HistoryMessage:
        message = HistoryMessage(role=role, content=content, session=session)
        return await message.insert()
    
    @staticmethod
    def format_docs(docs: List[Document]):
        return "\n\n".join(doc.page_content for doc in docs)
    
    @staticmethod
    async def response(query):
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": query}
            ]
            )

        print(completion.choices[0].message.content)

        # Extract and return the reply from the model
        response = completion.choices[0].message.content

        return ({"content": response, 'role':'bot'})
    @staticmethod
    async def chat(user: User, query: str, session_id: UUID):
        #todo create chat session and store in database
        session = await ChatService.retrieveSession(session_id, user)
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        history = await ChatService.retrieveChatfromSession(sessionid=session_id, user=user)
        listchat = []
        for message in history:
            listchat.append({'role':message.role, 'content':message.content})


        chat_history = []
        chat_history.extend(listchat)
        chat_history.append({"role": "user", "content": query})
        
        # evaluate journal sentiment
        journal = """
11h49, ngày 9 tháng 6 năm 2017,

Đường phố Seoul về đêm vắng vẻ và tĩnh mịch, làm tôi nhớ về đường phố Hà Nội. Hôm nay là thứ sáu. Nửa đêm, những người vào cửa hàng tiện lợi này vẫn rất đông, chủ yếu là những người trẻ vào mua rượu soju, bia, thuốc lá và đồ ăn kèm để tụ tập với bạn bè. Thỉnh thoảng còn có vài ông chú vô gia cư đã say mèm, chân bước chân xiêu bước vào ngồi trong quán và ngủ ngay đó. Trường hợp này cô chủ bảo tôi phải nhắc nhở họ rời đi hoặc nếu không được thì phải gọi cảnh sát đến giải quyết. Tôi cực kỳ ghét mùi của những người say xỉn. Trước đây, mỗi lần bố uống rượu say thường chửi và đánh mẹ, thỉnh thoảng đánh luôn cả tôi. Mẹ vẫn thường ôm tôi khóc, hoặc khóc một mình trong phòng. Lúc ấy, tôi rất ghét bố. Khung cảnh này lặp lại trong một khoảng thời gian dài, cho đến khi tôi du học tại Hàn Quốc. Bố tôi ít uống rượu hẳn đi vì ông mắc bệnh đường ruột. Dù ông vẫn nghiện thuốc lá, nhưng khi không say xỉn, bố tôi nền nã hơn hẳn.

“Lần sau, chị đừng nhờ em giúp gì nữa, em cảm thấy mất thời gian, phí công sức, lại còn phiền bạn em. Xong việc, chị cũng đâu biết ơn! Mà nữa, chị nhanh gửi em nốt tiền nhà tháng trước; ông chủ nhắc nhiều lần rồi, chị biết em khó xử không?”, đó là tin nhắn tôi vừa nhận được từ Linh - em gái tôi. Gần đây, tần suất tôi cãi nhau với Linh ngày càng nhiều, từ cái việc nhỏ nhặt nhất như sắp xếp đồ dùng, ăn tối món gì, giặt giũ ra sao… Linh muốn tôi chuyển ra ngoài ở vì con bé muốn ở cùng với người yêu của nó. Từ dạo đó đã hơn một tháng, Linh ít nhắn tin với tôi hẳn, mà có cũng là những tin nhắn kiểu như trên: trách móc hoặc đòi tiền. Nhớ lại một năm sau khi qua Hàn, lúc ấy ở nhà kẹt tiền quá nên bố mẹ không gửi được tiền trợ cấp. Hai chị em chỉ biết dựa vào nhau mà sống, tự đi làm thêm, tự lo đủ thứ từ tiền sinh hoạt đến học phí, tiền nhà… 

Lý do bọn tôi cãi nhau có lẽ không liên quan nhiều đến những thứ tôi đang viết. Nhưng khi nghe con bé nói thế, cái suy nghĩ tôi cất kín cả tháng nay lại bùng lên. Nó đập úp vào đầu tôi. Những suy nghĩ tiêu cực đó lại xuất hiện: “Nhìn xem mày lại gây ra chuyện rồi này. Ai sẽ chịu đựng mày được cơ chứ? Mày luôn làm phiền người khác, làm người ta khó chịu. Lẽ ra, mày không nên tồn tại trên cuộc sống này!”.

Thực ra, tôi luôn không muốn nhờ ai giúp đỡ chuyện gì. Tôi cảm thấy việc nhờ vả sẽ làm phiền người khác, khiến họ nghĩ rằng tôi tiếp cận họ là có mục đích. Chỉ đến khi mọi chuyện rối tung cả lên, tôi không thể tự giải quyết được nữa thì mới nhờ đến người khác. Mà chuyện rối tung thì lại càng phiền phức. Tôi luôn nghĩ về điều đó. Vậy nên, khi Linh nói như vậy, tôi chợt nhận ra suy nghĩ của mình đúng là sự thật. Tôi cảm thấy bản thân thật bất lực, thật vô dụng. 

Đó luôn là lỗi của tôi, từ việc dính vào những rắc rối đến việc làm phiền mọi người giúp đỡ mình, rồi chính tôi cũng phá hủy những mối quan hệ đó, khiến họ muốn tránh xa tôi. Tôi luôn nghĩ đến cái ngày xung quanh mình chẳng còn ai. Ai muốn lại gần một đống rắc rối cơ chứ? """

        journal_promopt = evaluateJournal(journal)
        evaluate_journal = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": journal_promopt}]
            )

        print(evaluate_journal.choices[0].message.content)
        journal_sentiment_results = evaluate_journal.choices[0].message.content
        #Chat 
        prompt = build_prompt(journal_sentiment_results=journal_sentiment_results, chat_history= chat_history)
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": prompt}]
            )

        print(completion.choices[0].message.content)

        eval_prompt = evaluate_prompt(completion.choices[0].message.content)
        evaluate = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": eval_prompt}]
            )

        print(evaluate.choices[0].message.content)

        # Extract and return the reply from the model
        response = f'{completion.choices[0].message.content}'

        #add chat to DB
        await ChatService.createMessage(session, role='user', content=query)
        await ChatService.createMessage(session, role='system', content=response)
        return {'role':'system', 'content': response}
        
        