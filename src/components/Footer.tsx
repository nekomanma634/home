import { Box, Typography, Container } from '@mui/material';

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#1a1a1a',
        borderTop: '1px solid', 
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        {/* <Stack 
          direction="row" 
          spacing={3} 
          justifyContent="center" 
          sx={{ mb: 3 }}
        >
          <MuiLink component={Link} to="/terms" color="text.secondary" underline="hover">
            利用規約
          </MuiLink>
          <MuiLink component={Link} to="/privacy" color="text.secondary" underline="hover">
            プライバシーポリシー
          </MuiLink>
          <MuiLink component={Link} to="/license" color="text.secondary" underline="hover">
            ライセンス
          </MuiLink>
        </Stack> */}

        {/* コピーライト（著作権）表記 */}
        <Typography variant="body2" color="text.secondary" align="center">
          © {currentYear} nekomanma634. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}