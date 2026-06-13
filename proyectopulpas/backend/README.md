# Backend Proyecto Pulpas

API en Express para productos de Proyecto Pulpas.

## Configuracion

1. Copia `.env.example` como `.env`.
2. Ajusta `MONGODB_URI` si tu MongoDB usa otra direccion.
3. Ejecuta el servidor:

```bash
npm run dev
```

## Rutas

- `GET /api/health`: revisa que la API responda.
- `GET /api/products`: lista productos activos.
- `GET /api/products/featured`: lista productos destacados.
- `POST /api/products`: crea un producto.
- `POST /api/products/seed`: crea los productos iniciales si la base esta vacia.
