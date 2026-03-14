import { Box, Card, CardContent, Typography, Avatar, Stack, Chip } from '@mui/material';

export default function ProfileBox() {
  return (
    <Card 
      elevation={0} 
      sx={{ 
        maxWidth: 800,
        mx: 'auto',
        bgcolor: '#1a1a1a', 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 4,
        
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        alignItems: 'center',
        p: 2,
      }}
    >
      
      {/* 1. 左側：アバター画像エリア */}
      <Box sx={{ p: 3 }}>
        <Avatar 
          alt="nekomanma634" 
          src="https://tegakisozai.com/wp-content/uploads/2021/10/neko_jyuwomotukuroneko.png?auto=format&fit=crop&w=150&q=80" 
          // 横長レイアウトに合わせて少しだけ画像を大きく（120 → 150）
          sx={{ width: 150, height: 150, border: '3px solid', borderColor: '#333333' }} 
        />
      </Box>

      {/* 2. 右側：テキスト＆タグエリア */}
      <CardContent 
        sx={{ 
          flex: 1,
          textAlign: { xs: 'center', md: 'left' },
          p: { xs: 2, md: 3 },
          '&:last-child': { pb: { xs: 2, md: 3 } }
        }}
      >
        <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
          nekomanma634
        </Typography>
        <Typography variant="body1" sx={{ color: '#90caf9', mb: 2, fontWeight: 'bold' }}>
          高専生（情報系）
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            幅広い技術領域とクリエイティブな表現に興味を持ち、<br/>日々開発を行っています.<p/>
            ・ 開発: C/C++でのゲームエンジン制作、Reactを用いたWeb開発<br/>
            ・ アルゴリズム: 競技プログラミング（AHC 緑コーダー）<br/>
            ・ 趣味: 音楽制作、イラスト制作<p />
            技術とアートの両輪で、面白いモノを生み出していくのが目標です！
        </Typography>

        {/* タグの配置もスマホとPCで揃え方を自動変更 */}
        <Stack 
          direction="row" 
          flexWrap="wrap" 
          justifyContent={{ xs: 'center', md: 'flex-start' }} 
          useFlexGap 
          sx={{ gap: 1 }}
        >
          <Chip label="React"       variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
          <Chip label="TypeScript"  variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
          <Chip label="MUI"         variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
          <Chip label="C/C++"       variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
          <Chip label="Rust"        variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
          <Chip label="OpenGL"      variant="outlined" sx={{ color: '#e0e0e0', borderColor: 'rgba(255,255,255,0.2)' }} />
        </Stack>
      </CardContent>

    </Card>
  );
}