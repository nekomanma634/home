import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Stack 
} from '@mui/material';
import SendIcon                     from '@mui/icons-material/Send';
import { useForm, ValidationError } from '@formspree/react';

export default function Contact() {
  const [state, handleSubmit] = useForm("xyknjqgw");

  if (state.succeeded) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 12, md: 20 }, textAlign: 'center' }}>
        <Typography variant="h3" color="white" fontWeight="bold" gutterBottom>
          Thank you!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          メッセージが送信されました。お問い合わせありがとうございます！
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 12 } }}>
      
      <Typography variant="h3" component="h1" color="white" fontWeight="bold" gutterBottom textAlign="center">
        Contact
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        お仕事のご依頼やお問い合わせはこちらから
      </Typography>

      <Card elevation={0} sx={{ bgcolor: '#1a1a1a', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              
              <Box>
                <TextField 
                  id="name"
                  name="name" 
                  label="お名前 (Name)" 
                  variant="outlined" 
                  fullWidth 
                  required 
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,0.2)' } }}
                />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </Box>

              <Box>
                <TextField 
                  id="email"
                  name="email" 
                  label="メールアドレス (Email)" 
                  type="email" 
                  variant="outlined" 
                  fullWidth 
                  required 
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,0.2)' } }}
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </Box>

              <Box>
                <TextField 
                  id="message"
                  name="message" 
                  label="メッセージ (Message)" 
                  variant="outlined" 
                  multiline 
                  rows={6} 
                  fullWidth 
                  required 
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(0,0,0,0.2)' } }}
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                endIcon={<SendIcon />}
                disabled={state.submitting} 
                sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2, fontWeight: 'bold' }}
              >
                {state.submitting ? '送信中...' : '送信する'}
              </Button>

            </Stack>
          </form>
        </CardContent>
      </Card>

    </Container>
  );
}