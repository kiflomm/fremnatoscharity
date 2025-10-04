import { Form } from '@inertiajs/react'
import { Transition } from '@headlessui/react'
import { usePage } from '@inertiajs/react'
import { LogOut } from 'lucide-react'
import type { SharedData } from '@/types'
import GuestProfileController from '@/actions/App/Http/Controllers/Guests/ProfileController'
import { logout } from '@/routes'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import AccountDeleteForm from '@/components/guests/AccountDeleteForm'
import PasswordUpdateForm from '@/components/guests/PasswordUpdateForm'
import { Separator } from '../ui/separator'

export default function ProfileInfoForm() {
    const { auth } = usePage<SharedData>().props

    return (
        <Card className="border-neutral-200/70 dark:border-neutral-800/60 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Profile information</CardTitle>
                        <CardDescription>Update your display name</CardDescription>
                    </div>
                    <Form {...logout.form()}>
                        <Button variant="outline" size="sm" asChild>
                            <button type="submit" className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </Button>
                    </Form>
                </div>
            </CardHeader>
            <CardContent>
                <Form
                    {...GuestProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                       <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <CardFooter className="px-0">
                                <div className="flex items-center gap-3">
                                    <Button disabled={processing}>Save</Button>
                                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300">Saved</p>
                                    </Transition>
                                </div>
                            </CardFooter>
                            <Separator/>
                            <div className="flex items-center justify-between gap-3"> 
                            <PasswordUpdateForm />
                            <AccountDeleteForm />
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    )
}


