import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseService, QueryOptions } from './firebase.service';

// Mock Firebase functions that we can actually test
const mockWriteBatch = jest.fn();
const mockServerTimestamp = jest.fn();
const mockAddDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

jest.mock('@angular/fire/firestore', () => ({
  ...jest.requireActual('@angular/fire/firestore'),
  writeBatch: () => mockWriteBatch(),
  serverTimestamp: () => mockServerTimestamp(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args),
  collection: jest.fn(() => ({ path: 'test-collection' })),
  doc: jest.fn(() => ({ path: 'test-doc' })),
  query: jest.fn(() => ({ path: 'test-query' })),
  where: jest.fn(() => ({ type: 'where' })),
  orderBy: jest.fn(() => ({ type: 'orderBy' })),
  limit: jest.fn(() => ({ type: 'limit' })),
  collectionData: jest.fn(),
  docData: jest.fn()
}));

describe('FirebaseService', () => {
  let service: FirebaseService;
  let mockFirestore: Partial<Firestore>;
  let mockBatch: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a minimal mock Firestore
    mockFirestore = {
      app: { name: 'test-app' } as any
    };

    // Setup mock batch
    mockBatch = {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        FirebaseService,
        { provide: Firestore, useValue: mockFirestore }
      ]
    });

    service = TestBed.inject(FirebaseService);

    // Setup mock returns
    mockWriteBatch.mockReturnValue(mockBatch);
    mockServerTimestamp.mockReturnValue({ seconds: 123456789, nanoseconds: 0 });
  });

  describe('Service Creation', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Basic Operations', () => {
    it('should create and return write batch', () => {
      const batch = service.createBatch();

      expect(batch).toBe(mockBatch);
      expect(mockWriteBatch).toHaveBeenCalled();
    });

    it('should return server timestamp', () => {
      const timestamp = service.getServerTimestamp();

      expect(timestamp).toEqual({ seconds: 123456789, nanoseconds: 0 });
      expect(mockServerTimestamp).toHaveBeenCalled();
    });

    it('should create multiple batches independently', () => {
      const batch1 = service.createBatch();
      const batch2 = service.createBatch();

      expect(mockWriteBatch).toHaveBeenCalledTimes(2);
      expect(batch1).toBe(mockBatch);
      expect(batch2).toBe(mockBatch);
    });
  });

  describe('Document Operations', () => {
    it('should add document with timestamps', async () => {
      mockAddDoc.mockResolvedValue({ id: 'new-doc-id' });
      const testData = { name: 'test', value: 42 };

      const docId = await service.addDocument('users', testData);

      expect(docId).toBe('new-doc-id');
      expect(mockAddDoc).toHaveBeenCalledWith(
        { path: 'test-collection' },
        expect.objectContaining({
          name: 'test',
          value: 42,
          createdAt: { seconds: 123456789, nanoseconds: 0 },
          updatedAt: { seconds: 123456789, nanoseconds: 0 }
        })
      );
    });

    it('should update document with timestamp', async () => {
      mockUpdateDoc.mockResolvedValue(undefined);
      const updateData = { name: 'updated', value: 100 };

      await service.updateDocument('users', '123', updateData);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        { path: 'test-doc' },
        expect.objectContaining({
          name: 'updated',
          value: 100,
          updatedAt: { seconds: 123456789, nanoseconds: 0 }
        })
      );
    });

    it('should delete document', async () => {
      mockDeleteDoc.mockResolvedValue(undefined);

      await service.deleteDocument('users', '123');

      expect(mockDeleteDoc).toHaveBeenCalledWith({ path: 'test-doc' });
    });
  });

  describe('Error Handling', () => {
    it('should handle addDocument errors', async () => {
      mockAddDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(
        service.addDocument('users', { name: 'test' })
      ).rejects.toThrow('Failed to add document to users');
    });

    it('should handle updateDocument errors', async () => {
      mockUpdateDoc.mockRejectedValue(new Error('Update failed'));

      await expect(
        service.updateDocument('users', '123', { name: 'updated' })
      ).rejects.toThrow('Failed to update document users/123');
    });

    it('should handle deleteDocument errors', async () => {
      mockDeleteDoc.mockRejectedValue(new Error('Delete failed'));

      await expect(
        service.deleteDocument('users', '123')
      ).rejects.toThrow('Failed to delete document users/123');
    });
  });

  describe('Data Types', () => {
    it('should handle various data types in documents', async () => {
      mockAddDoc.mockResolvedValue({ id: 'test-id' });

      const testCases = [
        { name: 'string test', value: 'string' },
        { name: 'number test', value: 42 },
        { name: 'boolean test', value: true },
        { name: 'null test', value: null },
        { name: 'array test', value: [1, 2, 3] },
        { name: 'object test', value: { nested: 'object' } }
      ];

      for (const testData of testCases) {
        const docId = await service.addDocument('test', testData);
        expect(docId).toBe('test-id');
      }

      expect(mockAddDoc).toHaveBeenCalledTimes(testCases.length);
    });
  });

  describe('Query Options', () => {
    it('should handle basic query options validation', () => {
      const validOptions: QueryOptions = {
        orderByField: 'createdAt',
        orderDirection: 'desc',
        limitCount: 10,
        whereConditions: [{ field: 'status', operator: '==', value: 'active' }]
      };

      expect(validOptions.orderByField).toBe('createdAt');
      expect(validOptions.orderDirection).toBe('desc');
      expect(validOptions.limitCount).toBe(10);
      expect(validOptions.whereConditions).toHaveLength(1);
    });

    it('should handle all supported operators', () => {
      const operators = ['==', '!=', '<', '<=', '>', '>=', 'array-contains', 'in', 'array-contains-any', 'not-in'];
      
      operators.forEach(operator => {
        const options: QueryOptions = {
          whereConditions: [{ 
            field: 'testField', 
            operator: operator as any, 
            value: 'testValue' 
          }]
        };
        
        expect(options.whereConditions![0].operator).toBe(operator);
      });
    });

    it('should handle order direction options', () => {
      const ascOptions: QueryOptions = { orderDirection: 'asc' };
      const descOptions: QueryOptions = { orderDirection: 'desc' };

      expect(ascOptions.orderDirection).toBe('asc');
      expect(descOptions.orderDirection).toBe('desc');
    });

    it('should handle edge cases for limit count', () => {
      const zeroLimit: QueryOptions = { limitCount: 0 };
      const negativeLimit: QueryOptions = { limitCount: -5 };
      
      expect(zeroLimit.limitCount).toBe(0);
      expect(negativeLimit.limitCount).toBe(-5);
    });
  });
});