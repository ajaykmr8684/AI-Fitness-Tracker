import { 
  Box, 
  Container, 
  Paper, 
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import { LoginPage } from "./components/LoginPage";
import { NavigationHeader } from "./components/NavigationHeader"
import { ActivityDetail } from "./components/ActivityDetail"
import { ActivitiesPage } from "./components/ActivitiesPage";


// Main App Component
function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  
  useEffect(() => {
    if (token) {
      dispatch(setCredentials({token, user: tokenData}));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        {!token ? (
          <LoginPage onLogin={logIn} />
        ) : (
          <>
            <NavigationHeader 
              user={tokenData} 
              onLogout={logOut} 
            />
            <Routes>
              <Route path="/activities" element={<ActivitiesPage />}/>
              <Route 
                path="/activities/:id" 
                element={
                  <Container maxWidth="xl">
                    <Paper 
                      elevation={2}
                      sx={{ 
                        p: 3,
                        borderRadius: 3,
                        minHeight: 400
                      }}
                    >
                      <ActivityDetail />
                    </Paper>
                  </Container>
                }
              />
              <Route 
                path="/" 
                element={token ? <Navigate to="/activities" replace/> : <LoginPage onLogin={logIn} />} 
              />
            </Routes>
          </>
        )}
      </Box>
    </Router>
  );
}

export default App;