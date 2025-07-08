import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import create_sql_agent

# Load env variables (used once globally)
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
db_uri = os.getenv("DATABASE_URL")
# Create DB and Gemini agent only once
db = SQLDatabase.from_uri(db_uri)
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)

agent_executor = create_sql_agent(
    llm,
    db=db,
    agent_type="tool-calling",
    verbose=False
)

# Service function to answer a question
def get_bot_response(question: str) -> str:
    try:
        result = agent_executor.invoke({"input": question})
        return result["output"]
    except Exception as e:
        return f"Erreur lors de l’exécution : {str(e)}"
