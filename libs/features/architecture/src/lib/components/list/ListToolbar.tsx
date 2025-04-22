import { cloneElement, FC, ReactElement } from 'react';
import styled from 'styled-components';
import { FilterContext } from './FilterContext';
import FilterForm from './filter/FilterForm';

export interface ListToolbarProps {
  actions?: ReactElement | false;
  // exporter?: Exporter | false;
  filters?: ReactElement | ReactElement[];
  hasCreate?: boolean;
}

export const ListToolbar: FC<ListToolbarProps> = (props) => {
  const { filters, actions, ...rest } = props;
  return Array.isArray(filters) ? (
    <FilterContext.Provider value={filters}>
      <Root>
        <FilterForm />
        <span />
        {actions && cloneElement(actions, { ...rest, ...actions.props })}
      </Root>
    </FilterContext.Provider>
  ) : (
    <Root>
      {filters && cloneElement(filters, { ...rest, context: 'form' })}
      <span />
      {actions && cloneElement(actions, { ...rest, filters, ...actions.props })}
    </Root>
  );
};

const Root = styled.div`
  position: relative;
`;

export default ListToolbar;
