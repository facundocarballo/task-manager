import { VStack, Text, Box, Divider } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure
} from '@chakra-ui/react'
import React from 'react';
import { Category, ICategory } from './Category';
import { getNumberOfTasks } from '../handlers/task';
import { useProvider } from '../context';
import { copyCategories } from '../handlers/categories';
import { handleDragAndDrop } from '../handlers/dragAndDrop';

export interface IMiniCategory {
    cat: ICategory
}

let catDrag: ICategory|null = null;
let catDrop: ICategory|null = null;

export const MiniCategory = ({ cat }: IMiniCategory) => {
    // Attributes
    // Alert Dialog
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)
    // Context
    const { categories, setCategories } = useProvider();
    // Methods
    // Drag and Drop Categories
    const handleOnDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (categories == null) return;
        catDrag = cat;
    };

    const handleOnDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        if (categories == null) return;
        catDrop = cat;
    };

    const handleOnDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        if (categories == null) return;
        if (catDrag == null || catDrop == null) return;
        let cats = copyCategories(categories);
        cats = handleDragAndDrop(catDrag.id, catDrop.id, cats);
        setCategories(cats)
    }
    // Component
    return (
        <>

            {/* Alert Dialog - Show Complete Category */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                size='2xl'
            >
                <AlertDialogOverlay>
                    <AlertDialogContent >
                        <AlertDialogHeader bg={`#${cat.color}`} fontSize='lg' fontWeight='bold'>
                            Category
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />

                        <AlertDialogBody>
                            <Category
                                color={cat.color}
                                description={cat.description}
                                id={cat.id}
                                tasks={cat.tasks}
                                title={cat.title}
                                tasksCompleted={cat.tasksCompleted}
                                tasksDeleted={cat.tasksDeleted}
                            />
                        </AlertDialogBody>

                        <AlertDialogFooter>

                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <VStack
                w='250px'
                bg={`${cat.color}`}
                borderRadius='10px'
                _hover={{
                    transform: 'scale(1.1)',
                    shadow: 'lg',
                    cursor: 'pointer'
                }}
                onClick={onOpen}
                draggable
                onDragStart={(e) => handleOnDragStart(e)}
                onDragEnter={(e) => handleOnDragEnter(e)}
                onDragEnd={(e) => handleOnDragEnd(e)}
            >
                <Box h='1px' />
                <Text
                    fontWeight='bold'
                    fontSize='18px'
                >
                    {cat.title}
                </Text>
                <Divider />
                <Text>{getNumberOfTasks(cat.tasks)}</Text>
                <Box h='5px' />
            </VStack>
        </>
    );
}