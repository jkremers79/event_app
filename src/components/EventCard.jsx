import { Link } from "react-router-dom";
import { Box, Heading, Text, Flex, Tag, Image } from "@chakra-ui/react";

export const EventCard = ({ event, categories }) => {
  const startDateTime = event.startTime.split("T");
  const endDateTime = event.endTime.split("T");

  const startDate = startDateTime[0].split("-").reverse().join("/");
  const startTime = startDateTime[1].slice(0, 5);

  const endDate = endDateTime[0].split("-").reverse().join("/");
  const endTime = endDateTime[1].slice(0, 5);

  return (
    <Box width={{ base: "275px", md: "400px" }} height={"auto"}>
      <Link to={`/event/${event.id}`}>
        <Flex
          rowGap={"0.5rem"}
          flexDirection={"column"}
          alignItems={"center"}
          className="event"
          padding={"1rem"}
          marginBottom={"1rem"}
          background={"hsl(0, 0%, 96%)"}
          borderRadius={"50px"}
        >
          <Heading size={"md"}>{event.title}</Heading>
          <Text>{event.description}</Text>
          <Box>
            <Text>{`Starts: ${startDate} at ${startTime}`}</Text>
            <Text>{`Ends: ${endDate} at ${endTime}`}</Text>
          </Box>
          <Image
            src={event.image}
            width={{ base: "250px", md: "300px" }}
            height={{ base: "250px", md: "300px" }}
            objectFit={"cover"}
          />
          <Box>
            {categories
              .filter((category) => event.categoryIds.includes(category.id))
              .map((category) => (
                <Tag
                  colorScheme="blue"
                  key={category.id}
                  marginLeft={"0.25em"}
                  marginRight={"0.25em"}
                >
                  {category.name}
                </Tag>
              ))}
          </Box>
        </Flex>
      </Link>
    </Box>
  );
};
