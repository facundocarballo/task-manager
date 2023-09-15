import { EditIcon, InfoIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React from "react";
import { TaskComponent } from "./Task";
import { InputInfo } from "./InputInfo";
import { CreateCategory } from "./CreateCategory";
import { Category } from "@/types/category";
import { useProvider } from "../context";

export interface ICategoryComponent {
  cat: Category;
}

export const CategoryComponent = ({ cat }: ICategoryComponent) => {
  // Attributes
  const taskDraggable = React.useRef<any>(null);
  const taskReplaced = React.useRef<any>(null);
  const bgIconsButton = useColorModeValue("light.bg", "dark.bg");
  // Create Task
  const [createTaskIsOpen, setCreateTaskIsOpen] =
    React.useState<boolean>(false);
  const [taskTitle, setTaskTitle] = React.useState<string>("");
  const [taskDescription, setTaskDescription] = React.useState<string>("");
  const [taskEndDate, setTaskEndDate] = React.useState<Date>(new Date(0));
  // Edit Category
  const [newTitle, setNewTitle] = React.useState<string>("");
  const [newDescription, setNewDescription] = React.useState<string>("");
  const [newColor, setNewColor] = React.useState<string>("");
  // Alert Dialog
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  // Methods
  const handleSetDate = (e: string) => {
    const date = new Date(e);
    setTaskEndDate(date);
  };

  const handleCreateTask = async () => {
   await cat.CreateTask(taskTitle, taskDescription, taskEndDate);
   setCreateTaskIsOpen(false);
  };

  const handleSaveEditCategory = () => {
    // if (categories == null) return;
    // let cats = copyCategories(categories);
    // cats[id].color = newColor;
    // cats[id].description = newDescription;
    // cats[id].title = newTitle;
    // setCategories(cats);
    // setOpenEdit(false);
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
              <Button
                variant="primary"
                ref={cancelRef}
                onClick={handleSaveEditCategory}
              >
                Save
              </Button>
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
              <Button variant="primary" onClick={handleCreateTask} ml={3}>
                Create Task
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack
        minH="400px"
        maxH="400px"
        minW="600px"
        maxW="600px"
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
        </HStack>
        {cat.tasks.map((task, idx) => {
          return (
            <VStack
              key={idx}
              w="full"
            >
              <TaskComponent task={task} />
            </VStack>
          );
        })}
        <Spacer />
      </VStack>
    </>
  );
};
