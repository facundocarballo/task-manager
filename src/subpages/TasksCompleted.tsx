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
import React from 'react';
import { useProvider } from '../context';
import { getAllTaskCompleted, getTaskFilterByAccomplishTime, getTaskFilterByCategory, getTaskFilterByDate } from '../handlers/task';
import { getStringDate } from '../handlers/date';
import { FilterItem } from '../components/FilterItem';
import { getCategoryIdFromName } from '../handlers/categories';
import { FilterDate, Handler, SetFunc } from '../components/FilterDate';

export const TasksCompleted = () => {
    // Attributes
    const [accomplishTime, setAccomplishTime] = React.useState<string>('Default');
    const [categoryName, setCategoryName] = React.useState<string>('Default');
    const [firstDate, setFirstDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef(null);

    // Context
    const { categories, tasksCompleted, setTasksCompleted } = useProvider();

    // Methods
    const showCorrectIcon = (timeExpected: number | undefined, timeReal: number | undefined) => {
        if (timeReal == undefined) return <Text>🚫</Text>
        if (timeExpected == undefined) return <Text>✅</Text>
        if (timeReal > timeExpected) return <Text>🚫</Text>
        return <Text>✅</Text>
    }
    const getCategoryName = (id: number): string => {
        if (categories == null) return "Don't found category with that id";
        return categories[id].title
    }
    const getCategories = (): string[] => {
        if (categories == null) return [];
        const categoriesName: string[] = ['Default'];
        for (const cat of categories) {
            categoriesName.push(cat.title)
        }
        return categoriesName;
    }

    const handleSetDate: Handler = (e: string, func: SetFunc) => {
        const date = new Date(e);
        func(date);
    };

    const filterData = () => {
        if (categories == null) return;

        const categoryId = getCategoryIdFromName(categoryName, categories);

        const allTasksCompleted = getAllTaskCompleted(categories);

        const tasksFilterByAccomplishTime = getTaskFilterByAccomplishTime(allTasksCompleted, accomplishTime);

        const tasksFilterByCategory = getTaskFilterByCategory(tasksFilterByAccomplishTime, categoryId);

        const tasksFilterByDate = getTaskFilterByDate(tasksFilterByCategory, firstDate, endDate);

        onClose();
        setTasksCompleted(tasksFilterByDate);
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
                                title='Accomplish Time'
                                options={['Default', '✅ YES', '🚫 NO']}
                                selected={accomplishTime}
                                setSelected={setAccomplishTime}
                            />
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
                            <Heading>{tasksCompleted.length} Task{tasksCompleted.length > 1 ? 's' : null} Completed</Heading>
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
                                            <Th>Date Ended</Th>
                                            <Th>Accomplish Time</Th>
                                            <Th>Category</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            tasksCompleted.map((task) => (
                                                <Tr>
                                                    <Td>{task.title}</Td>
                                                    <Td>{getStringDate(task.dateCreated)}</Td>
                                                    <Td>{getStringDate(task.dateEnded)}</Td>
                                                    <Td>{showCorrectIcon(task.dateMustEnd?.getTime(), task.dateEnded?.getTime())}</Td>
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