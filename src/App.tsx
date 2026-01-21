import { useState, useMemo } from 'react';
import { MENU_ITEMS, CATEGORY_NAMES } from './data/menuItems';
import { MenuItem, OrderItem, MenuCategory, Order } from './types/menu';

export default function App() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'all'>('all');
  const [customerName, setCustomerName] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const categories: (MenuCategory | 'all')[] = ['all', 'burgers', 'chicken', 'breakfast', 'sides', 'drinks', 'desserts'];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    if (!customerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerName: customerName.trim(),
      items: [...cart],
      total: cartTotal,
      timestamp: new Date(),
      status: 'pending',
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCustomerName('');
    setShowCart(false);
    alert(`Order placed successfully for ${newOrder.customerName}! Total: $${cartTotal.toFixed(2)}`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🍔</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">McDonald's</h1>
                <p className="text-sm text-yellow-200">I'm lovin' it™</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowOrders(!showOrders);
                  setShowCart(false);
                }}
                className="bg-yellow-400 text-red-600 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              >
                📋 Orders ({orders.length})
              </button>
              <button
                onClick={() => {
                  setShowCart(!showCart);
                  setShowOrders(false);
                }}
                className="relative bg-yellow-400 text-red-600 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              >
                🛒 Cart ({cartItemCount})
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-600">Your Order</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-red-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <span className="text-red-600 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">${item.price.toFixed(2)} each</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700 font-bold"
                          >
                            −
                          </button>
                          <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-green-600 text-white w-8 h-8 rounded-full hover:bg-green-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold mb-4">
                      <span className="text-gray-800">Total:</span>
                      <span className="text-red-600">${cartTotal.toFixed(2)}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-red-600 focus:outline-none"
                    />

                    <button
                      onClick={placeOrder}
                      className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mb-2"
                    >
                      Place Order
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Panel */}
      {showOrders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowOrders(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-600">All Orders</h2>
                <button
                  onClick={() => setShowOrders(false)}
                  className="text-gray-500 hover:text-red-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{order.customerName}</h3>
                          <p className="text-sm text-gray-500">
                            {order.timestamp.toLocaleTimeString()} - {order.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-600">${order.total.toFixed(2)}</div>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'ready' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="preparing">👨‍🍳 Preparing</option>
                            <option value="ready">✅ Ready</option>
                            <option value="completed">✔️ Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete order for ${order.customerName}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                      >
                        Delete Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div className="bg-yellow-50 border-b-2 border-yellow-200 sticky top-[88px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-600 hover:bg-red-100 border-2 border-red-600'
                }`}
              >
                {category === 'all' ? '🍽️ All Menu' : CATEGORY_NAMES[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-red-50 to-yellow-50 h-40 flex items-center justify-center">
                <div className="text-6xl">
                  {item.category === 'burgers' ? '🍔' :
                   item.category === 'chicken' ? '🍗' :
                   item.category === 'breakfast' ? '🍳' :
                   item.category === 'sides' ? '🍟' :
                   item.category === 'drinks' ? '🥤' : '🍦'}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 min-h-[40px]">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-3xl mb-3">🍔</div>
          <p className="text-yellow-400 font-bold text-lg mb-2">I'm lovin' it™</p>
          <p className="text-yellow-200 text-sm">Fake McDonald's Night - Order from your friends!</p>
        </div>
      </footer>
    </div>
  );
}
