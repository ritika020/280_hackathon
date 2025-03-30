# def handle_clinical_query(prompt: str) -> str:
#     return f"[ClinicalAgent] Here's a clinical response to '{prompt}'"

import os
# from dotenv import load_dotenv
# from langchain_community.chat_models import ChatOllama
from langchain_ollama import ChatOllama
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load clinical document (CTG dataset PDF)
pdf_path = "data/ctg-studies.pdf"  # Make sure this path is correct
loader = PyMuPDFLoader(pdf_path)
documents = loader.load()

# Split document into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(documents)

# Generate embeddings using HuggingFace (free + local)
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Create vectorstore using FAISS
vectorstore = FAISS.from_documents(chunks, embedding_model)

# Set up Ollama LLM (e.g., llama2 or mistral)
llm = ChatOllama(model="llama2")  # You can replace "llama2" with "mistral" if preferred

# Set up RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    chain_type="stuff"
)

# Final agent function
async def handle_clinical_query(query: str) -> str:
    try:
        response = qa_chain.run(query)
        return response
    except Exception as e:
        return f"Error while processing the clinical query: {str(e)}"