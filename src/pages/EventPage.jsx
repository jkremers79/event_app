import React, { useContext, useRef } from "react";
import { ApplicationData } from "../components/Root";
import { useForm } from "react-hook-form";
import { useNavigate, useLoaderData } from "react-router-dom";
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
  Flex,
  Input,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
  FormLabel,
  Select,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { users, categories } = useContext(ApplicationData);
  const event = useLoaderData();
  const navigate = useNavigate();

  const eventOrganiser = users.find((user) => user.id === event.createdBy);

  // console.log(eventCreator);
  // console.log(event);

  console.log(event.categoryIds);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      title: event.title,
      description: event.description,
      image: event.image,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      createdBy: event.createdBy,
      categoryIds: true,
    },
  });

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

  const handleDelete = async () => {
    const deleteEvent = await fetch(
      `http://localhost:3000/events/${event.id}`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      if (!response.ok) {
        toast({
          status: "error",
          title: "Event couldn't be deleted: ",
          description: `http-${response.status} ${response.statusText} `,
        });
      } else {
        toast({
          title: "Succes",
          status: "success",
          description: "Event deleted succesfully",
        });
        onDeleteClose();
        navigate("/");
      }
    });
  };

  const onFormSubmit = async (data) => {
    // console.log("data");
    // console.log(data);

    const categoryIds = data.categoryIds.map((id) => Number(id));
    const userId = Number(data.createdBy);

    const newData = {
      ...data,
      createdBy: userId,
      categoryIds: categoryIds,
    };

    // console.log("newData");
    // console.log(newData);
    await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newData),
    }).then((response) => {
      if (!response.ok) {
        toast({
          status: "error",
          title: "Event couldn't be updated",
          description: `http-${response.status}: ${response.statusText}`,
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          status: "success",
          title: "Succes",
          description: "Event has been updated",
          duration: 10000,
          isClosable: true,
        });
        onFormClose();
        navigate("/");
      }
    });
    // .then(() => {
    //   onFormClose();
    //   window.location.reload();
    // })
    // .catch((stat) => {
    //   toast({
    //     status: "error",
    //     title: "Error",
    //     description: stat,
    //     duration: 10000,
    //     isClosable: true,
    //   });
    // });
  };

  const minDate = new Date().toISOString().slice(0, 16);

  const date = new Date();
  const maxYear = date.getFullYear() + 3;
  const dateNoYear = date.toISOString().slice(4, 16);
  const maxDate = maxYear + dateNoYear;

  return (
    <Box>
      <Heading>Event</Heading>

      <Button colorScheme="red" onClick={onDeleteOpen}>
        Delete event
      </Button>
      <Button colorScheme="blue" onClick={onFormOpen}>
        Edit event
      </Button>

      {/* Modal used to display the editEventForm */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isFormOpen}
        onClose={onFormClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add an event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Flex direction={"column"} rowGap={"1rem"}>
                <Box>
                  <FormLabel htmlFor="title">Title of event</FormLabel>
                  <Input
                    type="text"
                    id="title"
                    {...register("title", { required: true })}
                    placeholder="Title of event"
                  />
                  {errors.title && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="desciption">Description</FormLabel>
                  <Input
                    type="text"
                    id="desciption"
                    {...register("description", { required: true })}
                    placeholder="Describe the event"
                  />
                  {errors.description && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="image-link">Image</FormLabel>
                  <Input
                    id="image-link"
                    type="text"
                    {...register("image", { required: true })}
                    placeholder="Provide a hyperlink of the image"
                  />
                  {errors.image && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <Input
                    type="text"
                    id="location"
                    {...register("location", { required: true })}
                    placeholder="Event location"
                  />
                  {errors.location && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="start-time">Start time</FormLabel>
                  <Input
                    type="datetime-local"
                    id="start-time"
                    min={minDate}
                    max={maxDate}
                    {...register("startTime", {
                      required: true,
                    })}
                    placeholder="Event location"
                  />
                  {errors.startTime && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="end-time">End time</FormLabel>
                  <Input
                    type="datetime-local"
                    id="end-time"
                    min={minDate}
                    max={maxDate}
                    {...register("endTime", { required: true })}
                    placeholder="Event location"
                  />
                  {errors.endTime && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="categories">Categories</FormLabel>
                  <HStack spacing="1rem">
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        {...register("categoryIds", { required: true })}
                        value={category.id}
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </HStack>
                  {errors.categoryIds && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="organiser">Select an organiser</FormLabel>
                  <Select
                    placeholder="Select event organiser"
                    id="organiser"
                    {...register("createdBy", { required: true })}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                  {errors.createdBy && (
                    <span style={{ color: "red" }}>This field is required</span>
                  )}
                </Box>

                <Center>
                  <Button
                    colorScheme="green"
                    type="submit"
                    marginTop={"1rem"}
                    marginBottom={"1rem"}
                  >
                    Update event
                  </Button>
                </Center>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogCloseButton />
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

export async function loader({ params }) {
  console.log("Firing eventLoader");
  const fetchEvents = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await fetchEvents.json();

  return event;
}
