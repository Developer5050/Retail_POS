export interface Order {
  id: string;
  invoiceNo: string;
  customerId: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  total: number;
  dcNo: string;
  poNo: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}
