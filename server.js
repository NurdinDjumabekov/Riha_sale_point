/*Главный каркас*/
var sql = require("mssql"); //подключение модуля SQL Server
var db = require("./db.js");
var path = require("path");
const fs = require("fs");
var ss = require("socket.io-stream");
var pdf = require("pdf-creator-node");
var QRCode = require("qrcode");

var request = require("request");
const config = JSON.parse("" + fs.readFileSync("config.js", "utf8"));

const cookieParser = require("cookie-parser");

//Подключение модулей
var express = require("express"),
  app = express();
var http = require("http").Server(app);
const https = require("https");

var io = require("socket.io")(http);
app.use(cookieParser());

var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  session = require("express-session");
const FileStore = require("session-file-store")(session);
//*****************************************************************************************************
//Подключение своих контроллеров-модулей

var getFiles = function (dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = "./" + dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
};

const sockets = getFiles("sockets");
const controllers = getFiles("controllers");

//*****************************************************************************************************
//Объявление глобальных переменных и объектов
//Параметры подключения к базе данных
//Параметры подключения к базе данных

console.dir(config);

var id;
var login;
var password;
var fio;
var type_user;
var language_user;
var status_agent;

//Для привязки сессии к сокетам
var sharedsession = require("express-socket.io-session");
//*****************************************************************************************************
//Установка шаблонизатора
// app.engine('handlebars', handlebars({ defaultLayout: 'main' }))//по умолчанию
app.set("view engine", "hbs"); //устанавливаем генератор шаблонов
app.set("views", "template"); //указываем путь где шаблоны
app.use("/", express.static(__dirname)); //разрешение чтобы стил и скрипты оформление бралось
//включаем кеширование
app.enable("view cache"); //механизм кэширования представлений в режиме production
const hbs = require("hbs"); //это для частичных представлений
const { log } = require("console");
hbs.registerPartials(__dirname + "/widjets");
//*****************************************************************************************************
// passport needs ability to serialize and unserialize users out of session
passport.serializeUser(function (user, done) {
  done(null, {
    id: id,
    login: login,
    password: password,
    fio: fio,
    type_user: type_user,
    status_agent: status_agent,
    language_user: language_user,
  });
});

passport.deserializeUser(function (id, done) {
  done(null, {
    id: id,
    login: login,
    password: password,
    status_agent: status_agent,
    fio: fio,
    type_user: type_user,
    language_user: language_user,
  });
});

// passport local strategy for local-login, local refers to this app
passport.use(
  "local-login",
  new LocalStrategy(async function (username, password, done) {
    var login1 = await db.query_await(
      "select codeid, [login], [password], [nameid_broker] as fio from [users] where login='" +
        username +
        "' AND password='" +
        password +
        "' "
    );
    login1 = login1.recordset;
    if (login1.length > 0) {
      console.log("Login admin or broker");
      id = login1[0].codeid;
      login = login1[0].login;
      password = login1[0].password;
      fio = login1[0].fio;
      if (id <= 0) {
        type_user = 1;
      } else {
        type_user = 2;
      }
      status_agent = 0;
      language_user = "russian";
      console.log(
        {
          id: id,
          fio: fio,
          type_user: type_user,
          language_user: language_user,
          status_agent: status_agent,
        },
        "test1"
      );
      return done(null, {
        id: id,
        fio: fio,
        type_user: type_user,
        language_user: language_user,
        status_agent: status_agent,
      });
    } else {
      console.log(
        "SELECT [codeid],[nameid_agent] as fio,[login], [password],[status] FROM [agents] WHERE [login]='" +
          username +
          "' and [password]='" +
          password +
          "' AND ([status]!=-2 OR [verification]=0) "
      );
      var login2 = await db.query_await(
        "SELECT [codeid],[nameid_agent] as fio,[login], [password],[status] FROM [agents] WHERE [login]='" +
          username +
          "' and [password]='" +
          password +
          "' AND ([status]!=-2 OR [verification]=0) "
      );
      login2 = login2.recordset;
      if (login2.length > 0) {
        console.log("Login agent");
        id = login2[0].codeid;
        login = login2[0].login;
        password = login2[0].password;
        status_agent = login2[0].status;
        fio = login2[0].fio;
        type_user = 3;
        language_user = "russian";

        console.error(
          {
            id: id,
            fio: fio,
            type_user: type_user,
            language_user: language_user,
            status_agent: status_agent,
          },
          "test"
        );
        return done(null, {
          id: id,
          fio: fio,
          type_user: type_user,
          language_user: language_user,
          status_agent: status_agent,
        });
      } else {
        return done(null, false, { message: "User not found." });
      }
    }
  })
);

// body-parser for retrieving form data
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// initialize passposrt and and session for persistent login sessions
app.use(
  session({
    secret: "cs-soft_company_perfect_birja1",
    store: new FileStore({ path: "./sessions" }),
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Привязываем с теми же настройками сессию к сокетам
io.use(
  sharedsession(
    session({
      secret: "cs-soft_company_perfect_birja1",
      store: new FileStore({ path: "./sessions" }),
      cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
      resave: true,
      saveUninitialized: true,
    })
  )
);

// route middleware to ensure user is logged in
function isLoggedIn(req) {
  console.error("------------------------");
  console.error(req.session);
  console.error("------------------------");
  if (typeof req.session.passport != "undefined") {
    if (typeof req.session.passport.user != "undefined") {
      return true;
    } else return false;
  } else {
    console.log("passport false");
    return false;
  }
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ПОМОГАТОРЫ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

hbs.registerHelper("ifeq", function (value1, value2) {
  return value1 == value2;
});

hbs.registerHelper("if_bigger", function (value1, value2) {
  return value1 > value2;
});

hbs.registerHelper("if_smoller", function (value1, value2) {
  return value1 < value2;
});

hbs.registerHelper("like", function (value1, value2) {
  return value1.indexOf(value2) > 0;
});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ПОМОГАТОРЫ!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

controllers.forEach((element) => {
  // console.log(element);
  element = element.substring(1, element.length);
  //console.log(element);
  element = element.substring(0, element.indexOf("."));
  console.log(element + " connected");

  var controller = require("." + element);

  if (controller.config.servise != "this") {
    // if(controller.config.method=='GET'){
    //     app.get()
    // }else{
    // }
  } else {
    if (controller.config.method == "GET") {
      // app.get(controller.config.href,controller.config.main_function(req,res));
      app.get(controller.config.href, function (req, res) {
        if (controller.config.auth) {
          if (isLoggedIn(req)) {
            controller.config.main_function(req, res, true);
          } else {
            res.redirect("/login");
          }
        } else {
          if (isLoggedIn(req)) {
            controller.config.main_function(req, res, true);
          } else {
            controller.config.main_function(req, res, false);
          }
        }
      });
    } else if (controller.config.method == "POST") {
      app.post(controller.config.href, function (req, res) {
        if (controller.config.auth) {
          if (isLoggedIn(req)) {
            controller.config.main_function(req, res);
          } else {
            res.send("auntificate fail");
          }
        } else {
          controller.config.main_function(req, res);
        }
      });
    }
  }
});

app.get("/config=admin", function (req, res) {
  res.render("config_define.hbs", { data: config });
});

app.post("/config_create", function (req, res) {
  console.log(req.body);
  var database_ip = req.body.database_ip;
  var database_port = req.body.database_port;
  var database_name = req.body.database_name;
  var database_user = req.body.database_user;
  var database_password = req.body.database_password;

  var JSON_string =
    '{"config_db":{"user": "' +
    database_user +
    '","password":"' +
    database_password +
    '","server": "' +
    database_ip +
    '","database": "' +
    database_name +
    '","port":' +
    database_port +
    ',"options": { "encrypt":false }}}';

  fs.writeFileSync("config.js", JSON_string);
});

app.get("/empty", function (req, res) {
  res.send("");
});

// api endpoints for login, content and logout
app.get("/login", function (req, res) {
  if (typeof language_user == "undefined") language_user = "russian";
  switch (language_user) {
    case "1":
      {
        lang = "russian";
      }
      break;
    case "2":
      {
        lang = "english";
      }
      break;
    default:
      {
        lang = "russian";
      }
      break;
  }
  //  console.log(req.session.passport.user);
  var language = JSON.parse(
    "" + fs.readFileSync("languages/" + lang + ".json", "utf8")
  );
  res.render("login.hbs", { language: language });
});

app.get("/login2", function (req, res) {
  if (typeof language_user == "undefined") language_user = "russian";
  switch (language_user) {
    case "1":
      {
        lang = "russian";
      }
      break;
    case "2":
      {
        lang = "english";
      }
      break;
    default:
      {
        lang = "russian";
      }
      break;
  }
  //  console.log(req.session.passport.user);
  var language = JSON.parse(
    "" + fs.readFileSync("languages/" + lang + ".json", "utf8")
  );
  res.render("login2.hbs", { language: language });
});

//     app.post('/get_file_lid', (req, res) => {
//       const receivedData = req.body;
//     //  console.log('============', receivedData);
//       // Ваша строка Base64 и переменная с типом документа
//       const fs = require('fs');
// const base64String = req.body.file;
// const documentType = req.body.type; // Здесь должно быть значение pdf, docx или png

// function base64ToBinary(base64String) {
//    const binaryString = Buffer.from(base64String, 'base64');
//    return binaryString;
//  }

//  function saveDocumentToFile(binaryData, documentType) {
//    fs.writeFileSync(`document.${documentType}`, binaryData);
//    console.log(`Document saved as document.${documentType}`);
//  }

//  if (documentType === "pdf" || documentType === "docx" || documentType === "png") {
//    const binaryData = base64ToBinary(base64String);
//    saveDocumentToFile(binaryData, documentType);

//    var new_filename = "files/" + req.body.name_guid+'.'+documentType;
//    console.log('new_filename');
//    stream.pipe(fs.createWriteStream(new_filename));

//  } else {
//    console.error("Unsupported document type.");
//  }

//       res.send('Data received successfully!');
//     });

// app.post('/get_file_lid', (req, res) => {
//    const fs = require('fs');
//    const base64String = req.body.file;
//    const documentType = req.body.type; // Здесь должно быть значение pdf, docx или png

//    // Функция для преобразования Base64 в бинарные данные
//    function base64ToBinary(base64String) {
//      const binaryString = Buffer.from(base64String, 'base64');
//      return binaryString;
//    }

//    // Функция для сохранения документа в файл
//    function saveDocumentToFile(binaryData, documentType, filename) {
//      const newFilename = "files/" + filename + '.' + documentType;
//      fs.writeFileSync(newFilename, binaryData);
//      console.log(`Документ сохранен как ${newFilename}`);
//    }

//    // Проверка поддерживаемого типа документа и сохранение файла
//    if (documentType === "pdf" || documentType === "docx" || documentType === "png") {
//      const binaryData = base64ToBinary(base64String);

//      // В req.body у вас должна быть информация о имени файла (например, req.body.name_guid).
//      // Предположим, что имя файла хранится в req.body.name_guid.
//      const filename = req.body.name_guid;

//      saveDocumentToFile(binaryData, documentType, filename);

//      res.send('Данные успешно получены и файл сохранен!');
//    } else {
//      console.error("Неподдерживаемый тип документа.");
//      res.status(400).send('Ошибка: неподдерживаемый тип документа.');
//    }
//  });
// app.post('/get_file_lid', (req, res) => {
//    const fs = require('fs');

//    function base64ToBinary(base64String) {
//      const binaryString = Buffer.from(base64String, 'base64');
//      return binaryString;
//    }

//    function saveDocumentToFile(binaryData, documentType, filename) {
//      const newFilename = `files/123/${filename}.${documentType}`;
//      fs.writeFileSync(newFilename, binaryData);
//      console.log(`Документ сохранен как ${newFilename}`);
//    }

//    const base64String = req.body.file;
//    const documentType = req.body.type;
//    const filename = req.body.name_guid;
//   // console.log(base64String);
//    console.log(filename);
//    console.log(documentType);
//    if (documentType === "pdf" || documentType === "docx" || documentType === "png") {
//      const binaryData = base64ToBinary(base64String);
//      saveDocumentToFile(binaryData, documentType, filename);
//      res.send('Данные успешно получены и файл сохранен!');
//    } else {
//      console.error("Неподдерживаемый тип документа.");
//    }
//  });
app.post("/get_file_lid", (req, res) => {
  const fs = require("fs");

  function base64ToBinary(base64String) {
    const binaryString = Buffer.from(base64String, "base64");
    return binaryString;
  }

  function saveDocumentToFile(binaryData, documentType, filename) {
    const newFilename = `files/${filename}.${documentType}`;
    try {
      fs.writeFileSync(newFilename, binaryData);
      console.log(`Документ сохранен как ${newFilename}`);
    } catch (error) {
      console.error("Ошибка при сохранении файла:", error);
    }
  }

  const base64String = req.body.file;
  const documentType = req.body.type;
  const filename = req.body.name_guid;
  // console.log(base64String);
  console.log(filename);
  console.log(documentType);
  if (
    documentType === "pdf" ||
    documentType === "docx" ||
    documentType === "png"
  ) {
    const binaryData = base64ToBinary(base64String);
    saveDocumentToFile(binaryData, documentType, filename);
    res.send("Данные успешно получены и файл сохранены!");
  } else {
    console.error("Неподдерживаемый тип документа.");
  }
});

app.post(
  "/login",

  function (req, res) {
    console.log("test123----");
    console.log(req.body);

    //   passport.authenticate("local-login", { failureRedirect: "/login_corp", failureMessage: true }, function(err, user, info){

    //       // handle succes or failure
    //       console.dir('----------------');
    //       console.dir(err);
    //       console.dir(user);
    //       console.dir(info);
    //       console.dir('----------------');
    //       // res.send(info);

    //       res.redirect("/");

    //     })(req,res, function(){res.redirect('/');});

    //passport.authenticate("local-corp", { failureRedirect: "/login_corp"})

    passport.authenticate("local-login", {
      failureRedirect: "/login",
      failureMessage: true,
    })(req, res, function () {
      res.redirect("/");
    });
    //   console.error('test123----');
    //res.redirect("/corporate");
  }
);

//  app.post("/login",
//      passport.authenticate("local-login", { failureRedirect: "/login"}),
//      function (req, res) {
//          res.redirect("/");
//  });
app.post(
  "/login2",
  passport.authenticate("local-login", { failureRedirect: "/login2" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
app.post("/api/create_file_depo_stocks", async (req, res) => {
  console.log(
    `SELECT *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [view_depo_stocks] WHERE codeid = ${req.body.codeid}`
  );
  var dealings_documents = await db.query_await(
    `SELECT *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [view_depo_stocks] WHERE codeid = ${req.body.codeid}`
  );

  dealings_documents = dealings_documents.recordset;
  for (var i = 0; i < dealings_documents.length; i++) {
    var document1 = {};
    var document2 = {};
    var document3 = {};

    document1 = dealings_documents[i];
    document2 = dealings_documents[i];
    document3 = dealings_documents[i];

    var new_name_clear1 = makeid(25);
    var new_name_clear2 = makeid(25);
    var new_name_clear3 = makeid(25);
    var new_name1 = new_name_clear1 + ".pdf";
    var new_name2 = new_name_clear2 + ".pdf";
    var new_name3 = new_name_clear3 + ".pdf";

    var image_qr_url = await QRCode.toDataURL(
      "http://broker.data.kg/files/depocb/" + new_name1,
      {}
    );
    var image_qr_ur2 = await QRCode.toDataURL(
      "http://broker.data.kg/files/depocb/" + new_name2,
      {}
    );
    var image_qr_ur3 = await QRCode.toDataURL(
      "http://broker.data.kg/files/depocb/" + new_name3,
      {}
    );
    var image_logo_url = "http://localhost/img/zaman1.png";

    var filename_for_base1 =
      '{"path":"files/depocb/' +
      new_name1 +
      '","dir":"files/depocb","name":"' +
      new_name_clear1 +
      '","original_name":"СПР","full_original_name":"Сводное передаточное распоряжение"}';
    var filename_for_base2 =
      '{"path":"files/depocb/' +
      new_name2 +
      '","dir":"files/depocb","name":"' +
      new_name_clear2 +
      '","original_name":"ПНД","full_original_name":"Поручение на депонирование"}';
    var filename_for_base3 =
      '{"path":"files/depocb/' +
      new_name3 +
      '","dir":"files/depocb","name":"' +
      new_name_clear3 +
      '","original_name":"ПР","full_original_name":"Передаточное распоряжение"}';

    document1.image_qr_url = image_qr_url;
    document1.image_logo_url = image_logo_url;

    document2.image_qr_url = image_qr_ur2;
    document2.image_logo_url = image_logo_url;

    document3.image_qr_url = image_qr_ur3;
    document3.image_logo_url = image_logo_url;

    var source1 = fs.readFileSync("files_template/template_depo.html", "utf8");
    var source2 = fs.readFileSync(
      "files_template/template_depo_cb_poruch.html",
      "utf8"
    );
    var source3 = fs.readFileSync(
      "files_template/template_depo_cb_raspor.html",
      "utf8"
    );

    var template1 = hbs.compile(source1);
    var template2 = hbs.compile(source2);
    var template3 = hbs.compile(source3);

    var result_document1 = template1(document1);
    var result_document2 = template2(document2);
    var result_document3 = template3(document3);

    var options = {
      format: "A2",
      orientation: "portrait",
      border: "0mm",
      header: {
        height: "0mm",
        contents: "<",
      },
      footer: {
        height: "0mm",
        contents: {
          default: "", // fallback value
        },
      },
    };
    var document_file1 = {
      html: result_document1,
      data: {},
      path: "files/depocb/" + new_name1,
    };
    var document_file2 = {
      html: result_document2,
      data: {},
      path: "files/depocb/" + new_name2,
    };
    var document_file3 = {
      html: result_document3,
      data: {},
      path: "files/depocb/" + new_name3,
    };

    function res_doc(file_data) {
      return async function (res_dock) {
        function res_doc1(file_data) {
          return async function (res_dock) {
            function res_doc2(file_data) {
              return async function (res_dock) {
                ////////////////////////////
                console.log(
                  `SELECT [files] FROM [view_depo_stocks] WHERE [codeid]=${file_data.row.codeid} +--+-+-+-+-+-+-+-+-+-+-+-`
                );
                var get_files = await db.query_await(
                  `SELECT [files] FROM [view_depo_stocks] WHERE [codeid]=${file_data.row.codeid}`
                );
                console.log(`${get_files}-----------------------------------`);
                get_files = get_files.recordset;
                var json_files = new Array();
                if (
                  typeof get_files[0].files != "undefined" &&
                  get_files[0].files != null &&
                  get_files[0].files != ""
                ) {
                  json_files = new Array();
                  json_files.push(JSON.parse(filename_for_base1));
                  json_files.push(JSON.parse(filename_for_base2));
                  json_files.push(JSON.parse(filename_for_base3));
                } else {
                  json_files = new Array();
                  json_files.push(JSON.parse(filename_for_base1));
                  json_files.push(JSON.parse(filename_for_base2));
                  json_files.push(JSON.parse(filename_for_base3));
                }

                var update_db = await db.query_await(
                  `exec create_file_depo_stocks '${JSON.stringify(
                    json_files
                  )}',${file_data.row.codeid}`
                );

                ////////////////////////////
              };
            }

            await pdf.create(document_file3, options).then(
              res_doc2({
                new_name_clear1: file_data.new_name_clear1,
                new_name_clear2: file_data.new_name_clear2,
                new_name_clear3: file_data.new_name_clear3,
                new_name1: file_data.new_name1,
                new_name2: file_data.new_name2,
                new_name3: file_data.new_name3,
                filename_for_base1: file_data.filename_for_base1,
                filename_for_base2: file_data.filename_for_base2,
                filename_for_base3: file_data.filename_for_base3,
                row: file_data.row,
              })
            );
          };
        }

        await pdf.create(document_file2, options).then(
          res_doc1({
            new_name_clear1: file_data.new_name_clear1,
            new_name_clear2: file_data.new_name_clear2,
            new_name_clear3: file_data.new_name_clear3,
            new_name1: file_data.new_name1,
            new_name2: file_data.new_name2,
            new_name3: file_data.new_name3,
            filename_for_base1: file_data.filename_for_base1,
            filename_for_base2: file_data.filename_for_base2,
            filename_for_base3: file_data.filename_for_base3,
            row: file_data.row,
          })
        );
      };
    }
    await pdf.create(document_file1, options).then(
      res_doc({
        new_name_clear1: new_name_clear1,
        new_name_clear2: new_name_clear2,
        new_name_clear3: new_name_clear3,
        new_name1: new_name1,
        new_name2: new_name2,
        new_name3: new_name3,
        filename_for_base1: filename_for_base1,
        filename_for_base2: filename_for_base2,
        filename_for_base3: filename_for_base3,
        row: dealings_documents[i],
      })
    );
  }
  res.json({ status: "success" });
});
app.post("/api/create_file_dealings", async (req, res) => {
  var dealings_documents = await db.query_await(
    `SELECT  *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [view_my_dealings] where codeid = ${req.body.codeid}`
  );

  dealings_documents = dealings_documents.recordset;
  for (var i = 0; i < dealings_documents.length; i++) {
    var new_name1 = makeid(25);
    var new_name = new_name1 + ".pdf";
    var image_qr_url = await QRCode.toDataURL(
      "http://broker.data.kg/files/dealings/" + new_name,
      {}
    );
    //var image_barcode_url=await QRCode.toDataURL('http://royal-gold.333.kg/files/dealings/'+new_name,{});
    var image_logo_url = "http://localhost/img/zaman1.png";
    var filename_for_base =
      '[{"path":"files/dealings/' +
      new_name +
      '","dir":"files/dealings","name":"' +
      new_name1 +
      '","original_name":"' +
      new_name +
      '"}]';
    dealings_documents[i].image_qr_url = image_qr_url;
    //dealings_documents[i].image_qr_url=image_qr_url;
    dealings_documents[i].image_logo_url = image_logo_url;
    var source = fs.readFileSync(
      "files_template/template_dealing.html",
      "utf8"
    );
    var template = hbs.compile(source);
    var result_document = template(dealings_documents[i]);
    var options = {
      format: "A2",
      orientation: "portrait",
      border: "0mm",
      header: {
        height: "0mm",
        contents: "<",
      },
      footer: {
        height: "0mm",
        contents: {
          default: "", // fallback value
        },
      },
    };
    var document = {
      html: result_document,
      data: {},
      path: "files/dealings/" + new_name,
    };
    function res_doc(file_data) {
      console.log(file_data);
      return async function (res_dock) {
        //res.send(result_document);
        var update_db = await db.query_await(
          `exec create_file_dealings '${filename_for_base}',${file_data.row.codeid}`
        );
      };
    }
    await pdf
      .create(document, options)
      .then(
        res_doc({
          name: new_name1,
          filename: new_name,
          filename_for_base: filename_for_base,
          row: dealings_documents[i],
        })
      )
      .then((res) => {
        console.log("+-----------------+-+--++--+-+----+-+-+", res);
      })
      .catch((error) => {
        console.error("+-----------------+-+--++--+-+----+-+-+", error);
      });
  }
  res.json({ status: "success" });
});

app.post("/api/create_file_reestr_spis", async (req, res) => {
  console.log("create_file_reestr_spis");
  var dealings_documents = await db.query_await(
    `SELECT *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [view_my_reestr_spis_print] WHERE codeid = ${req.body.codeid}`
  );
  dealings_documents = dealings_documents.recordset;
  for (var i = 0; i < dealings_documents.length; i++) {
    var document1 = {};
    var document2 = {};
    var document3 = {};

    document1 = dealings_documents[i];
    document2 = dealings_documents[i];
    document3 = dealings_documents[i];

    console.log(
      `SELECT * FROM [view_my_reestr_list_spis] where [codeid_reestr_spis]=${dealings_documents[i].codeid}`
    );
    var list_reestr_spis = await db.query_await(
      `SELECT * FROM [view_my_reestr_list_spis] where [codeid_reestr_spis]=${dealings_documents[i].codeid}`
    );
    document2.list_reestr_spis = list_reestr_spis.recordset;

    var new_name_clear1 = makeid(25);
    var new_name_clear2 = makeid(25);
    var new_name_clear3 = makeid(25);
    var new_name1 = new_name_clear1 + ".pdf";
    var new_name2 = new_name_clear2 + ".pdf";
    var new_name3 = new_name_clear3 + ".pdf";

    var image_qr_url = await QRCode.toDataURL(
      "http://broker.data.kg/files/spiscb/" + new_name1,
      {}
    );
    var image_qr_ur2 = await QRCode.toDataURL(
      "http://broker.data.kg/files/spiscb/" + new_name2,
      {}
    );
    var image_qr_ur3 = await QRCode.toDataURL(
      "http://broker.data.kg/files/spiscb/" + new_name3,
      {}
    );
    var image_logo_url = "http://localhost/img/logo_blank.png";

    var filename_for_base1 =
      '{"path":"files/depocb/' +
      new_name1 +
      '","dir":"files/depocb","name":"' +
      new_name_clear1 +
      '","original_name":"СПР","full_original_name":"Сводное передаточное распоряжение"}';
    var filename_for_base2 =
      '{"path":"files/depocb/' +
      new_name2 +
      '","dir":"files/depocb","name":"' +
      new_name_clear2 +
      '","original_name":"ПНС","full_original_name":"Поручение на списание"}';
    var filename_for_base3 =
      '{"path":"files/depocb/' +
      new_name3 +
      '","dir":"files/depocb","name":"' +
      new_name_clear3 +
      '","original_name":"Р","full_original_name":"Распоряжение"}';

    document1.image_qr_url = image_qr_url;
    document1.image_logo_url = image_logo_url;

    document2.image_qr_url = image_qr_ur2;
    document2.image_logo_url = image_logo_url;

    document3.image_qr_url = image_qr_ur3;
    document3.image_logo_url = image_logo_url;

    var source1 = fs.readFileSync("files_template/template_spis.html", "utf8");
    var source2 = fs.readFileSync(
      "files_template/template_spis_cb_poruch.html",
      "utf8"
    );
    var source3 = fs.readFileSync(
      "files_template/template_depo_cb_raspor.html",
      "utf8"
    );

    var template1 = hbs.compile(source1);
    var template2 = hbs.compile(source2);
    var template3 = hbs.compile(source3);

    var result_document1 = template1(document1);
    var result_document2 = template2(document2);
    var result_document3 = template3(document3);

    var options = {
      format: "A2",
      orientation: "portrait",
      border: "0mm",
      header: {
        height: "0mm",
        contents: "<",
      },
      footer: {
        height: "0mm",
        contents: {
          default: "", // fallback value
        },
      },
    };
    var document_file1 = {
      html: result_document1,
      data: {},
      path: "files/depocb/" + new_name1,
    };
    var document_file2 = {
      html: result_document2,
      data: {},
      path: "files/depocb/" + new_name2,
    };
    var document_file3 = {
      html: result_document3,
      data: {},
      path: "files/depocb/" + new_name3,
    };

    function res_doc(file_data) {
      return async function (res_dock) {
        function res_doc1(file_data) {
          return async function (res_dock) {
            ////////////////////////////
            var get_files = await db.query_await(
              `SELECT [files] FROM [reestr_spis] WHERE [codeid]=${file_data.row.codeid}`
            );
            get_files = get_files.recordset;
            var json_files = new Array();
            if (
              typeof get_files[0].files != "undefined" &&
              get_files[0].files != null &&
              get_files[0].files != ""
            ) {
              json_files = new Array();
              json_files.push(JSON.parse(filename_for_base1));
              json_files.push(JSON.parse(filename_for_base2));
              //json_files.push(JSON.parse(filename_for_base3));
            } else {
              json_files = new Array();
              json_files.push(JSON.parse(filename_for_base1));
              json_files.push(JSON.parse(filename_for_base2));
              //json_files.push(JSON.parse(filename_for_base3));
            }

            console.log(
              `exec create_file_reestr_spis '${JSON.stringify(json_files)}',${
                file_data.row.codeid
              }`
            );
            var update_db = await db.query_await(
              `exec create_file_reestr_spis '${JSON.stringify(json_files)}',${
                file_data.row.codeid
              }`
            );
          };
        }

        await pdf.create(document_file2, options).then(
          res_doc1({
            new_name_clear1: file_data.new_name_clear1,
            new_name_clear2: file_data.new_name_clear2,
            //  new_name_clear3: file_data.new_name_clear3,
            new_name1: file_data.new_name1,
            new_name2: file_data.new_name2,
            //  new_name3: file_data.new_name3,
            filename_for_base1: file_data.filename_for_base1,
            filename_for_base2: file_data.filename_for_base2,
            //  filename_for_base3:file_data.filename_for_base3,
            row: file_data.row,
          })
        );
      };
    }
    await pdf.create(document_file1, options).then(
      res_doc({
        new_name_clear1: new_name_clear1,
        new_name_clear2: new_name_clear2,
        //  new_name_clear3: new_name_clear3,
        new_name1: new_name1,
        new_name2: new_name2,
        //  new_name3: new_name3,
        filename_for_base1: filename_for_base1,
        filename_for_base2: filename_for_base2,
        //filename_for_base3:filename_for_base3,
        row: dealings_documents[i],
      })
    );
  }
  res.json({ status: "success" });
});
app.post("/api/send_sms_code", async (req, res) => {
  var dealings_documents = await db.query_await(
    `SELECT *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [register_temp] WHERE ISNULL([status],0) in (0,2) and codeid = ${req.body.codeid}`
  );
  dealings_documents = dealings_documents.recordset;
  for (var i = 0; i < dealings_documents.length; i++) {
    var document1 = {};

    document1 = dealings_documents[i];

    var new_name_clear1 = makeid(25);
    var new_name1 = new_name_clear1 + ".pdf";

    var image_qr_url = await QRCode.toDataURL(
      "http://broker.data.kg/files/register/" + new_name1,
      {}
    );
    var image_logo_url = "http://localhost/img/logo_blank.png";

    var filename_for_base1 =
      '{"path":"files/register/' +
      new_name1 +
      '","dir":"files/register","name":"' +
      new_name_clear1 +
      '","original_name":"Заявление "}';

    document1.image_qr_url = image_qr_url;
    document1.image_logo_url = image_logo_url;

    var source1 = fs.readFileSync(
      "files_template/registratopn_dogovor.html",
      "utf8"
    );

    var template1 = hbs.compile(source1);

    var result_document1 = template1(document1);

    var options = {
      format: "A2",
      orientation: "portrait",
      border: "0mm",
      header: {
        height: "0mm",
        contents: "<",
      },
      footer: {
        height: "0mm",
        contents: {
          default: "", // fallback value
        },
      },
    };
    var document_file1 = {
      html: result_document1,
      data: {},
      path: "files/register/" + new_name1,
    };

    function res_doc(file_data) {
      return async function (res_dock) {
        //    function res_doc1(file_data) {
        //    return async function (res_dock) {

        //  function res_doc2(file_data) {
        //  return async function (res_dock) {
        ////////////////////////////
        var json_files = new Array();
        json_files.push(JSON.parse(filename_for_base1));
        //var update_db = await db.query_await(`UPDATE [register_temp] set [files]='${(JSON.stringify(json_files))}',[status]=1 WHERE [guid]='${file_data.row.guid}'`);
        var update_db = await db.query_await(
          `exec [send_sms_code] '${file_data.row.guid}','${JSON.stringify(
            json_files
          )}'`
        );
        ////////////////////////////
        //  }}

        //  await pdf.create(document_file3, options).then(res_doc2({
        //     new_name_clear1: file_data.new_name_clear1,
        //     new_name_clear2: file_data.new_name_clear2,
        //     new_name_clear3: file_data.new_name_clear3,
        //     new_name1: file_data.new_name1,
        //     new_name2: file_data.new_name2,
        //     new_name3: file_data.new_name3,
        //     filename_for_base1:file_data.filename_for_base1,
        //     filename_for_base2:file_data.filename_for_base2,
        //     filename_for_base3:file_data.filename_for_base3,
        //     row:file_data.row
        //     }));

        //    }}

        //   await pdf.create(document_file2, options).then(res_doc1({
        //    new_name_clear1: file_data.new_name_clear1,
        //    new_name_clear2: file_data.new_name_clear2,
        //    new_name_clear3: file_data.new_name_clear3,
        //    new_name1: file_data.new_name1,
        //    new_name2: file_data.new_name2,
        //    new_name3: file_data.new_name3,
        //    filename_for_base1:file_data.filename_for_base1,
        //    filename_for_base2:file_data.filename_for_base2,
        //    filename_for_base3:file_data.filename_for_base3,
        //    row:file_data.row
        //    }));
      };
    }
    await pdf.create(document_file1, options).then(
      res_doc({
        new_name_clear1: new_name_clear1,
        new_name1: new_name1,
        filename_for_base1: filename_for_base1,
        row: dealings_documents[i],
      })
    );
  }
  res.json({ status: "success" });
});

async function create_document4() {
  ////////////////////////////////////////////////////////////////////Документы - депонирование цб////////////////////////////////////////////////////////////////////
  //console.log('Документы - допонирование ЦБ');
  var dealings_documents = await db.query_await(
    `SELECT *,CONVERT(varchar(20),[date_system],104) as date_t ,CONVERT(varchar(20),[date_system],108) as time_t FROM [register_temp] WHERE ISNULL([status],0) in (0,2)`
  );
  dealings_documents = dealings_documents.recordset;
  for (var i = 0; i < dealings_documents.length; i++) {
    var document1 = {};

    document1 = dealings_documents[i];

    var new_name_clear1 = makeid(25);
    var new_name1 = new_name_clear1 + ".pdf";

    var image_qr_url = await QRCode.toDataURL(
      "http://broker.data.kg/files/register/" + new_name1,
      {}
    );
    var image_logo_url = "http://localhost/img/logo_blank.png";

    var filename_for_base1 =
      '{"path":"files/register/' +
      new_name1 +
      '","dir":"files/register","name":"' +
      new_name_clear1 +
      '","original_name":"Заявление "}';

    document1.image_qr_url = image_qr_url;
    document1.image_logo_url = image_logo_url;

    var source1 = fs.readFileSync(
      "files_template/registratopn_dogovor.html",
      "utf8"
    );

    var template1 = hbs.compile(source1);

    var result_document1 = template1(document1);

    var options = {
      format: "A2",
      orientation: "portrait",
      border: "0mm",
      header: {
        height: "0mm",
        contents: "<",
      },
      footer: {
        height: "0mm",
        contents: {
          default: "", // fallback value
        },
      },
    };
    var document_file1 = {
      html: result_document1,
      data: {},
      path: "files/register/" + new_name1,
    };

    function res_doc(file_data) {
      return async function (res_dock) {
        //    function res_doc1(file_data) {
        //    return async function (res_dock) {

        //  function res_doc2(file_data) {
        //  return async function (res_dock) {
        ////////////////////////////
        var json_files = new Array();
        json_files.push(JSON.parse(filename_for_base1));
        //var update_db = await db.query_await(`UPDATE [register_temp] set [files]='${(JSON.stringify(json_files))}',[status]=1 WHERE [guid]='${file_data.row.guid}'`);
        var update_db = await db.query_await(
          `exec [send_sms_code] '${file_data.row.guid}','${JSON.stringify(
            json_files
          )}'`
        );
        ////////////////////////////
        //  }}

        //  await pdf.create(document_file3, options).then(res_doc2({
        //     new_name_clear1: file_data.new_name_clear1,
        //     new_name_clear2: file_data.new_name_clear2,
        //     new_name_clear3: file_data.new_name_clear3,
        //     new_name1: file_data.new_name1,
        //     new_name2: file_data.new_name2,
        //     new_name3: file_data.new_name3,
        //     filename_for_base1:file_data.filename_for_base1,
        //     filename_for_base2:file_data.filename_for_base2,
        //     filename_for_base3:file_data.filename_for_base3,
        //     row:file_data.row
        //     }));

        //    }}

        //   await pdf.create(document_file2, options).then(res_doc1({
        //    new_name_clear1: file_data.new_name_clear1,
        //    new_name_clear2: file_data.new_name_clear2,
        //    new_name_clear3: file_data.new_name_clear3,
        //    new_name1: file_data.new_name1,
        //    new_name2: file_data.new_name2,
        //    new_name3: file_data.new_name3,
        //    filename_for_base1:file_data.filename_for_base1,
        //    filename_for_base2:file_data.filename_for_base2,
        //    filename_for_base3:file_data.filename_for_base3,
        //    row:file_data.row
        //    }));
      };
    }
    await pdf.create(document_file1, options).then(
      res_doc({
        new_name_clear1: new_name_clear1,
        new_name1: new_name1,
        filename_for_base1: filename_for_base1,
        row: dealings_documents[i],
      })
    );
  }
  ////////////////////////////////////////////////////////////////////Документы - депонирование цб////////////////////////////////////////////////////////////////////

  setTimeout(create_document4, 5 * 1000);
}

app.get("/blank_lid", async function (req, res) {
  var codeid = req.query.codeid;

  var zayvki = await db.query_await(`SELECT *,
        CONVERT(varchar(20),srok_deystviya_pasporta,104) as srok_deystviya_pasporta2,
        CONVERT(varchar(20),data_vydachi_pasporta,104) as data_vydachi_pasporta2,
        CONVERT(varchar(20),data_trudoustroystva,104) as data_trudoustroystva
        FROM [order_success_cum] WHERE  [codeid]=${codeid} `);
  console.log(
    `SELECT * FROM [order_success_cum_contact_face] WHERE [code_lid] = ${zayvki.recordset[0].code_lid}`
  );
  var contact = await db.query_await(
    `SELECT * FROM [order_success_cum_contact_face] WHERE [code_lid] = ${zayvki.recordset[0].code_lid}`
  );
  var dohod = await db.query_await(
    `SELECT * FROM [order_success_cum_coming_expend] WHERE [code_lid] = ${zayvki.recordset[0].code_lid}`
  );
  var source = fs.readFileSync("files_template/blank_lid.hbs", "utf8");
  var template = hbs.compile(source);
  var html = "";
  for (var k = 0; k < contact.recordset.length; k++) {
    html += `
          <tr>
          <td>${contact.recordset[k].otnoshenie}</td>
          <td>${contact.recordset[k].fio}</td>
          <td>${contact.recordset[k].phone}</td>
          </tr>
          `;
  }

  var html1 = ``;
  var html2 = ``;
  var sum1 = 0;
  var sum2 = 0;
  for (var l = 0; l < dohod.recordset.length; l++) {
    if (dohod.recordset[l].type == "Доход") {
      html1 += `
         <tr>
         <td>${dohod.recordset[l].view_coming_expend}</td>
         <td>${dohod.recordset[l].sum}</td>
         </tr>
         `;
      sum1 += parseInt(dohod.recordset[l].sum);
    } else if (dohod.recordset[l].type == "Расход") {
      html2 += `
         <tr>
         <td>${dohod.recordset[l].view_coming_expend}</td>
         <td>${dohod.recordset[l].sum}</td>
         </tr>
         `;
      sum2 += parseInt(dohod.recordset[l].sum);
    }
  }
  html1 += `
                    <tr>
                    <td><strong>ИТОГО</strong></td>
                    <td><strong>${sum1}</strong></td>
                    </tr>`;
  html2 += `
                    <tr>
                    <td><strong>ИТОГО</strong></td>
                    <td><strong>${sum2}</strong></td>
                    </tr>`;

  var result_document = template({
    codeid: zayvki.recordset[0].codeid,
    code_lid: zayvki.recordset[0].code_lid,
    status: zayvki.recordset[0].status,
    inn: zayvki.recordset[0].inn,
    fio: zayvki.recordset[0].fio,
    nomer_pasporta: zayvki.recordset[0].nomer_pasporta,
    nomer_organa_vydachi: zayvki.recordset[0].nomer_organa_vydachi,
    srok_deystviya_pasporta: zayvki.recordset[0].srok_deystviya_pasporta2,
    data_vydachi_pasporta: zayvki.recordset[0].data_vydachi_pasporta2,
    organ_vydachi: zayvki.recordset[0].organ_vydachi,
    seriya_pasporta: zayvki.recordset[0].seriya_pasporta,

    adres_prozhivaniya: zayvki.recordset[0].adres_prozhivaniya,
    region_prozhivaniya: zayvki.recordset[0].region_prozhivaniya,
    rayon_prozhivaniya: zayvki.recordset[0].rayon_prozhivaniya,
    selo_poselok_pgt_projivaniya:
      zayvki.recordset[0].selo_poselok_pgt_projivaniya,
    ulitsa_prozhivaniya: zayvki.recordset[0].ulitsa_prozhivaniya,
    nomer_prozhivaniya: zayvki.recordset[0].nomer_prozhivaniya,
    otnoshenie_k_adresu_prozhivaniya:
      zayvki.recordset[0].otnoshenie_k_adresu_prozhivaniya,

    telefon: zayvki.recordset[0].telefon,
    mesto_raboty: zayvki.recordset[0].mesto_raboty,
    kommentariy: zayvki.recordset[0].kommentariy,
    email: zayvki.recordset[0].email,
    number_organa_vydachi: zayvki.recordset[0].number_organa_vydachi,

    region: zayvki.recordset[0].region,
    rayon: zayvki.recordset[0].rayon,
    selo_poselok_pgt: zayvki.recordset[0].selo_poselok_pgt,
    ulitsa: zayvki.recordset[0].ulitsa,
    nomer_doma: zayvki.recordset[0].nomer_doma,
    otnoshenie_k_adresu_registratsii:
      zayvki.recordset[0].otnoshenie_k_adresu_registratsii,

    obrazovanie: zayvki.recordset[0].obrazovanie,
    trudovoy_status: zayvki.recordset[0].trudovoy_status,
    tip_zanyatosti: zayvki.recordset[0].tip_zanyatosti,
    naimenovanie_mesta_raboty: zayvki.recordset[0].naimenovanie_mesta_raboty,
    sfera_deyatelnosti: zayvki.recordset[0].sfera_deyatelnosti,
    nazvanie_dolzhnosti: zayvki.recordset[0].nazvanie_dolzhnosti,
    data_trudoustroystva: zayvki.recordset[0].data_trudoustroystva2,
    adres_biznesa_mesta_raboty: zayvki.recordset[0].adres_biznesa_mesta_raboty,

    semeynoe_polozhenie: zayvki.recordset[0].semeynoe_polozhenie,
    kol_vo_chlenov_semi: zayvki.recordset[0].kol_vo_chlenov_semi,

    foto_pasporta_perednyaya_chast:
      zayvki.recordset[0].foto_pasporta_perednyaya_chast,
    foto_pasporta_zadnyaya_chast:
      zayvki.recordset[0].foto_pasporta_zadnyaya_chast,
    foto_s_pasportom: zayvki.recordset[0].foto_s_pasportom,
    skan_soglasiya: zayvki.recordset[0].skan_soglasiya,

    naimenovanie_tovara: zayvki.recordset[0].naimenovanie_tovara,
    imei_code: zayvki.recordset[0].imei_code,
    summa_kredita: zayvki.recordset[0].summa_kredita,
    periodichnost_dney: zayvki.recordset[0].periodichnost_dney,
    oplacheno: zayvki.recordset[0].oplacheno,
    ostatok: zayvki.recordset[0].ostatok,

    contact_face: html,
    dohod: html1,
    rashod: html2,
  });

  res.send(result_document);
});

function create_barcode_base64(barcode) {
  return new Promise((resolve) => {
    bwipjs.toBuffer(
      {
        bcid: "code128", // Barcode type
        text: barcode, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center", // Always good to set this
      },
      function (err, png) {
        if (err) {
          // `err` may be a string or Error object
        } else {
          // `png` is a Buffer
          // png.length           : PNG file length
          // png.readUInt32BE(16) : PNG image width
          // png.readUInt32BE(20) : PNG image height
          resolve("data:image/png;base64," + png.toString("base64"));
          //png1='data:image/png;base64,' +png.toString('base64');
        }
      }
    );
  });
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//Функции для работы с сокетами
io.on("connection", function (socket) {
  //подключились
  console.log("user connected");
  console.log(socket.id);

  //Данамическое подключение обработчиков

  sockets.forEach((element) => {
    element = element.substring(1, element.length);
    element = element.substring(0, element.indexOf("."));
    require("." + element).listen(socket);
  });

  // Отключение сокета
  socket.on("disconnect", function (msg) {
    console.log("user disconnected -" + msg);
  });
});

app.get("/listdata", (req, res) => {
  console.log(req);
  console.log(res);
});

http.listen(80, function () {
  console.log("Старт сервера :80");
});

////////////////////////// гавно код Нурдина /////////////////////////////////////////(p.s делаю это всё в первый раз!)

///////////////////////////////////////////// для того чтобы отобразить топ 10 акций
app.get("/api/get_emitets_top", async (req, res) => {
  try {
    const response = await db.query_await(
      `SELECT TOP 10 * FROM emitents;` /// топ 10 беру
    );
    // console.log("response", response);

    if (response) {
      res.status(200).json(response?.recordsets);
    }
  } catch (err) {
    res.send(500).json({ message: "Internale server error" });
  }
});

///////////////////////////////////////////// для получения каждого эмитента
app.get("/api/get_emitets", async (req, res) => {
  try {
    const id = req.query.id || 1; // Если параметр не передан,default будет 1
    const response = await db.query_await(
      `select * from emitents where codeid=${id}`
    );

    if (response) {
      res.status(200).json(response?.recordsets);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////// для получения данных каждого дела эмитентов
app.get("/api/my_dealing", async (req, res) => {
  try {
    const id = req.query.id || 0;

    const response = await db.query_await(
      `select * from view_my_dealings where codeid_emitent = ${id} `
    );
    if (response) {
      res.status(200).json(response?.recordsets?.[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////// для получения типов (акции,фонды,облигации,блоки акций) с количеством данных!
app.get("/api/get_vid", async (req, res) => {
  try {
    const response = await db.query_await(`\
            SELECT
            t.nameid_vid_stocks,
            t.codeid,
            t.codeid_sp_razdel,
            t.codeid_vid,
            ISNULL(COUNT(p.codeid_sp_vid), 0) AS counter
            FROM
              sp_vid_stocks t
            LEFT JOIN
              view_emitent_stocks p ON t.codeid = p.codeid_sp_vid
            GROUP BY
              t.codeid, t.nameid_vid_stocks, t.codeid_sp_razdel, t.codeid_vid;
  `);
    if (response) {
      res.status(200).json(response?.recordsets);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////// для получения данных каждой категории
// -1 это все данные без сортир0вки по категориям
app.get("/api/get_sort_vid", async (req, res) => {
  try {
    const id = req.query.id || -1;

    const response = await db.query_await(
      +id === -1
        ? `select * from view_emitent_stocks`
        : `select * from view_emitent_stocks where codeid_sp_vid=${id}`
    );
    if (response) {
      res.status(200).json(response?.recordsets?.[0]);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////// для получения суммы счета каждого пользователя
app.get("/api/check_mon", async (req, res) => {
  const id = req.query.id;
  try {
    const response = await db.query_await(
      `select * from depozitary where codeid_agent = ${id} AND number_account = 400`
    );
    if (response) {
      res.status(200).json(response?.recordsets);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////// для получения pdf файла для соглашения с условиями биржы
app.get("/api/agreement_doc", async (req, res) => {
  try {
    const pdfFilePath = "./files/00AAANewFilEEEEEEEEE123123.pdf";

    res.status(200).json(pdfFilePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//// логинизация
app.post("/api/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const response = await db.query_await(
      `select * from agents where login='${login}' AND password='${password}'`
    );
    if (response) {
      res.status(200).json(response?.recordsets?.[0]?.[0]);
      // console.log(response?.recordsets?.[0]?.[0]);
    } else {
      res.status(200).json("Неправильный логин или пароль");
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

/// история продаж и покупок
/// год,день,месяц /// 2023-06-06
app.post("/api/history", async (req, res) => {
  const { id, startDate, endDate } = req?.body;
  try {
    const response = await db.query_await(
      `SELECT * FROM view_my_orders WHERE codeid_agent = ${id} AND date_system BETWEEN '${startDate}' AND '${endDate}' ORDER BY date_system`
    );
    if (response) {
      res.status(200).json(response?.recordsets?.[0]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

/// для регистрации пользователя
app.post("/api/register", async (req, res) => {
  const { login, password, otherData } = req.body;

  // Проверки на корректность данных и хеширование пароля (например, с использованием bcrypt)

  // Сохранение данных в базу данных
  try {
    const response = await db.query_await(
      // `INSERT INTO agents (login, password, other_column) VALUES ('${login}', '${hashedPassword}', '${otherData}')`
      ``
    );
    if (response) {
      res.status(200).json({ message: "Registration successful" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});
