import { Box, Text, HStack, Spacer, Button, Input, InputGroup, InputRightElement, Divider } from '@chakra-ui/react';
import React from 'react';
import { InputInfo } from './InputInfo';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { TheDivider } from './TheDivider';

export const CreateUserForm = () => {
    // Attributes
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    // Context
    // Methods
    const renderAlertPassword = () => {
        if (password == '' || confirmPassword == '') return null;
        if (password != confirmPassword) return (
            <Text
                color='red'
                fontWeight='bold'
            >
                Passwords doesn't match.
            </Text>
        );
        return null;
    }

    const handleCreateUser = () => {

    }
    // Component
    return (
        <>
            <InputInfo
                title='Username'
                placeholder='user1234'
                type='text'
                handler={setUsername}
                value={username}
            />
            <Text fontWeight='bold'>Password</Text>
            <InputGroup>
                <Input
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    type={showPassword ? 'text' : 'password'}
                    w='full'
                />
                <InputRightElement>
                    <Button
                        variant='info'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {
                            showPassword ? <ViewIcon /> : <ViewOffIcon />
                        }
                    </Button>
                </InputRightElement>
            </InputGroup>
            <Box h='10px' />
            <InputGroup>
                <Input
                    placeholder="Repeat your Password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    type={showPassword ? 'text' : 'password'}
                    w='full'
                />
                <InputRightElement>
                    <Button
                        variant='info'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {
                            showPassword ? <ViewIcon /> : <ViewOffIcon />
                        }
                    </Button>
                </InputRightElement>
            </InputGroup>
            {renderAlertPassword()}
            <Box h='10px' />
            <TheDivider horizontal={true} />
            <InputInfo
                title='Email'
                placeholder='facu@gmail.com'
                type='email'
                handler={setEmail}
                value={email}
            />
            <HStack w='full'>
                <Spacer />
                <Button
                    variant='primary'
                    onClick={handleCreateUser}
                >
                    CREATE USER
                </Button>
            </HStack>
        </>
    );
}