import React from 'react';
// Asegúrate que la ruta a tu componente Button es la correcta
import { Button, IconButton } from '../../atomos/Button.jsx'; 
import { IoMdRefresh, IoMdTime, IoMdArrowDropdown, IoMdAdd } from 'react-icons/io';

// ✅ Asegúrate de que CADA componente aquí use React.forwardRef

export const RefreshControl = React.forwardRef((props, ref) => (
  <IconButton ref={ref} small onClick={props.onClick} title="Refrescar">
    <IoMdRefresh size={18} />
  </IconButton>
));

export const TimeRangeControl = React.forwardRef((props, ref) => (
  <Button ref={ref} small onClick={props.onClick}>
    <IoMdTime size={14} /> Last 60 minutes <IoMdArrowDropdown />
  </Button>
));

export const RequestsControl = React.forwardRef((props, ref) => (
  <Button ref={ref} small onClick={props.onClick}>
    All Requests <IoMdArrowDropdown />
  </Button>
));

export const AddFilterControl = React.forwardRef((props, ref) => (
  <Button ref={ref} primary small onClick={props.onClick}>
    <IoMdAdd size={14} /> Add filter
  </Button>
));