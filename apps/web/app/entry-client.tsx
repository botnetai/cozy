import React from 'react'
import ReactDOM from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { router } from './router'

const root = ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <StartClient router={router} />
  </React.StrictMode>
)