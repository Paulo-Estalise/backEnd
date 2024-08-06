const express = require('express');
const ProductManager = require('/ProductManager'); 

const app = express();
const port = 3000;
const productManager = new ProductManager('./products.json'); 


app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produtos.' });
  }
});


app.get('/products/:pid', async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productManager.getProductById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Produto não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produto.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
const ProductManager = require('/ProductManager'); 
