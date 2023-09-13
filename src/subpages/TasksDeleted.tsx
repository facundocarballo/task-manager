import React from 'react';
import { HStack, Heading, Spacer, VStack, Box, Text, Button, useDisclosure } from '@chakra-ui/react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react';
import { useProvider } from '../context';
import { getStringDate } from '../handlers/date';
import { FilterItem } from '../components/FilterItem';
import { FilterDate, Handler, SetFunc } from '../components/FilterDate';
import { getCategoryIdFromName } from '../handlers/categories';
import { getAllTaskDeleted, getTaskFilterByCategory, getTaskFilterByDate } from '../handlers/task';


export const TasksDeleted = () => {
    // Attributes
    const [categoryName, setCategoryName] = React.useState<string>('Default');
    const [firstDate, setFirstDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);
    // Context
    const { categories, tasksDeleted, setTasksDeleted } = useProvider();
    // Methods
    const getCategories = (): string[] => {
        if (categories == null) return [];
        const categoriesName: string[] = ['Default'];
        for (const cat of categories) {
            categoriesName.push(cat.title)
        }
        return categoriesName;
    }
    const getCategoryName = (id: number): string => {
        if (categories == null) return "Don't found category with that id";
        return categories[id].title
    }
    const handleSetDate: Handler = (e: string, func: SetFunc) => {
        const date = new Date(e);
        func(date);
    };
    const filterData = () => {
        if (categories == null) return;

        const categoryId = getCategoryIdFromName(categoryName, categories);

        const allTasksDeleted = getAllTaskDeleted(categories);

        const tasksFilterByCategory = getTaskFilterByCategory(allTasksDeleted, categoryId);

        const tasksFilterByDate = getTaskFilterByDate(tasksFilterByCategory, firstDate, endDate);

        onClose();
        setTasksDeleted(tasksFilterByDate);
        return;
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
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Filter Tasks Completed
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />

                        <AlertDialogBody>
                            <FilterItem
                                title='Category'
                                options={getCategories()}
                                selected={categoryName}
                                setSelected={setCategoryName}
                            />
                            <FilterDate
                                title="Date"
                                values={[undefined, undefined]}
                                handler={handleSetDate}
                                setFuncs={[setFirstDate, setEndDate]}
                            />
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button variant='primary' onClick={filterData}>
                                FILTER
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <Accordion w='full' allowToggle>
                <AccordionItem w='full'>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                            <Heading>{tasksDeleted.length} Task{tasksDeleted.length > 1 ? 's' : null} Deleted</Heading>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <VStack w='full'>
                            <HStack w='full'>
                                <Spacer />
                                <Button variant='secundary' onClick={onOpen}>
                                    FILTER
                                </Button>
                                <Box w='10px' />
                            </HStack>
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                        <Tr>
                                            <Th>Task Title</Th>
                                            <Th>Date Created</Th>
                                            <Th>Date Deleted</Th>
                                            <Th>Category</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            tasksDeleted.map((task) => (
                                                <Tr>
                                                    <Td>{task.title}</Td>
                                                    <Td>{getStringDate(task.dateCreated)}</Td>
                                                    <Td>{getStringDate(task.dateEnded)}</Td>
                                                    <Td>{getCategoryName(task.category_id)}</Td>
                                                </Tr>
                                            )
                                            )
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    );
}