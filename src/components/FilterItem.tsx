import { VStack, Text, Select, HStack, Box, Spacer, Divider } from '@chakra-ui/react';
import React from 'react';

interface IFilterItem {
    title: string,
    options: string[],
    selected: string,
    setSelected: (_selected: string) => void
}

export const FilterItem = ({ title, options, selected, setSelected }: IFilterItem) => {
    // Attributes
    // Context
    // Methods
    // Component
    return (
        <>
            <VStack w='full'>
                <HStack w='full'>
                    <Box w='10px' />
                    <Text fontWeight='bold' fontSize='20px'>{title}</Text>
                    <Spacer />
                </HStack>

                <Select
                    w='90%'
                    value={selected}
                    onChange={(e) => setSelected(e.currentTarget.value)}
                >
                    {
                        options.map((op) => (
                            <option value={op}>{op}</option>
                        ))
                    }
                </Select>

                <Divider />
            </VStack>
        </>
    );
}