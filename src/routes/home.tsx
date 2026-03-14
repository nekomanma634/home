import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack 
} from '@mui/material';
import ProfileBox       from '../components/ProfileBox';
import RecentPostCard   from '../components/RecentPostsButton';
import { getAllPosts }  from '../utils/getPosts';
import { Link } from 'react-router';

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <Container maxWidth="lg">

        <Box sx={{ height: 70 }} />
      
        <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
            <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            gutterBottom
            sx={{
                background: 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
        }}>
          Hello, I'm nekomanma634!!
        </Typography>

        <Box sx={{ height: 70 }} />

    {/* 直近の投稿 */}
      <Box sx={{ pb: 10 }}>
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom sx={{ mb: 4, borderBottom: '2px solid #333', pb: 2 }}>
          Recent Posts
        </Typography>
        
        <Stack spacing={3}>
          {recentPosts.map((post) => (
            <RecentPostCard 
              key={post.id}
              to={`/posts/${post.id}`}
              title={post.title}
              date={post.date}
              description={post.description}
              imageUrl={post.imageUrl}
            />
          ))}
        </Stack>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" component={Link} to='/posts' sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', borderRadius: 10, px: 4 }}>
            すべての記事を見る
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 70 }} />

      <Box sx={{ pb: 10 }}>
        <Typography variant="h4" color="white" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          About Me
        </Typography>
        
        <ProfileBox />
        
      </Box>

        {/* <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
          モダンで洗練されたUIを、ReactとMUIを使って簡単に構築しましょう。
          ダークテーマに最適な美しいレイアウトを提供します。
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px' }}>
            はじめる
          </Button>
          <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: '30px', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
            詳細を見る
          </Button>
        </Stack> */}
      </Box>

      {/* <Box sx={{ pb: 10 }}>
        <Grid container spacing={4}> */}
          
          {/* <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: '#1a1a1a', height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
                  ⚡️ 高速な動作
                </Typography>
                <Typography color="text.secondary">
                  Reactの仮想DOMを活用し、サクサク動く快適なユーザー体験を実現します。
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: '#1a1a1a', height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
                  🎨 美しいデザイン
                </Typography>
                <Typography color="text.secondary">
                  MUIのコンポーネントを組み合わせるだけで、プロ顔負けのレイアウトが完成します。
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: '#1a1a1a', height: '100%', border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="white" gutterBottom fontWeight="bold">
                  🌙 ダークモード
                </Typography>
                <Typography color="text.secondary">
                  目に優しく、洗練された印象を与えるダークテーマを標準でサポートしています。
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}

        {/* </Grid>
      </Box> */}

    </Container>
  );
}