import React, { FC } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RefreshIcon } from "@heroicons/react/solid";

type Props = {
  embed?: boolean;
  error?: string | Error | any;
  title?: string;
  text?: string;
  onRetry?: () => void;
  actions?: boolean;
};
const ErrorPane: FC<Props> = ({
  embed,
  title = "Something went wrong",
  text = `We are sorry, but something unexpected happened. We were notified
              and will be working on resolving the issue as soon as possible.`,
  error,
  onRetry,
  actions = true,
}) => {
  const router = useRouter();
  return (
    <Flex justifyContent="center">
      <Alert
        status={"error"}
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minHeight={200}
        minWidth={embed ? undefined : 350}
        maxWidth={450}
        borderRadius={8}
        pt={6}
        backgroundColor="gray.700"
      >
        <AlertIcon boxSize="30px" mr={0} color={"error"} />
        <AlertTitle mt={4} mb={1} fontSize="xl">
          {title}
        </AlertTitle>

        <AlertDescription maxWidth="sm" mt={3}>
          {process.env.NODE_ENV == "development" ? (
            <>
              {error ? (
                <Box
                  color="gray.500"
                  backgroundColor="gray.800"
                  mt={1}
                  p={2}
                  borderRadius={4}
                  fontSize="sm"
                  maxHeight={100}
                  minWidth={200}
                  overflow="auto"
                >
                  <Text textAlign="left">
                    Cause: {JSON.stringify(error.message ?? error)}
                  </Text>
                </Box>
              ) : null}
            </>
          ) : (
            <Text mb={5}>{text}</Text>
          )}

          {onRetry ? (
            <Box mt={6} mb={3}>
              <Flex gap={2} justifyContent="center">
                <Button
                  onClick={onRetry}
                  leftIcon={<RefreshIcon width={18} height={18} />}
                >
                  Retry
                </Button>
              </Flex>
            </Box>
          ) : null}
        </AlertDescription>
      </Alert>
    </Flex>
  );
};

export default ErrorPane;
