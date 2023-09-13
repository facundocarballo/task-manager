import { Box, Button, Grid, GridItem, HStack, Heading, Spacer, VStack, useDisclosure } from '@chakra-ui/react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
} from '@chakra-ui/react'
import React from 'react';
import { ICategory } from '../components/Category';
import { useProvider } from '../context';
import { copyCategories } from '../handlers/categories';
import { handleDragAndDrop } from '../handlers/dragAndDrop';
import { CreateCategory } from '../components/CreateCategory';
import { MiniCategory } from '../components/MiniCategory';

export const Categories = () => {
    // Attributes
    const [newTitle, setNewTitle] = React.useState<string>('');
    const [newDescription, setNewDescription] = React.useState<string>('');
    const [newColor, setNewColor] = React.useState<string>('dark.bg');

    const catDrag = React.useRef<any>(null);
    const catDrop = React.useRef<any>(null);
    // Alert Dialog
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef(null)
    // Context
    const { categories, setCategories } = useProvider();
    // Methods
    const handleOnDragEnd = () => {
        if (categories == null) return;
        let cats: ICategory[] = copyCategories(categories);
        let newCats = handleDragAndDrop(
            catDrag.current,
            catDrop.current,
            cats
        );
        // cats = newCats;
        setCategories(newCats);
    };
    const handleCreateCategory = () => {
        if (categories == null) return;
        let cats = copyCategories(categories);
        const catId = cats.length;
        cats.push({
            color: newColor,
            description: newDescription,
            title: newTitle,
            id: catId,
            tasks: [],
            tasksCompleted: [],
            tasksDeleted: []
        });
        setCategories(cats);
        onClose();
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
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
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
                            <Button variant='primary' onClick={handleCreateCategory}>
                                CREATE CATEGORY
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <VStack w='full'>
                <HStack w='full'>
                    <Box w='20px' />
                    <Heading>Categories</Heading>
                    <Spacer />
                    <Button variant='secundary' onClick={onOpen}>
                        Create Category
                    </Button>
                    <Box w='20px' />
                </HStack>
                <Grid
                    templateColumns='repeat(3, 1fr)'
                    gap={6}
                >
                    {
                        categories == null ? null :
                            categories.map((cat, idx) =>
                                <GridItem>
                                    <MiniCategory cat={cat} />
                                </GridItem>
                            )
                    }
                </Grid>
            </VStack>
        </>
    );
}