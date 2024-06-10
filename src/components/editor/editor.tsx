/* eslint-disable perfectionist/sort-imports */
import 'src/utils/highlight';

import dynamic from 'next/dynamic';

import { alpha } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

import { Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { EditorProps } from './types';
import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Skeleton
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        borderRadius: 1,
        position: 'absolute',
      }}
    />
  ),
});

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  error,
  simple = false,
  helperText,
  sx,
  ...other
}: EditorProps) {
  const { t } = useTranslate();

  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <Stack>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Toolbar id={id} simple={simple} />

        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder={t('editor.placeholder')}
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </Stack>
  );
}
