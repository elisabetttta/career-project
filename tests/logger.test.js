const logger = require('../src/logger');

describe('Logger', () => {
  test('should log info message', () => {
    console.log = jest.fn();

    logger.info('Test message', '123');

    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls[0][0]).toContain('[INFO]');
    expect(console.log.mock.calls[0][0]).toContain('Test message');
    expect(console.log.mock.calls[0][0]).toContain('123');
  });

  test('should log error message', () => {
    console.error = jest.fn();

    logger.error('Error message', '456');

    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain('[ERROR]');
  });
});