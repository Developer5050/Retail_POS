"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { customers as initialCustomers, type Customer } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type SortConfig = {
    key: keyof Customer | null;
    direction: 'asc' | 'desc';
};

export default function Customers() {
    const [list, setList] = useState<Customer[]>(initialCustomers);
    const [search, setSearch] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Customer | null>(null);
    const [form, setForm] = useState<Partial<Customer>>({ name: '', phone: '', email: '', address: '' });

    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filtered = [...list]
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            const key = sortConfig.key;
            const aValue = a[key];
            const bValue = b[key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

    // Pagination calculation
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedList = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openNew = () => { setEditing(null); setForm({ name: '', phone: '', email: '', address: '' }); setShowDialog(true); };
    const openEdit = (c: Customer) => { setEditing(c); setForm(c); setShowDialog(true); };

    const requestSort = (key: keyof Customer) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };


    const save = () => {
        if (editing) {
            setList(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } as Customer : c));
        } else {
            setList(prev => [...prev, { id: Date.now().toString(), totalOrders: 0, totalPurchase: 0, ...form } as Customer]);
        }
        setShowDialog(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="page-header flex items-center justify-between">
                <h1 className="page-title text-[18px] font-bold mt-1">Customers</h1>

                <Button
                    onClick={openNew}
                    size="sm"
                    className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"
                >
                    <Plus className="w-4 h-4" />
                    Add Customer
                </Button>
            </div>

            <div className="mb-4 relative max-w-md mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                <input
                    className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg p-2"
                    placeholder="Search customers by name..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="stat-card overflow-x-auto bg-white shadow rounded-lg mt-5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#27AA83] text-xs uppercase text-white border-b border-[#27AA83] h-[38px]">
                        <tr>
                            {['name', 'phone', 'email', 'address', 'totalOrders', 'totalPurchase'].map((col) => (
                                <th
                                    key={col}
                                    className="py-3 px-3 text-left font-semibold cursor-pointer select-none"
                                    onClick={() => requestSort(col as keyof Customer)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col === 'name' && 'Name'}
                                        {col === 'phone' && 'Phone'}
                                        {col === 'email' && 'Email'}
                                        {col === 'address' && 'Address'}
                                        {col === 'totalOrders' && 'Orders'}
                                        {col === 'totalPurchase' && 'Total Spent'}

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
                            <th className="py-3 px-3 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 mt-2">
                        {paginatedList.map((c, idx) => (
                            <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-4 py-3 font-medium text-gray-900 text-[14px]">{c.name}</td>
                                <td className="px-4 py-2 text-gray-700 text-[14px]">
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {c.phone}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-gray-700 text-[14px]">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {c.email}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-gray-700 text-[14px]">{c.address}</td>
                                <td className="px-4 py-2 text-gray-700 text-[14px]">{c.totalOrders}</td>
                                <td className="px-4 py-2 font-medium text-gray-900 text-[14px]">${c.totalPurchase.toLocaleString()}</td>
                                <td className="px-4 py-2 flex gap-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Edit2 className="w-4 h-4 text-black cursor-pointer" onClick={() => openEdit(c)} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                                                Edit Customer
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => setList(prev => prev.filter(x => x.id !== c.id))} />
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">
                                                Delete Customer
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

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md w-full rounded-lg p-6 bg-white shadow-lg">
                    <DialogHeader className="pb-2 border-b border-gray-200">
                        <DialogTitle className="text-lg font-semibold text-gray-900">{editing ? 'Edit' : 'Add'} Customer</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        {/* Name */}
                        <div className="flex flex-col">
                            <Label className="text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={form.name || ''}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Enter customer name"
                                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"

                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col">
                            <Label className="text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={form.phone || ''}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="Enter phone number"
                                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"

                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col">
                            <Label className="text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={form.email || ''}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="Enter email address"
                                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"

                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col">
                            <Label className="text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={form.address || ''}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                placeholder="Enter address"
                                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"

                            />
                        </div>

                        <Button
                            onClick={save}
                            className="w-full bg-[#27AA83] hover:bg-[#219a75] text-white mt-2"
                        >
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
