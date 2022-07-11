import {
  Flex,
  FlexProps,
  Spinner,
  SpinnerProps,
  ThemingProps,
  useTimeout,
} from '@chakra-ui/react';
import React from 'react';

const DELAY = 500;

export type Props = {
  h?: number | string;
  delayed?: boolean;
  size?: SpinnerProps['size'];
} & Omit<FlexProps, 'size' | 'h'>;

const SpinnerPane: React.FC<Props> = (props) => {
  const {h, delayed, size, ...rest} = props;
  const [isPlaying, setPlaying] = React.useState(!delayed);

  useTimeout(
    () => {
      if (!isPlaying) setPlaying(true);
    },
    delayed ? DELAY : 0,
  );

  return (
    <Flex
      mx="auto"
      minH={h}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {isPlaying ? <Spinner color={'gray.400'} size={size} /> : null}
    </Flex>
  );
};

export default SpinnerPane;
