import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function Navbar({ userid }: { userid: string }) {
    return (
        <Disclosure as="nav" className="translucent sticky top-0 bg-zinc-900">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex flex-1 items-center sm:items-stretch justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-8 w-auto"
                                        src="/assets/images/team-logo.png"
                                        alt="logo" />
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <button
                                    type="button"
                                    className="rounded-full transition-all bg-zinc-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-teamdao-primary focus:ring-offset-2 focus:ring-offset-gray-800" >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src={`/api/profile/${userid}`}
                                                alt={userid}
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link passHref href={'#'}>
                                                        <a
                                                            className={classNames(active && 'bg-gray-100 dark:bg-zinc-700', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300')}>
                                                            Your Profile
                                                        </a>
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link passHref href={'#'}>
                                                        <a
                                                            className={classNames(active && 'bg-gray-100 dark:bg-zinc-700', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300')}>
                                                            Settings
                                                        </a>
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}