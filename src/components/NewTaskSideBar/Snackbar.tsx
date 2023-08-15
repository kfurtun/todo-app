import React, { Dispatch, SetStateAction } from 'react';
import MuiSnackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  newTaskClicked: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snackbar = ({ open, setOpen, newTaskClicked }: Props) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <MuiSnackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={newTaskClicked ? 'success' : 'info'}
        sx={{ width: '100%' }}
      >
        {newTaskClicked ? 'New task added' : 'Task updated'}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
