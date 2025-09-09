import { Form } from '@inertiajs/react'
import GuestProfileController from '@/actions/App/Http/Controllers/Guests/ProfileController'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import InputError from '@/components/input-error'

export default function AccountDeleteForm() {
    return (
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">Delete account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 dark:text-red-400">Delete account</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                            <p className="font-medium">Warning</p>
                            <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                        </div>
                    </div>

                    <Form {...GuestProfileController.destroy.form()} className="space-y-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="delete_password">Password</Label>
                                    <Input 
                                        id="delete_password" 
                                        name="password" 
                                        type="password" 
                                        placeholder="Enter your password to confirm" 
                                        autoComplete="current-password" 
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <DialogFooter>
                                    <Button variant="destructive" disabled={processing} asChild>
                                        <button type="submit">Delete account</button>
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}