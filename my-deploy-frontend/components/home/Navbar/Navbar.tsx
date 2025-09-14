"use client";
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import Signdialog from "./Signdialog";
import Registerdialog from "./Registerdialog";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', current: true },
  { name: 'Services', href: '#services', current: false },
  { name: 'About', href: '#about', current: false },
  { name: 'Project', href: '#project', current: false },
  { name: 'Help', href: '/', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${hasScrolled ? 'shadow-md' : ''}`}>
      <div className="mx-auto max-w-7xl px-6 lg:py-4 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

            {/* LOGO */}
            <div className="flex flex-shrink-0 items-center">
              <img
                className="block h-12 w-40 lg:hidden"
                src={'/assets/logoApp.png'}
                alt="dsign-logo"
                width={28}
                height={28}
              />
              <img
                className="hidden w-44 lg:block"
                src={'/assets/logoApp.png'}
                alt="dsign-logo"
                width={28}
                height={28}
              />
            </div>

            {/* LINKS */}
            <div className="hidden lg:block m-auto">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'text-black hover:opacity-100'
                        : 'hover:text-black hover:opacity-100',
                      'px-3 py-4 text-lg font-normal opacity-75 space-links'
                    )}
                    aria-current={item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SIGNIN / REGISTER */}
          <Signdialog />
          <Registerdialog />

          {/* MOBILE MENU ICON */}
          <div className="block lg:hidden">
            <Bars3Icon
              className="block h-6 w-6 cursor-pointer"
              aria-hidden="true"
              onClick={() => setIsOpen(true)}
            />
          </div>

          {/* DRAWER */}
          <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
            <Drawerdata />
          </Drawer>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
