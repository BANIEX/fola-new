import React, { useState } from 'react'
import en from "@/translate/en.json";
import ErrorBoundary from '@/components/ErrorBoundary';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Input, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { IUser } from "@/types/auth/user";
import { useSnackbar, SnackbarProvider } from "notistack";
import { GetServerSidePropsContext } from 'next';
const ResetPasword = ({ code }: { code: string }) => {
    const [state, setState] = useState({
        newPassword: '',
        readonly: false,
        loading: false,     
        valid: true,
        description: ''
    });
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const resetPassword = async () => {
        try {
          setState({ ...state, readonly: true, loading: true });
          const resetPasswordResponse = await(
            await fetch("/api/auth/reset-password", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: code,
                newPassword: state.newPassword,
              }),
            })
          );
          // console.log(userResponse)
          // if (!userResponse.ok) throw new Error('Response Error');
          const resetPasswordData = await resetPasswordResponse.json();
          console.log(resetPasswordData);
          setState({ ...state, readonly: false, loading: false });
          if (resetPasswordData.status == "error")
            return enqueueSnackbar("Invalid or expired reset code", {
              variant: "error",
            });
          // enqueueSnackbar(`Signed in as ${user?.email}`);
          enqueueSnackbar(
            `Password reset successfully. Kindly proceed to Sign In`
          );
          return router.push("/auth/login")

          // await router.push(router.query.r ? router.query.r.toString() : "/");
        } catch (error: unknown) {
            setState({ ...state, readonly: false, valid: false, loading: false });
            return enqueueSnackbar("Password reset error", { variant: "error" });
        }
    }
    return (
      <div
        className={`bg-${
          code && !(code.length === 6) ? "white" : "red-50"
        } overflow-hidden min-h-[100] flex flex-col items-center justify-center min-h-screen md:py-2`}
      >
        <SnackbarProvider />

        {/* {!code && (
          <main className="flex relative items-center w-full px-2 md:px-20">
            <div className="hidden- px-4 md:xl:px-0 md:inline-flex flex-col flex-1 space-y-1">
              <p className="text-6xl text-black font-bold">
                Reset code invalid
              </p>
              <p className="font-medium pb-5 text-lg leading-1 text-gray-500">
                Reset `code` parameter empty or invalid, cannot proceed
              </p>
              <div>
                <Button href="/">Go Home</Button>
              </div>
            </div>
          </main>
        )} */}
        {(
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
                    <span className="text-black font-bold">Reset password</span>
                  </span>
                  <p className="text-md text-gray-500">
                    {en["Login:Subtitle"]}
                  </p>
                </div>
                <hr />
                <div className="mt-[2.5rem] sm:mx-auto sm:w-full sm:max-w-sm">
                  <ErrorBoundary
                    fallback={
                      <p>There was an error while submitting the form</p>
                    }
                  >
                    <div>
                      <div className="mx-2">
                        <Input
                          id="password"
                          name="password"
                          label="Password"
                          autoComplete="newpassword"
                          required
                          // isDisabled={state.readonly}
                          onFocus={() => setState({ ...state, valid: true })}
                          onBlur={() => {
                            if (!state.newPassword)
                              return setState({
                                ...state,
                                valid: false,
                                description: "Password empty",
                              });
                            // @ts-ignore
                            if (state.newPassword.length < 5)
                              return setState({
                                ...state,
                                valid: false,
                                description: "Password too weak",
                              });
                          }}
                          value={state.newPassword}
                          onChange={(e) => {
                            setState({ ...state, newPassword: e.target.value });
                          }}
                          type={"password"}
                          isInvalid={!state.valid}
                          errorMessage={!state.valid && state.description}
                          color={"default"}
                          variant="flat"
                        />
                      </div>
                      <div className="mt-5">
                        <Button
                          onClick={resetPassword}
                          className={"w-full bg-black"}
                          color="primary"
                          isLoading={state.loading}
                          isDisabled={!(state.newPassword.length > 4)}
                        >
                          <div className="text-white">Reset Password</div>
                        </Button>
                      </div>
                    </div>
                  </ErrorBoundary>
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
        )}
      </div>
    );
}



export function getServerSideProps(context: GetServerSidePropsContext) {
    const {query} = context;
    const code =   query?.code?.toString() ?? ''
    // console.log(code)
    return { props: { code } }
}






export default ResetPasword
