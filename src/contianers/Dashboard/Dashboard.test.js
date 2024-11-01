import React from "react";
import { render } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Dashboard tests", () => {
  it("should render", () => {
    expect(render(<Dashboard />)).toBeTruthy();
  });
});
