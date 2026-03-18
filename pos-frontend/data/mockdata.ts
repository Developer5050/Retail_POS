export interface Product {
    id: string;
    name: string;
    category: string;
    purchasePrice: number;
    salePrice: number;
    stock: number;
    supplier: string;
    image?: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    productCount: number;
  }
  
  export interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    totalOrders: number;
    totalPurchase: number;
  }
  
  export interface Supplier {
    id: string;
    name: string;
    phone: string;
    address: string;
    company: string;
  }
  
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
  
  export interface Employee {
    id: string;
    name: string;
    phone: string;
    position: string;
    salary: number;
    joiningDate: string;
  }
  
  export interface Expense {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
  }
  
  export const categories: Category[] = [
    { id: '1', name: 'Electronics', productCount: 12 },
    { id: '2', name: 'Clothing', productCount: 8 },
    { id: '3', name: 'Groceries', productCount: 15 },
    { id: '4', name: 'Stationery', productCount: 6 },
    { id: '5', name: 'Hardware', productCount: 10 },
  ];
  
  export const products: Product[] = [
    { id: '1', name: 'Wireless Mouse', category: 'Electronics', purchasePrice: 15, salePrice: 25, stock: 45, supplier: 'TechParts Co.' },
    { id: '2', name: 'USB-C Hub', category: 'Electronics', purchasePrice: 22, salePrice: 40, stock: 30, supplier: 'TechParts Co.' },
    { id: '3', name: 'Mechanical Keyboard', category: 'Electronics', purchasePrice: 45, salePrice: 85, stock: 18, supplier: 'TechParts Co.' },
    { id: '4', name: 'Cotton T-Shirt', category: 'Clothing', purchasePrice: 8, salePrice: 20, stock: 100, supplier: 'FashionWholesale' },
    { id: '5', name: 'Denim Jeans', category: 'Clothing', purchasePrice: 18, salePrice: 45, stock: 60, supplier: 'FashionWholesale' },
    { id: '6', name: 'Rice (5kg)', category: 'Groceries', purchasePrice: 5, salePrice: 8, stock: 200, supplier: 'FoodSupply Ltd.' },
    { id: '7', name: 'Cooking Oil (1L)', category: 'Groceries', purchasePrice: 3, salePrice: 5.5, stock: 150, supplier: 'FoodSupply Ltd.' },
    { id: '8', name: 'Notebook A4', category: 'Stationery', purchasePrice: 1.5, salePrice: 3, stock: 300, supplier: 'OfficeMart' },
    { id: '9', name: 'Ballpoint Pen (10pk)', category: 'Stationery', purchasePrice: 2, salePrice: 5, stock: 200, supplier: 'OfficeMart' },
    { id: '10', name: 'Power Drill', category: 'Hardware', purchasePrice: 35, salePrice: 65, stock: 12, supplier: 'BuildSupply' },
    { id: '11', name: 'Screwdriver Set', category: 'Hardware', purchasePrice: 12, salePrice: 25, stock: 25, supplier: 'BuildSupply' },
    { id: '12', name: 'LED Monitor 24"', category: 'Electronics', purchasePrice: 120, salePrice: 200, stock: 8, supplier: 'TechParts Co.' },
  ];
  
  export const customers: Customer[] = [
    { id: '1', name: 'Ahmed Khan', phone: '+92 300 1234567', email: 'ahmed@email.com', address: '123 Main St, Lahore', totalOrders: 15, totalPurchase: 4520 },
    { id: '2', name: 'Sara Ali', phone: '+92 321 9876543', email: 'sara@email.com', address: '456 Park Ave, Karachi', totalOrders: 8, totalPurchase: 2340 },
    { id: '3', name: 'Usman Malik', phone: '+92 333 4567890', email: 'usman@email.com', address: '789 Lake Rd, Islamabad', totalOrders: 22, totalPurchase: 8900 },
    { id: '4', name: 'Fatima Noor', phone: '+92 345 6789012', email: 'fatima@email.com', address: '321 Hill St, Rawalpindi', totalOrders: 5, totalPurchase: 1200 },
    { id: '5', name: 'Bilal Hassan', phone: '+92 312 3456789', email: 'bilal@email.com', address: '654 River Rd, Faisalabad', totalOrders: 12, totalPurchase: 5600 },
  ];
  
  export const suppliers: Supplier[] = [
    { id: '1', name: 'Ali Raza', phone: '+92 300 1112233', address: 'Industrial Area, Lahore', company: 'TechParts Co.' },
    { id: '2', name: 'Kamran Sheikh', phone: '+92 321 4445566', address: 'Textile Market, Faisalabad', company: 'FashionWholesale' },
    { id: '3', name: 'Hassan Tariq', phone: '+92 333 7778899', address: 'Food Street, Karachi', company: 'FoodSupply Ltd.' },
    { id: '4', name: 'Imran Butt', phone: '+92 345 0001122', address: 'Stationery Market, Rawalpindi', company: 'OfficeMart' },
    { id: '5', name: 'Naveed Akhtar', phone: '+92 312 3334455', address: 'Hardware Market, Islamabad', company: 'BuildSupply' },
  ];
  
  export const orders: Order[] = [
    { id: '1', invoiceNo: 'INV-001', customerId: '1', customerName: 'Ahmed Khan', date: '2026-03-06', items: [{ productId: '1', productName: 'Wireless Mouse', quantity: 2, price: 25, total: 50 }, { productId: '3', productName: 'Mechanical Keyboard', quantity: 1, price: 85, total: 85 }], total: 135, dcNo: 'DC-001', poNo: 'PO-001', status: 'paid' },
    { id: '2', invoiceNo: 'INV-002', customerId: '2', customerName: 'Sara Ali', date: '2026-03-05', items: [{ productId: '4', productName: 'Cotton T-Shirt', quantity: 5, price: 20, total: 100 }], total: 100, dcNo: 'DC-002', poNo: 'PO-002', status: 'paid' },
    { id: '3', invoiceNo: 'INV-003', customerId: '3', customerName: 'Usman Malik', date: '2026-03-05', items: [{ productId: '10', productName: 'Power Drill', quantity: 1, price: 65, total: 65 }, { productId: '11', productName: 'Screwdriver Set', quantity: 2, price: 25, total: 50 }], total: 115, dcNo: 'DC-003', poNo: 'PO-003', status: 'pending' },
    { id: '4', invoiceNo: 'INV-004', customerId: '4', customerName: 'Fatima Noor', date: '2026-03-04', items: [{ productId: '6', productName: 'Rice (5kg)', quantity: 3, price: 8, total: 24 }], total: 24, dcNo: 'DC-004', poNo: 'PO-004', status: 'paid' },
    { id: '5', invoiceNo: 'INV-005', customerId: '5', customerName: 'Bilal Hassan', date: '2026-03-03', items: [{ productId: '12', productName: 'LED Monitor 24"', quantity: 2, price: 200, total: 400 }], total: 400, dcNo: 'DC-005', poNo: 'PO-005', status: 'overdue' },
  ];
  
  export const employees: Employee[] = [
    { id: '1', name: 'Zain Ahmed', phone: '+92 300 1111111', position: 'Store Manager', salary: 45000, joiningDate: '2024-01-15' },
    { id: '2', name: 'Hira Fatima', phone: '+92 321 2222222', position: 'Cashier', salary: 25000, joiningDate: '2024-03-20' },
    { id: '3', name: 'Arslan Ali', phone: '+92 333 3333333', position: 'Sales Associate', salary: 22000, joiningDate: '2024-06-10' },
    { id: '4', name: 'Nida Shah', phone: '+92 345 4444444', position: 'Inventory Clerk', salary: 20000, joiningDate: '2025-01-05' },
    { id: '5', name: 'Omar Farooq', phone: '+92 312 5555555', position: 'Delivery Driver', salary: 18000, joiningDate: '2025-02-14' },
  ];
  
  export const expenses: Expense[] = [
    { id: '1', category: 'Salary', description: 'Employee salaries - March', amount: 130000, date: '2026-03-01' },
    { id: '2', category: 'Rent', description: 'Shop rent - March', amount: 35000, date: '2026-03-01' },
    { id: '3', category: 'Electricity', description: 'Electricity bill - Feb', amount: 8500, date: '2026-03-03' },
    { id: '4', category: 'Miscellaneous', description: 'Office supplies', amount: 2500, date: '2026-03-04' },
    { id: '5', category: 'Maintenance', description: 'AC repair', amount: 5000, date: '2026-03-05' },
  ];
  
  export const salesData = [
    { date: 'Mar 1', sales: 1200 },
    { date: 'Mar 2', sales: 980 },
    { date: 'Mar 3', sales: 1450 },
    { date: 'Mar 4', sales: 890 },
    { date: 'Mar 5', sales: 1320 },
    { date: 'Mar 6', sales: 1580 },
  ];
  
  export const monthlySalesData = [
    { month: 'Oct', sales: 32000, expenses: 22000 },
    { month: 'Nov', sales: 38000, expenses: 24000 },
    { month: 'Dec', sales: 45000, expenses: 28000 },
    { month: 'Jan', sales: 35000, expenses: 23000 },
    { month: 'Feb', sales: 42000, expenses: 26000 },
    { month: 'Mar', sales: 48000, expenses: 27000 },
  ];
  