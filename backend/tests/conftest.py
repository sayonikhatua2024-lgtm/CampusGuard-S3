import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import warnings

# Use SQLite memory explicitly in the environment
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

# Mock app.config BEFORE importing anything else
import app.config as config_module
config_module.DATABASE_URL = "sqlite:///:memory:"

# Replace pymysql explicitly
import sys
sys.modules['pymysql'] = None

# Create the engine specifically forcing sqlite to allow multiple threads and using StaticPool
# to ensure the in-memory database persists across multiple connections (vital for background threads in FastAPI)
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

import app.database
app.database.engine = engine
app.database.SessionLocal = TestingSessionLocal
app.database.DATABASE_URL = "sqlite:///:memory:"

from app.database import Base, get_db
from app.main import app as fastapi_app
from app.main import on_startup
from app.engine.orchestrator import orchestrator

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        # Run startup to execute specific schema modifications
        try:
            on_startup()
        except Exception as e:
            pass

    # Seed db explicitly via the orchestrator method normally called in run()
    db = TestingSessionLocal()
    orchestrator.bootstrap_services()
    db.commit()
    db.close()

    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        yield db_session

    fastapi_app.dependency_overrides[get_db] = override_get_db
    from fastapi.testclient import TestClient
    with TestClient(fastapi_app) as test_client:
        yield test_client
    fastapi_app.dependency_overrides.clear()
