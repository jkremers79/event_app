import React, { useContext, useState } from "react";

import { useLoaderData } from "react-router-dom";
import { Heading } from "@chakra-ui/react";

export async function loader({ params }) {
  const fetchEvent = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await fetchEvent.json();

  const userId = event.createdBy;
  const fetchUser = await fetch(`http://localhost:3000/users/${userId}`);

  return {
    event,
    user: await fetchUser.json(),
  };
}

export const EventPage = () => {
  const { event, user } = useLoaderData();

  console.log(user);
  console.log(event);

  return <Heading>Event</Heading>;
};
