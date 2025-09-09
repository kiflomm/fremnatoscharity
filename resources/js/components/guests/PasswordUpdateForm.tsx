import { useRef } from 'react'
import { Form } from '@inertiajs/react'
import { Transition } from '@headlessui/react'
import GuestPasswordController from '@/actions/App/Http/Controllers/Guests/PasswordController'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import InputError from '@/components/input-error'

export default function PasswordUpdateForm() {
    const passwordInput = useRef<HTMLInputElement>(null)
    const currentPasswordInput = useRef<HTMLInputElement>(null)

    return (
        <div className="space-y-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Change password</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new secure password.
                        </DialogDescription>
                    </DialogHeader>
                    <Form
                        {...GuestPasswordController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={["password", "password_confirmation", "current_password"]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus()
                            if (errors.current_password) currentPasswordInput.current?.focus()
                        }}
                        className="space-y-4"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">Current password</Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Current password"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">New password</Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="New password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirm password</Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Confirm password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <DialogFooter>
                                    <div className="flex items-center gap-3">
                                        <Button disabled={processing}>Save password</Button>
                                        <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                            <p className="text-sm text-neutral-600 dark:text-neutral-300">Saved</p>
                                        </Transition>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}