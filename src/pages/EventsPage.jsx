import React, { useReducer, useState } from "react";
import { EventCard } from "../components/EventCard";
import { useLoaderData, Link } from "react-router-dom";
import {
  Heading,
  Box,
  Flex,
  Radio,
  RadioGroup,
  Button,
  Input,
} from "@chakra-ui/react";

export async function loader() {
  const fetchEvents = await fetch("http://localhost:3000/events");
  const fetchCategories = await fetch("http://localhost:3000/categories");

  return {
    events: await fetchEvents.json(),
    categories: await fetchCategories.json(),
  };
}

export const reducerFn = (eventsState, action) => {
  switch (action.type) {
    case "filter":
      return action.events;
    case "search":
      return action.events;
    case "reset":
      return action.events;

    default:
      "";
  }
};

export const EventsPage = () => {
  const { events } = useLoaderData();
  const { categories } = useLoaderData();

  const [eventsState, dispatch] = useReducer(reducerFn, events);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const fetchEvents = await fetch(
      `http://localhost:3000/events?q=${searchQuery}`
    );

    dispatch({ type: "search", events: await fetchEvents.json() });
  };

  const handleFilter = async (id) => {
    const fetchEvent = await fetch(
      `http://localhost:3000/events?categoryIds_like=${id}`
    );

    setFilter(id);
    dispatch({ type: "filter", events: await fetchEvent.json() });
  };

  const handleReset = () => {
    dispatch({ type: "reset", events });
  };

  return (
    <Box>
      <Flex
        direction={"column"}
        rowGap={"1em"}
        alignItems={"center"}
        marginBottom="0.5em"
      >
        <Heading>List of events</Heading>
        <RadioGroup value={Number(filter)} onChange={handleFilter}>
          {categories.map((category) => (
            <Radio key={category.id} value={Number(category.id)}>
              {category.name}
            </Radio>
          ))}
        </RadioGroup>

        <form onSubmit={handleSearch}>
          <Flex justifyContent={"center"} columnGap={"0.25em"}>
            <Input
              value={searchQuery}
              placeholder="Type to search.."
              onChange={(e) => setSearchQuery(e.target.value)}
              width={"400px"}
            />
            <Button type="submit" size="md">
              Search
            </Button>
          </Flex>
        </form>

        <Button onClick={handleReset}>Show all events</Button>
      </Flex>

      <Flex
        flexWrap={"wrap"}
        columnGap={"1rem"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {eventsState.map((event) => (
          <EventCard key={event.id} event={event} categories={categories} />
        ))}
      </Flex>
    </Box>
  );
};
