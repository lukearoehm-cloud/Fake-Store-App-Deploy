import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { CartItem } from "../types";

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
}

export const createOrder = async (order: Omit<Order, "id">) => {
  const ordersCollection = collection(db, "orders");
  const docRef = await addDoc(ordersCollection, order);
  return docRef.id;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersCollection = collection(db, "orders");

  const q = query(ordersCollection, where("userId", "==", userId));

  const snapshot = await getDocs(q);

  const orders = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];

  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
