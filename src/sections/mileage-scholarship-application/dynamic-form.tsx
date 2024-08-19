import React from 'react';
import { isNaN } from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, MenuItem, TextField } from '@mui/material';

import { MileageArea } from 'src/domain/mileage-management/mileage-area';

interface DynamicFormProps {
  area: MileageArea;
}

export const DynamicForm = ({ area }: DynamicFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const renderField = (field: { name: string; type: string }) => {
    switch (field.type) {
      case 'number':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={field.name}
                type="number"
                fullWidth
                value={value || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!isNaN(Number(newValue))) {
                    onChange(newValue);
                  }
                }}
                margin="normal"
                error={Boolean(errors[field.name])}
              />
            )}
          />
        );

      case 'date':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={field.name}
                type="date"
                fullWidth
                value={value || ''}
                onChange={onChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(errors[field.name])}
              />
            )}
          />
        );
      case 'boolean':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={field.name}
                select
                fullWidth
                value={value !== undefined ? String(value) : ''}
                onChange={(e) => onChange(e.target.value)}
                margin="normal"
                error={Boolean(errors[field.name])}
              >
                <MenuItem value="true">O</MenuItem>
                <MenuItem value="false">X</MenuItem>
              </TextField>
            )}
          />
        );
      default:
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label={field.name}
                type="text"
                fullWidth
                value={value || ''}
                onChange={onChange}
                margin="normal"
                error={Boolean(errors[field.name])}
              />
            )}
          />
        );
    }
  };

  return <Stack sx={{ width: 440 }}>{area?.fields.map((field) => renderField(field))}</Stack>;
};
