export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;       // ✅ Necesario para página de detalle
  precio: number;
  stock: number;             // ✅ Para saber si hay disponibilidad
  categoria: string;         // ✅ Necesario para filtrar por categoría
  subcategoria: string;      // ✅ Necesario para filtrar por subcategoría
  imagenUrl: string;         // ✅ URL completa de la imagen
  activo: boolean;           // ✅ Para no mostrar productos desactivados
  __v?: number;
}
