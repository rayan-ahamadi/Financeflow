import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { TransactionProvider } from './context/TransactionContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>  
      <UserProvider>
        <TransactionProvider>
          <App/>
        </TransactionProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)

