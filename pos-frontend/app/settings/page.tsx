"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Cpu, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function SettingsPage() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    businessName: 'RetailPOS Store',
    address: '123 Business St, Lahore',
    phone: '+92 300 1234567',
    ownerName: 'John Doe',
    city: 'Lahore',
    email: 'john.doe@example.com',
    currency: 'USD',
    taxRate: 10,
    invoicePrefix: 'INV-',
    invoiceStart: 1,
    invoiceFooter: 'Thank you for your business!',
    lowStockAlert: 10,
    defaultPayment: 'Cash',
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',
  });

  const save = () => { toast.success(t.common.settingsSaved); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header flex items-center justify-between">
        <h1 className="page-title text-[18px] font-bold mt-1">{t.common.settings}</h1>
        <Button onClick={save} size="sm" className="bg-[#27AA83] hover:bg-[#219a75] text-white flex items-center gap-1 text-[13px] mt-1"><Save className="w-4 h-4 mr-1" /> {t.common.saveSettings}</Button>
      </div>

      <Tabs defaultValue="business" className="w-full">

        {/* Tabs Header */}
        <TabsList className="mb-4 flex gap-4 justify-start">
          <TabsTrigger
            value="business"
            className="relative text-[14px] font-semibold text-gray-700 
               after:absolute after:-bottom-1 after:left-0 after:h-0.5 
               after:w-0 after:bg-[#27AA83] after:transition-all 
               hover:after:w-full 
               data-[state=active]:after:w-full"
          >
            {t.common.businessInfo}
          </TabsTrigger>

          <TabsTrigger
            value="invoice"
            className="relative text-[14px] font-semibold text-gray-700 
               after:absolute after:-bottom-1 after:left-0 after:h-0.5 
               after:w-0 after:bg-[#27AA83] after:transition-all 
               hover:after:w-full 
               data-[state=active]:after:w-full"
          >
            {t.common.invoiceTax}
          </TabsTrigger>

          <TabsTrigger
            value="system"
            className="relative text-[14px] font-semibold text-gray-700 
               after:absolute after:-bottom-1 after:left-0 after:h-0.5 
               after:w-0 after:bg-[#27AA83] after:transition-all 
               hover:after:w-full 
               data-[state=active]:after:w-full"
          >
            {t.common.systemSetting}
          </TabsTrigger>
        </TabsList>


        {/* BUSINESS INFORMATION */}
        <TabsContent value="business">
          <div className="stat-card space-y-4">

            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-semibold mt-4">{t.common.businessInformation}</h3>
                <p className="text-[12px] text-gray-500">{t.common.configureBusinessInfo}</p>
              </div>
            </div>

            <div>
              <Label className="text-[14px]">{t.common.businessName}</Label>
              <Input
                value={settings.businessName}
                onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.ownerName}</Label>
              <Input
                value={settings.ownerName}
                onChange={e => setSettings({ ...settings, ownerName: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.address}</Label>
              <Input
                value={settings.address}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.city}</Label>
              <Input
                value={settings.city}
                onChange={e => setSettings({ ...settings, city: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.phone}</Label>
              <Input
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.email}</Label>
              <Input
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

          </div>
        </TabsContent>



        {/* INVOICE & TAX */}
        <TabsContent value="invoice">
          <div className="stat-card space-y-4">

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-semibold mt-4">{t.common.invoiceTaxSettings}</h3>
                <p className="text-[12px] text-gray-500">{t.common.configureInvoiceTax}</p>
              </div>
            </div>

            <div>
              <Label className="text-[14px]">{t.common.currency}</Label>

              <Select
                value={settings.currency}
                onValueChange={(v) => setSettings({ ...settings, currency: v })}
              >
                <SelectTrigger className="text-[13px] mt-0.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]">
                  <SelectValue placeholder={t.common.selectCategory} />
                </SelectTrigger>

                <SelectContent className="bg-white border border-gray-200 shadow-md text-[13px]">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[14px]">{t.common.taxRate}</Label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={e => setSettings({ ...settings, taxRate: +e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.invoicePrefix}</Label>
              <Input
                value={settings.invoicePrefix}
                onChange={e => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.invoiceNumberStart}</Label>
              <Input
                type="number"
                value={settings.invoiceStart}
                onChange={e => setSettings({ ...settings, invoiceStart: +e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.invoiceFooterMessage}</Label>
              <Input
                value={settings.invoiceFooter}
                onChange={e => setSettings({ ...settings, invoiceFooter: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

          </div>
        </TabsContent>



        {/* SYSTEM / INVENTORY */}
        <TabsContent value="system">
          <div className="stat-card space-y-4">

            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-semibold mt-4">{t.common.inventorySystemSettings}</h3>
                <p className="text-[12px] text-gray-500">{t.common.configureSystemSettings}</p>
              </div>
            </div>

            <div>
              <Label className="text-[14px]">{t.common.lowStockAlert}</Label>
              <Input
                type="number"
                value={settings.lowStockAlert}
                onChange={e => setSettings({ ...settings, lowStockAlert: +e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.paymentMethod}</Label>

              <Select
                value={settings.defaultPayment}
                onValueChange={(v) => setSettings({ ...settings, defaultPayment: v })}
              >
                <SelectTrigger className="text-[13px] mt-0.5 border border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]">
                  <SelectValue placeholder={t.common.selectPaymentMethod} />
                </SelectTrigger>

                <SelectContent className="bg-white border border-gray-200 shadow-md text-[13px]">
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="JazzCasCalendarh">JazzCash</SelectItem>
                  <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[14px]">{t.common.posCurrencySymbol}</Label>
              <Input
                value={settings.currencySymbol}
                onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="text-[13px] mt-0.5 border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
              />
            </div>

            <div>
              <Label className="text-[14px]">{t.common.dateFormat}</Label>

              <div className="relative mt-0.5">

                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

                <Input
                  type="date"
                  value={settings.dateFormat}
                  onChange={e => setSettings({ ...settings, dateFormat: e.target.value })}
                  className="pl-9 text-[13px] border-zinc-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-[#27AA83]"
                />

              </div>
            </div>

          </div>
        </TabsContent>

      </Tabs>
    </motion.div>
  );
}
