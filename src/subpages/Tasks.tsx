import { HStack, Heading, Spacer, VStack, Box, Button } from '@chakra-ui/react';
import React from 'react';
import { TheDivider } from '../components/TheDivider';
import { Task } from '../components/Task';
import { Category } from '../components/Category';

export const Tasks = () => {
    // Attributes
    // Context
    // Methods
    const handleShowMore = async () => {

    }
    // Component
    return (
        <VStack>
            <Heading>Tasks</Heading>
            <Task />
            <Task />
            <Button variant='secundary' onClick={handleShowMore}>
                Show More
            </Button>
        </VStack>
    );
}