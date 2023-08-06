import React from "react";
import { useLoaderData } from "react-router-dom";
import { Heading } from "@chakra-ui/react";

export async function loader({ params }) {
  const fetchEvent = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );

  return await fetchEvent.json();
}

export const EventPage = () => {
  const event = useLoaderData();

  console.log(event);

  return <Heading>Event</Heading>;
};
