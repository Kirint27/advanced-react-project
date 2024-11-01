import React from "react";
import { render } from "@testing-library/react";
import Projects from "./Projects";

describe("Projects tests", () => {
  it("should render", () => {
    expect(render(<Projects />)).toBeTruthy();
  });
});
