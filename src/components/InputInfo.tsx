import React from 'react';
import { Input, Text } from '@chakra-ui/react';
import { TheDivider } from './TheDivider';

export interface IInputInfo {
    title: string,
    placeholder: string,
    value: string | undefined,
    type: string,
    handler: (_value: string) => void
}

export const InputInfo = ({ title, placeholder, value, type, handler }: IInputInfo) => {
    // Attributes
    // Context
    // Methods
    // Component
    return (
        <>
            <Text fontWeight='bold'>{title}</Text>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => handler(e.currentTarget.value)}
                type={type}
                w='full'
            />
            <TheDivider horizontal={true} />
        </>
    );
}