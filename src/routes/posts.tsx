import { useState }     from 'react';
import { getAllPosts }  from '../utils/getPosts';
import RecentPostCard   from '../components/RecentPostsButton';
import { Container, Typography, Stack, Box, Chip, Pagination } from '@mui/material';

export default function Posts() {
const ALL_POSTS = getAllPosts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const POSTS_PER_PAGE = 10;

  const allCategories = Array.from(new Set(ALL_POSTS.flatMap(post => post.categories)));
  const CATEGORIES = ['All', ...allCategories];

    const filteredPosts = selectedCategory === 'All' 
        ? ALL_POSTS 
        : ALL_POSTS.filter(post => post.categories && post.categories.includes(selectedCategory));

  // 2. ページネーションの計算
  const count = Math.ceil(filteredPosts.length / POSTS_PER_PAGE); // 総ページ数
  const _pageIndex = (page - 1) * POSTS_PER_PAGE;
  const displayPosts = filteredPosts.slice(_pageIndex, _pageIndex + POSTS_PER_PAGE); // 表示する分だけ切り出す

  // カテゴリを変えたらページを1に戻す処理
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1); 
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
      
      <Typography variant="h3" component="h1" color="white" fontWeight="bold" gutterBottom textAlign="center">
        Posts
      </Typography>

      {/* カテゴリ選択チップ */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 6 }}>
        {CATEGORIES.map((cat) => (
            <Chip
                key={cat}
                label={cat}
                clickable
                onClick={() => handleCategoryChange(cat)}
                variant={selectedCategory === cat ? "filled" : "outlined"} 
                color={selectedCategory === cat ? "primary" : "default"}
                sx={{ px: 1 }}
            />
        ))}
      </Stack>

      {/* 記事一覧リスト (切り出した displayPosts を表示) */}
      <Stack spacing={4}>
        {displayPosts.map((post) => (
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

      {/* 3. ページネーション操作部分 */}
      {count > 1 && (
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={count} 
            page={page} 
            onChange={(_, value) => {
              setPage(value);
              window.scrollTo(0, 0); // ページを変えたら一番上へスクロール
            }}
            color="primary"
            size="large"
            // ダークテーマに合うように少しカスタマイズ
            sx={{
              '& .MuiPaginationItem-root': { color: 'white' }
            }}
          />
        </Box>
      )}

      {filteredPosts.length === 0 && (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 10 }}>
          該当する記事が見つかりませんでした。
        </Typography>
      )}

    </Container>
  );
}