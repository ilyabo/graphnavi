import React from "react";
import { Flex } from "@chakra-ui/react";
import ErrorPane from "./ErrorPane";

type Props = {
  children?: React.ReactNode;
};
type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Flex
          position={"absolute"}
          mx="auto"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <div>
            <ErrorPane />
          </div>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
