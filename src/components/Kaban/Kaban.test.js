import { render, screen, fireEvent } from "@testing-library/react";
import { addTask, getTasks } from "your-task-api"; // Import the task API functions
import { auth } from "firebase/auth"; // Import the Firebase auth module
import { useState } from "react";

jest.mock("firebase/auth");
jest.mock("your-task-api");

const mockAddTask = jest.fn();
const mockGetTasks = jest.fn();

beforeEach(() => {
  mockAddTask.mockReset();
  mockGetTasks.mockReset();
});

describe("handleAddTask", () => {
  test("should add a new task and update the task list", async () => {
 const mockCurrentUser = { uid: "123" };
 const mockProjectId = "abc123";
 const mockNewTask = { title: "Test Task", description: "Test Description" };
 const mockTaskData = [{ id: "task1", title: "Task 1", description: "Description 1" }];
 
 auth.currentUser = mockCurrentUser;

 const { result } = renderHook(() =>
   useState({
     currentUser: mockCurrentUser,
     projectId: mockProjectId,
     tasks: [],
showForm: true
  })
);

const { newTask, tasks, projectId, showForm, setTasks, setNewTask, setShowForm } =
result.current[0];

mockAddTask.mockResolvedValue("task1");
mockGetTasks.mockResolvedValue(mockTaskData);

const form = screen.getByRole("form");
fireEvent.submit(form);

expect(mockAddTask).toHaveBeenCalledTimes(1);
expect(mockGetTasks).toHaveBeenCalledTimes(1);

expect(mockAddTask).toHaveBeenCalledWith(projectId, expect.objectContaining({
  title: mockNewTask.title,
  description: mockNewTask.description,
  createdAt: expect.any(Date),
  status: "todo",

}));

expect(mockGetTasks).toHaveBeenCalledWith(projectId);
expect(setTasks).toHaveBeenCalledWith(mockTaskData);
expect(setTasks).toHaveBeenCalledTimes(1);

expect(setNewTask).toHaveBeenCalledTimes(1);
expect(setNewTask).toHaveBeenCalledWith({})

expect(setShowForm).toHaveBeenCalledTimes(1);
expect(setShowForm).toHaveBeenCalledWith(false);

});
});