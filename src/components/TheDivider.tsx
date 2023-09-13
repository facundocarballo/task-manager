import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

export interface ITheDivider {
   horizontal: boolean
}

export const TheDivider = ({ horizontal }: ITheDivider) => {
   // Attributes
   const bg = useColorModeValue('light.divider', 'dark.divider');
   // Context
   // Methods
   // Component
   if (horizontal) {
      return (
         <>
            <Box h='10px' />
            <Box w='full' h='3px' bg={bg} />
            <Box h='10px' />
         </>
      )
   } else {
      return (
         <>
            <>
               <Box w='10px' />
               <Box h='150px' w='3px' bg={bg}  />
               <Box w='10px' />
            </>
         </>
      )
   }
}