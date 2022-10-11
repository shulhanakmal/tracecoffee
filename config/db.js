const { createPool } = require("mysql");
const pool = createPool({
  host: "localhost",
  user: "akmal",
  password: "Letmein7",
  port: "3305",
  database: "kk_telu",
});

pool.getConnection((err) => {
  if (err) {
    console.log("Error Koneksi DB...");
  }
  console.log("Sukses Konek DB");
});

const executeQuery = (query, arraParms) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(query, arraParms, (err, data) => {
        if (err) {
          console.log("error excute query");
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { executeQuery };
