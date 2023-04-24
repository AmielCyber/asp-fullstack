import { createContext, useContext, useState } from "react";
// My import.
import type { Cart } from "../models/cart";

interface StoreContextValue {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (context === undefined) {
    throw Error("We are not inside the provider.");
  }

  return context;
}

type Props = {
  children: React.ReactNode;
};
export function StoreProvider(props: Props) {
  const [cart, setCart] = useState<Cart | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (!cart) return;
    const items = [...cart.items];
    const itemIndex = items.findIndex((i) => i.productId === productId);
    if (itemIndex >= 0) {
      items[itemIndex].quantity -= quantity;
      if (items[itemIndex].quantity < 1) {
        items.splice(itemIndex, 1);
      }
      setCart({
        id: cart.id,
        buyerId: cart.buyerId,
        items: items,
      });
    }
  };

  return (
    <StoreContext.Provider value={{ cart, setCart, removeItem }}>
      {props.children}
    </StoreContext.Provider>
  );
}
