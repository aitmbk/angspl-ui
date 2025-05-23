'use client';
import { memo } from 'react';
import eq from 'lodash/eq';
import MyButton from '@/app/custom-components/MyButton';
import MyTextField from '@/app/custom-components/MyTextField';
import useStateEntry from './useStateEntry';
import MyTypography from '@/app/custom-components/MyTypography';
import MyCardContent from '@/app/custom-components/MyCardContent';
import MyCardActions from '@/app/custom-components/MyCardActions';
import MyDivider from '@/app/custom-components/MyDivider';
import MyGrid from '@/app/custom-components/MyGrid';
import MyCard from '@/app/custom-components/MyCard';
import StateDTO from '@/app/types/stateDTO';
import LookupDTO from '@/app/types/LookupDTO';
import MyAutocomplete from '@/app/custom-components/MyAutocomplete';

type StateEntryProps = {
  dtoState: StateDTO;
  arrCountryLookup: LookupDTO[];
};

const StateEntry = (props: StateEntryProps) => {
  const { state, onInputChange, onCountryNameChange, onStateNameBlur, onCountryNameBlur, onSaveClick, onClearClick, onCancelClick } =
    useStateEntry(props);

  return (
    <MyCard>
      <MyCardContent>
        <MyGrid container spacing={2}>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyTextField
              label="State Name"
              name="state_name"
              value={state.dtoState.state_name}
              onChange={onInputChange}
              onBlur={onStateNameBlur}
              inputProps={{
                maxLength: 30, 
                pattern: "^[A-Za-z]{1,2}$", 
              }}
              error={state.errorMessages.state_name ? true : false}
            />
            <MyTypography className="error"> {state.errorMessages.state_name}</MyTypography>
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyTextField 
            label="State Code" 
            name="state_code" 
            value={state.dtoState.state_code} 
            onChange={onInputChange}
            inputProps={{
              maxLength: 10, 
              pattern: "^[A-Za-z]{1,2}$", 
            }}
            />
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyAutocomplete
              value={state.dtoState.countryLookupDTO}
              getOptionLabel={(option: any) => option.text || ''}
              firstitem={{ id: 0, text: '' }}
              options={state.arrCountryLookup}
              onChange={onCountryNameChange}
              onBlur={onCountryNameBlur}
                filterOptions={(options) => // to remove the empty selectable string in the lookup
                options.filter((option: any) => option.text && option.text.trim() !== '')
              }
              renderInput={(params) => (
                <MyTextField
                  {...params}
                  label="Country Name"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  onBlur={onCountryNameBlur}
                  error={state.errorMessages.country_id ? true : false}
                />
              )}
            />
            <MyTypography className="error">{state.errorMessages.country_id}</MyTypography>
          </MyGrid>
        </MyGrid>
      </MyCardContent>
      <MyDivider></MyDivider>
      <MyCardActions>
        <MyButton onClick={onSaveClick}>Save</MyButton>
        <MyButton onClick={onClearClick}>Clear</MyButton>
        <MyButton onClick={onCancelClick}>Cancel</MyButton>
      </MyCardActions>
    </MyCard>
  );
};

export default memo(StateEntry, (prevProps, nextProps) => {
  return eq(prevProps, nextProps); // Don't re-render!
});
