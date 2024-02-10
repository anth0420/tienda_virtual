from pydantic import BaseModel
from typing import Optional    

class ProductoCreate(BaseModel):
    Nombre: str
    Descripcion: str
    Precio: float
    Imagen: Optional[bytes  ] 

class ProductoResponse(BaseModel):
    ProductoID: int
    Nombre: str
    Descripcion: str
    Precio: float
    Imagen: Optional[bytes] 

class ImagenResponse(BaseModel):
    mensaje: str
    nombre_archivo: str

class ProductoUpdate(BaseModel):
    Nombre: str
    Descripcion: str
    Precio: float

class ProductoCreateWithImagen(ProductoCreate):
    Imagen: bytes
    NombreImagen: str

class ProductoUpdateWithImagen(ProductoUpdate):
    Imagen: bytes
    NombreImagen: str
