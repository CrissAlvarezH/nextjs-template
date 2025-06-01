import { listBlogPosts } from '../blogs';

describe('Blog Repository - Simple Test', () => {
  it('should return empty results when database is empty', async () => {
    // Act
    const result = await listBlogPosts(1, 10);

    // Assert
    expect(result.posts).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
}); 