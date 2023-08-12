import React, { useState } from "react";
import { EventCard } from "../components/EventCard";
import { useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Heading,
  Box,
  Flex,
  Radio,
  RadioGroup,
  Button,
  Input,
  Center,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
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
  const { events, categories, users } = useLoaderData();
  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

    const newPost = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (newPost.ok) {
      toast({
        title: "Succes",
        description: "Event was added",
        duration: 10000,
        isClosable: true,
      });
    }
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
        <RadioGroup value={Number(categoryFilter)} onChange={handleFilter}>
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
              <FormLabel>Title of event</FormLabel>
              <Input
                type="text"
                {...register("title", { required: true })}
                placeholder="Title of event"
                marginBottom={"1rem"}
              />

              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                {...register("description", { required: true })}
                placeholder="Describe the event"
                marginBottom={"1rem"}
              />

              <FormLabel>Image</FormLabel>
              <Input
                type="text"
                {...register("image", { required: true })}
                placeholder="Provide a hyperlink of the image"
                marginBottom={"1rem"}
              />

              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                {...register("location", { required: true })}
                placeholder="Event location"
                marginBottom={"1rem"}
              />

              <FormLabel>Start time</FormLabel>
              <Input
                type="datetime-local"
                {...register("startTime", { required: true })}
                placeholder="Event location"
                marginBottom={"1rem"}
              />

              <FormLabel>End time</FormLabel>
              <Input
                type="datetime-local"
                {...register("endTime", { required: true })}
                placeholder="Event location"
                marginBottom={"1rem"}
              />

              <HStack spacing="1rem" marginBottom={"1rem"}>
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

              <Select
                placeholder="Select event organiser"
                {...register("createdBy", { required: true })}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
              <Center>
                <Button
                  colorScheme="blue"
                  type="submit"
                  marginTop={"1rem"}
                  marginBottom={"1rem"}
                >
                  Add event
                </Button>
              </Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

//loader function
export async function loader() {
  console.log("Firing loader");
  const fetchEvents = await fetch("http://localhost:3000/events");
  const fetchCategories = await fetch("http://localhost:3000/categories");
  const fetchUsers = await fetch(`http://localhost:3000/users/`);

  return {
    events: await fetchEvents.json(),
    categories: await fetchCategories.json(),
    users: await fetchUsers.json(),
  };
}
