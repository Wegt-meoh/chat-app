"use client";

import Button from "@/components/ui/Button";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FacebookIcon } from "lucide-react";

type Props = {};

export default function Login({}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function mySignIn(provider: Parameters<typeof signIn>["0"]) {
    return signIn(provider, { callbackUrl: "/dashboard" });
  }

  async function loginWithGithub() {
    setIsLoading(true);
    try {
      await mySignIn("github");
    } catch (error) {
      // display error message to user
      toast.error("Something went wrong with your login.");
    } finally {
      //   setIsLoading(false);
    }
  }

  async function loginWithFacebook() {
    setIsLoading(true);
    try {
      await mySignIn("facebook");
    } catch (error) {
      // display error message to user
      toast.error("Something went wrong with your login.");
    } finally {
      //   setIsLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-100">
      <div className="py-12 px-4 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="w-full flex flex-col items-center max-w-md gap-y-4 bg-white min-h-[16rem] py-8 px-4">
          <Button
            isLoading={isLoading}
            type="button"
            className="max-w-sm mx-auto w-full"
            onClick={loginWithGithub}
          >
            {isLoading ? null : (
              <>
                <svg
                  className="mr-4 w-6 h-6"
                  viewBox="0 0 102 102"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    fill="#fff"
                  />
                </svg>
              </>
            )}
            Sign in with Github
          </Button>
          <Button
            isLoading={isLoading}
            type="button"
            className="max-w-sm mx-auto w-full bg-blue-500 hover:bg-blue-400"
            onClick={loginWithFacebook}
          >
            {isLoading ? null : (
              <FacebookIcon
                fill="white"
                className="mr-4 bg-blue-600 text-blue-600 rounded-sm"
              />
            )}
            Sign in with Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
