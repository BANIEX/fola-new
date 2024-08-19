import React, { useEffect } from 'react'
import en from "@/translate/en.json";
import ErrorBoundary from '@/components/ErrorBoundary';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@nextui-org/react';
import { useSignInState } from "@/zustand/auth";
import { useRouter } from 'next/router';
import { IUser } from "@/types/auth/user";
import { useSnackbar, SnackbarProvider } from "notistack";
import Link from 'next/link';

const SubmitButton = ({ state }: { state: 'pending' | 'failed' | 'unsubmitted' | 'submitted' }) => {
    return (
        <button
            type="submit" disabled={state === "pending"}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {(state === "pending") ? "Signing you in..." : "Sign in"}
        </button>
    );
}
const Login = () => {
    // const [state, setState] = useState<'pending' | 'failed' | 'unsubmitted' | 'submitted'>('unsubmitted');
    const signInState = useSignInState();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);





    useEffect(() => {
        return () => {
            signInState.setEmail('');
            signInState.clearEmailError();
        }
    }, [])






    const signInUser = async () => {
      signInState.setButtonLoading(true);
        try {
            signInState.toggleReadOnly();
            const userResponse = await (await fetch("/api/auth/login", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: signInState.email, password: signInState.password }),
            }));

            if (!userResponse.ok) throw new Error('Response Error');
            userResponse && signInState.setButtonLoading(false)
            const user = await userResponse.json() as IUser;
            enqueueSnackbar(`Signed in as ${user?.email}`);
            await router.push(router.query.r ? router.query.r.toString() : "/");
            return
        } catch (error: unknown) {
            signInState.toggleReadOnly();
            signInState.setButtonLoading(false);
            enqueueSnackbar("Invalid Username or Password", { variant: "error" });
            return
        }
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
                    Sign in to your account
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
                      //   isDisabled={true}
                      onFocus={signInState.clearEmailError}
                      // onBlur={() => {
                      //   if (signInState.email.length > 0) {
                      //     signInState.validateEmail;
                      //   }
                      // }}
                      onBlur={signInState.validateEmail}
                      // onClick={() => {
                      //   isEmailValidCheckMark();
                      // }}
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
                      endContent={
                        <div className="flex items-center">
                          {/* {signInState.email.length > 0 && (
                            <span>
                              {signInState.errors.email.e ? (
                                <CheckCircleIcon
                                  className="text-green-500"
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              ) : (
                                <XCircleIcon
                                  className="text-red-500"
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              )}
                            </span>
                          )} */}
                        </div>
                      }
                    />
                    <Link
                      href={"/auth/iforgot"}
                      className={`flex visible items-center justify-between`}
                    >
                      <div className="text-sm ml-auto">
                        <div className="font-semibold text-black">
                          Forgot password?
                        </div>
                      </div>
                    </Link>
                    <div className="mt-2">
                      <Input
                        id="password"
                        name="password"
                        label="Password"
                        autoComplete="password"
                        required
                        isDisabled={
                          signInState.loading.password || signInState.readonly
                        }
                        // isDisabled={true}
                        onFocus={signInState.clearPasswordError}
                        onBlur={signInState.validatePassword}
                        value={signInState.password}
                        onChange={(e) =>
                          signInState.setPassword(e.target.value)
                        }
                        type={signInState.passwordVisible ? "text" : "password"}
                        isInvalid={signInState.errors.password.e}
                        errorMessage={
                          signInState.errors.password.e &&
                          signInState.errors.password.description
                        }
                        color={"default"}
                        variant="flat"
                        endContent={
                          <div className="flex items-center">
                            {/* {!signInState.errors.password.e ? (
                              <CheckCircleIcon
                                className="text-green-500"
                                width={"1.5rem"}
                                height={"1.5rem"}
                              />
                            ) : (
                              <XCircleIcon
                                className="text-red-500"
                                width={"1.5rem"}
                                height={"1.5rem"}
                              />
                            )} */}

                            {/* {signInState.email.length > 0 && (
                            <span>
                              {signInState.errors.email.e ? (
                                <CheckCircleIcon
                                  className="text-green-500"
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              ) : (
                                <XCircleIcon
                                  className="text-red-500"
                                  width={"1.5rem"}
                                  height={"1.5rem"}
                                />
                              )}
                            </span>
                          )} */}

                            {signInState.password.length > 0 && (
                              <span>
                                <button
                                  className="ml-2 flex items-center"
                                  type="button"
                                  onClick={() =>
                                    signInState.togglePasswordVisiblity()
                                  }
                                >
                                  {signInState.passwordVisible ? (
                                    <EyeSlashIcon
                                      width={"1.1rem"}
                                      height={"1.1rem"}
                                    />
                                  ) : (
                                    <EyeIcon
                                      width={"1.1rem"}
                                      height={"1.1rem"}
                                    />
                                  )}
                                </button>
                              </span>
                            )}

                            {/* The button tab below renders even when the password field. It has been modifid to only show when the user put at least one character. This was done for a better UI */}
                            {/* <button
                              className="ml-2 flex items-center"
                              type="button"
                              onClick={() =>
                                signInState.togglePasswordVisiblity()
                              }
                            >
                              {signInState.passwordVisible ? (
                                <EyeSlashIcon
                                  width={"1.1rem"}
                                  height={"1.1rem"}
                                />
                              ) : (
                                <EyeIcon width={"1.1rem"} height={"1.1rem"} />
                              )}
                            </button> */}
                          </div>
                        }
                      />
                    </div>
                    <div className="mt-5">
                      <Button
                        onClick={signInUser}
                        className={"w-full bg-black"}
                        // isLoading={
                        //   signInState.loading.email ||
                        //   signInState.loading.password
                        // }
                        isLoading={signInState.buttonLoading}
                        // isDisabled={
                        //   !(
                        //     signInState.verified.email &&
                        //     signInState.password.length > 4
                        //   )
                        // }
                        isDisabled={
                          !(
                            isValidEmail(signInState.email) &&
                            signInState.password.length > 4
                          )
                        }
                        color="primary"
                      >
                        <div className="text-white">Sign In</div>
                      </Button>
                    </div>
                  </div>
                </ErrorBoundary>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
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

export default Login
