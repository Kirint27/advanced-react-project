


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

