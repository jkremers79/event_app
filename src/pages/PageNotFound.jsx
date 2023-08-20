import React from "react";
import { Link } from "react-router-dom";
import { Heading, VStack } from "@chakra-ui/react";

export const PageNotFound = () => {
  return (
    <VStack>
      <Link to={"/"}>To Homepage</Link>
      <Heading marginTop={"3rem"}>HTTP-404: Page not found</Heading>
    </VStack>
  );
};
