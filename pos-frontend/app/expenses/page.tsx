"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { expenses as initialExpenses, orders, products, type Expense } from '@/data/mockdata';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/lib/context/LanguageContext';

type SortConfig = {
  key: string | null;
  direction: 'asc' | 'desc';
};

export default function Expenses() {
  const { t } = useLanguage();
  const [expenseList, setExpenseList] = useState<Expense[]>(initialExpenses);
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<Partial<Expense>>({ category: 'Miscellaneous', description: '', amount: 0, date: '2026-03-06' });
  const [salesSort, setSalesSort] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [expenseSort, setExpenseSort] = useState<SortConfig>({ key: null, direction: 'asc' });
  // Add pagination state at the top
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // change number of rows per page

  const filteredExpenses = expenseList.filter(e =>
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalPurchaseCost = orders.reduce((s, o) => s + o.items.reduce((si, i) => {
    const p = products.find(x => x.id === i.productId);
    return si + (p ? p.purchasePrice * i.quantity : 0);
  }, 0), 0);
  const totalExpenses = expenseList.reduce((s, e) => s + e.amount, 0);
  const profit = totalSales - totalPurchaseCost - totalExpenses;

  const salesRecords = orders.flatMap(o => o.items.map(i => {
    const p = products.find(x => x.id === i.productId);
    return {
      name: i.productName,
      date: o.date,
      salePrice: i.price,
      purchasePrice: p?.purchasePrice || 0,
      profit: i.total - (p ? p.purchasePrice * i.quantity : 0),
    };
  }));

  const chartData = [
    { name: t.common.totalSales, amount: totalSales },
    { name: t.common.purchaseCost, amount: totalPurchaseCost },
    { name: t.common.expenses, amount: totalExpenses },
    { name: profit >= 0 ? t.common.profit : t.common.loss, amount: Math.abs(profit) },
  ];

  const requestSalesSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (salesSort.key === key && salesSort.direction === 'asc') {
      direction = 'desc';
    }
    setSalesSort({ key, direction });
  };

  const sortedSalesRecords = [...salesRecords].sort((a, b) => {
    if (!salesSort.key) return 0;
    const key = salesSort.key as keyof typeof a;
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === 'string') {
      return salesSort.direction === 'asc' ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
    }
    if (typeof aVal === 'number') {
      return salesSort.direction === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    }
    return 0;
  });

  const totalSalesRecords = sortedSalesRecords.length;
  const totalSalesPages = Math.ceil(totalSalesRecords / itemsPerPage);
  const paginatedSalesRecords = sortedSalesRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestExpenseSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (expenseSort.key === key && expenseSort.direction === 'asc') {
      direction = 'desc';
    }
    setExpenseSort({ key, direction });
  };

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (!expenseSort.key) return 0;
    const key = expenseSort.key as keyof Expense;
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === 'string') {
      return expenseSort.direction === 'asc' ? (aVal as string).localeCompare(bVal as string) : (bVal as string).localeCompare(aVal as string);
    }
    if (typeof aVal === 'number') {
      return expenseSort.direction === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    }
    return 0;
  });

  const totalExpenseItems = sortedExpenses.length;
  const totalExpensePages = Math.ceil(totalExpenseItems / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const save = () => {
    setExpenseList(prev => [...prev, { id: Date.now().toString(), ...form } as Expense]);
    setShowDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">{t.common.expensesProfit}</h1>
        <Button
          onClick={() => setShowDialog(true)}
          size="sm"
          className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"
        >
          <Plus className="w-4 h-4" />
          {t.common.addExpense}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-5">

        {/* Total Sales */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-[12px] font-medium text-muted-foreground">{t.common.totalSales}</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalSales.toLocaleString()}
          </p>
        </div>

        {/* Purchase Cost */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] font-medium text-muted-foreground">{t.common.purchaseCost}</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalPurchaseCost.toLocaleString()}
          </p>
        </div>

        {/* Expenses */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-red-500" />
            <span className="text-[12px] font-medium text-muted-foreground">{t.common.expenses}</span>
          </div>
          <p className="text-[16px] font-bold mt-1">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* Profit / Loss */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            {profit >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-[12px] font-medium text-muted-foreground">{t.common.profitLoss}</span>
          </div>

          <p className={`text-[16px] font-bold mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profit >= 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
          </p>
        </div>

      </div>

      {/* Chart */}
      <div className="stat-card mb-6 border border-gray-200 rounded-lg p-4">
        <h3 className="text-[14px] font-bold text-muted-foreground mb-4">{t.common.monthlySummary}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Bar dataKey="amount" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                  {t.common.monthlySummary}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sales Records */}
        <div className="overflow-x-auto bg-white shadow rounded-md border border-gray-200">

          <div className="px-4 py-3 font-bold text-gray-700">
            {t.common.salesRecords}
          </div>

          <table className="min-w-full">
            <thead className="bg-[#27AA83] text-white">
              <tr>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tl-md cursor-pointer select-none" onClick={() => requestSalesSort('name')}>
                  <div className="flex items-center gap-1">
                    {t.common.productName}
                    {salesSort.key === 'name' ? (
                      salesSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestSalesSort('salePrice')}>
                  <div className="flex items-center gap-1">
                    {t.common.sale}
                    {salesSort.key === 'salePrice' ? (
                      salesSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestSalesSort('purchasePrice')}>
                  <div className="flex items-center gap-1">
                    {t.common.cost}
                    {salesSort.key === 'purchasePrice' ? (
                      salesSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestSalesSort('profit')}>
                  <div className="flex items-center gap-1">
                    {t.common.profit}
                    {salesSort.key === 'profit' ? (
                      salesSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tr-md cursor-pointer select-none" onClick={() => requestSalesSort('date')}>
                  <div className="flex items-center gap-1">
                    {t.common.date}
                    {salesSort.key === 'date' ? (
                      salesSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedSalesRecords.map((r, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-[14px]">{r.name}</td>
                  <td className="px-4 py-2 text-[14px]">${r.salePrice}</td>
                  <td className="px-4 py-2 text-[14px]">${r.purchasePrice}</td>
                  <td className={`px-4 py-2 text-[14px] ${r.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${r.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[14px]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sales Pagination */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-200 bg-white">
            <div className="text-[13px] text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalSalesRecords)} of {totalSalesRecords} entries
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
              {Array.from({ length: totalSalesPages }, (_, i) => i + 1).map((num) => (
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
                disabled={currentPage === totalSalesPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2 py-1 text-[13px]"
              >
                Next
              </Button>
            </div>
          </div>

        </div>


        {/* Other Expenses */}
        <div className="overflow-x-auto bg-white shadow rounded-md border border-gray-200">

          <div className="px-4 py-3 font-bold text-gray-700">
            {t.common.otherExpenses}
          </div>

          <table className="min-w-full">
            <thead className="bg-[#27AA83] text-white">
              <tr>
                <th className="px-4 py-2 text-[14px] font-bold text-left rounded-tl-md cursor-pointer select-none" onClick={() => requestExpenseSort('category')}>
                  <div className="flex items-center gap-1">
                    {t.common.categories}
                    {expenseSort.key === 'category' ? (
                      expenseSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestExpenseSort('description')}>
                  <div className="flex items-center gap-1">
                    {t.common.description}
                    {expenseSort.key === 'description' ? (
                      expenseSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestExpenseSort('amount')}>
                  <div className="flex items-center gap-1">
                    {t.common.amount}
                    {expenseSort.key === 'amount' ? (
                      expenseSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-left cursor-pointer select-none" onClick={() => requestExpenseSort('date')}>
                  <div className="flex items-center gap-1">
                    {t.common.date}
                    {expenseSort.key === 'date' ? (
                      expenseSort.direction === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-2 text-[14px] font-bold text-right rounded-tr-md">{t.common.actions}</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedExpenses.map((e) => (
                <tr key={e.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-1 text-[14px]">
                    {e.category}
                  </td>

                  <td className="px-4 py-1 text-[14px]">{e.description}</td>

                  <td className="px-4 py-1 text-[14px]">
                    ${e.amount.toLocaleString()}
                  </td>

                  <td className="px-4 py-1 text-[14px]">{e.date}</td>

                  <td className="px-4 py-1 mt-2 text-[14px] flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              setExpenseList((prev) =>
                                prev.filter((x) => x.id !== e.id)
                              )
                            }
                            className="p-1"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          {t.common.delete}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expenses Pagination */}
          <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-200 bg-white">
            <div className="text-[13px] text-gray-700">
              {t.common.showing} {(currentPage - 1) * itemsPerPage + 1} {t.common.to} {Math.min(currentPage * itemsPerPage, totalExpenseItems)} {t.common.of} {totalExpenseItems} {t.common.entries}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-2 py-1 text-[13px]"
              >
                {t.common.prev}
              </Button>
              {Array.from({ length: totalExpensePages }, (_, i) => i + 1).map((num) => (
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
                disabled={currentPage === totalExpensePages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2 py-1 text-[13px]"
              >
                {t.common.next}
              </Button>
            </div>
          </div>

        </div>

      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.common.addExpense}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            {/* Category */}
            <div>
              <Label className="text-[14px]">
                {t.common.categories} <span className="text-red-500">*</span>
              </Label>

              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]">
                  <SelectValue placeholder={t.common.selectCategory} />
                </SelectTrigger>

                <SelectContent className="bg-white border border-gray-200 shadow-md text-[14px]">
                  {['Salary', 'Rent', 'Electricity', 'Maintenance', 'Miscellaneous'].map(
                    (c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="text-[14px] hover:bg-gray-100 cursor-pointer"
                      >
                        {c}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label className="text-[14px]">
                {t.common.description} <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.description || ''}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Amount */}
            <div>
              <Label className="text-[14px]">
                {t.common.amount} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.amount || 0}
                onChange={(e) =>
                  setForm({ ...form, amount: +e.target.value })
                }
              />
            </div>

            {/* Date */}
            <div>
              <Label className="text-[14px]">
                {t.common.date} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                value={form.date || ''}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <Button
              onClick={save}
              className="w-full bg-[#27AA83] hover:bg-[#21976f] text-white"
            >
              {t.common.saveExpense}
            </Button>

          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
