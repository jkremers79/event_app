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
  Center,
} from "@chakra-ui/react";

export async function loader() {
  console.log("Firing loader");
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

  const handleSearch = (searchString) => {
    setSearchQuery(searchString);
    const items = events.filter((event) => {
      const searchData = event.description + " " + event.title;
      return searchData
        .toLowerCase()
        .includes(searchString.toLocaleLowerCase());
    });

    if (filter !== "") {
      setFilter("");
    }
    setEventsFiltered(items);
  };

  const handleFilter = (id) => {
    const items = events.filter((event) =>
      event.categoryIds.includes(Number(id))
    );

    if (searchQuery !== "") {
      setSearchQuery("");
    }

    setEventsFiltered(items);
    setFilter(id);
  };

  const handleReset = () => {
    setEventsFiltered(events);
    setSearchQuery("");
    setFilter("");
  };

  //

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

        <Center>
          <Input
            value={searchQuery}
            placeholder="Type to search.."
            onChange={(e) => handleSearch(e.target.value)}
            width={"400px"}
          />
        </Center>

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
