import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useProvider } from "../context";
import { CreateCategory } from "../components/CreateCategory";
import { MiniCategory } from "../components/MiniCategory";
import { User } from "@/types/user";

export const Categories = () => {
  // Attributes
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newDescription, setNewDescription] = React.useState<string>("");
  const [newColor, setNewColor] = React.useState<string>("dark.bg");
  const [loading, setLoading] = React.useState<boolean>(false);

  // Alert Dialog
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  const { user, setUser } = useProvider();
  // Methods
  const handleCreateCategory = async () => {
    if (user == null) {
      console.error("Error user was null when trying to create a category.");
      return;
    }
    setLoading(true);
    await user.CreateCategory(newTitle, newDescription, newColor);
    const newUser = new User(user);
    setUser(newUser);
    setLoading(false);
    clearInputs();
    onClose();
  };
  
  const clearInputs = () => {
    setNewColor("dark.bg");
    setNewDescription("");
    setNewTitle("");
  }
  // Component
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={newColor}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create a new Category
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <CreateCategory
                title={newTitle}
                description={newDescription}
                color={newColor}
                setTitle={setNewTitle}
                setDescription={setNewDescription}
                setColor={setNewColor}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              {!loading ? (
                <Button variant="primary" onClick={handleCreateCategory}>
                  CREATE CATEGORY
                </Button>
              ) : (
                <Spinner />
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {user === null ? null : (
        <>
          <VStack w="full">
            <HStack w="full">
              <Box w="20px" />
              <Heading>Categories</Heading>
              <Spacer />
              <Button variant="secundary" onClick={onOpen}>
                Create Category
              </Button>
              <Box w="20px" />
            </HStack>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {user.categories.map((cat, idx) => (
                <GridItem key={idx}>
                  <MiniCategory cat={cat} />
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </>
      )}
    </>
  );
};
