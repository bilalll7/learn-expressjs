const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

// routes utama Method GET

app.get("/", (req, res) => {
  res.send(200, "test", "test", res);
});
app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (error, result) => {
    if (error) throw err;
    response(200, result, "Get all data from tabel mahasiswa", res);
  });
});
app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (error, result) => {
    if (error) throw err;
    response(200, result, "get detail by nim", res);
  });
});
// api method post / insert
app.post("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;
  const sql = `INSERT INTO mahasiswa (nim, nama_lengkap, kelas, alamat) VALUES (${nim}, '${namaLengkap}', '${kelas}', '${alamat}')`;
  db.query(sql, (error, result) => {
    if (error) response(500, "Data Failed", "error", res);
    if (result?.affectedRows) {
      const data = {
        isSucces: result.affectedRows,
        id: result.insertId,
      };
      response(200, data, "Data added succesfully !", res);
    }
  });
});
// api method put / update
app.put("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;
  const sql = `UPDATE mahasiswa SET nama_lengkap = '${namaLengkap}', kelas = '${kelas}', alamat = '${alamat}' WHERE nim = ${nim}`;
  db.query(sql, (error, result) => {
    if (error) response(500, "Invalid", "error", res);
    if (result?.affectedRows) {
      const data = {
        isSucces: result.affectedRows,
        message: result.message,
      };
      response(200, data, "Data Update succesfully !", res);
    } else {
      response(404, "User not found!", "error", res);
    }
  });
});
// api method delete
app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (error, result) => {
    if (error) response(500, "Invalid", "error", res);
    if (result?.affectedRows) {
      const data = {
        isDeleted: result.affectedRows,
      };
      response(200, data, "Delete Data Succesfully !", res);
    } else {
      response(404, "User not found!", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
