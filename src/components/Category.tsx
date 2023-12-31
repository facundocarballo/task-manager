import { AddIcon, DeleteIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import { TaskComponent } from "./Task";
import { InputInfo } from "./InputInfo";
import { CreateCategory } from "./CreateCategory";
import { Category } from "@/types/category";
import { useProvider } from "../context";
import { User } from "@/types/user";
import { MiniCategory } from "./MiniCategory";

export interface ICategoryComponent {
  cat: Category;
  onCloseCategory: () => void
}

export const CategoryComponent = ({ cat, onCloseCategory }: ICategoryComponent) => {
  // Attributes
  const bgIconsButton = useColorModeValue("light.bg", "dark.bg");
  // Create Task
  const [createTaskIsOpen, setCreateTaskIsOpen] =
    React.useState<boolean>(false);
  const [taskTitle, setTaskTitle] = React.useState<string>("");
  const [taskDescription, setTaskDescription] = React.useState<string>("");
  const [taskEndDate, setTaskEndDate] = React.useState<Date | undefined>(
    undefined
  );
  // Edit Category
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newDescription, setNewDescription] = React.useState<string>("");
  const [newColor, setNewColor] = React.useState<string>("");
  // Loading
  const [loading, setLoading] = React.useState<boolean>(false);
  // Create Category
  const [openCreateCategory, setOpenCreateCategory] =
    React.useState<boolean>(false);
  // Delete Category
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  // Alert Dialog
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  const { user, setUser } = useProvider();
  // Methods
  const handleSetDate = (e: string) => {
    const date = new Date(e);
    setTaskEndDate(date);
  };

  const handleCreateTask = async () => {
    setLoading(true);
    await cat.CreateTask(taskTitle, taskDescription, taskEndDate);
    clearInputs();
    setLoading(false);
    setCreateTaskIsOpen(false);
  };

  const handleSaveEditCategory = async () => {
    if (user === null) {
      console.error("User is null");
      return;
    }

    setLoading(true);
    await cat.Edit(newTitle, newDescription, newColor);
    setLoading(false);
    clearInputs();
    user.EditCategory(newTitle, newDescription, newColor, cat.uid);
    setUser(new User(user));
    setOpenEdit(false);
  };

  const handleCreateSubCategory = async () => {
    setLoading(true);
    await cat.CreateSubCategory(newTitle, newDescription, newColor);
    clearInputs();
    setLoading(false);
    setOpenCreateCategory(false);
  };

  const handleDeleteCategory = async () => {
    if (user === null) {
      console.error("User is null.");
      return;
    }

    setLoading(true);
    await cat.Delete();
    await user.GetCategories();
    setLoading(false);
    setUser(new User(user));
    setOpenDelete(false);
    onCloseCategory();
  };

  const clearInputs = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskEndDate(undefined);

    setNewColor("");
    setNewDescription("");
    setNewTitle("");
  };

  // Component
  return (
    <>
      {/* Alert Dialog - Category Edit */}
      <AlertDialog
        isOpen={openEdit}
        leastDestructiveRef={cancelRef}
        onClose={() => setOpenEdit(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit {cat.name}
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
              {loading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  ref={cancelRef}
                  onClick={handleSaveEditCategory}
                >
                  Save
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Dialog - Category Info */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {cat.name}
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>{cat.description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="primary" ref={cancelRef} onClick={onClose}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Dialog - Create Task */}
      <AlertDialog
        isOpen={createTaskIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setCreateTaskIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Task
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <InputInfo
                title="Title"
                placeholder="Task Title"
                value={taskTitle}
                type="text"
                handler={setTaskTitle}
              />
              <InputInfo
                title="Description"
                placeholder="Task Description"
                value={taskDescription}
                type="text"
                handler={setTaskDescription}
              />
              <InputInfo
                value={undefined}
                title="Deadline"
                placeholder="Task Deadline"
                type="datetime-local"
                handler={handleSetDate}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              {!loading ? (
                <Button variant="primary" onClick={handleCreateTask} ml={3}>
                  Create Task
                </Button>
              ) : (
                <Spinner />
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Dialog - Category Edit */}
      <AlertDialog
        isOpen={openCreateCategory}
        leastDestructiveRef={cancelRef}
        onClose={() => setOpenCreateCategory(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Create Subctegory for {cat.name}
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
              {loading ? (
                <Spinner />
              ) : (
                <Button
                  variant="primary"
                  ref={cancelRef}
                  onClick={handleCreateSubCategory}
                >
                  Create
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Alert Dialog - Delete Category */}
      <AlertDialog
        isOpen={openDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setOpenDelete(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deleting {cat.name}
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              Are you sure that you want to delete this category?
            </AlertDialogBody>

            <AlertDialogFooter>
              {loading ? (
                <HStack>
                  <Text>Deleting Category</Text>
                  <Box w="10px" />
                  <Spinner />
                </HStack>
              ) : (
                <>
                  <Button
                    variant="tomato"
                    ref={cancelRef}
                    onClick={() => setOpenDelete(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    ref={cancelRef}
                    onClick={handleDeleteCategory}
                  >
                    {"I'm sure."}
                  </Button>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack
        minH="600px"
        maxH="600px"
        minW={{ lg: "600px", md: "600px", sm: "full" }}
        maxW={{ lg: "600px", md: "600px", sm: "full" }}
        borderRadius="10px"
        overflowY="scroll"
      >
        <HStack w="full">
          <Box w="10px" />
          <Text fontSize="30px" fontWeight="bold">
            {cat.name}
          </Text>
          <Spacer />
          <Button
            variant="info"
            bg={bgIconsButton}
            onClick={() => setCreateTaskIsOpen(true)}
          >
            <EditIcon />
          </Button>
          <Button variant="info" bg={bgIconsButton} onClick={onOpen}>
            <InfoIcon />
          </Button>
          <Button variant="secundary" onClick={() => setOpenEdit(true)}>
            Edit
          </Button>
          <Button variant="secundary" onClick={() => setOpenDelete(true)}>
            <DeleteIcon />
          </Button>
        </HStack>
        <Box h="5px" />
        <Divider />
        <Box h="5px" />
        <HStack w="full">
          <Box w="10px" />
          <Text fontSize="25px" fontWeight="bold">
            Subcategories
          </Text>
          <Spacer />
          <Button
            variant="info"
            bg={bgIconsButton}
            onClick={() => setOpenCreateCategory(true)}
          >
            <AddIcon />
          </Button>
          <Box w="10px" />
        </HStack>
        <HStack w="full" overflowX='scroll'>
          {cat.subCategories.map((subcat, idx) => (
            <MiniCategory cat={subcat} key={idx} />
          ))}
        </HStack>
        <Box h="5px" />

        {cat.tasks.map((task, idx) => (
          <TaskComponent task={task} key={idx} />
        ))}
        <Spacer />
      </VStack>
    </>
  );
};
