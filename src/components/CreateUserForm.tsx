import { Button } from "@chakra-ui/react";
import React from "react";
import dotenv from "dotenv";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "@/firebase/google";
import { useProvider } from "../context";

// Load all the enviroment variables.
dotenv.config();

export const CreateUserForm = () => {
  // Attributes
  // Context
  const { setUser } = useProvider();
  // Methods
  const handleSiginGoogle = async () => {
    const auth = getAuth();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential?.accessToken;
      const user = res.user;
      setUser(user);
      console.log("user: ", user);
    } catch (err) {
      console.log("Error: ", err);
    }
  };
  // Component
  return (
    <>
      <Button variant="primary" onClick={handleSiginGoogle}>
        Google SignIn
      </Button>
    </>
  );
};
