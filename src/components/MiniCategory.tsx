import {
  VStack,
  Text,
  Box,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { CategoryComponent } from "./Category";
import { Category } from "@/types/category";

export interface IMiniCategory {
  cat: Category;
}

export const MiniCategory = ({ cat }: IMiniCategory) => {
  // Attributes
  // Alert Dialog
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  // Methods
  const getFontSizeFromTitle = (title: string) => {
    let size = "18";

    if (title.length > 13) size = "16";

    if (title.length > 20) size = "15";

    if (title.length > 30) size = "12";

    return size + "px";
  };
  // Drag and Drop Categories
  // Component
  return (
    <>
      {/* Alert Dialog - Show Complete Category */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size={{ lg: "2xl", md: "2xl", sm: "md", base: "md" }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              bg={`#${cat.color}`}
              fontSize="lg"
              fontWeight="bold"
            >
              Category
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <CategoryComponent cat={cat} onCloseCategory={onClose} />
            </AlertDialogBody>

            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack
        minW="250px"
        minH='90px'
        bg={`${cat.color}`}
        borderRadius="10px"
        _hover={{
          transform: "scale(1.1)",
          shadow: "lg",
          cursor: "pointer",
        }}
        onClick={onOpen}
      >
        <Box h="1px" />
        <Text align='center' fontWeight="bold" fontSize={getFontSizeFromTitle(cat.name)}>
          {cat.name}
        </Text>
        <Divider />
        <Text>{cat.GetTasksToDo().length}</Text>
        <Box h="5px" />
      </VStack>
    </>
  );
};
