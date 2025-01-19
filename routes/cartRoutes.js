const express = require('express');
const router = express.Router();
const db = require('../db/db.js');

// Welcome route
router.get('/', (req, res) => {
    res.status(200).json('WELCOME TO ONLINE SHOPPING (myu)');
});

// Add a product
router.post('/cart', async (req, res) => {
    const { productId, name, price, quantity } = req.body;

    if (!productId || !name || !price || !quantity) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await db.none('INSERT INTO products(productId, productname, price, quantity) VALUES ($1, $2, $3, $4)', [productId, name, price, quantity]);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product', details: error.message });
    }
});

// View cart
router.get('/cart', async (req, res) => {
    try {
        const productItems = await db.any('SELECT * FROM products');
        if (productItems.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        const totalQuantity = productItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = productItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        res.json({ productItems, totalQuantity, totalPrice });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart items', details: error.message });
    }
});

// Delete a product
router.delete('/cart/deleteproduct/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const result = await db.result('DELETE FROM products WHERE productname = $1', [name]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `No product found with name ${name}` });
        }

        res.json({ message: `Product with name "${name}" removed from cart` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove product', details: error.message });
    }
});

// Clear cart
router.delete('/cart', async (req, res) => {
    try {
        const result = await db.result('DELETE FROM products');
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cart is already empty' });
        }

        res.json({ message: 'All items cleared from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart', details: error.message });
    }
});

// Update product quantity
router.put('/cart/update/:name', async (req, res) => {
    const { name } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        const result = await db.result('UPDATE products SET quantity = $1 WHERE productname = $2', [quantity, name]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: `No product found with name ${name}` });
        }

        res.json({ message: `Product quantity updated to ${quantity}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product quantity', details: error.message });
    }
});

module.exports = router;