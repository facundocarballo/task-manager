import React from "react";
import Image from "next/image";
import {
  HStack,
  VStack,
  Box,
  Heading,
  Spacer,
  Text,
  Button,
} from "@chakra-ui/react";
import { useProvider } from "../context";
import Link from "next/link";

export const NavBar = () => {
  // Attributes
  // Context
  const { user } = useProvider();
  // Methods
  // Component
  if (user === null) return null;
  return (
    <>
      <VStack w="full">
        <Box h="10px" />
        <HStack w="full">
          <Box w="10px" />
          <Heading>Task Manager</Heading>
          <Spacer />
          <Link href={"/"}>
            <Button variant="info">{"Tasks ToDo"}</Button>
          </Link>
          <Link href={"/tasksCompleted"}>
            <Button variant="info">{"Tasks Completed"}</Button>
          </Link>
          <Link href={"/tasksDeleted"}>
            <Button variant="info">{"Tasks Deleted"}</Button>
          </Link>
          <Image alt="userPhoto" src={user.photoUrl} width={50} height={50} />
          <Box w="10px" />
        </HStack>
      </VStack>
    </>
  );
};
