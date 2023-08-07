import React, { useState, useEffect } from "react";
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

export const EventsPage = () => {
  const { events, categories } = useLoaderData();

  const [eventsFiltered, setEventsFiltered] = useState(events);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    const fetchEvents = await fetch(
      `http://localhost:3000/events?q=${searchQuery}`
    );

    setEventsFiltered(await fetchEvents.json());
  };

  const handleFilter = async (id) => {
    const fetchEvent = await fetch(
      `http://localhost:3000/events?categoryIds_like=${id}`
    );

    setFilter(id);
    setEventsFiltered(await fetchEvent.json());
  };

  const handleReset = () => {
    setEventsFiltered(events);
    setSearchQuery("");
    setFilter("");
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
            <Radio key={category.id} value={category.id}>
              {" "}
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
        {eventsFiltered.map((event) => (
          <EventCard key={event.id} event={event} categories={categories} />
        ))}
      </Flex>
    </Box>
  );
};
