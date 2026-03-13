var query = require("./index").query;

query("16273463-6", "106879378", "CEDULA", null)
    .then(function (state) {
        console.log("OK");
        process.exit(0);
    })
    .catch(function (error) {
        console.error("FAIL", error.message);
        process.exit(1);
    });