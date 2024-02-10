from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import Producto, SessionLocal
from models import (ProductoCreate,ProductoResponse,ProductoUpdate,)
from typing import List
from fastapi.responses import StreamingResponse
import io
app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500","http://127.0.0.1:5500/creacion_productos.html"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Rutas para obtener y crear productos

@app.get("/productos", response_model=List[ProductoResponse])
async def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()

    # Modificar la lista de productos para incluir la URL de la imagen
    productos_con_imagen = [
        ProductoResponse(
            ProductoID=producto.ProductoID,
            Nombre=producto.Nombre,
            Descripcion=producto.Descripcion,
            Precio=producto.Precio,
            Imagen=f'/productos/{producto.ProductoID}/imagen'  # URL de la imagen
            
        )
        for producto in productos
        
    ]

    return productos_con_imagen

@app.get("/productos/{producto_id}/imagen")
def obtener_imagen_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.ProductoID == producto_id).first()
    if not db_producto or not db_producto.Imagen:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")

    return StreamingResponse(io.BytesIO(db_producto.Imagen), media_type="image/jpeg")



    
@app.post("/productos/", response_model=ProductoCreate)
async def create_producto(nombre: str = Form(...), descripcion: str = Form(...), precio: float = Form(...), imagen: UploadFile = File(...), db: Session = Depends(get_db)):
    """Crear un nuevo producto con imagen"""
    # Leer contenido de la imagen
    contenido = imagen.file.read()
    # Crear el producto en la base de datos
    db_producto = Producto(Nombre=nombre, Descripcion=descripcion, Precio=precio, Imagen=contenido)
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)

    # Crear un objeto ProductoCreate con los datos del nuevo producto
    producto_create = ProductoCreate(Nombre=db_producto.Nombre, Descripcion=db_producto.Descripcion, Precio=db_producto.Precio)

    # Devuelve el objeto ProductoCreate
    return producto_create

@app.put("/productos/{producto_id}", response_model=ProductoResponse)
def update_producto(producto_id: int, producto: ProductoResponse, db: Session = Depends(get_db)):
    """Actualizar un producto"""
    db_producto = db.query(Producto).filter(Producto.ProductoID == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    for key, value in producto.dict().items():
        setattr(db_producto, key, value)
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

@app.delete("/productos/{producto_id}", response_model=ProductoResponse)
def delete_producto( db: Session = Depends(get_db)):
    """Eliminar un producto"""
    db_producto = db.query(Producto).all()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(db_producto)
    db.commit()
    return db_producto



