import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Stack, MenuItem, TextField } from '@mui/material';

import { MileageArea } from 'src/domain/mileage-management/mileage-area';

interface DynamicFormProps {
  area: MileageArea;
}

export const DynamicForm = ({ area }: DynamicFormProps) => {
  const { control } = useFormContext();

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
                onChange={onChange}
                margin="normal"
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
              >
                <MenuItem value="true">예</MenuItem>
                <MenuItem value="false">아니오</MenuItem>
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
              />
            )}
          />
        );
    }
  };

  return <Stack sx={{ width: 440 }}>{area?.fields.map((field) => renderField(field))}</Stack>;
};
