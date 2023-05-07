export interface SingleTaskProps {
    usageIn: "MyTasks" | "CreatedTasks";
    title: string;
    due_date: string;
    task_id: string;
    onDeleteClicked?:  any
}