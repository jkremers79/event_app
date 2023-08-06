import { Link } from "react-router-dom";
import { Box, Heading, Text, Flex, Tag, Image } from "@chakra-ui/react";

export const EventCard = ({ event, categories }) => {
  return (
    <Box width={"400px"} height={"auto"}>
      <Link to={`/event/${event.id}`}>
        <Flex
          rowGap={"0.5rem"}
          flexDirection={"column"}
          alignItems={"center"}
          className="event"
          padding={"1rem"}
          border={"solid hsl(220, 9%, 15%) 2px"}
          borderRadius={"20px"}
          marginBottom={"1rem"}
          background={"hsl(0, 0%, 96%)"}
        >
          <Heading size={"md"}>{event.title}</Heading>
          <Text>{event.description}</Text>
          <Box>
            <Text>
              Starts: {event.startTime.slice(0, 10)} at{" "}
              {event.startTime.slice(11, 16)}
            </Text>
            <Text>
              Ends: {event.endTime.slice(0, 10)} at{" "}
              {event.endTime.slice(11, 16)}
            </Text>
          </Box>
          <Image
            src={event.image}
            width={"300px"}
            height={"300px"}
            objectFit={"cover"}
          />
          <Box>
            {categories
              .filter((category) => event.categoryIds.includes(category.id))
              .map((category) => (
                <Tag
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
