import { Box, HStack, Stack, Text } from "@chakra-ui/react";

export const CommunityArticleCommentItem = ({ comment }) => {
  const { author, time, content } = comment;

  return (
    <Stack direction="column" gap="1">
      <HStack gap="2" color="black" fontSize="sm">
        <Box boxSize="6" rounded="full" bg="bg.muted" flexShrink="0" />
        <Text>{author}</Text>
        <Text>·</Text>
        <Text color="fg.muted">{time}</Text>
      </HStack>
      <Text fontSize="sm" paddingLeft="8">
        {content}
      </Text>
    </Stack>
  );
};
