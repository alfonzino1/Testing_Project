from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, TokenData
from app.models.schemas import User


async def get_current_active_user(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    # Здесь можно добавить проверку пользователя в БД
    # Для MVP пока просто возвращаем токен данные
    return current_user
