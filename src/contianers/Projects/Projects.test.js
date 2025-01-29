import { render, screen, fireEvent } from "@testing-library/react";
import { addDoc, collection, db } from "firebase/firestore";
import { useState } from "react";

jest.mock("firebase/firestore");


// Mock the addNewProject function
const mockAddDoc = jest.fn();

beforeEach(() => {
  mockAddDoc.mockReset();
});

describe("handleSubmit", () => {
  test("should add a new project and update the local state", async () => {
    const mockCurrentUser = { uid: "123" };
    const mockProjectName = "Test Project";
    const mockProjectDescription = "Test Description";
    const mockDueDate = "01/01/2022";
    const mockPriority = "High";
    const mockSelectedUsers = [
      { displayName: "User 1" },
      { displayName: "User 2" },
    ];
    const mockUserSearch = "User";

    const mockSetProjects = jest.fn();
    const mockSetIsFormVisible = jest.fn();
    const mockSetProjectName = jest.fn();
    const mockSetProjectDescription = jest.fn();
    const mockSetDueDate = jest.fn();
    const mockSetPriority = jest.fn();
    const mockSetSelectedUsers = jest.fn();
    const mockSetUserSearch = jest.fn();

    const { result } = renderHook(() =>
      useState({
        currentUser: mockCurrentUser,
        projectName: mockProjectName,
        projectDescription: mockProjectDescription,
        dueDate: mockDueDate,
        priority: mockPriority,
        selectedUsers: mockSelectedUsers,
        userSearch: mockUserSearch,
        setProjects: mockSetProjects,
        setIsFormVisible: mockSetIsFormVisible,
        setProjectName: mockSetProjectName,
        setProjectDescription: mockSetProjectDescription,
        setDueDate: mockSetDueDate,
        setPriority: mockSetPriority,
        setSelectedUsers: mockSetSelectedUsers,
        setUserSearch: mockSetUserSearch,
      })
    );

    const { currentUser, projectName, projectDescription, dueDate, priority, selectedUsers, userSearch, setProjects, setIsFormVisible, setProjectName, setProjectDescription, setDueDate, setPriority, setSelectedUsers, setUserSearch } =
      result.current[0];

    mockAddDoc.mockResolvedValueOnce({ id: "abc123" });

    await handleSubmit(
      { preventDefault: jest.fn() },
      currentUser,
      projectName,
      projectDescription,
      dueDate,
      priority,
      selectedUsers,
      userSearch,
      setProjects,
      setIsFormVisible,
      setProjectName,
      setProjectDescription,
      setDueDate,
      setPriority,
      setSelectedUsers,
      setUserSearch
    );

    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    expect(mockAddDoc).toHaveBeenCalledWith(
      collection(db, "projects"),
      expect.objectContaining({
        name: projectName,
        description: projectDescription,
        dueDate: dueDate || "MM/DD/YYYY",
        status: "Not Started",
        priority,
        userId: currentUser.uid,
        memberNames: selectedUsers.map((user) => user.displayName),
      })
    );

    expect(setProjects).toHaveBeenCalledTimes(1);
    expect(setProjects).toHaveBeenCalledWith((prevProjects) => [
      ...prevProjects,
      { id: "abc123", ...newProject },
    ]);

    expect(setIsFormVisible).toHaveBeenCalledTimes(1);
    expect(setIsFormVisible).toHaveBeenCalledWith(false);

    expect(setProjectName).toHaveBeenCalledTimes(1);
    expect(setProjectName).toHaveBeenCalledWith("");

    expect(setProjectDescription).toHaveBeenCalledTimes(1);
    expect(setProjectDescription).toHaveBeenCalledWith(""); 
  });
});

// test delete project

const mockDeleteProject = jest.fn();

beforeEach(() => {
  mockDeleteProject.mockReset();
});

describe("handleDeleteProject", () => {
  test("should delete a project and update the project list", async () => {
const mockProjectId = "abc123";
const  mockProjects = [
  { id: "abc123", name: "Project 1" },
  { id: "def456", name: "Project 2" },  
];
const { result } = renderHook(() =>
  useState({
    projects: mockProjects,
    setProjects: jest.fn(),
  })
);

const { projects, setProjects } = result.current[0];

mockDeleteProject.mockResolvedValueOnce();

handleDeleteProject(mockProjectId);
expect(mockDeleteProject).toHaveBeenCalledTimes(1);
expect(mockDeleteProject).toHaveBeenCalledWith(mockProjectId);
expect(setProjects).toHaveBeenCalledTimes(1);
expect(setProjects).toHaveBeenCalledWith((prevProjects)=>
prevProjects.filter((project) => project.id !== mockProjectId)
)

expect(projects).toEqual([
  {id: "def456",
  name: "Project 2"}
    ]);
 });

});


