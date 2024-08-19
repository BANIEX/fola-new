import React, { useState } from "react";
import en from "@/translate/en.json";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Input, Button, Radio, RadioGroup } from "@nextui-org/react";
import { useSignUpState } from "@/zustand/auth";
import { useRouter } from "next/router";
import { IUser } from "@/types/auth/user";
import { useSnackbar } from "notistack";

// const SubmitButton = ({
//   state,
// }: {
//   state: "pending" | "failed" | "unsubmitted" | "submitted";
// }) => {
//   return (
//     <button
//       type="submit"
//       disabled={state === "pending"}
//       className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//     >
//       {state === "pending" ? "Signing you in..." : "Sign in"}
//     </button>
//   );
// };




const OnBoard = () => {
  const signUpState = useSignUpState();
  // console.log(signUpState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();



  const signUpUser = async () => {
    try {
      signUpState.toggleReadOnly();
      signUpState.setButtonLoading(true);
      // console.log("sign up user function");
      const timestamp = new Date().getTime();
      const userSignUpFeedback = await(
        await fetch(`/api/auth/onboard?timestamp=${timestamp}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signUpState.email,
            // name: signUpState.name,
            firstName: signUpState.firstName,
            lastName: signUpState.lastName,
            gender: signUpState.gender,
            password: signUpState.password,
            number: signUpState.number,
          }),
        })
      ).json();
      // enqueueSnackbar(`Signed in as ${user?.email}`);

      // console.log(userSignUpFeedback);

      userSignUpFeedback && signUpState.setButtonLoading(false)

      if (userSignUpFeedback.status == "error") {
        console.log("here in error side");
        signUpState.setButtonLoading(false);

        return enqueueSnackbar(userSignUpFeedback.description);
      }

      // enqueueSnackbar(
      //   `Account created successfully. Please procced to Sign In.`
      // );

     


      enqueueSnackbar(userSignUpFeedback.description);

      router.push("/auth/login");

      return


      console.log("redirecting");
      // await router.push(router.query.r ? router.query.r.toString() : "/");
    } catch (error: unknown) {
      signUpState.toggleReadOnly();
      signUpState.setButtonLoading(false);
      enqueueSnackbar("Unknown error occurred", { variant: "error" });
      return

    }
  };

  const isValidEmail = (email : string) : boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => {
    if (
      signUpState.firstName.length > 0 &&
      signUpState.lastName.length > 0 &&
      isValidEmail(signUpState.email)
      &&
      signUpState.number.length > 0
      &&
      signUpState.gender.length > 0
      &&
      signUpState.password.length > 4
    ) {
      // console.log(true);
      return true;
    }
    // console.log(false)
    return false
  };


  return (
    <div className="bg-white overflow-hidden min-h-[100] flex flex-col items-center justify-center min-h-screen md:py-2">
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
                <span className="text-black font-bold">{en["Sign Up"]}</span>
              </span>
              <p className="text-md text-gray-500">{en["Sign Up:Subtitle"]}</p>
            </div>
            <hr />
            <div className="mt-[2.5rem] sm:mx-auto sm:w-full sm:max-w-sm">
              <ErrorBoundary
                fallback={<p>There was an error while submitting the form</p>}
              >
                <div>
                  <Input
                    id="first-name"
                    name="first-name"
                    label="First Name"
                    autoComplete="given-name"
                    required
                    value={signUpState.firstName}
                    onChange={(e) => signUpState.setFirstName(e.target.value)}
                    type="text"
                    className="my-4"
                    color={"default"}
                    variant="flat"
                  />
                  <Input
                    id="last-name"
                    name="last-name"
                    label="Last Name"
                    autoComplete="family-name"
                    required
                    // isDisabled={signUpState.readonly}
                    value={signUpState.lastName}
                    onChange={(e) => signUpState.setLastName(e.target.value)}
                    type="text"
                    className="my-4"
                    color={"default"}
                    variant="flat"
                  />
                  <Input
                    id="email"
                    name="email"
                    label="Email"
                    autoComplete="email"
                    required
                    // isDisabled={
                    //   signUpState.loading.email || signUpState.readonly
                    // }
                    onFocus={signUpState.clearEmailError}
                    onBlur={signUpState.validateEmail}
                    value={signUpState.email}
                    onChange={(e) => signUpState.setEmail(e.target.value)}
                    type="email"
                    isInvalid={signUpState.errors.email.e}
                    errorMessage={
                      signUpState.errors.email.e &&
                      signUpState.errors.email.description
                    }
                    color={"default"}
                    variant="flat"
                    endContent={
                      <div className="flex items-center">
                        {/* {!signUpState.errors.email.e ? (
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
                      </div>
                    }
                  />
                  {/* <Input
                    id="name"
                    name="name"
                    label="Name"
                    autoComplete="name"
                    required
                    isDisabled={signUpState.readonly}
                    value={signUpState.name}
                    onChange={(e) => signUpState.setName(e.target.value)}
                    type="text"
                    className="my-4"
                    color={"default"}
                    variant="flat"
                  /> */}
                  {/* 
                  <Button color="primary" isLoading={true}>
                    Loading
                  </Button> */}

                  <Input
                    id="number"
                    name="number"
                    label="Phone Number"
                    autoComplete="number"
                    required
                    // startContent={
                    //     <div className="pointer-events-none flex items-center">
                    //       {/* <span className="text-default-400 text-small">{process.env.NEXT_PULIC_CALLING_CODE || '+61'}</span> */}
                    //     </div>}
                    // isDisabled={signUpState.readonly}
                    value={signUpState.number}
                    onChange={(e) => signUpState.setNumber(e.target.value)}
                    type="tel"
                    className="my-4"
                    color={"default"}
                    variant="flat"
                    // isClearable
                    // labelPlacement="outside-left"
                  />

                  <RadioGroup
                    label="Select your gender"
                    value={signUpState.gender}
                    className="my-4"
                    onValueChange={(v) => signUpState.setGender(v)}
                    orientation="horizontal"
                  >
                    {signUpState.genders.map((g) => (
                      <Radio key={g} value={g}>
                        <div style={{ textTransform: "capitalize" }}>{g}</div>
                      </Radio>
                    ))}
                  </RadioGroup>
                  <div className="mt-2">
                    <Input
                      id="password"
                      name="password"
                      label="Password"
                      inputMode="numeric"
                      autoComplete="password"
                      required
                      // isDisabled={
                      //   signUpState.loading.password || signUpState.readonly
                      // }
                      onFocus={signUpState.clearPasswordError}
                      onBlur={signUpState.validatePassword}
                      value={signUpState.password}
                      onChange={(e) => signUpState.setPassword(e.target.value)}
                      type={signUpState.passwordVisible ? "text" : "password"}
                      isInvalid={signUpState.errors.password.e}
                      errorMessage={
                        signUpState.errors.password.e &&
                        signUpState.errors.password.description
                      }
                      color={"default"}
                      variant="flat"
                      endContent={
                        <div className="flex items-center">
                          {/* {!signUpState.errors.password.e ? (
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
                          {signUpState.password.length > 0 && (
                            <span>
                              <button
                                className="ml-2 flex items-center"
                                type="button"
                                onClick={() =>
                                  signUpState.togglePasswordVisiblity()
                                }
                              >
                                {signUpState.passwordVisible ? (
                                  <EyeSlashIcon
                                    width={"1.1rem"}
                                    height={"1.1rem"}
                                  />
                                ) : (
                                  <EyeIcon width={"1.1rem"} height={"1.1rem"} />
                                )}
                              </button>
                            </span>
                          )}
                          {/* <button
                            className="ml-2"
                            type="button"
                            onClick={() =>
                              signUpState.togglePasswordVisiblity()
                            }
                          >
                            {signUpState.passwordVisible ? (
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

                  <div className="mt-5 pt-5">
                    <Button
                      onClick={signUpUser}
                      className={"w-full bg-black"}
                      // isLoading={
                      //   signUpState.loading.email ||
                      //   signUpState.loading.password
                      // }
                      isLoading={signUpState.buttonLoading}
                      color="primary"
                      // isDisabled={
                      //   !(
                      //     signUpState.firstName.length > 0 &&
                      //     signUpState.verified.email &&
                      //     signUpState.verified.password &&
                      //     signUpState.number.length > 0
                      //   )
                      // }
                      isDisabled={!isFormValid()}
                    >
                      <div className="text-white">Create an account</div>
                    </Button>
                  </div>
                </div>
              </ErrorBoundary>
              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="font-semibold leading-6 text-black hover:text-gray-800"
                >
                  Login
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
};

export default OnBoard;
