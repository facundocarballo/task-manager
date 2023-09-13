import Head from 'next/head';
import React from 'react';
import { NavBar } from '@/src/components/NavBar';
import { TheDivider } from '@/src/components/TheDivider';
import { Categories } from '@/src/subpages/Categories';
import { Footer } from '@/src/subpages/Footer';
import { Spacer, VStack } from '@chakra-ui/react';
import { TasksCompleted } from '@/src/subpages/TasksCompleted';
import { useProvider } from '@/src/context';
import { getAllTaskCompleted } from '@/src/handlers/task';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import { CreateUserForm } from '@/src/components/CreateUserForm';
import { TasksDeleted } from '@/src/subpages/TasksDeleted';


export default function Home() {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const cancelRef = React.useRef(null);
  const onClose = () => setIsOpen(false);
  // Context
  const { categories, setTasksCompleted } = useProvider();
  // React Use Effect
  React.useEffect(() => {
    if (categories == null) return;
    setTasksCompleted(getAllTaskCompleted(categories));
  }, [])
  return (
    <>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Create a new User
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <CreateUserForm />
            </AlertDialogBody>

          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack minH='100%'>
        <Head>
          <title>Task Manager</title>
          <meta name="description" content="App to handle all of your tasks." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NavBar />
        <TheDivider horizontal={true} />
        <Categories />
        <TheDivider horizontal={true} />
        <TasksCompleted />
        <TheDivider horizontal={true} />
        <TasksDeleted />
        <TheDivider horizontal={true} />
        <Spacer />
        <Footer />
      </VStack>
    </>
  )
}
