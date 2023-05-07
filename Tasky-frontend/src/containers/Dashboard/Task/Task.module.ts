import { taskDataResponseType, getTaskType } from '../../../store/types/tasks.module';

export interface TaskProps {
    match: any;
    task: any | null;
    loading: boolean;
    token: string | null;
    onGetTask: (token: string | null, task_id: string) => getTaskType;
}