import { List, Typography, ListItemText, ListItemButton } from '@mui/material';

import { fTimestampToDateTime } from 'src/utils/format-time';

import { Form } from 'src/domain/form/form';

const FormList = ({
  forms,
  onSelectForm,
}: {
  forms: Form[];
  onSelectForm: (form: Form) => void;
}) => (
  <List
    sx={{
      borderRadius: 2,
      border: (theme) => `dashed 1px ${theme.palette.divider}`,
    }}
  >
    {forms.map((form) => (
      <ListItemButton key={form.id} onClick={() => onSelectForm(form)}>
        <ListItemText primary={form.title} secondary={form.author} />

        <Typography variant="caption">{fTimestampToDateTime(form.createdAt)}</Typography>
      </ListItemButton>
    ))}
  </List>
);

export default FormList;
