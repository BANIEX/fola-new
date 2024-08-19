import React from 'react'
import en from "@/translate/en.json";
import ErrorBoundary from '@/components/ErrorBoundary';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@nextui-org/react';
import { usePasswordResetState, useSignUpState } from "@/zustand/auth";
import { useRouter } from 'next/router';
import { IUser } from "@/types/auth/user";
import { useSnackbar, SnackbarProvider } from "notistack";
import Link from 'next/link';

const IForgot = () => {
    // const [state, setState] = useState<'pending' | 'failed' | 'unsubmitted' | 'submitted'>('unsubmitted');
    const router = useRouter();
    const signInState = usePasswordResetState();
    const { enqueueSnackbar } = useSnackbar();
   

    // console.log(signInState);
  const isValidEmail = (email: string): boolean =>  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const forgotPassword = async () => {
    console.log("forgot password handler");
    // signInState.setEmail(e.target.value);
    console.log(signInState);
    signInState.setButtonLoading(true);
    console.log(signInState);

    // const timedFunction = async () => {
      try {
        console.log("trying here");
        const forgotPasswordFeedback = await(
          await fetch(`/api/auth/forgot-password`, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: signInState.email,
            }),
          })
        ).json();

        console.log("after the request");

        console.log(forgotPasswordFeedback);
        if (forgotPasswordFeedback) {
            signInState.setButtonLoading(false);
            enqueueSnackbar(
              `If you have an account with us. You would receive a reset password mail shortly`
            );
            return
        }

        throw new Error("API call error")

        
      } catch (error) {
        signInState.setButtonLoading(false);

        enqueueSnackbar(`Error. Please try again later`);

        return
      }
    // };

    // setTimeout(timedFunction, 3000)


    

    
  }


   

    return (
      <div className="bg-white overflow-hidden min-h-[100] flex flex-col items-center justify-center min-h-screen md:py-2">
        <SnackbarProvider />
        <main className="flex relative items-center w-full px-2 md:px-20">
          <div className="hidden md:inline-flex flex-col flex-1 space-y-1">
            <p className="text-6xl text-black font-bold">
              {en["Meta:StoreName"]}
            </p>
            <p className="font-medium text-lg leading-1 text-gray-500">
              {en["Meta:StoreTagline"]}
            </p>
          </div>
          <div className="bg-white z-[100] p-10 md:lg:rounded-2xl md:xl:shadow-2xl flex flex-col w-full md:xl:w-1/3 md:xl:h-1/3 w-[100vw] h-[100vh] items-center max-w-4xl transition duration-1000 ease-out">
            <div className="bg-white flex min-w-full min-h-full flex-1 flex-col justify-center">
              <div className="sm:mx-auto mt-[-5rem] md:xl:mt-0 mb-[2.5rem] sm:w-full sm:max-w-sm">
                <span className="text-lg flex text-gray-800 text-bold">
                  <span className="md:xl:hidden block">
                    {en["Meta:StoreName"]}
                    <span className="mx-2">/</span>
                  </span>
                  <span className="text-black font-bold">
                    Change password to your account
                  </span>
                </span>
                <p className="text-md text-gray-500">{en["Login:Subtitle"]}</p>
              </div>
              <hr />
              <div className="mt-[2.5rem] sm:mx-auto sm:w-full sm:max-w-sm">
                <ErrorBoundary
                  fallback={<p>There was an error while submitting the form</p>}
                >
                  <div>
                    <Input
                      id="email"
                      name="email"
                      label="Email"
                      autoComplete="email"
                      required
                      isDisabled={
                        signInState.loading.email || signInState.readonly
                      }
                      onFocus={signInState.clearEmailError}
                      onBlur={signInState.validateEmail}
                      value={signInState.email}
                      onChange={(e) => signInState.setEmail(e.target.value)}
                      type="email"
                      isInvalid={signInState.errors.email.e}
                      errorMessage={
                        signInState.errors.email.e &&
                        signInState.errors.email.description
                      }
                      color={"default"}
                      variant="flat"
                      // endContent={<div className="flex items-center">{!signInState.errors.email.e ? <CheckCircleIcon className="text-green-500" width={'1.5rem'} height={'1.5rem'} /> : <XCircleIcon className="text-red-500" width={'1.5rem'} height={'1.5rem'} />}</div>}
                    />
                    <div className="mt-5">
                      <Button
                        onClick={() => {forgotPassword()}}
                        className={"w-full bg-black"}
                        isLoading={signInState.buttonLoading}
                        color={"primary"}
                        isDisabled={!isValidEmail(signInState.email)}
                      >
                        <div className="text-white">
                          Send Password Reset Email
                        </div>
                      </Button>

                      {/* <Button
                        onClick={() =>
                          router.push(
                            "/api/auth/forgot-password?email=" +
                              signInState.email
                          )
                        }
                        className={"w-full bg-black"}
                        isLoading={signInState.loading.email}
                        isDisabled={!isValidEmail(signInState.email)}
                      >
                        <div className="text-white">
                          Send Password Reset Email
                        </div>
                      </Button> */}
                    </div>
                  </div>
                </ErrorBoundary>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <a
                    href="/auth/onboard"
                    className="font-semibold leading-6 text-black hover:text-black"
                  >
                    Create Account
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </main>
      </div>
    );
}

export default IForgot
