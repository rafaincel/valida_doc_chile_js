const https = require("https");

/**
 * Consulta el estado de vigencia de un documento de identidad.
 *
 * @param {string} run Identificador de la persona (ej. "98765432-K")
 * @param {string} doc_num Número del documento (ej. "12345678")
 * @param {string} doc_type Tipo de documento: CEDULA o PASAPORTE
 * @param {string|null} api_key Token de acceso enviado como X-Token
 * @returns {Promise<string>} Promise que resuelve con el estado del documento:
 *   - "VALID": el documento está vigente
 *   - "NOT_VALID": el documento existe, pero no está vigente
 *   - "NO_MATCH": no se encuentra coincidencia o el documento no existe
 */
function query(run, doc_num, doc_type, api_key) {
    return new Promise(function (resolve, reject) {
        var postData = JSON.stringify({
            run: run,
            serial_number: doc_num,
            doc_type: doc_type
        });

        var options = {
            hostname: "regcivil.impish.top",
            path: "/v1/query",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        if (api_key !== null && api_key !== undefined) {
            options.headers["X-Token"] = api_key;
        }

        var req = https.request(options, function (res) {
            var data = "";

            res.on("data", function (chunk) {
                data += chunk;
            });

            res.on("end", function () {
                var json_data;
                try {
                    json_data = JSON.parse(data);
                } catch (e) {
                    reject(new Error("Invalid JSON response: " + e.message));
                    return;
                }

                if (!json_data || typeof json_data !== "object") {
                    reject(new Error("API returned an invalid response"));
                    return;
                }

                var statusCode = res.statusCode || 0;
                if (statusCode < 200 || statusCode >= 300 || json_data.error) {
                    var message = json_data.message || json_data.detail;
                    if (message && typeof message !== "string") {
                        message = JSON.stringify(message);
                    }
                    reject(new Error(
                        "API request failed (HTTP " + statusCode + "): " +
                        (message || "Unknown API error")
                    ));
                    return;
                }

                if (["VALID", "NOT_VALID", "NO_MATCH"].indexOf(json_data.status) === -1) {
                    reject(new Error("API returned an unknown document status"));
                    return;
                }

                resolve(json_data.status);
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