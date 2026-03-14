import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router'; // react-router-dom の場合はそちらに合わせてください
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh', // 画面の中央付近に配置
          textAlign: 'center',
          py: 10
        }}
      >
        {/* 大きな404の文字（グラデーション） */}
        <Typography 
          variant="h1" 
          fontWeight="900" 
          sx={{
            fontSize: { xs: '6rem', md: '10rem' },
            background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            lineHeight: 1
          }}
        >
          404
        </Typography>

        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: '500px' }}>
          お探しのページは、移動または削除されたか、URLが間違っている可能性があります。
        </Typography>

        {/* Homeに戻るボタン */}
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          size="large"
          startIcon={<HomeIcon />}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontSize: '1.1rem', 
            borderRadius: '30px',
            fontWeight: 'bold'
          }}
        >
          Homeへ戻る
        </Button>
      </Box>
    </Container>
  );
}