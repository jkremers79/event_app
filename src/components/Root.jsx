import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";
import { createContext } from "react";

export const ApplicationData = createContext(null);

export const Root = () => {
  const { users, categories } = useLoaderData();

  return (
    <Box>
      <Navigation />
      <ApplicationData.Provider value={{ users, categories }}>
        <Outlet />
      </ApplicationData.Provider>
    </Box>
  );
};

export async function loader() {
  console.log("Firing loader");
  const fetchCategories = await fetch("http://localhost:3000/categories");
  const fetchUsers = await fetch(`http://localhost:3000/users/`);

  return {
    categories: await fetchCategories.json(),
    users: await fetchUsers.json(),
  };
}
