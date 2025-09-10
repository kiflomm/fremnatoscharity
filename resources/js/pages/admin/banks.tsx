import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Banknote, MoreHorizontal, Image as ImageIcon, Search, Edit3, Eye, EyeOff, ChevronDown, ChevronRight, Building2, CreditCard, AlertCircle, CheckCircle2, Loader2, Upload, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';

type BankAccount = { id: number; account_number: string; sort_order?: number | null };
type Bank = {
    id: number;
    display_name_en: string;
    display_name_am?: string | null;
    display_name_ti?: string | null;
    logo_url?: string | null;
    sort_order?: number | null;
    accounts: BankAccount[];
};

type PageProps = { banks: Bank[] };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manage Banks', href: '/admin/banks' },
];

export default function AdminBanks({ banks }: PageProps) {
    const [editing, setEditing] = useState<Record<number, Bank>>(
        Object.fromEntries(banks.map(b => [b.id, { ...b, accounts: b.accounts.map(a => ({ ...a })) }]))
    );
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deleteBankId, setDeleteBankId] = useState<number | null>(null);
    const [deleteAccountId, setDeleteAccountId] = useState<{ bankId: number; accountId: number } | null>(null);
    const [saving, setSaving] = useState<Record<number, boolean>>({});

    // Create bank dialog state
    const [openCreate, setOpenCreate] = useState(false);
    const { data: createData, setData: setCreateData, post: postCreate, processing: creating, reset: resetCreate, errors: createErrors, clearErrors: clearCreateErrors } = useForm<{
        display_name_en: string;
        display_name_am?: string;
        display_name_ti?: string;
        logo_url?: string;
        sort_order?: number | '';
    }>({
        display_name_en: '',
        display_name_am: '',
        display_name_ti: '',
        logo_url: '',
        sort_order: ''
    });

    const updateBankField = (id: number, field: keyof Bank, value: any) => {
        setEditing(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const updateAccountField = (bankId: number, accountId: number, field: keyof BankAccount, value: any) => {
        setEditing(prev => ({
            ...prev,
            [bankId]: {
                ...prev[bankId],
                accounts: prev[bankId].accounts.map(a => (a.id === accountId ? { ...a, [field]: value } : a)),
            },
        }));
    };

    const addAccount = (bankId: number) => {
        setEditing(prev => ({
            ...prev,
            [bankId]: {
                ...prev[bankId],
                accounts: [...prev[bankId].accounts, { id: -Date.now(), account_number: '', sort_order: null }],
            },
        }));
    };

    const removeAccount = (bankId: number, accountId: number) => {
        const isNew = String(accountId).startsWith('-');
        if (isNew) {
            setEditing(prev => ({
                ...prev,
                [bankId]: { ...prev[bankId], accounts: prev[bankId].accounts.filter(a => a.id !== accountId) },
            }));
            return;
        }
        router.delete(`/admin/banks/${bankId}/accounts/${accountId}`);
    };

    const saveBank = async (bank: Bank) => {
        setSaving(prev => ({ ...prev, [bank.id]: true }));
        
        try {
            await router.put(`/admin/banks/${bank.id}`, {
                display_name_en: bank.display_name_en,
                display_name_am: bank.display_name_am,
                display_name_ti: bank.display_name_ti,
                logo_url: bank.logo_url,
                sort_order: bank.sort_order,
            });

            // Create any newly added accounts
            const newAccounts = bank.accounts.filter(a => String(a.id).startsWith('-') && a.account_number.trim());
            for (const account of newAccounts) {
                await router.post(`/admin/banks/${bank.id}/accounts`, {
                    account_number: account.account_number,
                    sort_order: account.sort_order,
                });
            }
        } finally {
            setSaving(prev => ({ ...prev, [bank.id]: false }));
        }
    };

    const deleteBank = (bankId: number) => {
        router.delete(`/admin/banks/${bankId}`);
    };

    const toggleExpand = (bankId: number) => {
        setExpanded(prev => ({ ...prev, [bankId]: !prev[bankId] }));
    };

    const canCreate = useMemo(() => {
        return (createData.display_name_en ?? '').trim().length > 0;
    }, [createData]);

    const filteredBanks = useMemo(() => {
        if (!searchQuery.trim()) return banks;
        const query = searchQuery.toLowerCase();
        return banks.filter(bank => 
            bank.display_name_en.toLowerCase().includes(query) ||
            bank.display_name_am?.toLowerCase().includes(query) ||
            bank.display_name_ti?.toLowerCase().includes(query) ||
            bank.accounts.some(acc => acc.account_number.toLowerCase().includes(query))
        );
    }, [banks, searchQuery]);

    const totalAccounts = useMemo(() => {
        return banks.reduce((sum, bank) => sum + bank.accounts.length, 0);
    }, [banks]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Manage Banks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                <Banknote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            Manage Banks
                        </h1>
                        <p className="text-muted-foreground">Create and manage bank information and account details for donations.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                            {viewMode === 'grid' ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            {viewMode === 'grid' ? 'List View' : 'Grid View'}
                        </Button>
                        <Button onClick={() => setOpenCreate(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Bank
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Banks</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{banks.length}</div>
                            <p className="text-xs text-muted-foreground">Active banks</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalAccounts}</div>
                            <p className="text-xs text-muted-foreground">Bank accounts</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Search Results</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{filteredBanks.length}</div>
                            <p className="text-xs text-muted-foreground">Matching banks</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search banks by name or account number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {searchQuery && (
                                <Button variant="outline" onClick={() => setSearchQuery('')}>
                                    Clear
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Banks List/Grid */}
                {filteredBanks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {searchQuery ? 'No banks found' : 'No banks yet'}
                            </h3>
                            <p className="text-muted-foreground text-center mb-4">
                                {searchQuery 
                                    ? 'Try adjusting your search terms or clear the search to see all banks.'
                                    : 'Get started by adding your first bank to manage donation accounts.'
                                }
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setOpenCreate(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Bank
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
                        {filteredBanks.map(bank => (
                            <Card key={bank.id} className="group hover:shadow-lg transition-all duration-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="relative">
                                                {editing[bank.id]?.logo_url ? (
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                                        <img 
                                                            src={editing[bank.id]?.logo_url || ''} 
                                                            alt={`${bank.display_name_en} logo`} 
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                        <div className="hidden h-full w-full flex items-center justify-center">
                                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                                                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-lg leading-tight mb-1">
                                                    {editing[bank.id]?.display_name_en || bank.display_name_en}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {editing[bank.id]?.accounts?.length || bank.accounts.length} accounts
                                                    </Badge>
                                                    {bank.sort_order && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Order: {bank.sort_order}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => toggleExpand(bank.id)}>
                                                    {expanded[bank.id] ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                                    {expanded[bank.id] ? 'Collapse' : 'Expand'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => saveBank(editing[bank.id])} disabled={saving[bank.id]}>
                                                    {saving[bank.id] ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                                    Save changes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => addAccount(bank.id)}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add account
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600 focus:text-red-600" 
                                                    onClick={() => setDeleteBankId(bank.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete bank
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {/* Bank Details Form */}
                                    <Tabs defaultValue="details" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="details">Details</TabsTrigger>
                                            <TabsTrigger value="accounts">Accounts</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="details" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`name-en-${bank.id}`}>Display Name (English) *</Label>
                                                    <Input
                                                        id={`name-en-${bank.id}`}
                                                        placeholder="Enter bank name in English"
                                                        value={editing[bank.id]?.display_name_en ?? ''}
                                                        onChange={e => updateBankField(bank.id, 'display_name_en', e.target.value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`name-am-${bank.id}`}>Display Name (Amharic)</Label>
                                                        <Input
                                                            id={`name-am-${bank.id}`}
                                                            placeholder="Amharic name"
                                                            value={editing[bank.id]?.display_name_am ?? ''}
                                                            onChange={e => updateBankField(bank.id, 'display_name_am', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`name-ti-${bank.id}`}>Display Name (Tigrinya)</Label>
                                                        <Input
                                                            id={`name-ti-${bank.id}`}
                                                            placeholder="Tigrinya name"
                                                            value={editing[bank.id]?.display_name_ti ?? ''}
                                                            onChange={e => updateBankField(bank.id, 'display_name_ti', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`logo-${bank.id}`}>Logo URL</Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id={`logo-${bank.id}`}
                                                            placeholder="https://example.com/logo.png"
                                                            value={editing[bank.id]?.logo_url ?? ''}
                                                            onChange={e => updateBankField(bank.id, 'logo_url', e.target.value)}
                                                            className="flex-1"
                                                        />
                                                        {editing[bank.id]?.logo_url && (
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    const logoUrl = editing[bank.id]?.logo_url;
                                                                    if (logoUrl) {
                                                                        window.open(logoUrl, '_blank');
                                                                    }
                                                                }}
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`sort-${bank.id}`}>Sort Order</Label>
                                                    <Input
                                                        id={`sort-${bank.id}`}
                                                        type="number"
                                                        placeholder="Display order (lower numbers first)"
                                                        value={editing[bank.id]?.sort_order ?? ''}
                                                        onChange={e => updateBankField(bank.id, 'sort_order', Number(e.target.value) || null)}
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>
                                        
                                        <TabsContent value="accounts" className="space-y-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">Bank Accounts</h4>
                                                    <p className="text-sm text-muted-foreground">Manage donation account numbers</p>
                                                </div>
                                                <Button size="sm" onClick={() => addAccount(bank.id)}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Account
                                                </Button>
                                            </div>
                                            
                                            {editing[bank.id]?.accounts?.length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <CreditCard className="h-8 w-8 mx-auto mb-2" />
                                                    <p>No accounts added yet</p>
                                                    <p className="text-sm">Add account numbers for donations</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {editing[bank.id]?.accounts?.map((acc, index) => (
                                                        <div key={acc.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="space-y-1">
                                                                    <Label htmlFor={`acc-${acc.id}`} className="text-sm font-medium">
                                                                        Account Number
                                                                    </Label>
                                                                    <Input
                                                                        id={`acc-${acc.id}`}
                                                                        placeholder="Enter account number"
                                                                        value={acc.account_number}
                                                                        onChange={e => updateAccountField(bank.id, acc.id, 'account_number', e.target.value)}
                                                                        className="w-full"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label htmlFor={`order-${acc.id}`} className="text-sm font-medium">
                                                                        Display Order
                                                                    </Label>
                                                                    <Input
                                                                        id={`order-${acc.id}`}
                                                                        type="number"
                                                                        placeholder="Order (optional)"
                                                                        value={acc.sort_order ?? ''}
                                                                        onChange={e => updateAccountField(bank.id, acc.id, 'sort_order', Number(e.target.value) || null)}
                                                                        className="w-32"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                size="icon"
                                                                variant="destructive"
                                                                onClick={() => setDeleteAccountId({ bankId: bank.id, accountId: acc.id })}
                                                                className="shrink-0"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>

                                    {/* Save Button */}
                                    <div className="flex justify-end pt-4 border-t">
                                        <Button 
                                            onClick={() => saveBank(editing[bank.id])} 
                                            disabled={saving[bank.id]}
                                            className="min-w-[120px]"
                                        >
                                            {saving[bank.id] ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Bank Dialog */}
                <Dialog open={openCreate} onOpenChange={(o) => { if (!o) { setOpenCreate(false); clearCreateErrors(); resetCreate(); } else { setOpenCreate(true); } }}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add New Bank
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="create-name-en">Display Name (English) *</Label>
                                    <Input
                                        id="create-name-en"
                                        placeholder="Enter bank name in English"
                                        value={createData.display_name_en}
                                        onChange={e => setCreateData('display_name_en', e.target.value)}
                                        className="w-full"
                                    />
                                    {createErrors.display_name_en && (
                                        <p className="text-sm text-red-600">{createErrors.display_name_en}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-name-am">Display Name (Amharic)</Label>
                                        <Input
                                            id="create-name-am"
                                            placeholder="Amharic name"
                                            value={createData.display_name_am ?? ''}
                                            onChange={e => setCreateData('display_name_am', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-name-ti">Display Name (Tigrinya)</Label>
                                        <Input
                                            id="create-name-ti"
                                            placeholder="Tigrinya name"
                                            value={createData.display_name_ti ?? ''}
                                            onChange={e => setCreateData('display_name_ti', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-logo">Logo URL</Label>
                                    <Input
                                        id="create-logo"
                                        placeholder="https://example.com/logo.png"
                                        value={createData.logo_url ?? ''}
                                        onChange={e => setCreateData('logo_url', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-sort">Sort Order</Label>
                                    <Input
                                        id="create-sort"
                                        type="number"
                                        placeholder="Display order (lower numbers first)"
                                        value={createData.sort_order ?? ''}
                                        onChange={e => setCreateData('sort_order', Number(e.target.value) || '')}
                                        className="w-32"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenCreate(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!canCreate || creating}
                                onClick={() => {
                                    postCreate('/admin/banks', {
                                        onSuccess: () => {
                                            setOpenCreate(false);
                                            resetCreate();
                                        },
                                    });
                                }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Bank
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Bank Confirmation */}
                <AlertDialog open={deleteBankId !== null} onOpenChange={(open) => { if (!open) setDeleteBankId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                Delete Bank
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this bank? This action cannot be undone and will also delete all associated bank accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteBankId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (deleteBankId) {
                                        deleteBank(deleteBankId);
                                        setDeleteBankId(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Bank
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Delete Account Confirmation */}
                <AlertDialog open={deleteAccountId !== null} onOpenChange={(open) => { if (!open) setDeleteAccountId(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                Delete Account
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this bank account? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteAccountId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    if (deleteAccountId) {
                                        removeAccount(deleteAccountId.bankId, deleteAccountId.accountId);
                                        setDeleteAccountId(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}


