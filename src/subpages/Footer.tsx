import { HStack, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import { SocialIcon } from 'react-social-icons';

export const Footer = () => {
    // Attributes
    const year = new Date().getFullYear();
    const ig = "https://instagram.com/facundocarballo_";
    const yt = 'https://www.youtube.com/@facucarballo_en';
    const github = 'https://github.com/facundocarballo/task-manager';
    const stylesButtonsFooter: React.CSSProperties = {
        height: '30px', width: '30px'
    };
    // Context
    // Methods
    // Component
    return (
        <HStack w='full'>
            <Spacer />
            <Text>©{year} Facundo Carballo.</Text>
            <Spacer />
            <Text>All rights reserved.</Text>
            <Spacer />
            <SocialIcon
                url={ig}
                style={stylesButtonsFooter}
                target='_blank'
            />
            <SocialIcon
                url={yt}
                style={stylesButtonsFooter}
                target='_blank'
            />
            <SocialIcon
                url={github}
                style={stylesButtonsFooter}
                target='_blank'
            />
            <Spacer />
        </HStack>

    );
}