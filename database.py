from sqlalchemy import create_engine, Column, Integer, String, Text, DECIMAL, LargeBinary, MetaData
from sqlalchemy.dialects.postgresql import BYTEA
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.declarative import declarative_base



DATABASE_URL = "postgresql://postgres:postgres@localhost/imagen"
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Producto(Base):
    __tablename__ = "Producto"
    ProductoID = Column(Integer, primary_key=True, index=True)
    Nombre = Column(String(100), nullable=False)
    Descripcion = Column(Text)
    Precio = Column(DECIMAL(10, 2), nullable=False)
    Imagen = Column(LargeBinary)  # Or LargeBinary depending on your needs

class Imagen(Base):
    __tablename__ = "imagenes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(Text)
    contenido = Column(String)
    
Base.metadata.create_all(bind=engine)






