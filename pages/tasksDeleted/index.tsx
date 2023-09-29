import { CreateUserForm } from "@/src/components/CreateUserForm";
import { NavBar } from "@/src/components/NavBar";
import { TheDivider } from "@/src/components/TheDivider";
import { useProvider } from "@/src/context";
import { trySiginWithCredential } from "@/src/handlers/google";
import { Footer } from "@/src/subpages/Footer";
import { TasksDeleted } from "@/src/subpages/TasksDeleted";
import {
  Box,
  Spacer,
  Spinner,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import Head from "next/head";
import React from "react";


let read: boolean = true;
let readTasksDeleted: boolean = true

export default function TasksDeletedPage() {
  // Attributes
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [heightSize, setHeightSize] = React.useState<number>(0);
  const [loadingTasks, setLoadingTasks] = React.useState<boolean>(false);
  const cancelRef = React.useRef(null);
  // Context
  const { user, setUser, setTasksDeleted } = useProvider();
  // Methods
  const onClose = () => setIsOpen(false);
  
  const handleUserEffect = async () => {
    if (!read) return;
    read = false;

    const theUser = await trySiginWithCredential();
    if (theUser == undefined) {
      setIsOpen(true);
      return;
    }
    setUser(theUser);
  };

  const handleGetTasksDeleted = async () => {
    if (user !== null && readTasksDeleted) {
        readTasksDeleted = false;
        setLoadingTasks(true);
        await user.GetTasksDeletedFirebase();
        setTasksDeleted(user.tasksDeleted);
        setLoadingTasks(false);
    }
  }

  // React Use Effect
  React.useEffect(() => {
    handleUserEffect();
    setHeightSize(window.innerHeight);
    handleGetTasksDeleted();
  },);
  // Component
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

      <VStack minH={heightSize}>
        <Head>
          <title>Tasks Deleted</title>
          <meta
            name="description"
            content="Visualize all of your tasks deleted."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        {loadingTasks ? (
          <>
            <Box h="200px" />
            <Spinner />
            <Box h="200px" />
          </>
        ) : (
          <>
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
