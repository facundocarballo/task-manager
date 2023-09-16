import { Button } from "@chakra-ui/react";
import React from "react";
import dotenv from "dotenv";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "@/firebase/google";
import { useProvider } from "../context";
import { User } from "@/types/user";

// Load all the enviroment variables.
dotenv.config();

export const CreateUserForm = () => {
  // Attributes
  // Context
  const { setUser, setTasksCompleted, setTasksDeleted } = useProvider();
  // Methods
  const handleSiginGoogle = async () => {
    const auth = getAuth();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = await User.CreateUserWithCredential(res.user);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      if (credential === null) {
        console.log("Credential null.");
        return
      }
      const token = credential.accessToken;
      if (token === undefined) {
        console.log("Token undefined.");
        return
      }
      user.SaveToken(token);
      setTasksCompleted(user.tasksCompleted);
      setTasksDeleted(user.tasksDeleted);
      setUser(user);
    } catch (err) {
      console.error("Error sigin with google. ", err);
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
