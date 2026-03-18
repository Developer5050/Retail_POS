"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ShoppingBag, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { suppliers as initialSuppliers, products as allProducts, type Supplier } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/lib/context/LanguageContext';

type SortConfig = {
  key: keyof Supplier | null;
  direction: 'asc' | 'desc';
};

export default function Suppliers() {
  const { t } = useLanguage();
  const [list, setList] = useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Partial<Supplier>>({ name: '', phone: '', address: '', company: '' });
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ supplierId: '', productId: '', qty: 1, purchasePrice: 0, salePrice: 0 });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.company.toLowerCase().includes(search.toLowerCase()));

  const requestSort = (key: keyof Supplier) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedList = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';
    if (typeof aVal === 'string') {
      return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - (bVal as unknown as number) : (bVal as unknown as number) - aVal;
    }
    return 0;
  });

  // Pagination calculation
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = sortedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const columns: { key: keyof Supplier; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
  ];

  const openNew = () => { setEditing(null); setForm({ name: '', phone: '', address: '', company: '' }); setShowDialog(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm(s); setShowDialog(true); };

  const save = () => {
    if (editing) {
      setList(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } as Supplier : s));
    } else {
      setList(prev => [...prev, { id: Date.now().toString(), ...form } as Supplier]);
    }
    setShowDialog(false);
  };

  const savePurchase = () => {
    toast.success(`${t.common.stockIncreased} ${purchaseForm.qty} ${t.common.units}`);
    setShowPurchase(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">{t.common.suppliers}</h1>
        <div className="flex gap-2 justify-end items-center">
          <Button onClick={() => setShowPurchase(true)} variant="outline" size="sm"><ShoppingBag className="w-4 h-4 mr-1 bg-[#27AA83] hover:bg-[#219a75] text-white" /> {t.common.newPurchase}</Button>
          <Button
            onClick={openNew}
            size="sm"
            className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> {t.common.addSupplier}
          </Button>
        </div>
      </div>

      <div className="mb-4 relative mt-3 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2" placeholder={t.common.searchSuppliers} value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
      </div>

      <div className="stat-card overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
        <table className="min-w-full text-sm">
          {/* Table Header */}
          <thead className="bg-[#27AA83] text-xs uppercase text-white border-b border-[#27AA83] h-[38px]">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => requestSort(col.key)}
                  className={`py-2 px-3 text-left font-semibold cursor-pointer select-none ${col.key === 'name' ? 'rounded-tl-lg' : ''
                    } ${col.key === 'address' ? '' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.key === 'name' && t.common.name}
                    {col.key === 'company' && t.common.company}
                    {col.key === 'phone' && t.common.phone}
                    {col.key === 'address' && t.common.address}
                    {sortConfig.key === col.key ? (
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
              ))}
              <th className="py-2 px-3 text-left font-semibold rounded-tr-lg">{t.common.actions}</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedList.map(s => (
              <tr key={s.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                <td className="py-2 px-3 text-[14px]">{s.name}</td>
                <td className="py-2 px-3 text-[14px]">{s.company}</td>
                <td className="py-2 px-3 text-[14px]">{s.phone}</td>
                <td className="py-2 px-3 text-[14px]">{s.address}</td>
                <td className="py-2 px-3 text-[14px]">
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-muted"><Edit2 className="w-4 h-4 text-muted-foreground cursor-pointer" /></button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          {t.common.editSupplier}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => setList(prev => prev.filter(x => x.id !== s.id))} className="p-1.5 rounded hover:bg-muted"><Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" /></button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                          {t.common.deleteSupplier}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-200 bg-white">
          <div className="text-[13px] text-gray-700">
            {t.common.showing} {(currentPage - 1) * itemsPerPage + 1} {t.common.to} {Math.min(currentPage * itemsPerPage, totalItems)} {t.common.of} {totalItems} {t.common.entries}
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
              {t.common.next}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t.common.edit : t.common.add} {t.common.suppliers}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>
                {t.common.name} <span className="text-red-500">*</span>
              </Label>
              <input
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder={t.common.enterName}
                className="mt-1 w-full text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#27AA83] focus:ring-0 p-2"
              />
            </div>

            <div>
              <Label>
                {t.common.company} <span className="text-red-500">*</span>
              </Label>
              <input
                value={form.company || ''}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder={t.common.company}
                className="mt-1 w-full text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#27AA83] focus:ring-0 p-2"
              />
            </div>

            <div>
              <Label>
                {t.common.phone} <span className="text-red-500">*</span>
              </Label>
              <input
                value={form.phone || ''}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder={t.common.phone}
                className="mt-1 w-full text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#27AA83] focus:ring-0 p-2"
              />
            </div>

            <div>
              <Label>
                {t.common.address} <span className="text-red-500">*</span>
              </Label>
              <input
                value={form.address || ''}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder={t.common.address}
                className="mt-1 w-full text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-[#27AA83] focus:ring-0 p-2"
              />
            </div>

            <Button
              onClick={save}
              className="w-full bg-[#27AA83] hover:bg-[#219a75] text-white"
            >
              {t.common.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.common.newPurchase}</DialogTitle>
          </DialogHeader>

          {/* Supplier */}
          <div>
            <Label>
              {t.common.suppliers} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={purchaseForm.supplierId}
              onValueChange={v => setPurchaseForm({ ...purchaseForm, supplierId: v })}
            >
              <SelectTrigger className="mt-1 w-full text-sm rounded-md border border-zinc-300 focus:outline-none focus:border-[#27AA83] focus:ring-0">
                <SelectValue placeholder={t.common.selectSupplier} />
              </SelectTrigger>
              <SelectContent
                className="absolute z-50 max-h-60 overflow-y-auto rounded-md border border-zinc-300 shadow-lg bg-white"
              >
                {list.map(s => (
                  <SelectItem
                    key={s.id}
                    value={s.id}
                    className="text-sm px-3 py-2 hover:bg-[#f3f4f6]"
                  >
                    {s.name} - {s.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product */}
          <div>
            <Label>
              {t.common.productName} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={purchaseForm.productId}
              onValueChange={v => setPurchaseForm({ ...purchaseForm, productId: v })}
            >
              <SelectTrigger className="mt-1 w-full text-sm rounded-md border border-zinc-300 focus:outline-none focus:border-[#27AA83] focus:ring-0">
                <SelectValue placeholder={t.common.selectProduct} />
              </SelectTrigger>
              <SelectContent
                className="absolute z-50 max-h-60 overflow-y-auto rounded-md border border-zinc-300 shadow-lg bg-white"
              >
                {allProducts.map(p => (
                  <SelectItem
                    key={p.id}
                    value={p.id}
                    className="text-sm px-3 py-2 hover:bg-[#f3f4f6]"
                  >
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity, Buy Price, Sell Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>
                {t.common.quantity} <span className="text-red-500">*</span>
              </Label>
              <input
                type="number"
                value={purchaseForm.qty}
                onChange={e => setPurchaseForm({ ...purchaseForm, qty: +e.target.value })}
                className="mt-1 w-full border border-zinc-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#27AA83] appearance-none p-2 text-sm"
              />
            </div>

            <div>
              <Label>
                {t.common.buyPrice} <span className="text-red-500">*</span>
              </Label>
              <input
                type="number"
                value={purchaseForm.purchasePrice}
                onChange={e => setPurchaseForm({ ...purchaseForm, purchasePrice: +e.target.value })}
                className="mt-1 w-full border border-zinc-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#27AA83] appearance-none p-2 text-sm"
              />
            </div>

            <div>
              <Label>
                {t.common.sellPrice} <span className="text-red-500">*</span>
              </Label>
              <input
                type="number"
                value={purchaseForm.salePrice}
                onChange={e => setPurchaseForm({ ...purchaseForm, salePrice: +e.target.value })}
                className="mt-1 w-full border border-zinc-300 rounded-md focus:outline-none focus:ring-0 focus:border-[#27AA83] appearance-none p-2 text-sm"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={savePurchase}
            className="w-full bg-[#27AA83] hover:bg-[#219a75] text-white"
          >
            {t.common.savePurchase}
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
