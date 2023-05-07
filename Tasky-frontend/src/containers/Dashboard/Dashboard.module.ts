import { dismissTasksErrorType } from "../../store/types/tasks.module";

export interface DashboardProps{
    isAuth: boolean;
    error: string | null;
    onDismissError: () => dismissTasksErrorType;
}