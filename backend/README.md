# Backend JuliT-REX

API Express y MongoDB para autenticación y catálogo de JuliT-REX.

## Configuracion

1. Copia `.env.example` como `.env`.
2. Define una clave larga y aleatoria en `JWT_SECRET`; configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` para crear la cuenta inicial si aún no existe.
3. Ajusta `MONGODB_URI` y, si es necesario, `CLIENT_URL`.
4. Ejecuta el servidor:

```bash
npm run dev
```

## Rutas

- `GET /api/health`: revisa que la API responda.
- `GET /api/products`: lista productos activos.
- `GET /api/products?category=<slug>`: filtra por categoría publicada.
- `GET /api/products/featured`: lista productos destacados.
- `GET /api/products/admin`: lista todo el inventario (solo admin).
- `POST /api/products`: crea un producto (solo admin).
- `PUT /api/products/:id`: edita un producto, precio, inventario y visibilidad (solo admin).
- `DELETE /api/products/:id`: elimina un producto si no está asociado a una promoción (solo admin).
- `POST /api/products/seed`: agrega los productos iniciales si la base esta vacia (solo admin).
- `POST /api/auth/register` y `POST /api/auth/login`: cuentas de compradores e inicio de sesion.
- `GET /api/categories`: categorías publicadas que tienen productos activos.
- `GET/POST /api/categories/admin` y `PUT/DELETE /api/categories/:id`: gestión de categorías (solo admin).
- `GET /api/promotions`: promociones vigentes con precios calculados al consultar el catálogo.
- `GET/POST /api/promotions/admin` y `PUT/DELETE /api/promotions/:id`: gestión de promociones (solo admin).
- `POST /api/admin/uploads`: carga autenticada de imágenes PNG, JPEG o WebP, hasta 5 MB.
- `GET/PUT /api/settings`: consulta pública y edición administrativa de contacto y datos del negocio.

Las categorías iniciales y los paquetes se agregan una sola vez, sin sobrescribir cambios administrativos. Categorías futuras parten ocultas y aparecen en la tienda cuando se publican y tienen productos activos. Las promociones usan fechas y descuentos sobre el precio base sin modificarlo; al vencer dejan de aplicarse automáticamente. Las imágenes cargadas se guardan en `backend/uploads`.

La compra sigue confirmándose por WhatsApp. El sitio no procesa pagos, guarda órdenes ni emite facturas electrónicas automáticamente; una solicitud de factura se comunica con el pedido para que el negocio la tramite por su sistema autorizado.
