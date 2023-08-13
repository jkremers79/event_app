import React, { useContext, useState, useRef } from "react";
import { ApplicationData } from "../components/Root";

import { Link, useParams } from "react-router-dom";
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
  const { users, events, categories } = useContext(ApplicationData);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const cancelRef = useRef();
  const toast = useToast();

  const { eventId } = useParams();
  const selectedEventId = Number(eventId);
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const handleDelete = async () => {
    const deleteEvent = await fetch(
      `http://localhost:3000/events/${selectedEventId}`,
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

  const eventCreator = users.find(
    (user) => user.id === selectedEvent.createdBy
  );

  return (
    <Box>
      <Heading>Event</Heading>

      <Button colorScheme="red" onClick={onDeleteOpen}>
        Delete event
      </Button>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
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
              <Button ref={cancelRef} onClick={onDeleteClose}>
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
