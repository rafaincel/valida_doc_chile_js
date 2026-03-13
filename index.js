const https = require("https");
const querystring = require("querystring");

/**
 * Consulta el estado de vigencia de un documento de identidad.
 *
 * @param {string} run Identificador de la persona (ej. "98765432-K")
 * @param {string} doc_num Número del documento (ej. "12345678")
 * @param {string} doc_type Tipo de documento: CEDULA o PASAPORTE
 * @param {string|null} api_key Clave de acceso a la API
 * @returns {Promise<string>} Promise que resuelve con el estado del documento:
 *   - "VALID": el documento está vigente
 *   - "NOT_VALID": el documento existe, pero no está vigente
 *   - "NO_MATCH": no se encuentra coincidencia o el documento no existe
 */
function query(run, doc_num, doc_type, api_key) {
    return new Promise(function (resolve, reject) {
        // Encode form data
        var postData = querystring.stringify({
            run: run,
            doc_num: doc_num,
            doc_type: doc_type
        });

        var options = {
            hostname: "regcivil.impish.top",
            path: "/query",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        if (api_key) {
            options.headers["X-api-key"] = api_key;
        }

        var req = https.request(options, function (res) {
            var data = "";

            res.on("data", function (chunk) {
                data += chunk;
            });

            res.on("end", function () {
                try {
                    var json_data = JSON.parse(data);
                    if (json_data.error) {
                        reject(new Error("api falló: " + json_data.error_code + ": " + json_data.desc));
                    } else {
                        resolve(json_data.state);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on("error", function (e) {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

module.exports = { query };