import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * Reusable cart item card displaying medicine details, quantity adjusters, subtotal, and removal.
 */
const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-teal-50/50">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md border"
            />
          ) : (
            <div className="w-16 h-16 bg-teal-50 rounded-md border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
              {item.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-slate-800">{item.name}</h3>
            <p className="text-sm text-slate-500">₹{item.price} per unit</p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
          {/* Quantity Controls */}
          <div className="flex items-center border border-teal-100 rounded-md p-1 bg-teal-50/30">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-teal-100 text-teal-800"
              onClick={() => decreaseQuantity(item.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium text-slate-800">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-teal-100 text-teal-800"
              onClick={() => increaseQuantity(item.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Subtotal and Delete Action */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg text-teal-800 w-24 text-right">
              ₹{item.price * item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
