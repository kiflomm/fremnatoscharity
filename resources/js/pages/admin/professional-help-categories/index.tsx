import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Toaster } from '@/components/ui/sonner';

interface ProfessionalHelpCategory {
    id: number;
    name: string;
    description?: string;
    translations?: Record<string, string>;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface PaginatedCategories {
    data: ProfessionalHelpCategory[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface ProfessionalHelpCategoriesProps {
    categories: PaginatedCategories;
}

export default function ProfessionalHelpCategories({ categories }: ProfessionalHelpCategoriesProps) {
    const [editingCategory, setEditingCategory] = useState<ProfessionalHelpCategory | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<ProfessionalHelpCategory>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        description: '',
        translations: {} as Record<string, string>,
        is_active: true,
        sort_order: 0,
    });

    const handleEdit = (category: ProfessionalHelpCategory) => {
        setEditingCategory(category);
        setEditFormData(category);
    };

    const handleSaveEdit = () => {
        if (!editingCategory || !editFormData.name?.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        router.patch(`/admin/professional-help-categories/${editingCategory.id}`, editFormData, {
            onSuccess: () => {
                setEditingCategory(null);
                setEditFormData({});
                setIsSubmitting(false);
                toast.success('Category updated successfully!');
                // Redirect back to the categories list
                router.get('/admin/professional-help-categories');
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to update category. Please try again.');
            }
        });
    };

    const handleCreate = () => {
        if (!createFormData.name.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        router.post('/admin/professional-help-categories', createFormData, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                setCreateFormData({
                    name: '',
                    description: '',
                    translations: {},
                    is_active: true,
                    sort_order: 0,
                });
                setIsSubmitting(false);
                toast.success('Category created successfully!');
                // Redirect back to the categories list
                router.get('/admin/professional-help-categories');
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to create category. Please try again.');
            }
        });
    };

    const handleDelete = (categoryId: number) => {
        router.delete(`/admin/professional-help-categories/${categoryId}`, {
            onSuccess: () => {
                toast.success('Category deleted successfully!');
                // Redirect back to the categories list
                router.reload({ only: ['categories'] });
                // router.get('/admin/professional-help-categories');
            },
            onError: () => {
                toast.error('Failed to delete category. Please try again.');
            }
        });
    };

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreateInputChange = (field: string, value: string | number | boolean) => {
        setCreateFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTranslationChange = (locale: string, value: string, isCreate: boolean = true) => {
        if (isCreate) {
            setCreateFormData(prev => ({
                ...prev,
                translations: {
                    ...prev.translations,
                    [locale]: value
                }
            }));
        } else {
            setEditFormData(prev => ({
                ...prev,
                translations: {
                    ...(prev.translations || {}),
                    [locale]: value
                }
            }));
        }
    };

    const handlePageChange = (page: number) => {
        router.get(`/admin/professional-help-categories?page=${page}`);
    };

    return (
        <AppLayout>
            <Head title="Professional Help Categories" />
            
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Professional Help Categories</h1>
                            <p className="text-muted-foreground mt-2">
                                Manage the professional help categories that users can select from
                            </p>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Category</DialogTitle>
                                    <DialogDescription>
                                        Create a new professional help category
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="create_name">Name</Label>
                                        <Input
                                            id="create_name"
                                            value={createFormData.name}
                                            onChange={(e) => handleCreateInputChange('name', e.target.value)}
                                            placeholder="Category name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="create_description">Description</Label>
                                        <Textarea
                                            id="create_description"
                                            value={createFormData.description}
                                            onChange={(e) => handleCreateInputChange('description', e.target.value)}
                                            placeholder="Category description"
                                            rows={3}
                                        />
                                    </div>
                                    
                                    {/* Translation Fields */}
                                    <div>
                                        <Label>Translations</Label>
                                        <div className="space-y-2 mt-2">
                                            <div>
                                                <Label htmlFor="create_translation_am" className="text-sm text-muted-foreground">Amharic</Label>
                                                <Input
                                                    id="create_translation_am"
                                                    value={createFormData.translations?.am || ''}
                                                    onChange={(e) => handleTranslationChange('am', e.target.value, true)}
                                                    placeholder="Amharic translation"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="create_translation_tg" className="text-sm text-muted-foreground">Tigrinya</Label>
                                                <Input
                                                    id="create_translation_tg"
                                                    value={createFormData.translations?.tg || ''}
                                                    onChange={(e) => handleTranslationChange('tg', e.target.value, true)}
                                                    placeholder="Tigrinya translation"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="create_sort_order">Sort Order</Label>
                                            <Input
                                                id="create_sort_order"
                                                type="number"
                                                value={createFormData.sort_order}
                                                onChange={(e) => handleCreateInputChange('sort_order', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="create_is_active"
                                                checked={createFormData.is_active}
                                                onCheckedChange={(checked) => handleCreateInputChange('is_active', checked)}
                                            />
                                            <Label htmlFor="create_is_active">Active</Label>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreate} disabled={isSubmitting || !createFormData.name.trim()}>
                                        {isSubmitting ? 'Creating...' : 'Create Category'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Categories ({categories.total})
                        </CardTitle>
                        <CardDescription>
                            Manage professional help categories for membership applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Sort Order</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.data.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate">
                                                    {category.description || 'No description'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={category.is_active ? "default" : "secondary"}>
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {category.sort_order}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Category</DialogTitle>
                                                                <DialogDescription>
                                                                    Update the category details
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label htmlFor="edit_name">Name</Label>
                                                                    <Input
                                                                        id="edit_name"
                                                                        value={editFormData.name || ''}
                                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="edit_description">Description</Label>
                                                                    <Textarea
                                                                        id="edit_description"
                                                                        value={editFormData.description || ''}
                                                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                                                        rows={3}
                                                                    />
                                                                </div>
                                                                
                                                                {/* Translation Fields */}
                                                                <div>
                                                                    <Label>Translations</Label>
                                                                    <div className="space-y-2 mt-2">
                                                                        <div>
                                                                            <Label htmlFor="edit_translation_am" className="text-sm text-muted-foreground">Amharic</Label>
                                                                            <Input
                                                                                id="edit_translation_am"
                                                                                value={editFormData.translations?.am || ''}
                                                                                onChange={(e) => handleTranslationChange('am', e.target.value, false)}
                                                                                placeholder="Amharic translation"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <Label htmlFor="edit_translation_tg" className="text-sm text-muted-foreground">Tigrinya</Label>
                                                                            <Input
                                                                                id="edit_translation_tg"
                                                                                value={editFormData.translations?.tg || ''}
                                                                                onChange={(e) => handleTranslationChange('tg', e.target.value, false)}
                                                                                placeholder="Tigrinya translation"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label htmlFor="edit_sort_order">Sort Order</Label>
                                                                        <Input
                                                                            id="edit_sort_order"
                                                                            type="number"
                                                                            value={editFormData.sort_order || 0}
                                                                            onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Switch
                                                                            id="edit_is_active"
                                                                            checked={editFormData.is_active || false}
                                                                            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                                                                        />
                                                                        <Label htmlFor="edit_is_active">Active</Label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setEditingCategory(null)} disabled={isSubmitting}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleSaveEdit} disabled={isSubmitting || !editFormData.name?.trim()}>
                                                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(category.id)}
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
                        
                        {/* Pagination Controls */}
                        {categories.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Showing {categories.from} to {categories.to} of {categories.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(categories.current_page - 1)}
                                        disabled={categories.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    
                                    <div className="flex items-center gap-1">
                                        {(() => {
                                            const maxVisiblePages = 5;
                                            const startPage = Math.max(1, categories.current_page - Math.floor(maxVisiblePages / 2));
                                            const endPage = Math.min(categories.last_page, startPage + maxVisiblePages - 1);
                                            const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
                                            
                                            return pages.map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === categories.current_page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ));
                                        })()}
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(categories.current_page + 1)}
                                        disabled={categories.current_page === categories.last_page}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Toaster position="top-right" richColors />
        </AppLayout>
    );
}
