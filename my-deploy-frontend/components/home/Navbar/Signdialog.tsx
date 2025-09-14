"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hook/auth/useAuth";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

const Signin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await signIn(data);
      if (response?.success) {
        toast.success("Logged in successfully!");
        closeModal();
        router.replace("/dashboard");
      } else {
        toast.error(response?.message || "Login failed");
      }
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
      <ToastContainer
        containerId="containerA"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0">
        <button
          type="button"
          data-testid="open-signin"
          className="text-lg text-blue font-medium px-4 py-2"
          onClick={openModal}
        >
          Sign In
        </button>
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
                  <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                      <img
                        className="mx-auto h-12 w-auto"
                        src="/assets/logoApp.png"
                        alt="Company"
                      />
                      <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                      </h2>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="Email address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          placeholder="Password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="remember-me"
                            className="h-4 w-4 border-gray-300 rounded"
                          />
                          Remember me
                        </label>
                        <a href="#" className="text-indigo-600 hover:underline">
                          Forgot your password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        className="relative w-full flex justify-center rounded-md bg-blue py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <LockClosedIcon
                            className="h-5 w-5 text-indigo-500"
                            aria-hidden="true"
                          />
                        </span>
                        Sign in
                      </button>
                    </form>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      >
                        Got it, thanks!
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

export default Signin;
