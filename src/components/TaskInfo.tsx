import { Divider, HStack, Spacer, Text, VStack, Box } from '@chakra-ui/react';
import React from 'react';

interface ITaskInfo {
    title: string,
    value: string | null
}

export const TaskInfo = ({title, value}: ITaskInfo) => {
   // Attributes
   // Context
   // Methods
   // Component
   return(
      <VStack>
        <HStack w='full'>
            <Box w='5px' />
            <Text fontWeight='bold' fontSize='20px'>{title}</Text>
            <Spacer />
        </HStack>
        <Text>{value}</Text>
        <Divider />
        <Box h='10px' />
      </VStack>
   );
}