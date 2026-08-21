from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.auth_config import (
    JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_MINUTES,
    ADMIN_USERNAME, ADMIN_PASSWORD,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# Single seeded admin user, hashed at import time. Swap this for a real
# users table if multi-user auth is ever needed.
_ADMIN_HASH = pwd_context.hash(ADMIN_PASSWORD)


def verify_credentials(username: str, password: str) -> bool:
    if username != ADMIN_USERNAME:
        return False
    return pwd_context.verify(password, _ADMIN_HASH)


def create_access_token(username: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def _decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> str:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise unauthorized
    username = _decode_token(token)
    if not username:
        raise unauthorized
    return username
