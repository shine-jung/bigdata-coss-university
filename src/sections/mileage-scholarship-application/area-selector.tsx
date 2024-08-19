import React from 'react';

import { Card, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { MileageArea } from 'src/domain/mileage-management/mileage-area';

interface AreaSelectorProps {
  areas: MileageArea[];
  selectedAreaIndex: number;
  handleAreaChange: (event: React.MouseEvent<HTMLElement>, newIndex: number) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({
  areas,
  selectedAreaIndex,
  handleAreaChange,
}) => (
  <Card
    component={ToggleButtonGroup}
    color="primary"
    value={selectedAreaIndex}
    exclusive
    onChange={handleAreaChange}
    sx={{ borderRadius: 1 }}
  >
    {areas.map((area, index) => (
      <ToggleButton key={index} value={index} sx={{ minWidth: 56 }}>
        <Typography variant="subtitle2">{area.name}</Typography>
      </ToggleButton>
    ))}
  </Card>
);

export default AreaSelector;
