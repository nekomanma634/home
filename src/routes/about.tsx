import { Box, Container, Typography, Grid, Stack, Button } from '@mui/material';

import GitHubIcon   from '@mui/icons-material/GitHub';
import XIcon        from '@mui/icons-material/X';
import CodeIcon     from '@mui/icons-material/Code';
import SkillCard    from '../components/SkillCard';

export default function About() {
  const skillCategories = [
    {
      title: 'Languages',
      description: 'メインで扱っているプログラミング言語',
      skills: ['C', 'C++', 'TypeScript', 'JavaScript', 'Python'],
    },
    {
      title: 'Frontend & Web',
      description: 'Webアプリケーション開発の技術スタック',
      skills: ['React', 'Material UI', 'HTML5', 'CSS3', 'Vite'],
    },
    {
      title: 'Fields & Interests',
      description: '開発領域や趣味・現在挑戦中の分野',
      skills: ['Game Engine Dev', 'Competitive Programming (AHC)', 'Music Production', 'Illustration'],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      
      <Typography variant="h3" component="h1" color="white" fontWeight="bold" gutterBottom textAlign="center">
        About Me
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 8 }}>
        私について・スキルセット・各種アカウント
      </Typography>

      {/* --- Background セクション (変更なし) --- */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" color="white" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #333', pb: 1, mb: 3 }}>
          Background
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          「ゼロから創り上げる楽しさ」を追求し、ソフトウェア開発を行っています。
          C/C++を用いた独自のゲームエンジン開発を通じて、メモリ管理やレンダリングといった低レイヤーの仕組みを学ぶ一方、Reactを使ったモダンなWebフロントエンド開発にも取り組んでいます。
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          また、アルゴリズムや最適化問題に強く惹かれており、競技プログラミング（AtCoder Heuristic Contest）にも挑戦中（現在 緑コーダー）です。
          休日は音楽制作やイラスト作成など、クリエイティブな活動を通して表現の幅を広げています。
        </Typography>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" color="white" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #333', pb: 1, mb: 4 }}>
          Skills & Expertise
        </Typography>
        
        <Grid container spacing={4}>
          {skillCategories.map((category, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <SkillCard 
                title={category.title}
                description={category.description}
                skills={category.skills}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="white" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #333', pb: 1, mb: 3 }}>
          Links
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          
          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<GitHubIcon />} 
            href="https://github.com/nekomanma634"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'white', borderColor: 'divider', '&:hover': { borderColor: 'white' } }}
          >
            GitHub
          </Button>

          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<CodeIcon />} 
            href="https://atcoder.jp/users/nekomanma634?contestType=heuristic"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#81c784', borderColor: 'rgba(129, 199, 132, 0.3)', '&:hover': { borderColor: '#81c784', bgcolor: 'rgba(129, 199, 132, 0.05)' } }}
          >
            AtCoder (AHC)
          </Button>

          <Button 
            variant="outlined" 
            size="large" 
            startIcon={<XIcon />}
            href="https://twitter.com/nekotofu634"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'white', borderColor: 'divider', '&:hover': { borderColor: 'white' } }}
          >
            X (Twitter)
          </Button>

        </Stack>
      </Box>

    </Container>
  );
}