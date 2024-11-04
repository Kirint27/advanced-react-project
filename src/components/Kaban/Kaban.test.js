import React from "react";
import { render } from "@testing-library/react";
import Kaban from "./Kaban";

describe("Kaban tests", () => {
  it("should render", () => {
    expect(render(<Kaban />)).toBeTruthy();
  });
});
