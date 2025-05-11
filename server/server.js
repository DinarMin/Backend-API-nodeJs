import { app } from "../app/app.js";
import https from "https";
import http from "http";
import fs from "fs";

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("Server on port 443 (HTTPS)");
});

http.createServer(app).listen(3000, () => {
  console.log("Server on port 3000 (HTTP)");
});

/* Создаем приложение на express */

// app.listen(3000, () => {
//   logger.info("Сервер успешно запущен на 3000 порту");
//   console.log("Server on port 3000");
// });

/* Подключение к базы данных MongoDB */

// async function startDB() {
//   try {
//     await mongoose.connect(process.env.DBURL);
//     console.log("Успешно подключена к MongoDB");
//   } catch (e) {
//     console.log(e + "Подключение прервано");
//   }
// }

// startDB();

