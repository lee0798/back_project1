const express = require('express');
const Controllers = require("./models/index"); // Import the Controllers array
const database = require("./database");
const jwtAuth = require("./middleware/jwtAuth");

(async () => {
    const app = express();
    await database.$connect();

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, limit: "700mb" }));
    app.use(jwtAuth);

    Controllers.forEach((controller) => {
        console.log(controller.router); // 추가된 코드
        app.use(controller.path, controller.router);
      });

    app.get("/", (req, res) => {
        res.send("Nodejs test");
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ message: err.message || "서버에서 에러가 발생하였습니다." });
    });

    app.listen(8000, () => {
        console.log("서버가 시작되었습니다.");
    });
})();
