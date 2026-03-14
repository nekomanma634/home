import { Card, CardContent, Typography, Divider, Stack, Chip } from '@mui/material';

// 受け取るデータの型を定義します
interface SkillCardProps {
  title: string;
  description: string;
  skills: string[];
}

export default function SkillCard({ title, description, skills }: SkillCardProps) {
  return (
    <Card elevation={0} sx={{ height: '100%', bgcolor: '#1a1a1a', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" color="white" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {skills.map((skill, idx) => (
            <Chip 
              key={idx} 
              label={skill} 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(144, 202, 249, 0.1)', 
                color: '#90caf9', 
                border: '1px solid rgba(144, 202, 249, 0.3)' 
              }} 
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}