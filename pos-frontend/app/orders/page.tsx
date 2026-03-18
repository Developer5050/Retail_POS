"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, ChevronUp, ChevronDown, ChevronsUpDown, ShoppingCart } from 'lucide-react';
import { IoCartOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { products as allProducts, customers as allCustomers, type OrderItem, type Product } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SortConfig = {
  key: keyof Product | null;
  direction: 'asc' | 'desc';
};

export default function NewOrder() {
  const [prodSearch, setProdSearch] = useState('');
  const [custSearch, setCustSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [dcNo, setDcNo] = useState('');
  const [poNo, setPoNo] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()));
  const filteredCustomers = allCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()));
  const grandTotal = cart.reduce((s, i) => s + i.total, 0);

  const requestSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';

    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal as unknown as string) : (bVal as unknown as string).localeCompare(aVal);
    }
    if (typeof aVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - (bVal as unknown as number) : (bVal as unknown as number) - aVal;
    }
    return 0;
  });

  // Pagination calculation
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const addToCart = (productId: string, productName: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
      }
      return [...prev, { productId, productName, quantity: 1, price, total: price }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const newQty = Math.max(1, i.quantity + delta);
      return { ...i, quantity: newQty, total: newQty * i.price };
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const saveOrder = () => {
    if (!selectedCustomer || cart.length === 0) {
      toast.error('Please select a customer and add products');
      return;
    }
    toast.success('Order saved & invoice generated!');
    setCart([]);
    setSelectedCustomer(null);
    setDcNo('');
    setPoNo('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <h1 className="page-title text-[18px] font-bold mt-1">New Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Products */}
        <div>
          <div className="mb-4 relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2" placeholder="Search products..." value={prodSearch} onChange={e => { setProdSearch(e.target.value); setCurrentPage(1); }} />
          </div>

          {/* Products Table */}
          <div className="stat-card overflow-x-auto bg-white rounded-lg border border-zinc-200 mb-4">
            <table className="w-full text-sm">

              {/* Table Header */}
              <thead className="bg-[#27AA83] text-xs uppercase text-white border-b border-[#27AA83] h-[38px]">
                <tr>
                  <th className="py-3 px-3 text-left font-semibold rounded-tl-lg cursor-pointer select-none" onClick={() => requestSort('name')}>
                    <div className="flex items-center gap-1">
                      Product
                      {sortConfig.key === 'name' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('category')}>
                    <div className="flex items-center gap-1">
                      Category
                      {sortConfig.key === 'category' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('salePrice')}>
                    <div className="flex items-center gap-1">
                      Price
                      {sortConfig.key === 'salePrice' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3 text-left font-semibold cursor-pointer select-none" onClick={() => requestSort('stock')}>
                    <div className="flex items-center gap-1">
                      Stock
                      {sortConfig.key === 'stock' ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-3 text-left font-semibold rounded-tr-lg">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                  >
                    <td className="py-3 px-3 text-[14px]">{p.name}</td>

                    <td className="py-3 px-3 text-[14px]">
                      {p.category}
                    </td>

                    <td className="py-3 px-3 text-[14px]">
                      ${p.salePrice}
                    </td>

                    <td className="py-3 px-3 text-[14px]">
                      {p.stock}
                    </td>

                    <td className="py-3 px-3 text-[14px]">
                      <button
                        onClick={() => addToCart(p.id, p.name, p.salePrice)}
                        className="px-3 py-1 text-[13px] bg-[#27AA83] text-white rounded-md hover:bg-[#219a75] cursor-pointer"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-200 bg-white">
              <div className="text-[13px] text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-2 py-1 text-[13px]"
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <Button
                    key={num}
                    size="sm"
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-1 text-[13px] rounded-md hover:bg-[#219a75] ${currentPage === num ? 'bg-[#27AA83] text-white' : ''}`}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-2 py-1 text-[13px]"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <IoCartOutline className="w-4 h-4" /> Cart ({cart.length} items)
            </h3>

            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items in cart
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition border-b border-zinc-200 dark:border-zinc-700"
                  >
                    {/* Product Info */}
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                        {item.productName}
                      </p>
                      {/* <p className="text-xs text-muted-foreground mt-0.5">
                        ${item.price} each
                      </p> */}
                    </div>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-7 h-7 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      {/* Item Total */}
                      <span className="w-16 text-right text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        ${item.total.toFixed(2)}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 rounded-md hover:bg-red-50 transition cursor-pointer"
                      >
                        <TooltipProvider>
                             <Tooltip>
                                 <TooltipTrigger asChild>
                                      <RiDeleteBinLine className="w-4 h-4 text-red-500" />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">Delete Item
                                    </TooltipContent>
                              </Tooltip>
                        </TooltipProvider>
                      </button>

                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between items-center pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Grand Total
                  </span>

                  <span className="text-lg font-bold text-[#27AA83]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Customer & Order Info */}
        <div className="space-y-4">
          <div className="stat-card mt-3.5 bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-[15px] font-semibold mb-3">Customer</h3>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <input
                className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2"
                placeholder="Search customer..."
                value={custSearch}
                onChange={e => setCustSearch(e.target.value)}
              />
            </div>

            <div className="space-y-1 max-h-[180px] overflow-y-auto">
              {filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCustomer === c.id
                    ? 'bg-[#27AA83] text-white'
                    : 'hover:bg-zinc-100'
                    }`}
                >
                  <p className="font-medium">{c.name}</p>
                  <p
                    className={`text-xs ${selectedCustomer === c.id
                      ? 'text-white/80'
                      : 'text-muted-foreground'
                      }`}
                  >
                    {c.phone}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 space-y-3 mt-3">
            <h3 className="text-[15px] font-semibold">Order Details</h3>

            <div>
              <Label>DC No</Label>
              <Input
                value={dcNo}
                onChange={e => setDcNo(e.target.value)}
                placeholder="Delivery Challan No"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] rounded-lg"
              />
            </div>

            <div>
              <Label>PO No</Label>
              <Input
                value={poNo}
                onChange={e => setPoNo(e.target.value)}
                placeholder="Purchase Order No"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83] rounded-lg"
              />
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-4 shadow-sm border border-zinc-200 dark:border-zinc-700 mt-3">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[13px] font-bold border-t border-zinc-200 dark:border-zinc-700 pt-2">
              <span>Grand Total</span>
              <span className="text-[#27AA83]">${grandTotal.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-4 bg-[#27AA83] hover:bg-[#219a75] text-white"
              onClick={saveOrder}
              disabled={cart.length === 0}
            >
              Save Order & Generate Invoice
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
