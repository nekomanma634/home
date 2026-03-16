import React, { useState, useEffect, useId } from 'react';
import { Container, Typography, Box, Button, Divider, Collapse, IconButton, Alert, AlertTitle } from '@mui/material';
import { useParams, Link } from 'react-router';
import { getPostById }     from '../utils/getPosts';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import ReactMarkdown       from 'react-markdown';
import rehypeRaw           from 'rehype-raw';
import ContentCopyIcon     from '@mui/icons-material/ContentCopy';
import CheckIcon           from '@mui/icons-material/Check';
import mermaid             from 'mermaid';
import ExpandMoreIcon      from '@mui/icons-material/ExpandMore';
import ExpandLessIcon      from '@mui/icons-material/ExpandLess';

// =====================================================================
// 1. Mermaid の初期設定 (ダークテーマ)
// =====================================================================
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark', 
  fontFamily: 'inherit',
});

// =====================================================================
// 2. Mermaid描画用コンポーネント (エラーハンドリング強化版)
// =====================================================================
const MermaidBlock = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const id = `mermaid-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const renderChart = async () => {
      try {
        setErrorMsg(null);
        await mermaid.parse(chart);
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error: any) {
        console.error('Mermaid構文エラー:', error);
        setErrorMsg(error?.message || 'Mermaidの構文エラーが発生しました。');
      }
    };
    if (chart) {
      renderChart();
    }
  }, [chart, id]);

  if (errorMsg) {
    return (
      <Box sx={{ 
        my: 4, 
        p: 2, 
        backgroundColor: '#2d2d2d', 
        borderLeft: '4px solid #ff5252',
        borderRadius: '4px',
        overflowX: 'auto'
      }}>
        <Typography sx={{ color: '#ff5252', fontWeight: 'bold', fontSize: '0.9rem', mb: 1 }}>
          Mermaid Syntax Error
        </Typography>
        <Typography sx={{ color: '#ff8a80', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
          MarkdownファイルのMermaid記法に誤りがあります。コードを確認してください。
        </Typography>
      </Box>
    );
  }

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

// =====================================================================
// 3. 言語名を綺麗にフォーマットする関数
// =====================================================================
const formatLanguageName = (lang: string) => {
  if (!lang) return '';
  const map: { [key: string]: string } = {
    cpp:        'C++',        'c++': 'C++',
    c:          'C',
    cs:         'C#',
    csharp:     'C#',         'c#': 'C#',
    rs:         'Rust',
    rust:       'Rust',
    py:         'Python',
    python:     'Python',
    js:         'JavaScript',
    javascript: 'JavaScript',
    ts:         'TypeScript',
    typescript: 'TypeScript',
    bash:       'Bash',
    sh:         'Shell',
    html:       'HTML',
    css:        'CSS',
    json:       'JSON',
    md:         'Markdown',
    react:      'React',
    rb:         'Ruby',
    ruby:       'Ruby',
  };
  return map[lang.toLowerCase()] || lang.toUpperCase();
};

// =====================================================================
// 4. :::note 記法を変換するプレプロセッサ
// =====================================================================
const preprocessMarkdown = (content: string) => {
  if (!content) return '';
  return content.replace(
    /^:::note\s*(info|warn|alert)?\s*\r?\n([\s\S]*?)\r?\n^:::/gm,
    (match, type, innerContent) => {
      const calloutType = type || 'info';
      const quotedContent = innerContent.split(/\r?\n/).map((line: string) => `> ${line}`).join('\n');
      return `> [!NOTE-${calloutType}]\n${quotedContent}`;
    }
  );
};

// =====================================================================
// 5. Shiki (ハイライト) + ヘッダー帯 (ファイル名表示対応) + コピー + 開閉機能
// =====================================================================
const ShikiCodeBlock = ({ languageId, metaString, children }: { languageId: string, metaString: string, children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  const codeString = String(children).replace(/\n$/, '');
  const displayLanguage = formatLanguageName(languageId);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const { codeToHtml } = await import('shiki');
        const out = await codeToHtml(codeString, {
          lang: languageId.replace('c++', 'cpp').replace('c#', 'csharp'), 
          theme: 'dark-plus' 
        });
        setHtml(out);
      } catch (error) {
        console.error('Shikiハイライトエラー:', error);
        setHtml(`<pre style="padding: 16px; margin: 0; background-color: #1e1e1e; overflow-x: auto;"><code>${codeString}</code></pre>`);
      }
    };
    highlightCode();
  }, [codeString, languageId]);

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
        {/* 左側：開閉ボタン ＋ 言語名 ＋ 追加情報(ファイル名など) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            size="small" 
            onClick={() => setIsExpanded(!isExpanded)} 
            sx={{ color: '#ccc', mr: 1, p: 0.5 }}
          >
            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
          
          <Typography 
            sx={{ 
              color: '#e0e0e0',
              fontFamily: 'Note Serif JP', 
              fontWeight: 'bold',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              transform: 'translateY(13px)', 
            }}
          >
            {displayLanguage}
          </Typography>

          {/* 追加情報（ファイル名やブランチ名など）の表示 */}
          {metaString && (
            <Box sx={{ display: 'flex', alignItems: 'center', transform: 'translateY(13px)' }}>
              <Box sx={{ width: '1px', height: '14px', mx: 1.5 }} />
              <Typography sx={{ color: '#9cdcfe', fontFamily: 'Note Serif JP', fontSize: '0.85rem' }}>
                {metaString}
              </Typography>
            </Box>
          )}
        </Box>

        {/* 右側：コピーボタン */}
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

      {/* コード本体エリア (Collapse で開閉) */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
      </Collapse>
    </Box>
  );
};

// =====================================================================
// 6. メインページコンポーネント
// =====================================================================
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

  // 取得したマークダウン文字列をプレプロセッサに通す
  const processedContent = preprocessMarkdown(post.content);

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
            // ==========================================================
            // ★ Zenn風のインフォメーション（Alert）ブロック
            // ==========================================================
            blockquote({ node, children, ...props }: any) {
              const childrenArray = React.Children.toArray(children);
              
              const firstElement = childrenArray.find(child => React.isValidElement(child)) as React.ReactElement | undefined;
              const childProps = firstElement?.props as any;
              
              if (firstElement && childProps && childProps.children) {
                const firstElementChildren = React.Children.toArray(childProps.children);
                
                const firstTextIndex = firstElementChildren.findIndex(child => typeof child === 'string' && child.trim() !== '');
                const firstTextNode = firstElementChildren[firstTextIndex] as string | undefined;
                
                if (firstTextNode && firstTextNode.trim().startsWith('[!NOTE-')) {
                  const match = firstTextNode.trim().match(/^\[!NOTE-(info|warn|alert)\]/);
                  if (match) {
                    const type = match[1];
                    const severity = type === 'alert' ? 'error' : type === 'warn' ? 'warning' : 'info';
                    
                    const titleMap: Record<string, string> = {
                      info: 'インフォメーション',
                      warn: '警告',
                      alert: 'より強い警告'
                    };
                    
                    const newFirstTextNode = firstTextNode.replace(/^\s*\[!NOTE-(info|warn|alert)\]\s*/, '');
                    
                    const newElementChildren = [...firstElementChildren];
                    newElementChildren[firstTextIndex] = newFirstTextNode;
                    
                    const newFirstElement = React.cloneElement(firstElement, {
                      ...childProps,
                      children: newElementChildren
                    });

                    const elementIndex = childrenArray.indexOf(firstElement);
                    const newChildrenArray = [...childrenArray];
                    newChildrenArray[elementIndex] = newFirstElement;

                    return (
                      <Alert 
                        severity={severity} 
                        variant="outlined" 
                        sx={{ 
                          my: 4, 
                          borderRadius: '8px',
                          borderWidth: '1px',
                          backgroundColor: type === 'alert' ? 'rgba(211,47,47,0.1)' : type === 'warn' ? 'rgba(237,108,2,0.1)' : 'rgba(2,136,209,0.1)',
                          alignItems: 'flex-start',
                          '& .MuiAlert-message': { width: '100%', color: '#e0e0e0' },
                          '& .MuiAlert-icon': { mt: '4px' }, 
                        }}
                      >
                        <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5, color: type === 'alert' ? '#ff8a80' : type === 'warn' ? '#ffb74d' : '#81d4fa' }}>
                          {titleMap[type]}
                        </AlertTitle>
                        
                        <Box sx={{ 
                          '& p': { mt: 0, mb: 1.5, lineHeight: 1.6 }, 
                          '& p:last-child': { mb: 0 } 
                        }}>
                          {newChildrenArray}
                        </Box>
                      </Alert>
                    );
                  }
                }
              }

              return (
                <Box
                  component="blockquote"
                  sx={{
                    borderLeft: '4px solid #555',
                    pl: 2,
                    my: 3,
                    color: '#aaa',
                    fontStyle: 'italic',
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    py: 1,
                    borderRadius: '0 4px 4px 0'
                  }}
                  {...props}
                >
                  {children}
                </Box>
              );
            },
            
            // ==========================================================
            // ★ 折りたたみ（details）
            // ==========================================================
            details({ node, children, ...props }: any) {
              return (
                <Box
                  component="details"
                  sx={{
                    my: 3, 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    backgroundColor: '#1e1e1e',
                    overflow: 'hidden',
                    '&[open] summary': {
                      borderBottom: '1px solid #333',
                      color: '#90caf9', 
                      '&::before': {
                        transform: 'rotate(90deg)', 
                      }
                    },
                    '& > *:not(summary)': {
                      px: 2, 
                      pb: 1, 
                    },
                  }}
                  {...props}
                >
                  {children}
                </Box>
              );
            },
            
            summary({ node, children, ...props }: any) {
              return (
                <Box
                  component="summary"
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#e0e0e0',
                    backgroundColor: '#252526',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s, color 0.2s',
                    '&:hover': {
                      backgroundColor: '#2d2d2d',
                    },
                    listStyle: 'none',
                    '&::-webkit-details-marker': {
                      display: 'none',
                    },
                    '&::before': {
                      content: '"▶"',
                      display: 'inline-block',
                      mr: 1.5,
                      fontSize: '0.8rem',
                      color: '#888',
                      transition: 'transform 0.2s ease', 
                    }
                  }}
                  {...props}
                >
                  {children}
                </Box>
              );
            },

            // ==========================================================
            // ★ コードブロック
            // ==========================================================
            pre({ node, children, ...props }: any) {
              return <div className="markdown-pre-wrapper" {...props}>{children}</div>;
            },
                
            code({ node, className, children, ...props }: any) {
              // コロン(:)区切りのファイル名、またはスペース区切りの追加情報を取得
              const match = /language-([a-zA-Z0-9+#]+)(?::(.*))?/.exec(className || '');
              const languageId = match ? match[1].toLowerCase() : '';
              
              // 🌟 クラス名に含まれるコロン以降の文字と、スペース以降のメタデータの両方を結合！
              const classMeta = match?.[2] || '';
              const remarkMeta = node?.data?.meta || node?.properties?.meta || '';
              const metaString = `${classMeta} ${remarkMeta}`.trim();

              if (languageId === 'mermaid') {
                return <MermaidBlock chart={String(children).replace(/\n$/, '')} />;
              }
              
              return match ? (
                <ShikiCodeBlock languageId={match[1]} metaString={metaString} children={children} />
              ) : (
                <code {...props} className={className} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#ffb74d' }}>
                  {children}
                </code>
              );
            }
          } as any}
        >
          {processedContent}
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