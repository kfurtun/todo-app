import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import 'dayjs/locale/en-ca';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/joy/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

import { FetchResult, useMutation } from '@apollo/client';
import { SAVE_TASK, DELETE_TASK } from '@/apolloClient';
import type { Task } from '@/__generated__/resolvers-types';
import Modal from './Modal';
import Snackbar from './Snackbar';
import { UPDATE_TASK } from '@/apolloClient/mutations/updateTask';

interface Props {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userEmail: string | undefined;
  data: Task | undefined;
  setData: Dispatch<SetStateAction<Task | undefined>>;
  clearForm: boolean;
  refetch: () => void;
  newTaskClicked: boolean;
}

interface Form {
  task: string;
  description?: string;
  date: string | null | Dayjs;
}

const initialForm: Form = {
  task: '',
  description: '',
  date: null,
};

const NewTaskSideBar = ({
  isOpen,
  setOpen,
  userEmail,
  data,
  setData,
  refetch,
  clearForm,
  newTaskClicked,
}: Props) => {
  const [form, setForm] = useState<Form>(initialForm);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [saveTask, { loading, error }] = useMutation(SAVE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK);

  useEffect(() => {
    if (data) {
      setForm({
        task: data.task,
        description: data.description as string,
        date: dayjs(data.date),
      });
    }
  }, [data]);

  useEffect(() => {
    if (clearForm) {
      setForm(initialForm);
    }
  }, [clearForm]);

  const resolveResult = (result: FetchResult<any>) => {
    return result?.data?.saveTask?.status;
  };

  const onSaveClick = async () => {
    if (newTaskClicked) {
      const result = await saveTask({
        variables: {
          newTask: {
            ...form,
            userEmail,
            date: dayjs(form.date).format('YYYY-MM-DD'),
          },
        },
      });
      setOpenSnackbar(resolveResult(result) === 'success');
      refetch();
    } else {
      setOpenModal(true);
    }
  };

  const onYesModalClick = async () => {
    const result = await updateTask({
      variables: {
        updatedTask: {
          ...form,
          userEmail,
          _id: data?._id,
          date: dayjs(form.date).format('YYYY-MM-DD'),
        },
      },
    });
    if (result) {
      setOpenModal(false);
    }
    setOpenSnackbar(resolveResult(result) === 'success');
    refetch();
  };

  const onDeleteClick = async () => {
    const result = await deleteTask({ variables: { id: data?._id } });
    console.log(result);
    refetch();
  };

  return (
    <>
      <Drawer
        anchor="right"
        variant="persistent"
        open={isOpen}
        PaperProps={{
          sx: {
            display: 'flex',
            alignItems: 'center',
            width: 'calc(40% - 26px)',
          },
        }}
      >
        <List
          sx={{
            width: '90%',
          }}
        >
          <ListItem
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h6">Task:</Typography>
            <IconButton
              onClick={() => {
                setOpen(false);
                setData(undefined);
                setForm(initialForm);
              }}
            >
              {<CloseIcon />}
            </IconButton>
          </ListItem>
          <ListItem>
            <Input
              placeholder="Task Title"
              fullWidth
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              value={form.task}
            />
          </ListItem>
          <ListItem>
            <Textarea
              placeholder="Description"
              sx={{ width: '100%', minHeight: '100px' }}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              value={form.description}
            />
          </ListItem>
          <ListItem
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-ca"
            >
              <Typography>Due Date</Typography>
              <DatePicker
                value={form.date}
                onChange={(newVal) => setForm({ ...form, date: newVal })}
              />
            </LocalizationProvider>
          </ListItem>
        </List>
        <List
          sx={{
            width: '80%',
            mt: '60px',
          }}
        >
          <ListItem sx={{ justifyContent: 'space-around' }}>
            {!newTaskClicked && (
              <Button
                sx={{ width: '40%' }}
                variant="outlined"
                onClick={onDeleteClick}
              >
                Delete Task
              </Button>
            )}
            <Button sx={{ width: '40%' }} color="warning" onClick={onSaveClick}>
              {newTaskClicked ? 'Submit' : 'Save Changes'}
            </Button>
          </ListItem>
        </List>
      </Drawer>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        onYesModalClick={onYesModalClick}
        loading={updateLoading}
      />
      <Snackbar
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        newTaskClicked={newTaskClicked}
      />
    </>
  );
};

export default NewTaskSideBar;
