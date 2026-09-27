const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🧠 Random Facts API running on http://localhost:${PORT}`);
  console.log(`   Try it: http://localhost:${PORT}/api/fact`);
});
