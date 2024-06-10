import { List, Typography, ListItemText, ListItemButton } from '@mui/material';

import { fTimestampToDateTime } from 'src/utils/format-time';

import { Notice } from 'src/domain/notice/notice';

const NoticeList = ({
  notices,
  onSelectNotice,
}: {
  notices: Notice[];
  onSelectNotice: (notice: Notice) => void;
}) => (
  <List
    sx={{
      borderRadius: 2,
      border: (theme) => `dashed 1px ${theme.palette.divider}`,
    }}
  >
    {notices.map((notice) => (
      <ListItemButton key={notice.id} onClick={() => onSelectNotice(notice)}>
        <ListItemText primary={notice.title} secondary={notice.author} />

        <Typography variant="caption">{fTimestampToDateTime(notice.createdAt)}</Typography>
      </ListItemButton>
    ))}
  </List>
);

export default NoticeList;
