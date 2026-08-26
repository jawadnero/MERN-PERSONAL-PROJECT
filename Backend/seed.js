const dotenv = require('dotenv');
const dns = require('dns');

// Use public DNS resolvers to avoid local DNS SRV lookup failures
dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/auth.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const seed = async () => {
  try {
    await connectDB();

    // Clear collections (be careful in production)
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create users
    const RAW_PASSWORD = process.env.SEED_PASSWORD || 'password123';
    const passwordHash = await bcrypt.hash(RAW_PASSWORD, 10);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
      isVerified: true
    });

    const user = await User.create({
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: passwordHash,
      role: 'user',
      isVerified: true
    });

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'High quality wireless headphones',
        price: 5999,
        category: 'electronics',
        stock: 50,
        imageUrl: '/uploads/headphones.jpg'
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes',
        price: 7999,
        category: 'fashion',
        stock: 30,
        imageUrl: '/uploads/shoes.jpg'
      },
      {
        name: 'Minimalist Backpack',
        description: 'A durable everyday backpack with a spacious laptop compartment',
        price: 4499,
        category: 'fashion',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'
      },
      {
        name: 'Ceramic Coffee Set',
        description: 'A modern ceramic mug and saucer set for your daily coffee ritual',
        price: 2499,
        category: 'home',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fccb13?auto=format&fit=crop&w=900&q=85'
      },
      {
        name: 'Smart Desk Lamp',
        description: 'Adjustable LED desk lamp with warm and cool light settings',
        price: 3299,
        category: 'electronics',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85'
      }
    ]);

    // Create an order for the user
    const order = await Order.create({
      user: user._id,
      products: [
        { productId: products[0]._id, qty: 2, price: products[0].price },
        { productId: products[1]._id, qty: 1, price: products[1].price }
      ],
      totalAmount: products[0].price * 2 + products[1].price,
      address: {
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'Lahore'
      },
      paymentId: 'TEST_PAYMENT_123'
    });

    console.log('Seed complete:');
    console.log({
      admin: { email: admin.email, username: admin.username, password: RAW_PASSWORD },
      user: { email: user.email, username: user.username, password: RAW_PASSWORD },
      productsCount: products.length,
      orderId: order._id
    });

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
