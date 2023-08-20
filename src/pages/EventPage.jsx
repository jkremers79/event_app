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
  Text,
  Image,
  Tag,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { users, categories } = useContext(ApplicationData);
  const event = useLoaderData();
  const navigate = useNavigate();
  const cancelRef = useRef();
  const toast = useToast();

  const eventOrganiser = users.find((user) => user.id === event.createdBy);

  //these values need to be changed in order to be displayed correctly as defaultValues in the form.
  const categoryiDs = event.categoryIds.map((id) => String(id));
  const eventStartTime = event.startTime.slice(0, 16);
  const eventEndTime = event.endTime.slice(0, 16);

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
      startTime: eventStartTime,
      endTime: eventEndTime,
      createdBy: event.createdBy,
      categoryIds: categoryiDs,
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

  const handleDelete = async () => {
    await fetch(`http://localhost:3000/events/${event.id}`, {
      method: "DELETE",
    }).then((response) => {
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
    const categoryIds = data.categoryIds.map((id) => Number(id));
    const userId = Number(data.createdBy);

    const newData = {
      ...data,
      createdBy: userId,
      categoryIds: categoryIds,
    };

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
          description:
            "Event has been updated, page will refresh in a few seconds",
          duration: 10000,
          isClosable: true,
        });
        onFormClose();
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    });
  };

  const minDate = new Date().toISOString().slice(0, 16);

  const startDateTime = event.startTime.split("T");
  const endDateTime = event.endTime.split("T");

  const startDate = startDateTime[0].split("-").reverse().join("/");
  const startTime = startDateTime[1].slice(0, 5);

  const endDate = endDateTime[0].split("-").reverse().join("/");
  const endTime = endDateTime[1].slice(0, 5);

  return (
    <Box>
      <Flex
        background={"hsl(210, 16%, 98%)"}
        boxShadow={"-20px -20px 60px hsl(210, 11%, 83%)"}
        maxW={{ sm: "95%", md: "80%" }}
        margin={"auto"}
        padding={"2rem"}
        borderRadius={"3rem"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        rowGap={"1rem"}
      >
        <Heading>{event.title}</Heading>
        <Text>{event.description}</Text>

        <Image
          src={event.image}
          maxW={{ base: "90%", sm: "80%", md: "75%", xl: "50%" }}
          borderRadius={"2rem"}
        />

        <HStack>
          {categories
            .filter((category) => event.categoryIds.includes(category.id))
            .map((category) => (
              <Tag key={category.id} colorScheme="blue">
                {category.name}
              </Tag>
            ))}
        </HStack>

        <Box>
          <Text>{`Starts: ${startDate} at ${startTime}`}</Text>
          <Text>{`Ends: ${endDate} at ${endTime}`}</Text>
        </Box>

        <Image
          src={eventOrganiser.image}
          maxW={{ base: "35%", md: "25%", lg: "15%", xl: "10%" }}
          borderRadius={"50%"}
        />
        <Text>Event organised by {eventOrganiser.name}</Text>

        <Flex width={"75vW"} direction={"row"} justifyContent={"center"}>
          <Button
            colorScheme="green"
            onClick={onFormOpen}
            size={{ base: "sm", md: "md" }}
          >
            Edit event
          </Button>
          <Button
            colorScheme="red"
            onClick={onDeleteOpen}
            marginLeft={"3vW"}
            size={{ base: "sm", md: "md" }}
          >
            Delete event
          </Button>
        </Flex>
      </Flex>

      {/* Modal used to display the editEventForm */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isFormOpen}
        onClose={onFormClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit event</ModalHeader>
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
                    {...register("startTime", {
                      required: "This field is required",
                      min: {
                        value: minDate,
                        message: "Cannot enter a date in the past",
                      },
                      pattern: {
                        value: /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/,
                        message: "Invalid date selected",
                      },
                    })}
                    placeholder="Event location"
                  />
                  <span style={{ color: "red" }}>
                    {errors.startTime?.message}
                  </span>
                </Box>

                <Box>
                  <FormLabel htmlFor="end-time">End time</FormLabel>
                  <Input
                    type="datetime-local"
                    id="end-time"
                    {...register("endTime", {
                      required: "This field is required",
                      min: {
                        value: minDate,
                        message: "Cannot enter a date in the past",
                      },
                      pattern: {
                        value: /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/,
                        message: "Invalid date selected",
                      },
                    })}
                    placeholder="Event location"
                  />
                  <span style={{ color: "red" }}>
                    {errors.endTime?.message}{" "}
                  </span>
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
                    marginTop={"2vW"}
                    marginBottom={"2vW"}
                    size={{ base: "sm", md: "md" }}
                  >
                    Update event
                  </Button>
                </Center>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* //////////////// */}

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
              <Button
                ref={cancelRef}
                onClick={onDeleteClose}
                size={{ base: "sm", md: "md" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                size={{ base: "sm", md: "md" }}
              >
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
  console.log("Firing event loader");
  const fetchEvent = await fetch(
    `http://localhost:3000/events/${params.eventId}`
  );
  const event = await fetchEvent.json();

  return event;
}
