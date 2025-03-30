import tempfile
from langchain_ollama import ChatOllama
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

llm = ChatOllama(model="llama2")

async def handle_document_query(file, query: str) -> str:
    try:
        # Save PDF temporarily
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp.flush()

            # Load and split PDF
            loader = PyMuPDFLoader(tmp.name)
            documents = loader.load()

            splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
            docs = splitter.split_documents(documents)

            # Create in-memory FAISS vectorstore
            embeddings = HuggingFaceEmbeddings()
            vectorstore = FAISS.from_documents(docs, embeddings)

            # Create RAG chain
            qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
            response = qa_chain.run(f"Use the following document to answer: {query}")

            return response
    except Exception as e:
        return f"Error while handling document query: {str(e)}"
