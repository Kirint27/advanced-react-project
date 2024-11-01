import React from "react";
import { render } from "@testing-library/react";
import Login from "./Login";

describe("Login tests", () => {
  it("should render", () => {
    expect(render(<Login />)).toBeTruthy();
  });
});
