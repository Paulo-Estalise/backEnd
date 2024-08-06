const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.nextId = 1;
    this.loadProducts();
  }

  async loadProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = fs.readFileSync(this.path, 'utf-8');
        this.products = JSON.parse(data);
        if (this.products.length > 0) {
          this.nextId = Math.max(...this.products.map(p => p.id)) + 1;
        }
      } else {
        this.products = [];
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    }
  }

  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error('Todos os campos são obrigatórios.');
      return;
    }

    const existingProduct = this.products.find(p => p.code === code);
    if (existingProduct) {
      console.error('Código de produto já existe.');
      return;
    }

    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    await this.saveProducts();
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return product;
    } else {
      console.error('Produto não encontrado.');
    }
  }

  async updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error('Produto não encontrado.');
      return;
    }

    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    await this.saveProducts();
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error('Produto não encontrado.');
      return;
    }

    this.products.splice(productIndex, 1);
    await this.saveProducts();
  }
}

// Exemplo de uso
const productManager = new ProductManager('./products.json');

(async () => {
  await productManager.addProduct({
    title: 'Produto 1',
    description: 'Descrição do Produto 1',
    price: 100,
    thumbnail: 'caminho/imagem1.jpg',
    code: 'CODE123',
    stock: 10
  });

  await productManager.addProduct({
    title: 'Produto 2',
    description: 'Descrição do Produto 2',
    price: 200,
    thumbnail: 'caminho/imagem2.jpg',
    code: 'CODE124',
    stock: 5
  });

  console.log(await productManager.getProductById(1));
  console.log(await productManager.getProductById(3));
})();
