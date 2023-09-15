import { DeleteIcon, DragHandleIcon, InfoIcon } from '@chakra-ui/icons';
import { HStack, VStack, Box, Text, useDisclosure, Divider, Button, Spacer } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import React, { ReactElement } from 'react';
import { useProvider } from '../context';
import { TaskInfo } from './TaskInfo';
import { getStringDate } from '../handlers/date';
import { deleteTask } from '../handlers/task';
import { copyCategories } from '../handlers/categories';
import { Task } from '@/types/task';

interface ITaskProps {
    task: Task
}

export const TaskComponent = ({ task }: ITaskProps) => {
    // Attributes
    const [mouseEnter, setMouseEnter] = React.useState<boolean>(false);
    // AlertDialog Attributes
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)

    // Context
    const { categories, setCategories, tasksCompleted, setTasksCompleted, setTasksDeleted, tasksDeleted } = useProvider();
    // Methods
    const handleMouseEnter = () => {
        setMouseEnter(true);
    }
    const handleMouseLeave = () => {
        setMouseEnter(false);
    }
    const handleCompleteTask = () => {
        // if (categories == null) return;
        // let cats = copyCategories(categories);
        // const tasks = deleteTask(task, cats[task.category_id].tasks);
        // cats[task.category_id].tasks = tasks;
        // task.dateEnded = new Date();
        // cats[task.category_id].tasksCompleted.push(task);

        // setCategories(cats);
        // setTasksCompleted([...tasksCompleted, task])
    }
    const handleDeleteTask = () => {
        // if (categories == null) return;
        // let cats = copyCategories(categories);
        // const tasks = deleteTask(task, cats[task.category_id].tasks);
        // cats[task.category_id].tasks = tasks;
        // task.dateEnded = new Date();
        // cats[task.category_id].tasksDeleted.push(task);

        // setCategories(cats);
        // setTasksDeleted([...tasksDeleted, task])
    };

    // SubComponents    
    const renderDragIcon = (): ReactElement<any> | null => {
        if (mouseEnter) {
            return (
                <>
                    <Box w='5px' />
                    <DragHandleIcon
                        cursor='pointer'
                        _hover={{
                            shadow: 'lg',
                            transform: 'scale(1.1)',
                        }}
                    />
                </>
            );
        }
        return <>
            <Box w='30px' />
        </>;
    }
    
    const renderInfoBtn = (): ReactElement<any> | null => {
        if (mouseEnter) {
            return (
                <Button variant='info' onClick={onOpen}>
                    <InfoIcon />
                </Button>
            )
        }

        return null;
    }
    
    const renderDeleteBtn = (): ReactElement<any> | null => {
        if (mouseEnter) {
            return (
                <Button
                    variant='info'
                    onClick={handleDeleteTask}
                >
                    <DeleteIcon />
                </Button>
            )
        }

        return null;
    }
    // Component
    return (
        <>
            {/* Alert Dialog - Task Info */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {task.name}
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />

                        <AlertDialogBody>
                            <TaskInfo
                                title="Description"
                                value={task.description}
                            />
                            <TaskInfo
                                title="Date Created"
                                value={getStringDate(task.dates.created)}
                            />
                            <TaskInfo
                                title="Date Must End"
                                value={getStringDate(task.dates.mustEnd)}
                            />

                        </AlertDialogBody>

                        <AlertDialogFooter>

                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <VStack
                w='full'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <HStack w='full'>
                    {renderDragIcon()}
                    <Box w='3px' />
                    <Box
                        minW='35px'
                        maxW='35px'
                        minH='35px'
                        maxH='35px'
                        border='1px solid'
                        borderRadius='10px'
                        onClick={handleCompleteTask}
                        cursor='pointer'
                    />
                    <Text
                    >
                        {task.name}
                    </Text>
                    <Spacer />
                    {renderInfoBtn()}
                    {renderDeleteBtn()}
                    <Box w='3px' />
                </HStack>
                <Divider />
            </VStack>
        </>
    );
}