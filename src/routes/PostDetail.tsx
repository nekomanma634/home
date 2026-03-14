import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { Prism as SyntaxHighlighter }                  from 'react-syntax-highlighter';
import { useParams, Link } from 'react-router';
import { vscDarkPlus }     from 'react-syntax-highlighter/dist/esm/styles/prism';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import ReactMarkdown       from 'react-markdown';
import rehypeRaw           from 'rehype-raw';

// 先ほど作った自動取得関数をインポート
import { getPostById } from '../utils/getPosts';

export default function PostDetail() {
  const { id } = useParams(); // URLから /posts/1 の "1" を取得
  
  // IDを使って該当するMarkdownのデータを検索！
  const post = id ? getPostById(id) : undefined;

  // 記事が見つからない（存在しないURL）場合
  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="white">記事が見つかりませんでした。</Typography>
        <Button component={Link} to="/posts" sx={{ mt: 3, color: '#90caf9' }}>一覧へ戻る</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      
      <Button component={Link} to="/posts" startIcon={<ArrowBackIcon />} sx={{ mb: 4, color: '#90caf9' }}>
        記事一覧へ戻る
      </Button>

      {/* マークダウンのデータ（フロントマター）からタイトル等を反映！ */}
    <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="white" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          公開日: {post.date} | カテゴリ: {post.categories ? post.categories.join(', ') : '未分類'}
        </Typography>
    </Box>

      {/* 描画エリアには マークダウンの本文（post.content）を渡す */}
      <Box 
        sx={{ 
          color: '#e0e0e0', lineHeight: 2, fontSize: '1.1rem',
          '& h2': { color: 'white', borderBottom: '1px solid #333', pb: 1, mt: 6, mb: 3 },
          '& h3': { color: '#90caf9', mt: 4, mb: 2 },
          '& p': { mb: 3 }
        }}
      >
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code(props: any) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  {...rest} PreTag="div" children={String(children).replace(/\n$/, '')}
                  language={match[1]} style={vscDarkPlus as any}
                  customStyle={{ borderRadius: '8px', padding: '16px', fontSize: '0.95rem', margin: '1.5em 0' }}
                />
              ) : (
                <code {...rest} className={className} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#ffb74d' }}>
                  {children}
                </code>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </Box>

      <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ textAlign: 'center' }}>
        <Button variant="outlined" component={Link} to="/contact" sx={{ color: 'white', borderColor: 'divider' }}>
          この記事について質問する
        </Button>
      </Box>

    </Container>
  );
}