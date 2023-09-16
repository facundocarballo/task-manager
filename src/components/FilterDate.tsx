import React from 'react';
import { VStack, Text, Select, HStack, Box, Spacer, Divider, Input } from '@chakra-ui/react';

export type SetFunc = (_date: Date) => void;
export type Handler = (_str: string, setFunc: SetFunc) => void;

interface IFilterDate {
    title: string,
    values: string[] | undefined[],
    handler: Handler,
    setFuncs: SetFunc[],
}

export const FilterDate = ({ values, title, handler, setFuncs }: IFilterDate) => {
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

                <HStack w='full'>
                    <Box w='30px' />
                    <VStack w='full'>
                        <Text
                            fontWeight='semibold'
                        >
                            From
                        </Text>
                        <Input
                            value={values[0]}
                            onChange={(e) => handler(e.currentTarget.value, setFuncs[0])}
                            type="datetime-local"
                            w={{md: '190px', base: '170px'}}
                        />
                    </VStack>
                    <Spacer />
                    <VStack w='full'>
                        <Text
                            fontWeight='semibold'
                        >
                            Until
                        </Text>
                        <Input
                            value={values[1]}
                            onChange={(e) => handler(e.currentTarget.value, setFuncs[1])}
                            type="datetime-local"
                            w={{md: '190px', base: '170px'}}
                        />
                    </VStack>
                    <Box w='30px' />
                </HStack>

                <Divider />
            </VStack>
        </>
    );
}