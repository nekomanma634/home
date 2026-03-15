import fm from 'front-matter';

const mdFiles = import.meta.glob('../../posts/**/*.md', { query: '?raw', eager: true });

export interface Post {
  id: string;
  title: string;
  date: string;
  categories: string[]; // 絶対に配列にする
  description: string;
  imageUrl: string;
  content: string;
}

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  for (const path in mdFiles) {
    const relativePath = path.replace('../posts/', '').replace('.md', '');
    const id = relativePath.replace(/\//g, '_'); 
    
    const fileContent = (mdFiles[path] as any).default as string;
    const parsed = fm<any>(fileContent);

    // ★ 超重要：カテゴリがどう書かれていても、絶対に「配列」に変換してエラーを防ぐ
    let rawCategories = parsed.attributes.categories || parsed.attributes.category;
    let finalCategories: string[] = [];
    
    if (!rawCategories) {
      finalCategories = ['未分類']; // 何も書かれていない場合
    } else if (Array.isArray(rawCategories)) {
      finalCategories = rawCategories; // 正しく [ ] で書かれている場合
    } else {
      // "C++" のように文字列で書かれてしまっている場合、強制的に ["C++"] にする
      finalCategories = [String(rawCategories)]; 
    }

    posts.push({
      id,
      title: parsed.attributes.title || 'No Title',
      // 日付も念のため確実に文字列化
      date: parsed.attributes.date ? String(parsed.attributes.date) : '2000-01-01', 
      categories: finalCategories, 
      description: parsed.attributes.description || '',
      imageUrl: parsed.attributes.imageUrl || '',
      content: parsed.body,
    });
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostById(id: string): Post | undefined {
  return getAllPosts().find(post => post.id === id);
}