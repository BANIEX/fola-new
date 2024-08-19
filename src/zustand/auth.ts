import { create } from "zustand";
import { EmailRegex } from "@/util/email-regex";

export const usePasswordResetState = create<{
  email: string;
  errors: {
    email: {
      e: boolean;
      description: null | string;
    };
  };
  loading: {
    email: boolean;
  };
  buttonLoading: boolean;
  verified: {
    email: boolean;
  };
  setEmail: (x: string) => void;
  clearEmailError: () => void;
  validateEmail: () => void;
  toggleReadOnly: () => void;
  setLoading: () => void;
  setButtonLoading: (value: boolean) => void;
  readonly: boolean;
}>((set, get) => ({
  password: "",
  email: "",
  passwordVisible: false,
  readonly: false,
  toggleReadOnly: () => set((s) => ({ ...s, readonly: !s.readonly })),
  verified: {
    email: false,
    password: false,
  },
  loading: {
    email: false,
    password: false,
  },
  buttonLoading: false,
  errors: {
    email: {
      e: false,
      description: null,
    },
    password: {
      e: false,
      description: null,
    },
  },
  setEmail: (email: string) =>
    set({ email: email.toString().toLowerCase().trim() }),
  clearEmailError: () =>
    set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
    })),
  clearPasswordError: () =>
    set((state) => ({
      errors: { ...state.errors, password: { e: false, description: null } },
    })),
  validateEmail: async () => {
    set((state) => ({ loading: { ...state.loading, email: true } }));
    const email = get().email;
    console;
    if (!email)
      return set((state) => ({
        errors: { ...state.errors, email: { e: false, description: null } },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));
    const valid = email.match(EmailRegex);
    if (!valid)
      return set((state) => ({
        errors: {
          ...state.errors,
          email: { e: true, description: "Invalid Email" },
        },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));

    // The below code checks if the email exists or not
    // const exists = (
    //   await fetch("/api/auth/exists", {
    //     method: "post",
    //     body: JSON.stringify({ email: get().email }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    // ).ok;
    // if (!exists)
    //   return set((state) => ({
    //     errors: {
    //       ...state.errors,
    //       email: {
    //         e: true,
    //         description: "Account with this email doesn't exists",
    //       },
    //     },
    //     loading: { ...state.loading, email: false },
    //     verified: { ...state.verified, email: false },
    //   }));

    return set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
      verified: { ...state.verified, email: true },
      loading: { ...state.loading, email: false },
    }));
  },

  setLoading: () => {
    set((state) => ({ loading: { ...state.loading, email: true } }));
  },

  // setButtonLoading: () => {
  //   set((state)=>{
  //     console.log(state.buttonLoading)
  //     return {buttonLoading : !state.buttonLoading}

  //   })
  // }

  setButtonLoading: (value) => set({ buttonLoading: value }),
}));

export const useSignInState = create<{
  password: string;
  email: string;
  passwordVisible: boolean;
  errors: {
    email: {
      e: boolean;
      description: null | string;
    };
    password: {
      e: boolean;
      description: null | string;
    };
  };
  loading: {
    email: boolean;
    password: boolean;
  };
  buttonLoading: boolean;
  verified: {
    email: boolean;
    password: boolean;
  };
  setEmail: (x: string) => void;
  setPassword: (x: string) => void;
  clearEmailError: () => void;
  clearPasswordError: () => void;
  validateEmail: () => void;
  setButtonLoading: (value: boolean) => void;
  togglePasswordVisiblity: () => void;
  validatePassword: () => void;
  toggleReadOnly: () => void;
  readonly: boolean;
}>((set, get) => ({
  password: "",
  email: "",
  passwordVisible: false,
  readonly: false,
  toggleReadOnly: () => set((s) => ({ ...s, readonly: !s.readonly })), //what does toggle Read only mean : Explanation for wheter input fields are alterable or not
  verified: {
    email: false,
    password: false,
  },
  loading: {
    email: false,
    password: false,
  },
  buttonLoading: false,
  errors: {
    email: {
      e: false,
      description: null,
    },
    password: {
      e: false,
      description: null,
    },
  },
  togglePasswordVisiblity: () =>
    set((state) => ({ ...state, passwordVisible: !state.passwordVisible })),
  setEmail: (email: string) =>
    set({ email: email.toString().toLowerCase().trim() }),
  setPassword: (password: string) =>
    set({ password: password.toString().trim() }),
  clearEmailError: () =>
    set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
    })),
  clearPasswordError: () =>
    set((state) => ({
      errors: { ...state.errors, password: { e: false, description: null } },
    })),
  validateEmail: async () => {
    set((state) => ({ loading: { ...state.loading, email: true } }));
    const email = get().email;
    if (!email)
      return set((state) => ({
        errors: { ...state.errors, email: { e: false, description: null } },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));
    const valid = email.match(EmailRegex);
    if (!valid)
      return set((state) => ({
        errors: {
          ...state.errors,
          email: { e: true, description: "Invalid Email" },
        },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));

    //   Problem starts from here It shouldnt check if email exists or not till user tries to sign in and then tell the user Ivalid username or passsword. woth first layer of check being if the email is vald
    //  Also the greencheck should only show if its a valid email that has been inputed and then not tell the user email exists with us

    //  Commented out the "exists" variable that checks the database if the email exists or not

    // const exists = (
    //   await fetch("/api/auth/exists", {
    //     method: "post",
    //     body: JSON.stringify({ email: get().email }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    // ).ok;
    // if (!exists)
    //   return set((state) => ({
    //     errors: {
    //       ...state.errors,
    //       email: {
    //         e: true,
    //         description: "Account with this email doesn't exists",
    //       },
    //     },
    //     loading: { ...state.loading, email: false },
    //     verified: { ...state.verified, email: false },
    //   }));

    return set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
      verified: { ...state.verified, email: true },
      loading: { ...state.loading, email: false },
    }));
  },
  validatePassword: async () => {
    set((state) => ({ loading: { ...state.loading, password: true } }));
    const password = get().password;
    console.log(password);
    if (!password)
      return set((state) => ({
        errors: { ...state.errors, password: { e: false, description: null } },
        verified: { ...state.verified, password: false },
        loading: { ...state.loading, password: false },
      }));
    // @ts-ignore
    // if (password.length < 5)
    //   return set((state) => ({
    //     errors: {
    //       ...state.errors,
    //       password: { e: true, description: "Password too weak" },
    //     },
    //     verified: { ...state.verified, password: false },
    //     loading: { ...state.loading, password: false },
    //   }));
    return set((state) => ({
      errors: {
        ...state.errors,
        password: { e: false, description: "Password Secure" },
      },
      verified: { ...state.verified, password: true },
      loading: { ...state.loading, password: false },
    }));
  },
  setButtonLoading: (value) => set({ buttonLoading: value }),
}));

export const useSignUpState = create<{
  password: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  number: string;
  passwordVisible: boolean;
  errors: {
    email: {
      e: boolean;
      description: null | string;
    };
    password: {
      e: boolean;
      description: null | string;
    };
  };
  loading: {
    email: boolean;
    password: boolean;
  };
  buttonLoading: boolean;
  verified: {
    email: boolean;
    password: boolean;
  };
  setEmail: (x: string) => void;
  setNumber: (x: string) => void;
  setPassword: (x: string) => void;
  setName: (x: string) => void;
  setFirstName: (x: string) => void;
  setLastName: (x: string) => void;
  setGender: (x: string) => void;
  clearEmailError: () => void;
  clearPasswordError: () => void;
  // clearFormField: () => void;
  validateEmail: () => void;
  togglePasswordVisiblity: () => void;
  validatePassword: () => void;
  toggleReadOnly: () => void;
  setButtonLoading: (value: boolean) => void;
  readonly: boolean;
  genders: string[];
  // genders: ["male", "female", "other"];
}>((set, get) => ({
  password: "",
  email: "",
  name: "",
  firstName: "",
  lastName: "",
  gender: "",
  number: "",
  passwordVisible: false,
  readonly: false,
  toggleReadOnly: () => set((s) => ({ ...s, readonly: !s.readonly })),
  verified: {
    email: false,
    password: false,
  },
  loading: {
    email: false,
    password: false,
  },
  buttonLoading: false,
  errors: {
    email: {
      e: false,
      description: null,
    },
    password: {
      e: false,
      description: null,
    },
  },
  genders: ["male", "female", "other"],
  togglePasswordVisiblity: () =>
    set((state) => ({ ...state, passwordVisible: !state.passwordVisible })),
  setEmail: (email: string) =>
    set({ email: email.toString().toLowerCase().trim() }),
  setPassword: (password: string) =>
    set({ password: password.toString().trim() }),
  setName: (name: string) =>
    set({ name: name.toString().toLowerCase().trim() }),
  setFirstName: (firstName: string) =>
    set({ firstName: firstName.toString().toLowerCase().trim() }),
  setLastName: (lastName: string) =>
    set({ lastName: lastName.toString().toLowerCase().trim() }),
  setNumber: (number: string) =>
    set({ number: number.toString().toLowerCase().trim() }),
  setGender: (gender: string) =>
    set({ gender: gender.toString().toLowerCase().trim() }),
  clearEmailError: () =>
    set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
    })),
  clearPasswordError: () =>
    set((state) => ({
      errors: { ...state.errors, password: { e: false, description: null } },
    })),
  validateEmail: async () => {
    set((state) => ({ loading: { ...state.loading, email: true } }));
    const email = get().email;
    if (!email)
      return set((state) => ({
        errors: { ...state.errors, email: { e: false, description: null } },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));
    const valid = email.match(EmailRegex);
    if (!valid)
      return set((state) => ({
        errors: {
          ...state.errors,
          email: { e: true, description: "Invalid Email" },
        },
        loading: { ...state.loading, email: false },
        verified: { ...state.verified, email: false },
      }));

    // The below checks if the user (using his email) has an account in the database.

    // const exists = (
    //   await fetch("/api/auth/exists", {
    //     method: "post",
    //     body: JSON.stringify({ email: get().email }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    // ).ok;
    // if (exists)
    //   return set((state) => ({
    //     errors: {
    //       ...state.errors,
    //       email: {
    //         e: true,
    //         description: "Account with this email already exists",
    //       },
    //     },
    //     loading: { ...state.loading, email: false },
    //     verified: { ...state.verified, email: false },
    //   }));

    return set((state) => ({
      errors: { ...state.errors, email: { e: false, description: null } },
      verified: { ...state.verified, email: true },
      loading: { ...state.loading, email: false },
    }));
  },
  validatePassword: async () => {
    set((state) => ({ loading: { ...state.loading, password: true } }));
    const password = get().password;
    if (!password)
      return set((state) => ({
        errors: { ...state.errors, password: { e: false, description: null } },
        verified: { ...state.verified, password: false },
        loading: { ...state.loading, password: false },
      }));
    // @ts-ignore
    if (password.length < 5)
      return set((state) => ({
        errors: {
          ...state.errors,
          password: { e: true, description: "Password too weak" },
        },
        verified: { ...state.verified, password: false },
        loading: { ...state.loading, password: false },
      }));
    return set((state) => ({
      errors: {
        ...state.errors,
        password: { e: false, description: "Password Secure" },
      },
      verified: { ...state.verified, password: true },
      loading: { ...state.loading, password: false },
    }));
  },

  setButtonLoading: (value: boolean) => set({ buttonLoading: value }),
}));
