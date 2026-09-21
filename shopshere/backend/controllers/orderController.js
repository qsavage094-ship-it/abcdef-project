const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new Cash on Delivery order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, items } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address details'
      });
    }

    // Determine items: either from payload or from user's current cart
    let orderItems = items;
    if (!orderItems || orderItems.length === 0) {
      const userCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (!userCart || userCart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty'
        });
      }
      orderItems = userCart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity
      }));
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    // Check stock and calculate total amount
    const processedProducts = [];
    let totalAmount = 0;

    for (const item of orderItems) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      totalAmount += itemPrice * item.quantity;

      processedProducts.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: itemPrice
      });
    }

    // Create order with Cash on Delivery
    const order = await Order.create({
      user: req.user._id,
      products: processedProducts,
      shippingAddress,
      totalAmount,
      paymentMethod: 'COD',
      orderStatus: 'PLACED'
    });

    // Reduce stock for each product
    for (const item of processedProducts) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear the customer's cart
    const userCart = await Cart.findOne({ user: req.user._id });
    if (userCart) {
      userCart.items = [];
      await userCart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order'
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your orders'
    });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name image price brand');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order'
    });
  }
};

// @desc    Cancel order (Customer can cancel when status is PLACED)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Section 15: Customer can cancel an order when its status is PLACED
    if (order.orderStatus !== 'PLACED') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already marked as ${order.orderStatus}`
      });
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    // Restore stock for cancelled items
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling order'
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
};
