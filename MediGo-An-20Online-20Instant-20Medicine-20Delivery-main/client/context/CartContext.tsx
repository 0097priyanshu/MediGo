import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  pharmacy?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.medicineId === item.medicineId,
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.medicineId === item.medicineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [
        ...prevItems,
        { ...item, id: `${item.medicineId}-${Date.now()}` },
      ];
    });
  }, []);

  const removeItem = useCallback((medicineId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.medicineId !== medicineId),
    );
  }, []);

  const updateQuantity = useCallback((medicineId: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.medicineId !== medicineId);
      }
      return prevItems.map((item) =>
        item.medicineId === medicineId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
