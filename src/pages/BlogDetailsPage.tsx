import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockBlogPosts } from '../data/mockData';

const BlogDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = mockBlogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate('/blog')}>Retour au blog</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{post.author}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishDate).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} min de lecture
              </span>
            </div>
          </div>
        </div>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        <div className="prose max-w-none">
          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          <p className="leading-relaxed">{post.content}</p>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogDetailsPage;
