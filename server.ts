import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Dummy database for orders and products (in-memory for now)
import { INITIAL_PRODUCTS } from "./src/data/initialData.js";

let products = [...INITIAL_PRODUCTS];
let orders: any[] = [];
let payments: any[] = [];

// Setup file upload handling for local storage (bypassing large base64 strings in "db")
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload size for base64 uploads (if sent as JSON) or use raw express
  app.use(express.json({ limit: "50mb" }));

  // Middleware to verify admin (Simulated)
  const verifyAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer ADMIN_SECRET_TOKEN") {
      return res.status(403).json({ error: "Unauthorized access. Admins only." });
    }
    next();
  };

  // PAYMENT SERVICE ABSTRACTION
  class PaymentService {
    static async initializePayment(orderId: string, amount: number, method: string) {
      const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const payment = {
        id: paymentId,
        orderId,
        amount,
        currency: "RWF",
        method,
        status: "PENDING",
        provider: method === 'MOMO' ? 'MTN' : method === 'AIRTEL' ? 'Airtel' : 'Stripe',
        transactionId: `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      payments.push(payment);
      return payment;
    }

    static async verifyPayment(paymentId: string) {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");
      
      // Simulate verification - normally this makes API call to Momo/Stripe
      if (payment.status === 'PENDING') {
        payment.status = 'PAID';
        payment.updatedAt = new Date().toISOString();
      }
      return payment;
    }
  }

  // API ROUTES
  
  // Image Upload Endpoint
  app.post("/api/upload", verifyAdmin, (req, res) => {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });
    
    // In a real app we'd save to cloud storage or disk and return URL.
    // For this simulation, we'll write to a temp directory and return path,
    // or just return the base64 if it's small, but to satisfy "no base64 in db"
    // we'll pretend it's a URL by storing it in a local map or file and serving it,
    // actually let's just write it to a file.
    try {
      const match = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!match) return res.status(400).json({ error: "Invalid base64 string" });
      
      const ext = match[1].split('/')[1] || 'jpg';
      const buffer = Buffer.from(match[2], 'base64');
      
      const fileName = `upload-${Date.now()}.${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      
      fs.writeFileSync(path.join(uploadsDir, fileName), buffer);
      
      res.json({ url: `/uploads/${fileName}` });
    } catch (e) {
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Get Products
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // Admin Add Product (Protected)
  app.post("/api/products", verifyAdmin, (req, res) => {
    const { name, description, price, categoryId, categoryName, isAvailable, isFeatured, isPopular, badge, uploadedImage } = req.body;
    
    if (!name || price === undefined || price < 0 || !categoryId) {
      return res.status(400).json({ error: "Invalid product data" });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      price: Number(price),
      categoryId,
      categoryName: categoryName || 'Uncategorized',
      defaultImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      uploadedImage: uploadedImage || null,
      isAvailable: isAvailable ?? true,
      isFeatured: isFeatured ?? false,
      isPopular: isPopular ?? false,
      badge: badge || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct as any); // Add to top
    res.status(201).json(newProduct);
  });

  // Admin Update Product (Protected)
  app.put("/api/products/:id", verifyAdmin, (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    
    const updated = { ...products[idx], ...req.body, updatedAt: new Date().toISOString() };
    products[idx] = updated;
    res.json(updated);
  });

  // Admin Delete Product (Protected)
  app.delete("/api/products/:id", verifyAdmin, (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // Checkout / Payment Flow
  app.post("/api/checkout", async (req, res) => {
    const { items, deliveryMethod, paymentMethod, customerInfo, deliveryFee = 0, discount = 0 } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Server-side calculation
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product && product.isAvailable) {
        calculatedSubtotal += product.price * item.quantity;
      } else {
        return res.status(400).json({ error: `Product ${item.name} is unavailable or invalid.` });
      }
    }

    const grandTotal = Math.max(0, calculatedSubtotal + deliveryFee - discount);
    
    const orderId = `ORD-${Date.now()}`;
    
    const newOrder = {
      id: orderId,
      customerName: customerInfo.fullName,
      phone: customerInfo.phone,
      deliveryMethod,
      deliveryAddress: customerInfo.deliveryAddress,
      items,
      subtotal: calculatedSubtotal,
      deliveryFee,
      discount,
      total: grandTotal,
      status: "PENDING",
      paymentMethod,
      paymentStatus: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    orders.push(newOrder);

    try {
      // Initialize Payment
      if (paymentMethod !== 'CASH') {
        const payment = await PaymentService.initializePayment(orderId, grandTotal, paymentMethod);
        newOrder.paymentStatus = payment.status;
        return res.status(200).json({ order: newOrder, paymentId: payment.id, status: 'PAYMENT_REQUIRED' });
      } else {
        newOrder.paymentStatus = 'UNPAID';
        newOrder.status = 'CONFIRMED';
        return res.status(200).json({ order: newOrder, status: 'SUCCESS' });
      }
    } catch (e: any) {
      return res.status(500).json({ error: "Payment could not be initialized." });
    }
  });

  // Simulate payment verification/webhook
  app.post("/api/payments/:id/verify", async (req, res) => {
    try {
      const payment = await PaymentService.verifyPayment(req.params.id);
      
      // Update order
      const order = orders.find(o => o.id === payment.orderId);
      if (order) {
        order.paymentStatus = payment.status;
        if (payment.status === 'PAID') {
          order.status = 'CONFIRMED';
        }
      }
      
      res.json({ payment, order });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Get Admin Payments
  app.get("/api/admin/payments", verifyAdmin, (req, res) => {
    res.json(payments);
  });

  // Get Admin Orders
  app.get("/api/admin/orders", verifyAdmin, (req, res) => {
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
