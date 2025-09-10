import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, Banknote, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
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

    const saveBank = (bank: Bank) => {
        router.put(`/admin/banks/${bank.id}`, {
            display_name_en: bank.display_name_en,
            display_name_am: bank.display_name_am,
            display_name_ti: bank.display_name_ti,
            logo_url: bank.logo_url,
            sort_order: bank.sort_order,
        });

        // Create any newly added accounts
        bank.accounts
            .filter(a => String(a.id).startsWith('-') && a.account_number.trim())
            .forEach(a => {
                router.post(`/admin/banks/${bank.id}/accounts`, {
                    account_number: a.account_number,
                    sort_order: a.sort_order,
                });
            });
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Manage Banks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Banknote className="h-6 w-6" /> Manage Banks
                        </h1>
                        <p className="text-muted-foreground">Create banks, edit details, and manage accounts.</p>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => setOpenCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add bank
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {banks.map(bank => (
                        <Card key={bank.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {editing[bank.id]?.logo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={editing[bank.id]?.logo_url} alt="logo" className="h-8 w-8 rounded object-contain bg-muted" />
                                        ) : (
                                            <div className="h-8 w-8 rounded bg-muted text-muted-foreground grid place-items-center">
                                                <ImageIcon className="h-4 w-4" />
                                            </div>
                                        )}
                                        <CardTitle className="cursor-pointer" onClick={() => toggleExpand(bank.id)}>
                                            {editing[bank.id]?.display_name_en}
                                        </CardTitle>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="outline">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => saveBank(editing[bank.id])}>
                                                <Save className="h-4 w-4 mr-2" /> Save changes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => addAccount(bank.id)}>
                                                <Plus className="h-4 w-4 mr-2" /> Add account
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600" onClick={() => deleteBank(bank.id)}>
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete bank
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Display name (EN)"
                                        value={editing[bank.id]?.display_name_en ?? ''}
                                        onChange={e => updateBankField(bank.id, 'display_name_en', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Display name (AM)"
                                        value={editing[bank.id]?.display_name_am ?? ''}
                                        onChange={e => updateBankField(bank.id, 'display_name_am', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Display name (TI)"
                                        value={editing[bank.id]?.display_name_ti ?? ''}
                                        onChange={e => updateBankField(bank.id, 'display_name_ti', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Logo URL"
                                        value={editing[bank.id]?.logo_url ?? ''}
                                        onChange={e => updateBankField(bank.id, 'logo_url', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Sort order"
                                        type="number"
                                        value={editing[bank.id]?.sort_order ?? ''}
                                        onChange={e => updateBankField(bank.id, 'sort_order', Number(e.target.value))}
                                    />
                                </div>

                                <Separator />

                                {expanded[bank.id] !== false && (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Accounts</div>
                                        <div className="hidden sm:grid grid-cols-[1fr_120px_40px] gap-2 px-1 text-xs text-muted-foreground">
                                            <div>Account number</div>
                                            <div>Order</div>
                                            <div></div>
                                        </div>
                                        <div className="space-y-2">
                                            {editing[bank.id]?.accounts?.map(acc => (
                                                <div key={acc.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_40px] gap-2 items-center">
                                                    <Input
                                                        placeholder="Account number"
                                                        value={acc.account_number}
                                                        onChange={e => updateAccountField(bank.id, acc.id, 'account_number', e.target.value)}
                                                    />
                                                    <Input
                                                        placeholder="Order"
                                                        type="number"
                                                        value={acc.sort_order ?? ''}
                                                        onChange={e => updateAccountField(bank.id, acc.id, 'sort_order', Number(e.target.value))}
                                                    />
                                                    <Button size="icon" variant="destructive" onClick={() => removeAccount(bank.id, acc.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button onClick={() => saveBank(editing[bank.id])}>
                                        <Save className="h-4 w-4 mr-2" /> Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={openCreate} onOpenChange={(o) => { if (!o) { setOpenCreate(false); clearCreateErrors(); resetCreate(); } else { setOpenCreate(true); } }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add bank</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                                placeholder="Display name (EN)"
                                value={createData.display_name_en}
                                onChange={e => setCreateData('display_name_en', e.target.value)}
                            />
                            <Input
                                placeholder="Display name (AM)"
                                value={createData.display_name_am ?? ''}
                                onChange={e => setCreateData('display_name_am', e.target.value)}
                            />
                            <Input
                                placeholder="Display name (TI)"
                                value={createData.display_name_ti ?? ''}
                                onChange={e => setCreateData('display_name_ti', e.target.value)}
                            />
                            <Input
                                placeholder="Logo URL"
                                value={createData.logo_url ?? ''}
                                onChange={e => setCreateData('logo_url', e.target.value)}
                            />
                            <Input
                                placeholder="Sort order"
                                type="number"
                                value={createData.sort_order ?? ''}
                                onChange={e => setCreateData('sort_order', Number(e.target.value))}
                            />
                        </div>
                        <DialogFooter>
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
                            >
                                <Plus className="h-4 w-4 mr-2" /> Create bank
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}


