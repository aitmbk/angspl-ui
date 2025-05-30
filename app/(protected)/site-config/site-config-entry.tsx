'use client';
import { memo } from 'react';
import eq from 'lodash/eq';
import MyButton from '@/app/custom-components/MyButton';
import MyTextField from '@/app/custom-components/MyTextField';
import useSiteConfigEntry from './useSiteConfigEntry';
import MyTypography from '@/app/custom-components/MyTypography';
import MyCardContent from '@/app/custom-components/MyCardContent';
import MyCardActions from '@/app/custom-components/MyCardActions';
import MyDivider from '@/app/custom-components/MyDivider';
import MyGrid from '@/app/custom-components/MyGrid';
import MyCard from '@/app/custom-components/MyCard';
import SiteConfigDTO from '@/app/types/SiteConfigDTO';
import * as gConstants from '../../constants/constants';
import MyAutocomplete from '@/app/custom-components/MyAutocomplete';

type SiteConfigEntryProps = {
  dtoSiteConfig: SiteConfigDTO;
};

const SiteConfigEntry = (props: SiteConfigEntryProps) => {
  const {
    state,
    onInputChange,
    onKeyBlur,
    onStatusBlur,
    onDescriptionBlur,
    onSiteConfigStatusChange,
    onSiteConfigTypeChange,
    onTypeBlur,
    onValueBlur,
    onSaveClick,
    onClearClick,
    onCancelClick,
    setOpen1,
    setClose1,
    setOpen2,
    setClose2
  } = useSiteConfigEntry(props);

  return (
    <MyCard>
      <MyCardContent>
        <MyGrid container spacing={2}>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyTextField
              label="Key"
              name="key"
              value={state.dtoSiteConfig.key}
              onChange={onInputChange}
              inputProps={{
                maxLength: gConstants.FIRST_NAME_LENGTH, // Restricts input to two characters
                pattern: '^[A-Za-z]{1,2}$' // Allows only up to two letters (A-Z, a-z)
              }}
              onBlur={onKeyBlur}
              error={state.errorMessages.key ? true : false}
            />
            <MyTypography className="error"> {state.errorMessages.key}</MyTypography>
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyTextField
              label="Value"
              name="value"
              value={state.dtoSiteConfig.value}
              onChange={onInputChange}
              inputProps={{
                maxLength: gConstants.FIRST_NAME_LENGTH, // Restricts input to two characters
                pattern: '^[A-Za-z]{1,2}$' // Allows only up to two letters (A-Z, a-z)
              }}
              onBlur={onValueBlur}
              error={state.errorMessages.value ? true : false}
            />
            <MyTypography className="error"> {state.errorMessages.value}</MyTypography>
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyTextField
              label="Description"
              name="description"
              value={state.dtoSiteConfig.description}
              onChange={onInputChange}
              inputProps={{
                maxLength: gConstants.FIRST_NAME_LENGTH, // Restricts input to two characters
                pattern: '^[A-Za-z]{1,2}$' // Allows only up to two letters (A-Z, a-z)
              }}
              onBlur={onDescriptionBlur}
              error={state.errorMessages.description ? true : false}
            />
            <MyTypography className="error"> {state.errorMessages.description}</MyTypography>
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyAutocomplete
              open={state.open1}
              onOpen={setOpen1}
              onClose={setClose1}
              value={{ text: state.dtoSiteConfig.status }}
              getOptionLabel={(option: any) => option.text}
              firstitem={{ id: 0, text: '' }}
              options={state.arrSiteConfigStatusLookup}
              onChange={onSiteConfigStatusChange}
              onBlur={onStatusBlur}
              filterOptions={(
                options // to remove the empty selectable string in the lookup
              ) => options.filter((option: any) => option.text && option.text.trim() !== '')}
              renderInput={(params) => (
                <MyTextField
                  {...params}
                  label="Status"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  onBlur={onStatusBlur}
                  error={state.errorMessages.status ? true : false}
                />
              )}
            />
            <MyTypography className="error"> {state.errorMessages.status}</MyTypography>
          </MyGrid>
          <MyGrid size={{ xs: 12, sm: 6 }}>
            <MyAutocomplete
              open={state.open2}
              onOpen={setOpen2}
              onClose={setClose2}
              value={{ text: state.dtoSiteConfig.type }}
              getOptionLabel={(option: any) => option.text}
              firstitem={{ id: 0, text: '' }}
              options={state.arrSiteConfigTypeLookup}
              onChange={onSiteConfigTypeChange}
              onBlur={onTypeBlur}
              filterOptions={(
                options // to remove the empty selectable string in the lookup
              ) => options.filter((option: any) => option.text && option.text.trim() !== '')}
              renderInput={(params) => (
                <MyTextField
                  {...params}
                  label="Type"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  onBlur={onTypeBlur}
                  error={state.errorMessages.type ? true : false}
                />
              )}
            />
            <MyTypography className="error"> {state.errorMessages.type}</MyTypography>
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

export default memo(SiteConfigEntry, (prevProps, nextProps) => {
  return eq(prevProps, nextProps); // Don't re-render!
});
