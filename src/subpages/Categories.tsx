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
} from "@chakra-ui/react";
import React from "react";
import { useProvider } from "../context";
import { CreateCategory } from "../components/CreateCategory";
import { MiniCategory } from "../components/MiniCategory";

export const Categories = () => {
  // Attributes
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newDescription, setNewDescription] = React.useState<string>("");
  const [newColor, setNewColor] = React.useState<string>("dark.bg");

  // Alert Dialog
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  const { user } = useProvider();
  // Methods
  const handleCreateCategory = async () => {
    if (user == null) {
      console.error("Error user was null when trying to create a category.");
      return;
    }
    user.CreateCategory(newTitle, newDescription, newColor)
  };
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
              <Button variant="primary" onClick={handleCreateCategory}>
                CREATE CATEGORY
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
          {user == null
            ? null
            : user.categories.map((cat, idx) => (
                <GridItem key={idx}>
                  <MiniCategory cat={cat} />
                </GridItem>
              ))}
        </Grid>
      </VStack>
    </>
  );
};
