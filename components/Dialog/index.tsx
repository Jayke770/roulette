import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { RiLoader5Fill } from 'react-icons/ri'
type props = {
    icon?: string,
    open: boolean,
    onClose: Function | any,
    title: string,
    message: string,
    backdrop: boolean,
    loader?: any,
    showCancelButton?: boolean,
    showConfirmButton?: boolean
}
export default function _Dialog(props: props) {
    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={props.onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/70 transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                                <div className="bg-white dark:bg-zinc-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        {props.icon === 'error' && (
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                        )}
                                        {props.icon === 'success' && (
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ShieldCheckIcon className="h-6 w-6 text-teal-600" aria-hidden="true" />
                                            </div>
                                        )}
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-zinc-300">
                                                {props.title}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 dark:text-zinc-500">
                                                    {props.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    {props.showCancelButton && (
                                        <button
                                            onClick={props.onClose}
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 sm:ml-3 sm:w-auto sm:text-sm">
                                            Close
                                        </button>
                                    )}
                                    {props.loader && (
                                        <div className='flex justify-center items-center'>
                                            <RiLoader5Fill className='w-8 h-8 text-teal-600 animate-spin' />
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
