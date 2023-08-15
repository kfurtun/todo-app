import { gql } from '@apollo/client';

export const SAVE_TASK = gql`
  mutation saveTask($newTask: InputTask!) {
    saveTask(newTask: $newTask) {
      status
    }
  }
`;
