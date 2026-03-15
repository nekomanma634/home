import { useState, useEffect, useId } from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { useParams, Link } from 'react-router';
import { getPostById }     from '../utils/getPosts';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import ReactMarkdown       from 'react-markdown';
import rehypeRaw           from 'rehype-raw';
import ContentCopyIcon     from '@mui/icons-material/ContentCopy';
import CheckIcon           from '@mui/icons-material/Check';
import mermaid             from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark', 
  fontFamily: 'inherit',
});

const MermaidBlock = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string>('');
  const id = `mermaid-${useId().replace(/:/g, '')}`; // React 18の機能でユニークなIDを生成

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setSvg(`<div style="color: #ff5252; padding: 16px; border: 1px solid #ff5252;">Mermaidの構文エラーです</div>`);
      }
    };
    if (chart) {
      renderChart();
    }
  }, [chart, id]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        my: 4, 
        p: 2, 
        backgroundColor: '#1e1e1e', 
        borderRadius: '8px',
        overflowX: 'auto' 
      }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

const ShikiCodeBlock = ({ match, children }: { match: RegExpExecArray, children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string>('');
  
  const codeString = String(children).replace(/\n$/, '');
  const language = match[1];

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const { codeToHtml } = await import('shiki'); // 動的インポート
        const out = await codeToHtml(codeString, {
          lang: language,
          theme: 'dark-plus' 
        });
        setHtml(out);
      } catch (error) {
        console.error('Shikiハイライトエラー:', error);
        // エラー時は素のコードを表示
        setHtml(`<pre style="padding: 16px; margin: 0; background-color: #1e1e1e; overflow-x: auto;"><code>${codeString}</code></pre>`);
      }
    };
    highlightCode();
  }, [codeString, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピー失敗:', err);
    }
  };

  return (
    <Box sx={{ 
      margin: '1.5em 0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      
      {/* 帯（ヘッダー）部分 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2d2d2d', 
        px: 2, 
        py: 0.5, 
        borderBottom: '1px solid #1e1e1e', 
      }}>
        {/* 言語名の表示 */}
        <Typography variant="caption" sx={{ color: '#ccc', fontFamily: 'monospace', fontWeight: 'bold' }}>
          {language}
        </Typography>

        {/* コピーボタン */}
        <Button
          size="small"
          onClick={handleCopy}
          startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          sx={{
            color: copied ? '#4caf50' : '#d4d4d4',
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 8px',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>

      {/* コード本体エリア */}
      <Box sx={{ 
        '& pre': {
          margin: 0,
          padding: '16px !important', 
          backgroundColor: '#1e1e1e !important', 
          overflowX: 'auto',
          fontSize: '0.95rem',
          lineHeight: 1.5,
        }
      }}>
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <Box sx={{ p: 2, bgcolor: '#1e1e1e', color: '#888' }}>
            Loading code...
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default function PostDetail() {
  const { id } = useParams(); 
  const post = id ? getPostById(id) : undefined;

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

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="white" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          公開日: {post.date} | カテゴリ: {post.categories ? post.categories.join(', ') : '未分類'}
        </Typography>
      </Box>

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
            pre({ children, ...props }: any) {
                  return <div className="markdown-pre-wrapper" {...props}>{children}</div>;
                },
                
            code(props: any) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';

              // 言語が 'mermaid' の場合
              if (language === 'mermaid') {
                return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
              }
              
              // それ以外のコードブロックの場合
              return match ? (
                <ShikiCodeBlock match={match} children={children} />
              ) : (
                // インラインコード（`code` のようにバッククォート1つで囲まれたもの）の場合
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