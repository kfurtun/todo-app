import { gql } from '@apollo/client';

export const UPDATE_TASK = gql`
  mutation updateTask($updatedTask: UpdatedTaskInput!) {
    updateTask(updatedTask: $updatedTask) {
      status
    }
  }
`;
