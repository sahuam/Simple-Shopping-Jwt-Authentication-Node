module.exports = {
  hostname: "localhost",
  port: 4000,
  jwt: {
    secret: "my-secret-key",
  },
  db: {
    url: "http://localhost:8600",
  },
  publicDir: __dirname,
};
