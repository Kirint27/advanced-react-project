


import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';
import useLogin from '../../services/login.service';
jest.mock('../../services/login.service', () => ({
  useLogin: jest.fn(() => ({
    loginWithGooglePopup: jest.fn(),
    user: null,
    loading: false,
  })),

}));

describe('Login component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Login />);
    expect(getByText('Project Management Tool')).toBeInTheDocument();
    expect(getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('calls loginWithGooglePopup on button click', () => {
    const { getByText } = render(<Login />);
    const loginButton = getByText('Sign in with Google');
    fireEvent.click(loginButton);
    expect(useLogin().loginWithGooglePopup).toHaveBeenCalledTimes(1);
  });
});