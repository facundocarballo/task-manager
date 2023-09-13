import { CheckIcon } from '@chakra-ui/icons';
import { Button, HStack, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

export const SelectCategory = () => {
   // Attributes
   const [select, setSelected] = React.useState<boolean>(false);
   // Context
   // Methods
   // Component
   return(
      <>
        <HStack w='full' p='3px'>
            <Text>Category</Text>
            <Spacer />
            <Button bg='white' border='1px' w='45px' borderRadius='10px' onClick={() => setSelected(!select)}>
                {
                    select ? <CheckIcon color='green' /> : null
                }
            </Button>
        </HStack>
      </>
   );
}