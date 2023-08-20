import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink, Center } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Center>
            <ChakraLink
              marginTop={"1vH"}
              marginBottom={"2vH"}
              as={ReactRouterLink}
              to="/"
            >
              Show list of events
            </ChakraLink>
          </Center>
        </li>
      </ul>
    </nav>
  );
};
