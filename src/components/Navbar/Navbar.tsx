/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useMemo } from "react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Translations from "@/translate/en.json";
import { Avatar } from "@nextui-org/react";
import Search from "../Search/Search";
import { useSearchState } from "@/zustand/product";
import { useAccountState } from "@/zustand/account";
import { useRouter } from "next/router";
import Link from "next/link";

const navigation = [
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Cart", href: "/cart" },
  // { name: "Cart", href: "/cart" },
];
interface NavbarProps {
  shadow?: boolean;
}

const SearchBar = () => {
  const setQuery = useSearchState((state) => state.setQuery);
  const query = useSearchState((state) => state.query);
  const [open, toggleOpen] = useSearchState((state) => [
    state.open,
    state.toggleOpen,
  ]);

  return useMemo(
    () => (
      <>
        <div
          onClick={toggleOpen}
          className={`fixed bottom-0 top-0 h-[100vh] w-[100vw] inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
            open ? "block" : "hidden"
          }`}
        />
        <>
          <div className="w-full md:xl:ml-5 px-4 md:xl:px-0 md:xl:mr-5 -md:lg:max-w-[30rem] -max-w-[100%] md:xl:pb-0 pb-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                value={query}
                tabIndex={-1}
                autoFocus={false}
                autoComplete="off"
                onFocus={() => (!open ? toggleOpen() : null)}
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Search Products..."
                required
              />
            </div>
          </div>
          {/* <div className={`overflow-hidden ${open ? "block" : "hidden"} md:xl:pr-5 ml-0 md:xl:ml-5 md:xl:px-0 md:xl:mx-0 md:xl:w-max l-0 r-0 px-4 w-full absolute md:xl:mt-[5rem]`}>
          <Search />
        </div> */}
        </>
      </>
    ),
    [open, query, setQuery, toggleOpen]
  );
};

const NavbarComponent: FC<NavbarProps> = ({ shadow }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const account = useAccountState((state) => state.account);
  const [top, setTop] = useState(true);
  const [isProfileNameHovered, setIsProfileNameHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  const titleCaseConverter = (word: string): string =>
    word.charAt(0).toUpperCase() + word.slice(1);

  return useMemo(
    () => (
      <div className="Navbar">
        <header
          className={`fixed border-b-1 border-dark bg-white inset-x-0 top-0 z-50 ${
            !top && shadow ? "drop-shadow-lg" : ""
          }`}
        >
          <nav
            className="flex items-center justify-between p-3 lg:px-8 lg:justify-around"
            aria-label="Global"
          >
            <div className="flex lg:w-1/4">
              <a href="/" className="-m-1.5 p-1.5 ">
                <img
                  src="/static/ranforte-logo.png"
                  className="w-[4rem] h-auto"
                  alt="ranforte"
                />
                {/* <span className="text-black text-bold">{Translations['Meta:StoreName']}</span> */}
              </a>
            </div>
            <div className="flex  md:hidden">
              <Link href="/cart">
                <ShoppingCartIcon
                  className="h-6 w-6 mr-12"
                  aria-hidden="true"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="right-nav hidden md:flex md:justify-around md:w-3/5 lg:w-1/2">
              <div className="hidden left-right-nav md:flex md:w-2/3  md:justify-around lg:flex lg:w-2/3 lg:justify-around">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900 lg:text-base"
                  >
                    {item.name}
                  </a>
                ))}
                {account && (
                  <>
                    {/* <a
                      href={"/cart"}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cart
                    </a> */}
                    <a
                      href={"/orders"}
                      className="text-sm font-semibold leading-6 text-gray-900 lg:text-base"
                    >
                      Orders
                    </a>
                  </>
                )}
                <div style={{ flexGrow: "1 1 auto" }} />
              </div>
              <div className="hidden right-right-nav md:flex md:ml-2 md:justify-end">
                {!account ? (
                  <a
                    href="/auth/login"
                    className="text-sm font-semibold leading-6 text-gray-900 lg:text-base"
                  >
                    Log in <span aria-hidden="true">&rarr;</span>
                  </a>
                ) : (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      setIsProfileNameHovered(true);
                    }}
                    onMouseLeave={() => {
                      setIsProfileNameHovered(false);
                    }}
                  >
                    {/* Nav account icon on large screens */}
                    <div className="flex items-center">
                      <Avatar size="sm" />

                      <div>
                        {"\u00A0"}
                        {"\u00A0"}
                        {titleCaseConverter(account.firstName)}
                        <br />
                        {account.type === "admin" && (
                          <a href="/admin">
                            <span className="text-black">
                              <u>Admin</u>
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                    {/* <a
                      href="/auth/logout"
                      className="text-sm font-semibold leading-6 ml-[2rem] text-gray-900"
                    >
                      Log out <span aria-hidden="true">&rarr;</span>
                    </a> */}
                    {isProfileNameHovered && (
                      <div
                        className="absolute top-full left-0  w-32 bg-white shadow-lg border border-gray-200 rounded-md z-10"
                        onMouseEnter={() => setIsProfileNameHovered(true)}
                        onMouseLeave={() => setIsProfileNameHovered(false)}
                      >
                        <a
                          href="/auth/logout"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                          Log out <span aria-hidden="true">&rarr;</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>
          <Dialog
            as="div"
            className="md:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="headless-nav flex items-center justify-between">
                <div>
                  {account && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar size="sm" />{" "}
                      <div>
                        {titleCaseConverter(account.firstName)}
                        <br />
                        {account.type === "admin" && (
                          <a href="/admin">
                            <span className="text-black">
                              <u>Admin</u>
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* <a href="#logonearx" className="-m-1.5 p-1.5 sm:invisible">
                  <img
                    src="/static/ranforte-logo.png"
                    className="w-[4rem] h-auto"
                  />
                 
                </a> */}

                <div className="flex">
                  {/* <ShoppingCartIcon
                    className="h-6 w-6 mr-12"
                    aria-hidden="true"
                  /> */}

                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="headless-menu flow-root">
                <div className="divide-y divide-gray-500/10">
                  <div className="border-solid space-y-2 py-6">
                    {navigation.map(
                      (item) =>
                        item.name !== "Cart" && (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </a>
                        )
                    )}
                  </div>
                  <div className="py-6">
                    {account && (
                      <>
                        {/* <a
                          href={"/cart"}
                          className="block rounded-lg px-3- py-2.5 text-base font-semibold justify-left flex items-center leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          <ShoppingCartIcon
                            className="h-6 w-6 mr-4"
                            aria-hidden="true"
                          />{" "}
                          {"Cart"}
                        </a> */}
                        <a
                          href={"/orders"}
                          className="block rounded-lg px-3- py-2.5 text-base font-semibold justify-left flex items-center leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          Orders
                        </a>
                      </>
                    )}
                  </div>
                  <div className="py-6">
                    {!account ? (
                      <a
                        href="/auth/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        Log in <span aria-hidden="true">&rarr;</span>
                      </a>
                    ) : (
                      <div className="text-black">
                        {/* <div className="flex items-center gap-2 mb-1">
                          <Avatar />{" "}
                          <div>
                            k{titleCaseConverter(account.firstName)}
                            <br />
                            {account.type === "admin" && (
                              <a href="/admin">
                                <span className="text-black">
                                  <u>Admin</u>
                                </span>
                              </a>
                            )}
                          </div>
                        </div> */}
                        <a
                          href="/auth/logout"
                          className="block text-center text-red-500 rounded-lg -px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          Log out <span aria-hidden="true">&rarr;</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
      </div>
    ),
    [
      account,
      mobileMenuOpen,
      router.pathname,
      shadow,
      top,
      isProfileNameHovered,
    ]
  );
};

export default NavbarComponent;
