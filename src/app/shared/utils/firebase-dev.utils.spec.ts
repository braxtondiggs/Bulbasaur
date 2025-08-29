import { TestBed } from '@angular/core/testing';
import { isDevMode } from '@angular/core';
import { of, throwError } from 'rxjs';
import { FirebaseDevUtils } from './firebase-dev.utils';
import { FirebaseService, FirebaseDocument, QueryOptions } from '@shared/services/firebase.service';

// Mock Angular's isDevMode
jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn()
}));

// Mock console methods
const consoleMocks = {
  group: jest.spyOn(console, 'group').mockImplementation(() => {}),
  groupEnd: jest.spyOn(console, 'groupEnd').mockImplementation(() => {}),
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  time: jest.spyOn(console, 'time').mockImplementation(() => {}),
  timeEnd: jest.spyOn(console, 'timeEnd').mockImplementation(() => {})
};

interface TestDocument extends FirebaseDocument {
  id: string;
  name: string;
  value: number;
}

describe('FirebaseDevUtils', () => {
  let service: FirebaseDevUtils;
  let mockFirebaseService: jest.Mocked<FirebaseService>;
  let mockPerformance: any;

  const mockData: TestDocument[] = [
    { id: '1', name: 'Test 1', value: 100 },
    { id: '2', name: 'Test 2', value: 200 },
    { id: '3', name: 'Test 3', value: 300 }
  ];

  beforeEach(() => {
    // Mock performance.now
    mockPerformance = {
      now: jest.fn()
    };
    Object.defineProperty(global, 'performance', {
      value: mockPerformance,
      writable: true
    });

    mockFirebaseService = {
      getCollection: jest.fn(),
      getDocument: jest.fn(),
      addDocument: jest.fn(),
      updateDocument: jest.fn(),
      deleteDocument: jest.fn(),
      getInstagramPosts: jest.fn(),
      validateInstagramData: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        FirebaseDevUtils,
        { provide: FirebaseService, useValue: mockFirebaseService }
      ]
    });

    service = TestBed.inject(FirebaseDevUtils);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear all console mocks
    Object.values(consoleMocks).forEach(mock => mock.mockClear());
  });

  describe('Service Initialization', () => {
    it('should create', () => {
      expect(service).toBeTruthy();
    });

    it('should inject FirebaseService', () => {
      expect(service['firebaseService']).toBeDefined();
    });
  });

  describe('getCollectionWithDevInsights', () => {
    beforeEach(() => {
      mockFirebaseService.getCollection.mockReturnValue(of(mockData));
      mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);
    });

    describe('Development Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(true);
      });

      it('should add development insights in dev mode', (done) => {
        const collectionName = 'test-collection';
        const options: QueryOptions = { limitCount: 10 };

        service.getCollectionWithDevInsights<TestDocument>(collectionName, options).subscribe({
          next: (result) => {
            expect(result).toEqual(mockData);
            expect(mockFirebaseService.getCollection).toHaveBeenCalledWith(collectionName, options);
            done();
          },
          error: done
        });
      });

      it('should call Firebase service with correct parameters', (done) => {
        service.getCollectionWithDevInsights<TestDocument>('test-collection').subscribe({
          next: () => {
            expect(mockFirebaseService.getCollection).toHaveBeenCalledWith('test-collection', undefined);
            done();
          },
          error: done
        });
      });

      it('should handle undefined options', (done) => {
        service.getCollectionWithDevInsights<TestDocument>('test-collection').subscribe({
          next: (result) => {
            expect(result).toEqual(mockData);
            done();
          },
          error: done
        });
      });

      it('should handle errors from Firebase service', (done) => {
        mockFirebaseService.getCollection.mockReturnValue(throwError(() => new Error('Test error')));

        service.getCollectionWithDevInsights<TestDocument>('test-collection').subscribe({
          next: () => done(new Error('Should have thrown')),
          error: (error) => {
            expect(error.message).toBe('Test error');
            done();
          }
        });
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(false);
      });

      it('should bypass dev insights in production mode', (done) => {
        service.getCollectionWithDevInsights<TestDocument>('test-collection').subscribe({
          next: (result) => {
            expect(result).toEqual(mockData);
            expect(mockFirebaseService.getCollection).toHaveBeenCalledWith('test-collection', undefined);
            done();
          },
          error: done
        });
      });
    });
  });

  describe('analyzeQuery', () => {
    describe('Development Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(true);
      });

      it('should analyze simple query', () => {
        const options: QueryOptions = { limitCount: 10 };
        
        service.analyzeQuery('test-collection', options);

        expect(consoleMocks.group).toHaveBeenCalledWith('[Firebase Dev Query Analyzer] test-collection');
        expect(consoleMocks.log).toHaveBeenCalledWith('Query Complexity:', 'Simple');
        expect(consoleMocks.groupEnd).toHaveBeenCalled();
      });

      it('should detect complex query with multiple where conditions', () => {
        const options: QueryOptions = {
          whereConditions: [
            { field: 'field1', operator: '==', value: 'value1' },
            { field: 'field2', operator: '>', value: 100 },
            { field: 'field3', operator: '!=', value: 'value3' }
          ]
        };

        service.analyzeQuery('test-collection', options);

        expect(consoleMocks.log).toHaveBeenCalledWith('Query Complexity:', 'Complex');
        expect(consoleMocks.log).toHaveBeenCalledWith('Performance Suggestions:', 
          expect.arrayContaining(['Consider using composite indexes for multiple where conditions'])
        );
      });

      it('should suggest pagination for large limits', () => {
        const options: QueryOptions = { limitCount: 150 };

        service.analyzeQuery('test-collection', options);

        expect(consoleMocks.log).toHaveBeenCalledWith('Performance Suggestions:', 
          expect.arrayContaining(['Large limit detected - consider pagination for better performance'])
        );
      });

      it('should suggest index optimization for orderBy with where conditions', () => {
        const options: QueryOptions = {
          orderByField: 'timestamp',
          whereConditions: [{ field: 'status', operator: '==', value: 'active' }]
        };

        service.analyzeQuery('test-collection', options);

        expect(consoleMocks.log).toHaveBeenCalledWith('Performance Suggestions:', 
          expect.arrayContaining(['Ensure your Firestore indexes support this query combination'])
        );
      });

      it('should handle query without options', () => {
        service.analyzeQuery('test-collection');

        expect(consoleMocks.log).toHaveBeenCalledWith('Query Complexity:', 'Simple');
        expect(consoleMocks.groupEnd).toHaveBeenCalled();
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(false);
      });

      it('should not analyze in production mode', () => {
        service.analyzeQuery('test-collection', { limitCount: 10 });

        expect(consoleMocks.group).not.toHaveBeenCalled();
        expect(consoleMocks.log).not.toHaveBeenCalled();
      });
    });
  });

  describe('profileQuery', () => {
    beforeEach(() => {
      mockPerformance.now.mockReturnValueOnce(100).mockReturnValueOnce(250);
    });

    describe('Development Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(true);
      });

      it('should execute query function in dev mode', (done) => {
        const queryFunction = () => of(mockData);
        const operationName = 'Test Operation';

        service.profileQuery(operationName, queryFunction).subscribe({
          next: (result) => {
            expect(result).toEqual(mockData);
            done();
          },
          error: done
        });
      });

      it('should handle query errors', (done) => {
        const errorFunction = () => throwError(() => new Error('Query failed'));
        const operationName = 'Failed Operation';

        service.profileQuery(operationName, errorFunction).subscribe({
          next: () => done(new Error('Should have thrown')),
          error: (error) => {
            expect(error.message).toBe('Query failed');
            done();
          }
        });
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(false);
      });

      it('should execute query without profiling in production', (done) => {
        const queryFunction = () => of(mockData);

        service.profileQuery('Test Operation', queryFunction).subscribe({
          next: (result) => {
            expect(result).toEqual(mockData);
            done();
          },
          error: done
        });
      });
    });
  });

  describe('validateFirebaseData', () => {
    describe('Development Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(true);
      });

      it('should validate data with all required fields', () => {
        const requiredFields = ['id', 'name', 'value'];
        
        const isValid = service.validateFirebaseData(mockData, 'test-collection', requiredFields);

        expect(isValid).toBe(true);
        expect(consoleMocks.group).toHaveBeenCalledWith('[Firebase Validator] test-collection');
        expect(consoleMocks.log).toHaveBeenCalledWith('✓ All data validation checks passed');
        expect(consoleMocks.log).toHaveBeenCalledWith('Data sample:', [mockData[0]]);
        expect(consoleMocks.groupEnd).toHaveBeenCalled();
      });

      it('should detect missing required fields', () => {
        const invalidData = [
          { id: '1', name: 'Test 1' }, // missing 'value'
          { id: '2', value: 200 } // missing 'name'
        ] as TestDocument[];
        const requiredFields = ['id', 'name', 'value'];

        const isValid = service.validateFirebaseData(invalidData, 'test-collection', requiredFields);

        expect(isValid).toBe(false);
        expect(consoleMocks.warn).toHaveBeenCalledWith('Data validation issues found:', 
          expect.arrayContaining([
            'Item 0: Missing required field \'value\'',
            'Item 1: Missing required field \'name\''
          ])
        );
      });

      it('should detect null or undefined values', () => {
        const invalidData = [
          { id: '1', name: null, value: 100 },
          { id: '2', name: 'Test', value: undefined }
        ] as any;
        const requiredFields = ['id', 'name', 'value'];

        const isValid = service.validateFirebaseData(invalidData, 'test-collection', requiredFields);

        expect(isValid).toBe(false);
        expect(consoleMocks.warn).toHaveBeenCalledWith('Data validation issues found:', 
          expect.arrayContaining([
            'Item 0: Missing required field \'name\'',
            'Item 1: Missing required field \'value\''
          ])
        );
      });

      it('should detect invalid ID types', () => {
        const invalidData = [
          { id: 123, name: 'Test 1', value: 100 }, // numeric ID
          { id: '2', name: 'Test 2', value: 200 }
        ] as any;
        const requiredFields = ['id', 'name', 'value'];

        const isValid = service.validateFirebaseData(invalidData, 'test-collection', requiredFields);

        expect(isValid).toBe(false);
        expect(consoleMocks.warn).toHaveBeenCalledWith('Data validation issues found:', 
          expect.arrayContaining(['Item 0: ID should be a string'])
        );
      });

      it('should handle empty data array', () => {
        const requiredFields = ['id', 'name', 'value'];

        const isValid = service.validateFirebaseData([], 'test-collection', requiredFields);

        expect(isValid).toBe(true);
        expect(consoleMocks.log).toHaveBeenCalledWith('✓ All data validation checks passed');
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(false);
      });

      it('should return true without validation in production', () => {
        const invalidData = [{ id: 123 }] as any;
        const requiredFields = ['id', 'name', 'value'];

        const isValid = service.validateFirebaseData(invalidData, 'test-collection', requiredFields);

        expect(isValid).toBe(true);
        expect(consoleMocks.group).not.toHaveBeenCalled();
        expect(consoleMocks.warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('logOperation', () => {
    describe('Development Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(true);
      });

      it('should log operation details', () => {
        const operation = 'Create Document';
        const details = { collectionName: 'users', data: { name: 'John' } };

        service.logOperation(operation, details);

        expect(consoleMocks.log).toHaveBeenCalledWith('[Firebase Operation] Create Document', {
          timestamp: expect.any(String),
          details
        });
      });

      it('should handle complex details object', () => {
        const operation = 'Complex Query';
        const details = {
          collection: 'posts',
          filters: [{ field: 'status', value: 'published' }],
          orderBy: 'createdAt',
          limit: 50
        };

        service.logOperation(operation, details);

        expect(consoleMocks.log).toHaveBeenCalledWith('[Firebase Operation] Complex Query', {
          timestamp: expect.any(String),
          details
        });
      });

      it('should handle null details', () => {
        service.logOperation('Test Operation', null);

        expect(consoleMocks.log).toHaveBeenCalledWith('[Firebase Operation] Test Operation', {
          timestamp: expect.any(String),
          details: null
        });
      });
    });

    describe('Production Mode', () => {
      beforeEach(() => {
        (isDevMode as jest.Mock).mockReturnValue(false);
      });

      it('should not log in production mode', () => {
        service.logOperation('Test Operation', { test: 'data' });

        expect(consoleMocks.log).not.toHaveBeenCalled();
      });
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      (isDevMode as jest.Mock).mockReturnValue(true);
      mockFirebaseService.getCollection.mockReturnValue(of(mockData));
      mockPerformance.now.mockReturnValue(100);
    });

    it('should work with multiple methods together', (done) => {
      const collectionName = 'test-collection';
      const options: QueryOptions = { limitCount: 10 };
      const requiredFields = ['id', 'name', 'value'];

      // Analyze query first
      service.analyzeQuery(collectionName, options);
      
      // Profile the operation and get data
      service.profileQuery('Integration Test', () => 
        service.getCollectionWithDevInsights<TestDocument>(collectionName, options)
      ).subscribe({
        next: (result) => {
          // Validate the result
          const isValid = service.validateFirebaseData(result, collectionName, requiredFields);
          
          // Log the operation
          service.logOperation('Integration Test Complete', { 
            resultCount: result.length, 
            isValid 
          });

          expect(result).toEqual(mockData);
          expect(isValid).toBe(true);
          done();
        },
        error: done
      });
    });

    it('should handle all methods in development mode', () => {
      // Test that all methods can be called without errors
      expect(() => {
        service.analyzeQuery('test-collection', { limitCount: 10 });
        service.validateFirebaseData(mockData, 'test-collection', ['id', 'name']);
        service.logOperation('Test Operation', { test: 'data' });
      }).not.toThrow();
    });

    it('should handle all methods in production mode', () => {
      (isDevMode as jest.Mock).mockReturnValue(false);
      
      // Test that all methods can be called without errors in production
      expect(() => {
        service.analyzeQuery('test-collection', { limitCount: 10 });
        const isValid = service.validateFirebaseData(mockData, 'test-collection', ['id', 'name']);
        service.logOperation('Test Operation', { test: 'data' });
        expect(isValid).toBe(true); // Should return true in production
      }).not.toThrow();
    });
  });
});
