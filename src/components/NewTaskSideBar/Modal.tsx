import React, { Dispatch, SetStateAction } from 'react';
import Button from '@mui/joy/Button';
import MuiModal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onYesModalClick: () => void;
  loading: boolean;
}

const Modal = ({ open, setOpen, onYesModalClick, loading }: Props) => {
  return (
    <MuiModal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => setOpen(false)}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose
          variant="outlined"
          sx={{
            top: 'calc(-1/4 * var(--IconButton-size))',
            right: 'calc(-1/4 * var(--IconButton-size))',
            boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
            borderRadius: '50%',
            bgcolor: 'background.body',
          }}
        />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Are you absolutely sure?
        </Typography>
        <Typography>
          This action cannot be undone. This will permanently update your task.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '20px',
          }}
        >
          <Button size="lg" variant="soft" color="neutral">
            No
          </Button>
          <Button
            size="lg"
            color="neutral"
            onClick={onYesModalClick}
            loading={loading}
          >
            Yes
          </Button>
        </Box>
      </Sheet>
    </MuiModal>
  );
};

export default Modal;
