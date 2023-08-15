import {
  Task,
  InputTask,
  StatusResponse,
  UpdatedTaskInput,
} from '@/__generated__/resolvers-types';
import { connectDb } from '@/utils/connectDb';
import { ObjectId } from 'mongodb';

export class TaskQueries {
  async getTasks(): Promise<Task[]> {
    const db = await connectDb();
    // write Task type according to database
    const user = await db.collection<Task>('tasks').find().toArray();

    return user;
  }
}

export class TaskMutations {
  async saveTask(newTask: InputTask): Promise<StatusResponse | null> {
    const db = await connectDb();

    const result = await db.collection('tasks').insertOne(newTask);

    if (result) {
      return { status: 'success' };
    }
    return null;
  }

  async deleteTask(id: string): Promise<StatusResponse | null> {
    const db = await connectDb();

    const result = await db
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(id) });

    if (result) {
      return { status: 'success' };
    }
    return null;
  }

  async updateTask(
    updatedTask: UpdatedTaskInput
  ): Promise<StatusResponse | null> {
    const db = await connectDb();

    const result = await db
      .collection('tasks')
      .updateOne(
        { _id: new ObjectId(updatedTask._id) },
        {
          $set: {
            task: updatedTask.task,
            description: updatedTask.description,
            date: updatedTask.date,
          },
        }
      );

    if (result) {
      return { status: 'success' };
    }
    return null;
  }
}
