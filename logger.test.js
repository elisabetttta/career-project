const logger = require('./logger');

describe('Logger Tests', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should log message with INFO level', () => {
        logger.info('Test info message');
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('[INFO]')
        );
    });
});