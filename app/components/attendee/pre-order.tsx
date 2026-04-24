"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Clock, ShoppingCart, Plus, Minus, MapPin } from "lucide-react";
import { CONCESSION_OUTLETS } from "@/lib/venue-data";

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

const MENU = [
  { name: "Chicken Biryani", price: 250, category: "Main" },
  { name: "Veg Biryani", price: 200, category: "Main" },
  { name: "Samosa (2 pcs)", price: 50, category: "Snack" },
  { name: "Pani Puri", price: 60, category: "Snack" },
  { name: "Dhokla", price: 80, category: "Snack" },
  { name: "Pepsi (500ml)", price: 100, category: "Drink" },
  { name: "Water (1L)", price: 40, category: "Drink" },
  { name: "Mango Lassi", price: 120, category: "Drink" },
  { name: "Vanilla Ice Cream", price: 100, category: "Dessert" },
  { name: "Jalebi", price: 70, category: "Dessert" },
];

export function PreOrder() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addItem = (name: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === name);
      if (existing) return prev.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const removeItem = (name: string) => {
    setCart((prev) => prev.map((i) => (i.name === name ? { ...i, qty: Math.max(0, i.qty - 1) } : i)).filter((i) => i.qty > 0));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const nearestOutlet = CONCESSION_OUTLETS.reduce((best, o) => (o.waitTime < best.waitTime ? o : best), CONCESSION_OUTLETS[0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-3">
        <MapPin size={14} className="text-emerald-400 shrink-0" />
        <div>
          <p className="text-xs font-medium text-emerald-300">Nearest outlet: {nearestOutlet.name}</p>
          <p className="text-[10px] text-zinc-500">Wait time: {nearestOutlet.waitTime} min | {nearestOutlet.zone}</p>
        </div>
      </div>

      {["Main", "Snack", "Drink", "Dessert"].map((cat) => (
        <div key={cat}>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">{cat}</p>
          <div className="space-y-1.5">
            {MENU.filter((m) => m.category === cat).map((item) => {
              const inCart = cart.find((c) => c.name === item.name);
              return (
                <div key={item.name} className="flex items-center justify-between rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-zinc-300">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">&#8377;{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {inCart ? (
                      <>
                        <button onClick={() => removeItem(item.name)} className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"><Minus size={12} /></button>
                        <span className="text-xs font-bold text-white w-5 text-center">{inCart.qty}</span>
                        <button onClick={() => addItem(item.name, item.price)} className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"><Plus size={12} /></button>
                      </>
                    ) : (
                      <button onClick={() => addItem(item.name, item.price)} className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-semibold text-white transition-colors">Add</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {totalItems > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-0 rounded-xl bg-indigo-600 p-4 flex items-center justify-between shadow-lg shadow-indigo-500/20">
          <div>
            <p className="text-xs font-bold text-white">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
            <p className="text-sm font-black text-white">&#8377;{total}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 text-xs font-bold hover:bg-zinc-100 transition-colors">
            <ShoppingCart size={14} />
            Pre-Order
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
