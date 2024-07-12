import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  filename?: string | null;
};

export default function SingleFilePreview({ filename = '' }: Props) {
  return (
    <Typography variant="subtitle2" noWrap color="text.secondary">
      {filename}
    </Typography>
  );
}
