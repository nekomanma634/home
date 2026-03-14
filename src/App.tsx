import { HashRouter, Routes, Route } from 'react-router';
import { Box, Stack, CssBaseline }      from '@mui/material';
import { ThemeProvider, createTheme }   from '@mui/material/styles';
import AppBar     from '@mui/material/AppBar';
import Toolbar    from '@mui/material/Toolbar';
import NavButton  from './components/NavButton'; 
import Home       from './routes/home';
import About      from './routes/about';
import Footer     from './components/Footer';
import Contact    from './routes/contact';
import Posts      from './routes/posts';
import PostDetail from './routes/PostDetail';
import NotFound   from './routes/NotFound';
import './css/App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424', 
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <HashRouter>
          <AppBar 
            position='static' 
            elevation={0} 
            sx={{ 
              bgcolor: '#1a1a1a', 
              borderBottom: '3px solid', 
              borderColor: 'divider' 
            }}
          >
            <Toolbar>
              <Stack direction='row' spacing={1}>
                
                <NavButton to="/"       >Home   </NavButton>
                <NavButton to="/posts"  >Posts  </NavButton>
                <NavButton to="/about"  >About  </NavButton>
                <NavButton to="/contact">Contact</NavButton>

              </Stack>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/"          element={<Home       />} />
            <Route path="/posts"     element={<Posts      />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/about"     element={<About      />} />
            <Route path="/contact"   element={<Contact    />} />
            <Route path="*"          element={<NotFound   />} />
          </Routes>

          <Footer />

        </HashRouter>
      </Box>
    </ThemeProvider>
  )
}

export default App