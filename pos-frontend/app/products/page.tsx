"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { products as initialProducts, categories as initialCategories, type Product, type Category } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type SortConfig = {
    key: keyof Product | null;
    direction: 'asc' | 'desc';
};


export default function Products() {
    const [productsList, setProductsList] = useState<Product[]>(initialProducts);
    const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
    const [selectedCat, setSelectedCat] = useState<string>('All');
    const [search, setSearch] = useState('');
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [showCatDialog, setShowCatDialog] = useState(false);
    const [catName, setCatName] = useState('');
    const [editCat, setEditCat] = useState<Category | null>(null);

    const [form, setForm] = useState<Partial<Product>>({
        name: '', category: '', purchasePrice: 0, salePrice: 0, stock: 0, supplier: ''
    });

    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const filteredProducts = productsList.filter(p =>
        (selectedCat === 'All' || p.category === selectedCat) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const key = sortConfig.key;
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
    });

    // Pagination calculation
    const totalItems = sortedProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const requestSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };


    const openNewProduct = () => {
        setEditProduct(null);
        setForm({ name: '', category: categoriesList[0]?.name || '', purchasePrice: 0, salePrice: 0, stock: 0, supplier: '' });
        setShowProductDialog(true);
    };

    const openEditProduct = (p: Product) => {
        setEditProduct(p);
        setForm(p);
        setShowProductDialog(true);
    };

    const saveProduct = () => {
        if (editProduct) {
            setProductsList(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...form } as Product : p));
        } else {
            const newP: Product = { id: Date.now().toString(), ...form } as Product;
            setProductsList(prev => [...prev, newP]);
        }
        setShowProductDialog(false);
    };

    const deleteProduct = (id: string) => {
        setProductsList(prev => prev.filter(p => p.id !== id));
    };

    const saveCat = () => {
        if (editCat) {
            setCategoriesList(prev => prev.map(c => c.id === editCat.id ? { ...c, name: catName } : c));
        } else {
            setCategoriesList(prev => [...prev, { id: Date.now().toString(), name: catName, productCount: 0 }]);
        }
        setShowCatDialog(false);
        setCatName('');
        setEditCat(null);
    };

    const deleteCat = (id: string) => {
        setCategoriesList(prev => prev.filter(c => c.id !== id));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header flex items-center justify-between">
                <h1 className="page-title text-[18px] font-bold">Products</h1>

                <Button
                    onClick={openNewProduct}
                    size="sm"
                    className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 mt-1 text-[13px]"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
                {/* Categories */}
                <div className="stat-card h-fit mt-6 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">

                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Categories</h3>

                        <Dialog open={showCatDialog} onOpenChange={setShowCatDialog}>
                            <DialogTrigger asChild>
                                <button
                                    className="text-[#27AA83] hover:underline text-xs"
                                    onClick={() => { setEditCat(null); setCatName(''); }}
                                >
                                    + Add
                                </button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editCat ? 'Edit' : 'Add'} Category</DialogTitle>
                                </DialogHeader>

                                <Input
                                    value={catName}
                                    onChange={e => setCatName(e.target.value)}
                                    placeholder="Category name"
                                    className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                                />

                                <Button
                                    onClick={saveCat}
                                    className="mt-2 bg-[#27AA83] hover:bg-[#219a75] text-white text-[13px]"
                                >
                                    Save
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-1 mt-4">

                        {/* All Products */}
                        <button
                            onClick={() => setSelectedCat('All')}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
      ${selectedCat === 'All'
                                    ? 'bg-[#27AA83] text-white'
                                    : 'hover:bg-muted'
                                }`}
                        >
                            All Products
                        </button>

                        {/* Category List */}
                        {categoriesList.map(c => (
                            <div key={c.id} className="flex items-center group">

                                <button
                                    onClick={() => setSelectedCat(c.name)}
                                    className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors
          ${selectedCat === c.name
                                            ? 'bg-[#27AA83] text-white'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    {c.name}
                                </button>

                                <div className="hidden group-hover:flex gap-1 pr-1">

                                    <button
                                        onClick={() => {
                                            setEditCat(c);
                                            setCatName(c.name);
                                            setShowCatDialog(true);
                                        }}
                                    >
                                        <Edit2 className="w-3 h-3 text-muted-foreground" />
                                    </button>

                                    <button onClick={() => deleteCat(c.id)}>
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

                {/* Products Grid */}
                <div>
                    {/* Search Field */}
                    <div className="relative max-w-md mt-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                            <input
                                className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2"
                                placeholder="Search products by name..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                    </div>

                    {/* Products Table */}
                    <div className="stat-card bg-white dark:bg-zinc-900 rounded-lg p-2 mt-3 shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
                        <table className="w-full min-w-[600px] text-sm text-left">
                            <thead className="bg-[#27AA83] text-xs uppercase text-white border-b border-[#27AA83] h-[38px]">
                                <tr>
                                    {['name', 'category', 'purchasePrice', 'salePrice', 'stock'].map((col, idx, arr) => (
                                        <th
                                            key={col}
                                            className={`
                    py-3 px-3 text-left font-semibold cursor-pointer select-none
                    ${idx === 0 ? 'rounded-tl-lg' : ''} 
                    ${idx === arr.length - 1 ? '' : ''}
                `}
                                            onClick={() => requestSort(col as keyof Product)}
                                        >
                                            <div className="flex items-center gap-1">
                                                {col === 'name' && 'Product'}
                                                {col === 'category' && 'Category'}
                                                {col === 'purchasePrice' && 'Buy Price'}
                                                {col === 'salePrice' && 'Sell Price'}
                                                {col === 'stock' && 'Stock'}

                                                {/* Sort Icon */}
                                                {sortConfig.key === col ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="w-3 h-3 text-white" />
                                                    ) : (
                                                        <ChevronDown className="w-3 h-3 text-white" />
                                                    )
                                                ) : (
                                                    <ChevronsUpDown className="w-3 h-3 opacity-40 text-white" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="py-3 px-3 text-left font-semibold rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map(p => (
                                    <tr key={p.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-muted">
                                        <td className="px-3 py-3 font-medium">{p.name}</td>
                                        <td className="px-3 py-3 text-muted-foreground">{p.category}</td>
                                        <td className="px-3 py-3">${p.purchasePrice}</td>
                                        <td className="px-3 py-3 text-primary">${p.salePrice}</td>
                                        <td className={`px-3 py-3 font-medium ${p.stock < 15 ? 'text-destructive' : ''}`}>{p.stock}</td>
                                        <td className="px-3 py-3 flex gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => openEditProduct(p)}
                                                            className="p-1 rounded hover:bg-muted"
                                                        >
                                                            <Edit2 className="w-4 h-4 text-muted-foreground cursor-pointer" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                                                        Edit Product
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => deleteProduct(p.id)}
                                                            className="p-1 rounded hover:bg-muted cursor-pointer"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-destructive cursor-pointer text-red-500" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                                                        Delete Product
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
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
                </div>
            </div>

            {/* Product Dialog */}
            <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editProduct ? 'Edit' : 'Add'} Product</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">

                        {/* Product Name */}
                        <div>
                            <Label>
                                Product Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={form.name || ''}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label>
                                Category <span className="text-red-500">*</span>
                            </Label>

                            <Select
                                value={form.category}
                                onValueChange={v => setForm({ ...form, category: v })}
                            >
                                <SelectTrigger className="bg-white dark:bg-zinc-900 text-[13px] mt-0.5 border-zinc-300 focus:border-[#27AA83] focus:ring-0 focus:outline-none">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-[13px]">
                                    {categoriesList.map(c => (
                                        <SelectItem key={c.id} value={c.name} className="text-[13px]">
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-2 gap-3">

                            <div>
                                <Label>
                                    Purchase Price <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={form.purchasePrice || 0}
                                    onChange={e =>
                                        setForm({ ...form, purchasePrice: +e.target.value })
                                    }
                                    className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                                />
                            </div>

                            <div>
                                <Label>
                                    Sale Price <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={form.salePrice || 0}
                                    onChange={e =>
                                        setForm({ ...form, salePrice: +e.target.value })
                                    }
                                    className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                                />
                            </div>

                        </div>

                        {/* Stock + Supplier */}
                        <div className="grid grid-cols-2 gap-3">

                            <div>
                                <Label>
                                    Stock <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    value={form.stock || 0}
                                    onChange={e => setForm({ ...form, stock: +e.target.value })}
                                    className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                                />
                            </div>

                            <div>
                                <Label>
                                    Supplier <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={form.supplier || ''}
                                    onChange={e => setForm({ ...form, supplier: e.target.value })}
                                    className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                                />
                            </div>

                        </div>

                        {/* Save Button */}
                        <Button
                            onClick={saveProduct}
                            className="w-full bg-[#27AA83] hover:bg-[#219a75] text-white"
                        >
                            Save Product
                        </Button>

                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
