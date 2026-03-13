# valida_doc_chile

Librería en Node.js para validar la vigencia de documentos de identidad chilenos (cédula y pasaporte) usando la API pública de [regcivil.impish.top](https://regcivil.impish.top/).

## Instalación

```bash
npm install valida_doc_chile
```

## Requisitos

- Node.js >= 4

## Uso desde Node.js (viejo)

```js
var query = require('valida_doc_chile').query;

query("16273463-6", "106879378", "CEDULA", null)
    .then(estado => {
        console.log(estado); // "VALID", "NOT_VALID" o "NO_MATCH"
    })
    .catch(error => {
        console.error("Error:", error.message);
    });
```

## Uso desde Node.js (moderno)

```js
import { query } from 'valida_doc_chile';

async function main() {
    try {
        const estado = await query("16273463-6", "106879378", "CEDULA", null);
        console.log(estado); // "VALID", "NOT_VALID" o "NO_MATCH"
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();
```

### Parámetros

- `run`: string, RUT con guión (ej. "16273463-6").
- `doc_num`: string, número de documento o número de serie.
- `doc_type`: string, `CEDULA` o `PASAPORTE`.
- `api_key` (opcional): string para usar la API con mayor frecuencia.

### Retorno

La función `query(...)` retorna una promesa que resuelve con uno de los siguientes valores (string):

- `VALID`: el documento está vigente.
- `NOT_VALID`: el documento existe, pero no está vigente (vencido, bloqueado, perdido, etc.).
- `NO_MATCH`: no se encuentra coincidencia o el documento no existe.

### Mensajes y códigos de salida sugeridos

| respuesta API | mensaje sugerido                                    |
| ------------- | -------------------------------------------------- |
| `VALID`       | El documento está vigente.                          |
| `NOT_VALID`   | El documento existe, pero no está vigente.          |
| `NO_MATCH`    | No se encuentra coincidencia / el documento no existe. |

## Más información

Esta librería usa la API gratuita de consulta de documentos proporcionada por [regcivil.impish.top](https://regcivil.impish.top/).
