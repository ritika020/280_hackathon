# def handle_food_query(prompt: str) -> str:
#     return f"[FoodSecurityAgent] Handling food security question for '{prompt}'"

import os

# from langchain_community.chat_models import ChatOllama
from langchain_ollama import ChatOllama
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load and process PDF
pdf_path = "data/cd1254en.pdf"
loader = PyMuPDFLoader(pdf_path)
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(documents)

# Embeddings
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embedding_model)

# LLM
llm = ChatOllama(model="llama2")  # or use mistral

# RAG pipeline
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
    chain_type="stuff"
)

# Final agent function
async def handle_food_query(query: str) -> str:
    try:
        response = qa_chain.run(query)
        return response
    except Exception as e:
        return f"Error while processing the food security query: {str(e)}"