import React, { useState, useContext } from "react";
import { EventCard } from "../components/EventCard";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ApplicationData } from "../components/Root";
import {
  Heading,
  Box,
  Flex,
  Radio,
  RadioGroup,
  Button,
  Input,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  useToast,
  Checkbox,
  FormLabel,
  Select,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";

export const EventsPage = () => {
  const { users, categories } = useContext(ApplicationData);
  const events = useLoaderData();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const [eventsFiltered, setEventsFiltered] = useState(events);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Functions for filtering events displayed on screen
  const handleSearch = (searchString) => {
    setSearchQuery(searchString);
    const items = events.filter((event) => {
      const searchData = event.description + " " + event.title;
      return searchData
        .toLowerCase()
        .includes(searchString.toLocaleLowerCase());
    });

    // reset the categoryFilter state, it is not used with search
    if (categoryFilter !== "") {
      setCategoryFilter("");
    }

    setEventsFiltered(items);
  };

  const handleFilter = (id) => {
    setCategoryFilter(id);
    const items = events.filter((event) =>
      event.categoryIds.includes(Number(id))
    );

    // reset the searchQuery state, it is not used with the filter
    if (searchQuery !== "") {
      setSearchQuery("");
    }

    setEventsFiltered(items);
  };

  const handleReset = () => {
    setEventsFiltered(events);
    setSearchQuery("");
    setCategoryFilter("");
  };

  ////////////////////////////////////////////

  const onFormSubmit = async (data) => {
    const categoryIds = data.categoryIds.map((id) => Number(id));
    const userId = Number(data.createdBy);

    const newData = {
      ...data,
      createdBy: userId,
      categoryIds: categoryIds,
    };

    await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        } else {
          toast({
            status: "success",
            title: "Succes",
            description: "Event was added",
            duration: 10000,
            isClosable: true,
          });
          return response.json();
        }
      })
      .then((data) => {
        onClose();
        navigate(`/event/${data.id}`);
      })
      .catch((error) => {
        toast({
          status: "error",
          title: "Error while creating event",
          description: `${error}`,
          duration: 10000,
          isClosable: true,
        });
      });
  };

  const minDate = new Date().toISOString().slice(0, 16);

  const date = new Date();
  const maxYear = date.getFullYear() + 3;
  const dateNoYear = date.toISOString().slice(4, 16);
  const maxDate = maxYear + dateNoYear;

  return (
    <Box>
      <Flex
        direction={"column"}
        rowGap={"1em"}
        alignItems={"center"}
        marginBottom="0.5em"
      >
        <Heading>List of events</Heading>
        <RadioGroup value={Number(categoryFilter)} onChange={handleFilter}>
          <HStack spacing={"1rem"}>
            {categories.map((category) => (
              <Radio key={category.id} value={category.id}>
                {" "}
                {category.name}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>

        <Center>
          <Input
            value={searchQuery}
            placeholder="Type to search.."
            onChange={(e) => handleSearch(e.target.value)}
            width={"400px"}
          />
        </Center>

        <Box>
          <Button
            onClick={handleReset}
            isDisabled={!categoryFilter && !searchQuery}
          >
            Show all events
          </Button>
          <Button onClick={onOpen} marginLeft={"0.5rem"}>
            Add new event
          </Button>
        </Box>
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

      {/* Modal used to display the addEventForm */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
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
                        id="categories"
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
                    id="organiser"
                    placeholder="Select event organiser"
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
                    Add event
                  </Button>
                </Center>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export async function loader() {
  console.log("Firing postListLoader");
  const fetchEvents = await fetch("http://localhost:3000/events");
  const events = await fetchEvents.json();

  return events;
}
