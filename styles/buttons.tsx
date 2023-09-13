import { useColorModeValue } from "@chakra-ui/react"

export const ButtonStyles = {
    variants:  {
        primary: () => ({
            bg: useColorModeValue('light.primary', 'dark.primary'),
            color: useColorModeValue('light.secundary', 'dark.secundary'),
            margin: '2px',
            _hover: {
                boxShadow: 'md',
                transform: 'scale(1.05)',
            }
        }),
        secundary: () => ({
            bg: useColorModeValue('light.secundary', 'dark.secundary'),
            color: useColorModeValue('light.bg', 'dark.bg'),
            margin: '2px',
            _hover: {
                boxShadow: 'md',
                transform: 'scale(1.05)',
            }
        }),
        info: () => ({
            bg: useColorModeValue('light.bg', 'dark.bg'),
            color: useColorModeValue('dark.bg', 'light.bg'),
            _hover: {
                boxShadow: 'md',
                transform: 'scale(1.15)',
            }
        })
    }
}