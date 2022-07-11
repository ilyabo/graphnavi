import React from 'react';
import {Select} from 'chakra-react-select';
import {Badge, HStack, Text, useTheme} from '@chakra-ui/react';
import {ColumnSpec, TableField} from './CreateTableDropzone';
import styled from '@emotion/styled';

export type InputColumnOption = {
  value: string;
  row: TableField;
};

type Props = {
  selectedOption: InputColumnOption | undefined;
  unusedInputColumns: Array<InputColumnOption>;
  handleSelectColumn: (
    column: string,
    inputFileColumn: string | undefined,
  ) => void;
  col: ColumnSpec;
};
const SelectOuter = styled.div`
  & > div > div {
    width: unset;
  }
`;
const FieldSelect = ({
  selectedOption,
  col,
  unusedInputColumns,
  handleSelectColumn,
}: Props) => {
  const theme = useTheme();
  return (
    <SelectOuter>
      <Select<InputColumnOption>
        name="columns"
        value={selectedOption}
        options={unusedInputColumns}
        placeholder="…"
        size="sm"
        closeMenuOnSelect={true}
        isMulti={false}
        isSearchable={true}
        isClearable={true}
        chakraStyles={{
          dropdownIndicator: (provided) => ({
            ...provided,
            backgroundColor: theme.colors.gray[700],
          }),
          menuList: (provided) => ({
            ...provided,
            backgroundColor: theme.colors.gray[700],
          }),
          option: (provided, state) => ({
            ...provided,
            ...(state.isFocused
              ? {
                  backgroundColor: theme.colors.gray[600],
                  color: theme.colors.gray[300],
                }
              : null),
          }),
        }}
        formatOptionLabel={({row}) => (
          <HStack>
            <Text width="50px">
              <Badge colorScheme="teal" fontSize={9} variant="outline">
                {row.type}
              </Badge>
            </Text>
            <Text>{row.name}</Text>
          </HStack>
        )}
        onChange={(selected) => handleSelectColumn(col.name, selected?.value)}
      />
    </SelectOuter>
  );
};

export default FieldSelect;
