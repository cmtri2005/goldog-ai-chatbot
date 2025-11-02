import asyncio
from src.services.application.rag import rag_service

async def main():
    resp = await rag_service.get_response(
          'Viết một endpoint FastAPI chào Hello',
          session_id='dev'
    )
    print(resp)

if __name__ == '__main__':
    asyncio.run(main())