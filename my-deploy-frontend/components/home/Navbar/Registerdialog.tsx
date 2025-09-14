"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/hook/auth/useAuth';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signUp, error } = useAuth();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await signUp(data);
      if (error) throw new Error(error);
      toast.success("Registration successful!");
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error: " + err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:pr-0">
        <div className="hidden lg:block">
          <button
            className="text-blue text-lg font-medium ml-9 py-5 px-16 transition duration-150 ease-in-out leafbutton bg-lightblue hover:text-white hover:bg-blue"
            onClick={openModal}
          >
            Sign up
          </button>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full space-y-8">
                    <div className="text-center">
                      <img className="mx-auto h-12 w-auto" src="/assets/logoApp.png" alt="Logo" />
                      <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Register your account
                      </h2>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <input
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          placeholder="Your name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="Email address"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          placeholder="Password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="group relative w-full flex justify-center rounded-md bg-blue py-2 px-4 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                        </span>
                        Register Now
                      </button>
                    </form>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Register;
