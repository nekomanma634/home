import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router';

interface RecentPostCardProps {
  to: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export default function RecentPostCard({ to, title, date, description, imageUrl }: RecentPostCardProps) {
  return (
    <Card 
      elevation={0} 
      sx={{ 
        bgcolor: '#1a1a1a', 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden', // 角丸から画像がはみ出さないようにする
        transition: 'transform 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)', // マウスを乗せると少しフワッと浮く
          borderColor: '#90caf9',        // 枠線がアクセントカラーに光る
        }
      }}
    >
      {/* CardActionArea で囲むと、中身全体がクリック可能なボタンになります */}
      <CardActionArea 
        component={Link} 
        to={to} 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, // スマホは縦、PCは横並び
          alignItems: 'stretch' 
        }}
      >
        {/* サムネイル画像 */}
        <CardMedia
          component="img"
          sx={{ 
            width: { xs: '100%', sm: 240 }, // PC時は幅240px固定
            height: { xs: 200, sm: '100' }, // PC時は高さ自動（親に合わせる）
            minHeight: { sm: 160 },
            objectFit: 'cover'
          }}
          image={imageUrl}
          alt={title}
        />
        
        {/* テキスト部分 */}
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Typography variant="caption" sx={{ color: '#81c784', fontWeight: 'bold', mb: 1, display: 'block' }}>
            {date}
          </Typography>
          <Typography variant="h5" component="h3" color="white" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}