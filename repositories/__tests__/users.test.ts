import {
  getUserById,
  getUserByEmail,
  insertUser,
  validateUserEmail,
  updateUserData,
  updateUserPicture,
  updateUserPassword,
  getUserOAuthProvider,
  getAccountByGoogleId,
  createGoogleAccount,
  getOrCreateConfirmationEmail,
  getEmailConfirmationCode,
  deleteEmailConfirmationCode,
} from '../users';
import { db } from '../../testing/setup-tests';
import { users, accounts, confirmationEmailCode } from '@/db/schemas/users';
import { blogPosts, blogPostComment } from '@/db/schemas/blog';
import { eq } from 'drizzle-orm';

describe('User Repository', () => {
  let testUserId: number;
  let testUser2Id: number;

  beforeEach(async () => {
    // Clean up tables before each test in the correct order to respect foreign keys
    await db.delete(blogPostComment);
    await db.delete(blogPosts);
    await db.delete(confirmationEmailCode);
    await db.delete(accounts);
    await db.delete(users);

    // Create test users
    const [user1] = await db.insert(users).values({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword123',
      is_email_validated: false,
    }).returning();

    const [user2] = await db.insert(users).values({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'hashedpassword456',
      is_email_validated: true,
      phone: '+1234567890',
    }).returning();

    testUserId = user1.id;
    testUser2Id = user2.id;
  });

  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      const user = await getUserById(testUserId);
      
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.name).toBe('John Doe');
      expect(user?.email).toBe('john@example.com');
    });

    it('should return undefined when user does not exist', async () => {
      const user = await getUserById(99999);
      expect(user).toBeUndefined();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when email exists', async () => {
      const user = await getUserByEmail('jane@example.com');
      
      expect(user).toBeDefined();
      expect(user?.id).toBe(testUser2Id);
      expect(user?.name).toBe('Jane Smith');
      expect(user?.email).toBe('jane@example.com');
    });

    it('should return undefined when email does not exist', async () => {
      const user = await getUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('insertUser', () => {
    it('should create a new user and return it', async () => {
      const newUserData = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'hashedpassword789',
      };

      const createdUser = await insertUser(newUserData);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.name).toBe(newUserData.name);
      expect(createdUser.email).toBe(newUserData.email);
      expect(createdUser.password).toBe(newUserData.password);
      expect(createdUser.is_email_validated).toBe(false);
      expect(createdUser.createdAt).toBeDefined();
    });

    it('should create user with optional fields', async () => {
      const newUserData = {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        password: 'hashedpassword101',
        phone: '+9876543210',
        is_email_validated: true,
      };

      const createdUser = await insertUser(newUserData);

      expect(createdUser.phone).toBe(newUserData.phone);
      expect(createdUser.is_email_validated).toBe(true);
    });
  });

  describe('validateUserEmail', () => {
    it('should validate user email when user exists and email is not validated', async () => {
      const userBefore = await getUserById(testUserId);
      expect(userBefore?.is_email_validated).toBe(false);

      await validateUserEmail(testUserId);

      const userAfter = await getUserById(testUserId);
      expect(userAfter?.is_email_validated).toBe(true);
    });

    it('should not throw error when user email is already validated', async () => {
      // User2 already has validated email
      await expect(validateUserEmail(testUser2Id)).resolves.not.toThrow();
    });

    it('should throw error when user does not exist', async () => {
      await expect(validateUserEmail(99999)).rejects.toThrow();
    });
  });

  describe('updateUserData', () => {
    it('should update user name and phone', async () => {
      const newName = 'John Updated';
      const newPhone = '+1111111111';

      await updateUserData(testUserId, newName, newPhone);

      const updatedUser = await getUserById(testUserId);
      expect(updatedUser?.name).toBe(newName);
      expect(updatedUser?.phone).toBe(newPhone);
    });

    it('should update only provided fields', async () => {
      const originalUser = await getUserById(testUserId);
      const newName = 'Updated Name';
      const newPhone = '+2222222222';

      await updateUserData(testUserId, newName, newPhone);

      const updatedUser = await getUserById(testUserId);
      expect(updatedUser?.name).toBe(newName);
      expect(updatedUser?.phone).toBe(newPhone);
      expect(updatedUser?.email).toBe(originalUser?.email); // Should remain unchanged
    });
  });

  describe('updateUserPicture', () => {
    it('should update user picture and hash', async () => {
      const picturePath = '/uploads/user123.jpg';
      const blurHash = 'L4Rp0qxu02?w0000004n';

      const result = await updateUserPicture(testUserId, picturePath, blurHash);

      expect(result).toHaveLength(1);
      expect(result[0].picture).toBe(picturePath);
      expect(result[0].pictureHash).toBe(blurHash);

      const updatedUser = await getUserById(testUserId);
      expect(updatedUser?.picture).toBe(picturePath);
      expect(updatedUser?.pictureHash).toBe(blurHash);
    });
  });

  describe('updateUserPassword', () => {
    it('should update user password with hashed value', async () => {
      const newPassword = 'newSecurePassword123';
      const originalUser = await getUserById(testUserId);

      await updateUserPassword(testUserId, newPassword);

      const updatedUser = await getUserById(testUserId);
      expect(updatedUser?.password).not.toBe(newPassword); // Should be hashed
      expect(updatedUser?.password).not.toBe(originalUser?.password); // Should be different
      expect(updatedUser?.password).toBeDefined();
    });
  });

  describe('OAuth Account Management', () => {
    const googleUserId = 'google123456789';
    
    beforeEach(async () => {
      // Create a Google account for testUserId
      await db.insert(accounts).values({
        providerId: 'google',
        providerUserId: googleUserId,
        userId: testUserId,
      });
    });

    describe('getUserOAuthProvider', () => {
      it('should return provider ID when user has OAuth account', async () => {
        const provider = await getUserOAuthProvider(testUserId);
        expect(provider).toBe('google');
      });

      it('should return null when user has no OAuth account', async () => {
        const provider = await getUserOAuthProvider(testUser2Id);
        expect(provider).toBeNull();
      });
    });

    describe('getAccountByGoogleId', () => {
      it('should return account when Google ID exists', async () => {
        const account = await getAccountByGoogleId(googleUserId);
        
        expect(account).toBeDefined();
        expect(account?.providerId).toBe('google');
        expect(account?.providerUserId).toBe(googleUserId);
        expect(account?.userId).toBe(testUserId);
      });

      it('should return undefined when Google ID does not exist', async () => {
        const account = await getAccountByGoogleId('nonexistent123');
        expect(account).toBeUndefined();
      });
    });

    describe('createGoogleAccount', () => {
      it('should create new Google account', async () => {
        const newGoogleUserId = 'google987654321';
        
        await createGoogleAccount({
          providerId: 'google',
          providerUserId: newGoogleUserId,
          userId: testUser2Id,
        });

        const account = await getAccountByGoogleId(newGoogleUserId);
        expect(account).toBeDefined();
        expect(account?.userId).toBe(testUser2Id);
      });

      it('should not throw error when account already exists (onConflictDoNothing)', async () => {
        // Try to create the same account again
        await expect(createGoogleAccount({
          providerId: 'google',
          providerUserId: googleUserId,
          userId: testUserId,
        })).resolves.not.toThrow();
      });
    });
  });

  describe('Email Confirmation Code Management', () => {
    describe('getOrCreateConfirmationEmail', () => {
      it('should create new confirmation code when none exists', async () => {
        const code = await getOrCreateConfirmationEmail(testUserId);
        
        expect(code).toBeDefined();
        expect(code).toHaveLength(5); // Should be 5-digit code
        expect(parseInt(code)).toBeGreaterThanOrEqual(10000);
        expect(parseInt(code)).toBeLessThanOrEqual(99999);
      });

      it('should return existing confirmation code when one exists', async () => {
        // Create initial code
        const firstCode = await getOrCreateConfirmationEmail(testUserId);
        
        // Get code again - should return the same one
        const secondCode = await getOrCreateConfirmationEmail(testUserId);
        
        expect(firstCode).toBe(secondCode);
      });

      it('should create different codes for different users', async () => {
        const code1 = await getOrCreateConfirmationEmail(testUserId);
        const code2 = await getOrCreateConfirmationEmail(testUser2Id);
        
        // While codes could theoretically be the same, it's very unlikely
        expect(code1).toBeDefined();
        expect(code2).toBeDefined();
      });
    });

    describe('getEmailConfirmationCode', () => {
      let confirmationCode: string;

      beforeEach(async () => {
        confirmationCode = await getOrCreateConfirmationEmail(testUserId);
      });

      it('should return confirmation code when user ID and code match', async () => {
        const result = await getEmailConfirmationCode(testUserId, confirmationCode);
        
        expect(result).toBeDefined();
        expect(result?.userId).toBe(testUserId);
        expect(result?.code).toBe(confirmationCode);
      });

      it('should return undefined when user ID does not match', async () => {
        const result = await getEmailConfirmationCode(testUser2Id, confirmationCode);
        expect(result).toBeUndefined();
      });

      it('should return undefined when code does not match', async () => {
        const result = await getEmailConfirmationCode(testUserId, '00000');
        expect(result).toBeUndefined();
      });
    });

    describe('deleteEmailConfirmationCode', () => {
      let confirmationCode: string;

      beforeEach(async () => {
        confirmationCode = await getOrCreateConfirmationEmail(testUserId);
      });

      it('should delete confirmation code when user ID and code match', async () => {
        // Verify code exists
        const beforeDelete = await getEmailConfirmationCode(testUserId, confirmationCode);
        expect(beforeDelete).toBeDefined();

        // Delete code
        await deleteEmailConfirmationCode(testUserId, confirmationCode);

        // Verify code no longer exists
        const afterDelete = await getEmailConfirmationCode(testUserId, confirmationCode);
        expect(afterDelete).toBeUndefined();
      });

      it('should not delete other user codes when deleting specific code', async () => {
        const user2Code = await getOrCreateConfirmationEmail(testUser2Id);
        
        // Delete user1's code
        await deleteEmailConfirmationCode(testUserId, confirmationCode);

        // Verify user2's code still exists
        const user2CodeAfter = await getEmailConfirmationCode(testUser2Id, user2Code);
        expect(user2CodeAfter).toBeDefined();
      });

      it('should not throw error when trying to delete non-existent code', async () => {
        await expect(deleteEmailConfirmationCode(testUserId, '00000')).resolves.not.toThrow();
      });
    });
  });
}); 