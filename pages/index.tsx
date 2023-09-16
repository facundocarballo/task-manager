import Head from "next/head";
import React from "react";
import { NavBar } from "@/src/components/NavBar";
import { TheDivider } from "@/src/components/TheDivider";
import { Categories } from "@/src/subpages/Categories";
import { Footer } from "@/src/subpages/Footer";
import {
  Spacer,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { TasksCompleted } from "@/src/subpages/TasksCompleted";
import { useProvider } from "@/src/context";
import { getAllTaskCompleted } from "@/src/handlers/task";
import { CreateUserForm } from "@/src/components/CreateUserForm";
import { TasksDeleted } from "@/src/subpages/TasksDeleted";
import { trySiginWithCredential } from "@/src/handlers/google";

let read: boolean = true;

export default function Home() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const cancelRef = React.useRef(null);
  const onClose = () => setIsOpen(false);
  // Context
  const { user, setUser } = useProvider();
  // React Use Effect
  React.useEffect(() => {
    handleUserEffect();
  }, []);

  const handleUserEffect = async () => {
    if (!read) return;
    read = false;

    const user = await trySiginWithCredential();
    if (user == undefined) {
      setIsOpen(true);
      return;
    }
    setUser(user);
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen && user === null}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create a new User
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <CreateUserForm />
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack minH="100%">
        <Head>
          <title>Task Manager</title>
          <meta name="description" content="App to handle all of your tasks." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        {user == null ? (
          <>
            <Box h='200px' />
            <Spinner />
            <Box h='200px' />
          </>
          
        ) : (
          <>
            <TheDivider horizontal={true} />
            <Categories />
            <TheDivider horizontal={true} />
            <TasksCompleted />
            <TheDivider horizontal={true} />
            <TasksDeleted />
            <TheDivider horizontal={true} />
          </>
        )}
        <Spacer />
        <Footer />
      </VStack>
    </>
  );
}
