import 'dayjs/locale/en-ca';

import React, { useState } from 'react';
import { getSession, GetSessionParams } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { Task } from '@/__generated__/resolvers-types';

import Box from '@mui/material/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Divider from '@mui/joy/Divider';
import AddIcon from '@mui/icons-material/Add';
import TodayIcon from '@mui/icons-material/Today';

import NewTaskSideBar from '@/components/NewTaskSideBar/NewTaskSideBar';
import { client, GET_TASKS } from '@/apolloClient';
import { useQuery } from '@apollo/client';

import dayjs, { Dayjs } from 'dayjs';

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // const { data } = await client.query({ query: GET_TASKS });

  return {
    props: {
      session,
      // data: data.getTasks,
    },
  };
}

interface Props {
  session: Session | null;
  data: Task[];
}

const TodayPage = ({ session }: Props) => {
  const { loading, data: _data, refetch } = useQuery(GET_TASKS);
  const data: Task[] = _data?.getTasks?.filter(
    (task: Task) => task.date === dayjs(new Date()).format('YYYY-MM-DD')
  );

  const [openNewTask, setOpenNewTask] = useState(false);
  const [taskData, setTaskData] = useState<Task | undefined>(undefined);
  const [clearForm, setClearForm] = useState(false);
  const [newTaskClicked, setNewTaskClicked] = useState(false);

  const onListItemClick = (id: string) => {
    setNewTaskClicked(false);
    setTaskData(data.find((task) => task._id === id));
    setOpenNewTask(true);
    setClearForm(false);
  };

  const onNewTaskClick = () => {
    setNewTaskClicked(true);
    if (openNewTask) {
      if (taskData) {
        setTaskData(undefined);
        setClearForm(true);
        return;
      }
      setTaskData(undefined);
    }
    setOpenNewTask((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      sx={{ width: '100%', height: '100vh', background: 'white' }}
    >
      <Box
        sx={{
          width: openNewTask ? 'calc(60% - 70px)' : '60%', // change this condition for side bar
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          padding: '2%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            mb: '40px',
          }}
        >
          <Typography level="h1">Today</Typography>
          {data && (
            <Typography
              level="h2"
              variant="soft"
              sx={{ ml: '40px' }}
              color="primary"
            >
              {data.length}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: '100%',
            alignItems: 'flex-start',
          }}
        >
          <Button onClick={onNewTaskClick}>
            <AddIcon sx={{ mr: '10px' }} />
            Add New Task
          </Button>
        </Box>

        <List sx={{ width: '100%' }} size="lg">
          {!loading &&
            data.map((task) => (
              <Box key={task._id}>
                <ListItemButton
                  onClick={() => onListItemClick(task._id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <ListItemContent>
                    <Typography level="h3">{task.task}</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <TodayIcon />
                      {task.date}
                    </Box>
                  </ListItemContent>
                  <ArrowForwardIosIcon />
                </ListItemButton>
                <Divider sx={{ background: 'darkgrey' }} />
              </Box>
            ))}
        </List>
      </Box>
      <Box>
        <NewTaskSideBar
          isOpen={openNewTask}
          setOpen={setOpenNewTask}
          userEmail={session?.user.email}
          data={taskData}
          setData={setTaskData}
          refetch={refetch}
          clearForm={clearForm}
          newTaskClicked={newTaskClicked}
        />
      </Box>
    </Box>
  );
};

export default TodayPage;
