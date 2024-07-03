```mermaid
erDiagram
    CATEGORIAS {
        int id PK
        varchar nombre
    }
    MARCAS {
        int id PK
        varchar nombre
    }
    PRODUCTOS {
        int id PK
        varchar nombre
        text descrip
        decimal precio
        int categoria_id FK
        int marca_id FK
    }
    IMAGENES {
        int id PK
        int producto_id FK
        varchar url
    }
    DETALLES_PRODUCTO {
        int id PK
        int producto_id FK
        varchar clave
        varchar valor
    }

    CATEGORIAS ||--o{ PRODUCTOS: contiene
    MARCAS ||--o{ PRODUCTOS: fabrica
    PRODUCTOS ||--o| IMAGENES: tiene
    PRODUCTOS ||--o{ DETALLES_PRODUCTO: tiene

```