const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, 'products.json');
  }

  async getProducts(limit) {
    try {
      // Lê o arquivo JSON de forma assíncrona
      const data = await fs.readFile(this.filePath, 'utf-8');
      const products = JSON.parse(data);

      // Verifica se o limite é um número válido
      if (limit && !isNaN(limit)) {
        return products.slice(0, limit);
      }

      return products;
    } catch (error) {
      console.error('Erro ao ler produtos:', error);
      throw new Error('Erro ao ler produtos');
    }
  }

  async getProductById(id) {
    try {
      // Lê o arquivo JSON de forma assíncrona
      const data = await fs.readFile(this.filePath, 'utf-8');
      const products = JSON.parse(data);

      // Verifica se o ID é um número válido
      if (isNaN(id)) {
        throw new Error('ID do produto inválido');
      }

      // Encontra o produto com o ID fornecido
      return products.find(product => product.id === id);
    } catch (error) {
      console.error('Erro ao ler produto:', error);
      throw new Error('Erro ao ler produto');
    }
  }
}

module.exports = ProductManager;
