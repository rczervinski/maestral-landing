const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/lib/three', express.static(path.join(__dirname, 'node_modules', 'three')));
app.use('/lib/gsap', express.static(path.join(__dirname, 'node_modules', 'gsap')));
app.use('/lib/lenis', express.static(path.join(__dirname, 'node_modules', 'lenis')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ma&Stral rodando na porta ${PORT}`);
});
