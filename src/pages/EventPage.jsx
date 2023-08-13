import React, { useContext, useState, useRef } from "react";

import { useLoaderData, Link } from "react-router-dom";
import {
  Heading,
  Box,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const { event, users } = useLoaderData();
  const toast = useToast();

  const handleDelete = async () => {
    const deleteEvent = await fetch(
      `http://localhost:3000/events/${event.id}`,
      {
        method: "DELETE",
      }
    );

    if (deleteEvent.ok) {
      toast({
        title: "Succes",
        status: "success",
        description: "Event deleted succesfully",
      });
    } else {
      toast({
        title: "Error",
        status: "error",
        description: "Something went wrong, event couldn't be deleted",
      });
    }
  };

  const eventCreator = users.find((user) => user.id === event.createdBy);

  console.log(eventCreator);

  return (
    <Box>
      <Heading>Event</Heading>

      <Button colorScheme="red" onClick={onOpen}>
        Delete event
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

//loader function
export async function loader({ params }) {
  const fetchEvent = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const fetchUsers = await fetch(`http://localhost:3000/users/`);

  return {
    event: await fetchEvent.json(),
    users: await fetchUsers.json(),
  };
}
