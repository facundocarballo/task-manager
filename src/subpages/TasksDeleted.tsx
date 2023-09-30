import React from "react";
import {
  HStack,
  Heading,
  Spacer,
  VStack,
  Box,
  Button,
  useDisclosure,
  // Table
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  // Alert Dialog
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  // Alert Dialog
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useProvider } from "../context";
import { getStringDate } from "../handlers/date";
import { FilterItem } from "../components/FilterItem";
import { FilterDate, Handler, SetFunc } from "../components/FilterDate";
import { Task } from "@/types/task";
import { GetCategories } from "../handlers/filter";


let set: boolean = false;

export const TasksDeleted = () => {
  // Attributes
  const [categoryName, setCategoryName] = React.useState<string>("Default");
  const [firstDate, setFirstDate] = React.useState<Date|undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date>(new Date(Date.now()));
  const [allTasks, setAllTasks] =  React.useState<Task[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  // Context
  const { user, tasksDeleted, setTasksDeleted } = useProvider();
  // Methods
  const handleSetDate: Handler = (e: string, func: SetFunc) => {
    const date = new Date(e);
    func(date);
  };
  
  const filterData = () => {
    if (user == null) return;
    const cat = user.GetCategoryFromName(categoryName);
    let fileteredTasks: Task[] = [];

    if (cat === undefined) {
      // Es default.
      if(firstDate === undefined) {
        setTasksDeleted(user.tasksDeleted);
        onClose();
        return
      }

      fileteredTasks = Task.FilterTasksByDates(allTasks, firstDate, endDate, false);
  
      onClose();
      setTasksDeleted(fileteredTasks);
      clearInputs();
      return
    }

    if(firstDate === undefined) {
      setTasksDeleted(cat.tasksDeleted);
      onClose();
      clearInputs();
      return
    }
    
    fileteredTasks = Task.FilterTasksByDates(cat.tasksDeleted, firstDate, endDate, false);

    setTasksDeleted(fileteredTasks);
    onClose();
    clearInputs();
  };

  const clearInputs = () => {
    setCategoryName("Default");
    setFirstDate(undefined);
    setEndDate(new Date(Date.now()))
  };

  React.useEffect(() => {
    if (user === null) return;
    if (!set && tasksDeleted.length !== 0) {
      set = true;
      setAllTasks(tasksDeleted);
    }
  },);

  // Component
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Filter Tasks Completed
            </AlertDialogHeader>
            <AlertDialogCloseButton />

            <AlertDialogBody>
              <FilterItem
                title="Category"
                options={GetCategories(user)}
                selected={categoryName}
                setSelected={setCategoryName}
              />
              <FilterDate
                title="Date (Ended)"
                values={[undefined, undefined]}
                handler={handleSetDate}
                setFuncs={[setFirstDate, setEndDate]}
              />
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="primary" onClick={filterData}>
                FILTER
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {user == null ? null : (
        <>
          <Accordion w="full" allowToggle>
            <AccordionItem w="full">
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Heading>
                    {tasksDeleted.length} Task
                    {tasksDeleted.length > 1 ? "s" : null} Deleted
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack w="full">
                  <HStack w="full">
                    <Spacer />
                    <Button variant="secundary" onClick={onOpen}>
                      FILTER
                    </Button>
                    <Box w="10px" />
                  </HStack>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Task Title</Th>
                          <Th>Date Created</Th>
                          <Th>Date Deleted</Th>
                          <Th>Category</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tasksDeleted.map((task, idx) => (
                          <Tr key={idx}>
                            <Td>{task.name}</Td>
                            <Td>{getStringDate(task.dates.created)}</Td>
                            <Td>{getStringDate(task.dates.deleted)}</Td>
                            <Td>{task.categoryName}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </>
      )}
    </>
  );
};
