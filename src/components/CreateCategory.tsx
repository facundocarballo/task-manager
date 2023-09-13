import {
  Box,
  HStack,
  Input,
  Text,
  InputLeftAddon,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import React from "react";

export interface ICreateCategory {
  title: string;
  description: string;
  color: string;

  setTitle: (_title: string) => void;
  setDescription: (_title: string) => void;
  setColor: (_title: string) => void;
}

export const CreateCategory = ({
  title,
  description,
  color,
  setTitle,
  setDescription,
  setColor,
}: ICreateCategory) => {
  // Attributes
  // Context
  // Methods
  // Component
  return (
    <>
      <VStack w="full">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <HStack w='full'>
            <Text fontWeight='bold' fontSize='18px'>Color</Text>
            <Spacer />
        </HStack>
          <SketchPicker
            color={color}
            width="full"
            onChange={(c, _) => setColor(c.hex)}
            onChangeComplete={(c, _) => console.log("Color: ", color)}
          />
      </VStack>
    </>
  );
};
