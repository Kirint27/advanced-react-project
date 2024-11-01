import React from "react";
import { render } from "@testing-library/react";
import SideBar from "./SideBar";

describe("SideBar tests", () => {
  it("should render", () => {
    expect(render(<SideBar />)).toBeTruthy();
  });
});
