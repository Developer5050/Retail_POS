"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { employees as initialEmployees, type Employee } from '@/data/mockdata';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/lib/context/LanguageContext';

type SortConfig = {
  key: keyof Employee | null;
  direction: 'asc' | 'desc';
};

export default function Employees() {
  const { t } = useLanguage();
  const [list, setList] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({ name: '', phone: '', position: '', salary: 0, joiningDate: '' });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  const requestSort = (key: keyof Employee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedList = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';
    if (typeof aVal === 'string') return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    if (typeof aVal === 'number') return sortConfig.direction === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    return 0;
  });

  // Pagination calculation
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedList = sortedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openNew = () => { setEditing(null); setForm({ name: '', phone: '', position: '', salary: 0, joiningDate: '' }); setShowDialog(true); };
  const openEdit = (e: Employee) => { setEditing(e); setForm(e); setShowDialog(true); };
  const save = () => {
    if (editing) setList(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } as Employee : e));
    else setList(prev => [...prev, { id: Date.now().toString(), ...form } as Employee]);
    setShowDialog(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">{t.common.employees}</h1>
        <Button
          onClick={openNew}
          size="sm"
          className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"
        >
          <Plus className="w-4 h-4" /> {t.common.addEmployee}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-md mt-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="search-input w-full pl-10 py-2.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#27AA83] focus-visible:outline-none focus:border-[#27AA83] text-[13px] mt-0.5 rounded-lg"
          placeholder={t.common.searchEmployees}
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} // reset page on search
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-md">
        <table className="min-w-full">
          <thead className="bg-[#27AA83] text-white">
            <tr>
              {['name', 'position', 'phone', 'salary', 'joiningDate'].map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-left text-[14px] cursor-pointer select-none"
                  onClick={() => requestSort(key as keyof Employee)}
                >
                  <div className="flex items-center gap-1 capitalize">
                    {key === 'name' && t.common.name}
                    {key === 'position' && t.common.position}
                    {key === 'phone' && t.common.phone}
                    {key === 'salary' && t.common.salary}
                    {key === 'joiningDate' && t.common.joined}
                    {sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    ) : <ChevronsUpDown className="w-3 h-3 opacity-40" />}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-right text-[14px] rounded-tr-md">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedList.map(e => (
              <tr key={e.id} className="border-b border-zinc-200 hover:bg-zinc-50 transition">
                <td className="px-4 py-2 text-[14px]">{e.name}</td>
                <td className="px-4 py-2 text-[14px]"><span className="badge-info">{e.position}</span></td>
                <td className="px-4 py-2 text-[14px]">{e.phone}</td>
                <td className="px-4 py-2 text-[14px]">${e.salary.toLocaleString()}</td>
                <td className="px-4 py-2 text-[14px]">{e.joiningDate}</td>
                <td className="px-4 py-2 flex justify-end gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => openEdit(e)} className="p-1">
                          <Edit2 className="w-4 h-4 text-black cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">{t.common.editEmployee}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => setList(prev => prev.filter(x => x.id !== e.id))} className="p-1">
                          <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-black border border-zinc-200 shadow-md">{t.common.deleteEmployee}</TooltipContent>
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

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md w-full rounded-lg p-6 bg-white shadow-lg">
          <DialogHeader className="pb-2 border-b border-gray-200">
            <DialogTitle>{editing ? t.common.edit : t.common.add} {t.common.employees}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {['name', 'phone', 'position', 'salary', 'joiningDate'].map((field) => (
              <div key={field}>
                <Label className="capitalize">
                  {field === 'name' && t.common.name}
                  {field === 'phone' && t.common.phone}
                  {field === 'position' && t.common.position}
                  {field === 'salary' && t.common.salary}
                  {field === 'joiningDate' && t.common.joined}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type={field === 'salary' ? 'number' : field === 'joiningDate' ? 'date' : 'text'}
                  className="mt-1 border border-zinc-300 focus:outline-none focus:ring-0 focus:border-[#27AA83]"
                  value={(form as any)[field] || (field === 'salary' ? 0 : '')}
                  onChange={e => setForm({ ...form, [field]: field === 'salary' ? +e.target.value : e.target.value })}
                />
              </div>
            ))}
            <Button className="w-full bg-[#27AA83] hover:bg-[#21976f] text-white" onClick={save}>{t.common.save}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}