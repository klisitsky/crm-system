export interface Task {
  created: string;
  id: number;
  isDone: boolean;
  title: string;
}

export interface TasksInfoAmount {
  all: number | null;
  completed: number | null;
  inWork: number | null;
}

interface ResponseFetchTasks {
  data: Task[];
  info: TasksInfoAmount;
  meta: {
    totalAmount: number | null;
  };
}
export type TasksData = ResponseFetchTasks;
type ResponceCreateTask = Task;
type ResponceChangeTask = Pick<Task, "isDone" | "title">;

const BASE_URL = "https://easydev.club/api/v1/";

const errorStatuses: Record<string, string> = {
  "400": "Некорректный запрос",
  "404": "Такой задачи нет",
  "500": "Ошибка сервера",
};

const checkStatusResponse = (response: Response) => {
  if (!response.ok) {
    throw new Error(`${errorStatuses[response.status] ?? "Some Error"}`);
  }
};

export class TasksApi {
  static getTasks() {
    return fetch(`${BASE_URL}todos`)
      .then((response): Promise<ResponseFetchTasks> => {
        if (!response.ok && response.status === 500) {
          throw new Error("Ошибка сервера");
        }
        return response.json();
      })
      .then((result) => result);
  }

  static createTask(title: string) {
    return fetch(`${BASE_URL}todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        isDone: false,
        title,
      }),
    })
      .then((response): Promise<ResponceCreateTask> => {
        checkStatusResponse(response);
        return response.json();
      })
      .then((result) => result);
  }

  static updateTask(id: number, isDone: boolean, title: string) {
    return fetch(`${BASE_URL}todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        isDone,
        title,
      }),
    })
      .then((response): Promise<ResponceChangeTask> => {
        checkStatusResponse(response);
        return response.json();
      })
      .then((result) => result);
  }

  static deleteTask(id: number) {
    return fetch(`${BASE_URL}todos/${id}`, {
      method: "DELETE",
    }).then((response) => {
      checkStatusResponse(response);
    });
  }
}
