import { createListenerMiddleware } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();

export const { startListening , stopListening } = listenerMiddleware;

import('./admin/listeners');