import FieldSelect, {InputColumnOption} from './FieldSelect';
import {
  Badge,
  FormControl,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import React, {FC} from 'react';
import {QuestionOutlineIcon} from '@chakra-ui/icons';
import {ColumnSpec} from './CreateTableDropzone';

type Props = {
  allInputColumns: InputColumnOption[];
  selectedColumns: Record<string, string> | undefined;
  outputColumnSpecs: ColumnSpec[];
  unusedInputColumns: Array<InputColumnOption>;
  onSelect: (column: string, inputFileColumn: string | undefined) => void;
};
export const OutputColumnsTable: FC<Props> = (props) => {
  const {
    allInputColumns,
    selectedColumns,
    outputColumnSpecs,
    unusedInputColumns,
    onSelect,
  } = props;
  const findSelectedOption = (col: ColumnSpec) => {
    const selectedColumn = selectedColumns?.[col.name];
    const selectedOption = allInputColumns.find(
      ({value}) => value === selectedColumn,
    );
    return selectedOption;
  };
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Column</Th>
          <Th>Type</Th>
          <Th />
          <Th>Input file column</Th>
        </Tr>
      </Thead>
      <Tbody>
        {outputColumnSpecs.map((col) => (
          <OutputColumnRow
            key={col.name}
            col={col}
            selectedOption={findSelectedOption(col)}
            unusedInputColumns={unusedInputColumns}
            onSelect={onSelect}
          />
        ))}
      </Tbody>
    </Table>
  );
};

const OutputColumnRow: FC<{
  col: ColumnSpec;
  selectedOption: InputColumnOption | undefined;
  unusedInputColumns: Array<InputColumnOption>;
  onSelect: (column: string, inputFileColumn: string | undefined) => void;
}> = ({col, selectedOption, onSelect, unusedInputColumns}) => {
  return (
    <Tr>
      <Td>
        {col.comment ? (
          <Tooltip p={3} label={col.comment} hasArrow placement="right">
            <HStack _hover={{color: 'white'}} transition="color 0.2s ease">
              <Text color={'gray.200'}>{col.name}</Text>
              <QuestionOutlineIcon />
            </HStack>
          </Tooltip>
        ) : (
          <Text>{col.name}</Text>
        )}
      </Td>
      <Td>
        <Badge colorScheme="blue" fontSize={9} variant="outline">
          {col.type}
        </Badge>
      </Td>
      <Td>
        {col.required ? (
          <Badge colorScheme="purple" fontSize="9" variant="outline">
            required
          </Badge>
        ) : (
          <Badge fontSize="9" color="gray.400" variant="outline">
            optional
          </Badge>
        )}
      </Td>
      <Td width={250}>
        <FormControl isInvalid={false}>
          <FieldSelect
            selectedOption={selectedOption}
            unusedInputColumns={unusedInputColumns}
            handleSelectColumn={onSelect}
            col={col}
          />
        </FormControl>
      </Td>
    </Tr>
  );
};

export default OutputColumnsTable;
