import React from "react";
import { render } from "@testing-library/react";
import Tasks from "./Tasks";

describe("Tasks tests", () => {
  it("should render", () => {
    expect(render(<Tasks />)).toBeTruthy();
  });
});
