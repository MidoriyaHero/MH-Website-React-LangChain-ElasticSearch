from passlib.context import CryptContext
from typing import Union, Any
from datetime import datetime,timedelta, date
from jose import jwt 
from json import dumps

from app.core.config import settings

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

password_context = CryptContext(schemes =['bcrypt'], deprecated = 'auto') 


def create_access_token(subject: Union[str, Any], expires: int=None) -> str:
    if expires is not None:
        expires = dumps(datetime.now() + expires, default=json_serial) 
    else:
        expires = dumps((datetime.now() + timedelta(minutes= settings.ACCESS_TOKEN_EXPIRE_MINUTES)),default=json_serial )
    to_encode = {'subject': str(subject),'expires': expires}

    encode_jwt = jwt.encode(to_encode, settings.JWT_KEY, settings.ALGORITHM)
    return encode_jwt

def create_refresh_token(subject: Union[str, Any], expires: int=None) -> str:
    if expires is not None:
        expires = dumps(datetime.now() + expires, default=json_serial) 
    else:
        expires = dumps((datetime.now() + timedelta(minutes= settings.REFRESH_TOKEN_EXPIRE_MINUTES)), default=json_serial)
    to_encode = {'subject': str(subject),'expires': expires}
    encode_jwt = jwt.encode(to_encode, settings.JWT_REFRESH_KEY, settings.ALGORITHM)
    return encode_jwt

def get_password(password: str) -> str:
    return password_context.hash(password)

def verify_password(password: str, hash_password: str) -> bool:
    return password_context.verify(password, hash_password)