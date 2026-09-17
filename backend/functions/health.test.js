const test = require('firebase-functions-test')();
const admin = require('firebase-admin');

// Mock the admin SDK
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue({}),
};

const mockAuth = {
  listUsers: jest.fn().mockResolvedValue({ users: [] }),
};

// Mock admin initialization
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => mockFirestore),
  auth: jest.fn(() => mockAuth),
}));

describe('Health Endpoint', () => {
  let healthFunction;
  let req;
  let res;

  beforeAll(() => {
    // Import the function after mocking
    const functions = require('./index');
    healthFunction = functions.health;
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      method: 'GET',
      headers: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterAll(() => {
    test.cleanup();
  });

  test('should return 200 when all services are healthy', async () => {
    // Mock successful Firestore and Auth checks
    mockFirestore.set.mockResolvedValue({});
    mockAuth.listUsers.mockResolvedValue({ users: [] });

    await healthFunction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'healthy',
        service: 'instagram-clone-backend',
        version: '1.0.0',
        checks: expect.objectContaining({
          firestore: 'healthy',
          auth: 'healthy',
        }),
      })
    );
  });

  test('should return 503 when Firestore is unhealthy', async () => {
    // Mock Firestore failure
    mockFirestore.set.mockRejectedValue(new Error('Firestore connection failed'));
    mockAuth.listUsers.mockResolvedValue({ users: [] });

    await healthFunction(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'degraded',
        checks: expect.objectContaining({
          firestore: 'unhealthy',
          auth: 'healthy',
        }),
      })
    );
  });

  test('should return 503 when Auth is unhealthy', async () => {
    // Mock Auth failure
    mockFirestore.set.mockResolvedValue({});
    mockAuth.listUsers.mockRejectedValue(new Error('Auth service unavailable'));

    await healthFunction(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'degraded',
        checks: expect.objectContaining({
          firestore: 'healthy',
          auth: 'unhealthy',
        }),
      })
    );
  });

  test('should include timestamp in response', async () => {
    mockFirestore.set.mockResolvedValue({});
    mockAuth.listUsers.mockResolvedValue({ users: [] });

    await healthFunction(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(String),
      })
    );
  });

  test('should handle unexpected errors gracefully', async () => {
    // Mock an unexpected error
    mockFirestore.collection.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await healthFunction(req, res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'unhealthy',
        error: expect.any(String),
      })
    );
  });
});
