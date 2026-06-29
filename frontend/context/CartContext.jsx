import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Load initial cart items from local storage, if present
  const [items, setItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("medigo_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (err) {
      console.error("Failed to parse cart items from local storage:", err);
      return [];
    }
  });

  // Sync cart items to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("medigo_cart", JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart items to local storage:", err);
    }
  }, [items]);

  // Adds a product to the cart or increments its quantity
  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Removes a product from the cart by its ID
  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Increments quantity of an existing item in the cart
  const increaseQuantity = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrements quantity of an existing item (removes item if quantity reaches 0)
  const decreaseQuantity = (productId) => {
    setItems((prev) => {
      const targetItem = prev.find((item) => item.id === productId);
      if (targetItem && targetItem.quantity <= 1) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Directly sets a specific quantity for a product in the cart
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Empties the cart
  const clearCart = () => {
    setItems([]);
  };

  // Calculates the sum of (price * quantity) of all items in the cart
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
export default CartContext;
