import React from 'react';

import { Stack } from '@mui/material';
import {
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

const Toolbar = () => (
  <GridToolbarContainer>
    <GridToolbarQuickFilter />
    <Stack sx={{ flexGrow: 1 }} />
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
);

export default Toolbar;
