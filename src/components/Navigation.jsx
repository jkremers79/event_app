import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, Center } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Center>
            <ChakraLink as={ReactRouterLink} to="/" marginBottom={"0.5rem"}>
              Show list of events
            </ChakraLink>
          </Center>
        </li>
      </ul>
    </nav>
  );
};
