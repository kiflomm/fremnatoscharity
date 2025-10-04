import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader as TableHeaderEl, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface MembershipRow {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  help_profession?: string;
  donation_amount?: number;
  donation_currency?: string;
  created_at: string;
}

export default function AdminMemberships({ memberships }: { memberships: { data: MembershipRow[] } }) {
  const [query, setQuery] = useState('');
  const rows = memberships?.data ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.email?.toLowerCase().includes(q) ?? false) ||
      (r.phone_number?.toLowerCase().includes(q) ?? false) ||
      (r.help_profession?.toLowerCase().includes(q) ?? false)
    );
  }, [rows, query]);

  return (
    <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Memberships', href: '/admin/memberships' }]}> 
      <Head title="Admin - Memberships" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Donor Registrations</CardTitle>
            <CardDescription>Review and manage Donors submissions</CardDescription>
            <div className="flex items-center gap-2">
              <Input placeholder="Search by name, email, phone, help..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full sm:w-[320px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeaderEl>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Help</TableHead>
                    <TableHead>Donation</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeaderEl>
                <TableBody>
                  {filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.email ?? '-'}</TableCell>
                      <TableCell>{m.phone_number ?? '-'}</TableCell>
                      <TableCell>{m.help_profession ?? '-'}</TableCell>
                      <TableCell>
                        {m.donation_amount ? (
                          <Badge variant="secondary">{m.donation_amount} {m.donation_currency}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{new Date(m.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            router.delete(`/admin/memberships/${m.id}`,
                              {
                                preserveScroll: true,
                                onSuccess: () => toast.success('Membership deleted successfully'),
                                onError: () => toast.error('Failed to delete membership'),
                              }
                            )
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


