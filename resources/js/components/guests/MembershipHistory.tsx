import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Eye, Calendar, User, Briefcase, DollarSign, Clock } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { update as updateMembership, deleteMethod as deleteMembership } from '@/routes/guest/membership';
import { toast } from 'sonner';

interface Membership {
    id: number;
    name: string;
    father_name?: string;
    gender?: string;
    age?: number;
    country?: string;
    region?: string;
    city?: string;
    woreda?: string;
    kebele?: string;
    profession?: string;
    education_level?: string;
    phone_number?: string;
    help_profession?: string[];
    donation_amount?: number;
    donation_currency?: string;
    donation_time?: string;
    property_type?: string;
    additional_property?: string;
    property_donation_time?: string;
    created_at: string;
    updated_at: string;
}

interface ProfessionalHelpCategory {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    translations?: Record<string, string>;
}

interface MembershipHistoryProps {
    memberships: Membership[];
    professionalHelpCategories: ProfessionalHelpCategory[];
}

export default function MembershipHistory({ memberships, professionalHelpCategories }: MembershipHistoryProps) {
    const { t } = useTranslations();
    const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Membership>>({});

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to get translated category name
    const getTranslatedCategoryName = (category: ProfessionalHelpCategory) => {
        const currentLanguage = document.documentElement.lang || 'en';
        
        if (currentLanguage === 'en') {
            return category.name;
        }
        
        const translations = category.translations || {};
        return translations[currentLanguage] || category.name;
    };

    const handleEdit = (membership: Membership) => {
        setEditingMembership(membership);
        setEditFormData(membership);
    };

    const handleSaveEdit = () => {
        if (editingMembership) {
            router.patch(updateMembership.url(editingMembership.id), editFormData, {
                onSuccess: () => {
                    setEditingMembership(null);
                    setEditFormData({});
                    toast.success('Membership application updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update membership application. Please try again.');
                }
            });
        }
    };

    const handleDelete = (membershipId: number) => {
        router.delete(deleteMembership.url(membershipId), {
            onSuccess: () => {
                toast.success('Membership application deleted successfully!');
            },
            onError: () => {
                toast.error('Failed to delete membership application. Please try again.');
            }
        });
    };

    const handleInputChange = (field: string, value: string | number) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleHelpProfessionChange = (selectedProfessions: string[]) => {
        setEditFormData(prev => ({
            ...prev,
            help_profession: selectedProfessions
        }));
    };

    if (memberships.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Membership History
                    </CardTitle>
                    <CardDescription>
                        Your membership applications will appear here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No membership applications found</p>
                        <p className="text-sm">Submit your first membership application to get started</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-6 w-6" />
                    Membership History
                </CardTitle>
                <CardDescription className="text-blue-100">
                    View and manage your membership applications
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {memberships.length === 0 ? (
                    <div className="text-center py-12 px-6">
                        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Applications Yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">You haven't submitted any membership applications yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800">
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Name
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            Profession
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Donation
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Submitted
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memberships.map((membership) => (
                                    <TableRow key={membership.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="space-y-1">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {membership.name}
                                                </div>
                                                {membership.father_name && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Father: {membership.father_name}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {membership.profession || 'Not specified'}
                                                </div>
                                                {membership.help_profession && membership.help_profession.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {Array.isArray(membership.help_profession) 
                                                            ? membership.help_profession.slice(0, 2).map((help, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                                    {help}
                                                                </Badge>
                                                            ))
                                                            : <Badge variant="secondary" className="text-xs">
                                                                {membership.help_profession}
                                                            </Badge>
                                                        }
                                                        {Array.isArray(membership.help_profession) && membership.help_profession.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{membership.help_profession.length - 2} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {membership.donation_amount ? (
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-green-600 dark:text-green-400">
                                                        {membership.donation_amount} {membership.donation_currency || 'ETB'}
                                                    </div>
                                                    {membership.donation_time && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {membership.donation_time}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 italic">No donation</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {formatDate(membership.created_at)}
                                                </div>
                                                {membership.updated_at !== membership.created_at && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        Updated: {formatDate(membership.updated_at)}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => handleEdit(membership)}
                                                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 dark:hover:text-blue-300"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Membership Application Details</DialogTitle>
                                                        <DialogDescription>
                                                            View and edit your membership application details
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="name">Full Name</Label>
                                                                <Input
                                                                    id="name"
                                                                    value={editFormData.name || ''}
                                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="father_name">Father's Name</Label>
                                                                <Input
                                                                    id="father_name"
                                                                    value={editFormData.father_name || ''}
                                                                    onChange={(e) => handleInputChange('father_name', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <Label htmlFor="gender">Gender</Label>
                                                                <Select value={editFormData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select gender" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="male">Male</SelectItem>
                                                                        <SelectItem value="female">Female</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="age">Age</Label>
                                                                <Input
                                                                    id="age"
                                                                    type="number"
                                                                    value={editFormData.age || ''}
                                                                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="phone_number">Phone Number</Label>
                                                                <Input
                                                                    id="phone_number"
                                                                    value={editFormData.phone_number || ''}
                                                                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="profession">Profession</Label>
                                                                <Input
                                                                    id="profession"
                                                                    value={editFormData.profession || ''}
                                                                    onChange={(e) => handleInputChange('profession', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="education_level">Education Level</Label>
                                                                <Input
                                                                    id="education_level"
                                                                    value={editFormData.education_level || ''}
                                                                    onChange={(e) => handleInputChange('education_level', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <Label htmlFor="country">Country</Label>
                                                                <Input
                                                                    id="country"
                                                                    value={editFormData.country || ''}
                                                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="region">Region</Label>
                                                                <Input
                                                                    id="region"
                                                                    value={editFormData.region || ''}
                                                                    onChange={(e) => handleInputChange('region', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="city">City</Label>
                                                                <Input
                                                                    id="city"
                                                                    value={editFormData.city || ''}
                                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="woreda">Woreda</Label>
                                                                <Input
                                                                    id="woreda"
                                                                    value={editFormData.woreda || ''}
                                                                    onChange={(e) => handleInputChange('woreda', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="kebele">Kebele</Label>
                                                                <Input
                                                                    id="kebele"
                                                                    value={editFormData.kebele || ''}
                                                                    onChange={(e) => handleInputChange('kebele', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Label>How do you want to help the organization professionally?</Label>
                                                            <div className="text-xs text-muted-foreground mt-1 mb-2">
                                                                💡 Select multiple options that apply to you
                                                            </div>
                                                            <MultiSelect
                                                                options={professionalHelpCategories.map(category => ({
                                                                    value: getTranslatedCategoryName(category),
                                                                    label: getTranslatedCategoryName(category)
                                                                }))}
                                                                value={editFormData.help_profession || []}
                                                                onChange={handleHelpProfessionChange}
                                                                placeholder="Select professional help areas..."
                                                                className="w-full"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <Label htmlFor="donation_amount">Donation Amount</Label>
                                                                <Input
                                                                    id="donation_amount"
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={editFormData.donation_amount || ''}
                                                                    onChange={(e) => handleInputChange('donation_amount', parseFloat(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="donation_currency">Currency</Label>
                                                                <Select value={editFormData.donation_currency || ''} onValueChange={(value) => handleInputChange('donation_currency', value)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select currency" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="ETB">ETB</SelectItem>
                                                                        <SelectItem value="USD">USD</SelectItem>
                                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="donation_time">Donation Time</Label>
                                                                <Input
                                                                    id="donation_time"
                                                                    value={editFormData.donation_time || ''}
                                                                    onChange={(e) => handleInputChange('donation_time', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label htmlFor="property_type">Property Type</Label>
                                                                <Input
                                                                    id="property_type"
                                                                    value={editFormData.property_type || ''}
                                                                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor="property_donation_time">Property Donation Time</Label>
                                                                <Input
                                                                    id="property_donation_time"
                                                                    value={editFormData.property_donation_time || ''}
                                                                    onChange={(e) => handleInputChange('property_donation_time', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="additional_property">Additional Property Details</Label>
                                                            <Textarea
                                                                id="additional_property"
                                                                value={editFormData.additional_property || ''}
                                                                onChange={(e) => handleInputChange('additional_property', e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setEditingMembership(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button onClick={handleSaveEdit}>
                                                            Save Changes
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Membership Application</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this membership application? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(membership.id)}
                                                            className="bg-destructive text-white hover:bg-destructive/90"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                )}
            </CardContent>
        </Card>
    );
}
