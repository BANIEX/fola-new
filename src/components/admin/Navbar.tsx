import { useAccountState } from '@/zustand/account';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router';
import React, { Fragment } from "react";
import { Avatar } from "@nextui-org/react";
import Sidebar from './Sidebar';

const userNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Change User Roles', href: '/admin/users' },
    { name: 'Log out', href: '/auth/logout' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const router = useRouter();
    const account = useAccountState(state => state.account);
    return (
        <div>
            <Disclosure as="nav" className="-bg-gray-50 border-b-1 border-gray-200 -shadow-sm text-black">
                {({ open }) => (
                    <>
                        <div className="ml-0 px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div style={{ flexGrow: '1 1 auto', width: '100%' }} />
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <Menu.Button className="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    <Avatar name={account?.username ?? ""} />
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
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {userNavigation.map((item) => (
                                                        <Menu.Item key={item.name}>
                                                            {({ active }) => (
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        active ? 'bg-gray-100' : '',
                                                                        'block px-4 py-2 text-sm text-gray-700'
                                                                    )}
                                                                >
                                                                    {item.name}
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-black">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden w-full z-50 bg-white">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                <Sidebar embedded={true}/>
                            </div>
                            <div className="border-t border-gray-700 pb-3 pt-4">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <Avatar name={account?.username} />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-white">{account?.username}</div>
                                        <div className="text-sm font-medium leading-none text-gray-400">{account?.email}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {userNavigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>

            <div className="m-4 mb-2">
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                        {router.pathname.split('/').slice(1).map((route, index) => (
                            <li key={route} className="inline-flex items-center">
                                <a href="#" className="inline-flex capitalize items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                    {/* <svg class="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                    </svg> */}
                                    {index !== 0 && '/'} {router.pathname.split('/').slice(1).length -1 === index ? <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{route}</span> : route}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>
                <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white capitalize">{(router.pathname.split('/').pop() === "admin" ? "Dashboard" : router.pathname.split('/').pop())}</h2>
            </div>
        </div>
    )
}