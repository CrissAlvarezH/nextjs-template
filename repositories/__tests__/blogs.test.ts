import {
  listBlogPosts,
  retrieveBlogPost,
  insertBlogPost,
  updateBlogPost,
  updateBlogPostBannerPath,
  deleteBlogPost,
  listPostComments,
  insertPostComment,
} from '../blogs';
import { db } from '../../testing/setup-tests';
import { blogPosts, blogPostComment } from '@/db/schemas/blog';
import { users, confirmationEmailCode } from '@/db/schemas/users';

describe('Blog Repository', () => {
  let testUserId: number;
  let testUser2Id: number;
  let testBlogPostId: number;

  beforeEach(async () => {
    // Clean up tables before each test in the correct order to respect foreign keys
    await db.delete(blogPostComment);
    await db.delete(blogPosts);
    await db.delete(confirmationEmailCode);
    await db.delete(users);

    // Create test users
    const [user1] = await db.insert(users).values({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123',
    }).returning();

    const [user2] = await db.insert(users).values({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword456',
    }).returning();

    testUserId = user1.id;
    testUser2Id = user2.id;

    // Create a test blog post
    const [blogPost] = await db.insert(blogPosts).values({
      title: 'Test Blog Post',
      description: 'This is a test blog post description',
      content: 'This is the full content of the test blog post.',
      author: testUserId,
      date: new Date('2023-01-01'),
      banner: 'test-banner.jpg',
    }).returning();

    testBlogPostId = blogPost.id;
  });

  describe('listBlogPosts', () => {
    it('should return empty results when database is empty', async () => {
      // Clear all blog posts
      await db.delete(blogPosts);

      const result = await listBlogPosts(1, 10);

      expect(result.posts).toHaveLength(0);
      expect(result.totalPages).toBe(0);
    });

    it('should return blog posts with pagination', async () => {
      // Create additional blog posts
      await db.insert(blogPosts).values([
        {
          title: 'Second Blog Post',
          description: 'Second post description',
          content: 'Second post content',
          author: testUser2Id,
          date: new Date('2023-01-02'),
        },
        {
          title: 'Third Blog Post',
          description: 'Third post description',
          content: 'Third post content',
          author: testUserId,
          date: new Date('2023-01-03'),
        },
      ]);

      const result = await listBlogPosts(1, 2);

      expect(result.posts).toHaveLength(2);
      expect(result.totalPages).toBe(2); // 3 posts, 2 per page = 2 pages
      expect(result.posts[0]).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        date: expect.any(Date),
        author: {
          id: expect.any(Number),
          name: expect.any(String),
        },
      });
    });

    it('should handle pagination correctly for second page', async () => {
      // Create additional blog posts for pagination testing
      await db.insert(blogPosts).values([
        {
          title: 'Second Blog Post',
          description: 'Second post description',
          content: 'Second post content',
          author: testUser2Id,
          date: new Date('2023-01-02'),
        },
        {
          title: 'Third Blog Post',
          description: 'Third post description',
          content: 'Third post content',
          author: testUserId,
          date: new Date('2023-01-03'),
        },
      ]);

      const page2Result = await listBlogPosts(2, 2);

      expect(page2Result.posts).toHaveLength(1); // Only 1 post on page 2
      expect(page2Result.totalPages).toBe(2);
    });
  });

  describe('retrieveBlogPost', () => {
    it('should return blog post when it exists', async () => {
      const result = await retrieveBlogPost(testBlogPostId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(testBlogPostId);
      expect(result?.title).toBe('Test Blog Post');
      expect(result?.description).toBe('This is a test blog post description');
      expect(result?.content).toBe('This is the full content of the test blog post.');
      expect(result?.author).toEqual({
        id: testUserId,
        name: 'John Doe',
      });
      expect(result?.banner).toBe('test-banner.jpg');
    });

    it('should return undefined when blog post does not exist', async () => {
      const result = await retrieveBlogPost(99999);
      expect(result).toBeUndefined();
    });
  });

  describe('insertBlogPost', () => {
    it('should create a new blog post and return it', async () => {
      const newPostData = {
        title: 'New Blog Post',
        description: 'A new post description',
        content: 'The content of the new blog post',
        author: testUser2Id,
      };

      const result = await insertBlogPost(newPostData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(newPostData.title);
      expect(result.description).toBe(newPostData.description);
      expect(result.content).toBe(newPostData.content);
      expect(result.author).toBe(newPostData.author);
      expect(result.date).toBeInstanceOf(Date);
      expect(result.banner).toBeNull();
    });

    it('should work with transaction parameter', async () => {
      const newPostData = {
        title: 'Transaction Test Post',
        description: 'Test with transaction',
        content: 'Content with transaction',
        author: testUserId,
      };

      // Using the db as transaction (simplified for testing)
      const result = await insertBlogPost(newPostData, db);

      expect(result.title).toBe(newPostData.title);
    });
  });

  describe('updateBlogPost', () => {
    it('should update blog post data', async () => {
      const updateData = {
        title: 'Updated Blog Post Title',
        description: 'Updated description',
        content: 'Updated content',
      };

      const result = await updateBlogPost(testBlogPostId, updateData);

      expect(result.id).toBe(testBlogPostId);
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
      expect(result.content).toBe(updateData.content);
      expect(result.author).toBe(testUserId); // Author should remain unchanged
    });

    it('should throw error when updating non-existent blog post', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        content: 'Updated content',
      };

      await expect(updateBlogPost(99999, updateData)).rejects.toThrow('database error');
    });

    it('should work with transaction parameter', async () => {
      const updateData = {
        title: 'Transaction Updated Title',
        description: 'Transaction updated description',
        content: 'Transaction updated content',
      };

      const result = await updateBlogPost(testBlogPostId, updateData, db);
      expect(result.title).toBe(updateData.title);
    });
  });

  describe('updateBlogPostBannerPath', () => {
    it('should update blog post banner path', async () => {
      const newBannerPath = 'new-banner-image.jpg';

      await updateBlogPostBannerPath(testBlogPostId, newBannerPath);

      // Verify the update
      const updatedPost = await retrieveBlogPost(testBlogPostId);
      expect(updatedPost?.banner).toBe(newBannerPath);
    });

    it('should work with transaction parameter', async () => {
      const newBannerPath = 'transaction-banner.jpg';

      await updateBlogPostBannerPath(testBlogPostId, newBannerPath, db);

      const updatedPost = await retrieveBlogPost(testBlogPostId);
      expect(updatedPost?.banner).toBe(newBannerPath);
    });
  });

  describe('deleteBlogPost', () => {
    it('should delete blog post', async () => {
      await deleteBlogPost(testBlogPostId);

      const deletedPost = await retrieveBlogPost(testBlogPostId);
      expect(deletedPost).toBeUndefined();
    });

    it('should not throw error when deleting non-existent blog post', async () => {
      await expect(deleteBlogPost(99999)).resolves.not.toThrow();
    });
  });

  describe('Blog Comments', () => {
    let testCommentId: number;

    beforeEach(async () => {
      // Create a test comment
      const commentDate = new Date('2023-01-01T10:00:00Z');
      await insertPostComment('This is a test comment', testBlogPostId, testUserId, commentDate);

      // Get the comment ID for tests
      const comments = await listPostComments(testBlogPostId);
      testCommentId = comments[0].comment.id;
    });

    describe('insertPostComment', () => {
      it('should create a new comment', async () => {
        const commentContent = 'This is a new comment';
        const commentDate = new Date('2023-01-02T10:00:00Z');

        await insertPostComment(commentContent, testBlogPostId, testUser2Id, commentDate);

        const comments = await listPostComments(testBlogPostId);
        expect(comments).toHaveLength(2);

        const newComment = comments.find(c => c.comment.content === commentContent);
        expect(newComment).toBeDefined();
        expect(newComment?.comment.post).toBe(testBlogPostId);
        expect(newComment?.comment.author).toBe(testUser2Id);
        expect(newComment?.comment.date).toEqual(commentDate);
      });
    });

    describe('listPostComments', () => {
      it('should return comments for a blog post with author info', async () => {
        const comments = await listPostComments(testBlogPostId);

        expect(comments).toHaveLength(1);
        expect(comments[0]).toMatchObject({
          comment: {
            id: expect.any(Number),
            content: 'This is a test comment',
            post: testBlogPostId,
            author: testUserId,
            date: expect.any(Date),
          },
          author: {
            id: testUserId,
            name: 'John Doe',
            picture: null,
            pictureHash: null,
          },
        });
      });

      it('should return empty array when no comments exist', async () => {
        // Clear all comments
        await db.delete(blogPostComment);

        const comments = await listPostComments(testBlogPostId);
        expect(comments).toHaveLength(0);
      });

      it('should return comments ordered by date descending', async () => {
        // Add multiple comments with different dates
        await insertPostComment('Second comment', testBlogPostId, testUser2Id, new Date('2023-01-02T10:00:00Z'));
        await insertPostComment('Third comment', testBlogPostId, testUserId, new Date('2023-01-03T10:00:00Z'));

        const comments = await listPostComments(testBlogPostId);

        expect(comments).toHaveLength(3);
        expect(comments[0].comment.content).toBe('Third comment'); // Most recent first
        expect(comments[1].comment.content).toBe('Second comment');
        expect(comments[2].comment.content).toBe('This is a test comment'); // Oldest last
      });

      it('should return empty array for non-existent blog post', async () => {
        const comments = await listPostComments(99999);
        expect(comments).toHaveLength(0);
      });
    });
  });
}); 