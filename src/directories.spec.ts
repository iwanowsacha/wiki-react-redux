import * as fs from 'fs-extra';
import { createDirectoryIfNotExists } from './directories';

jest.mock('fs-extra');

describe('directories', () => {
  describe('createDirectoryIfNotExists', () => {
    beforeAll(async () => {
      console.log('before');
      // @ts-ignore
      fs.mkdir.mockClear();

      await createDirectoryIfNotExists('some/test/path');

      // @ts-ignore
      fs.pathExists.mockReturnValue(true);

      await createDirectoryIfNotExists('some/test/path');
    });

    it('should match snapshot of calls (mkdir)', () => {
      // @ts-ignore
      expect(fs.mkdir.mock.calls).toMatchSnapshot();
    });

    it('should match snapshot of calls (pathExists)', () => {
      // @ts-ignore
      expect(fs.pathExists.mock.calls).toMatchSnapshot();
    });

    it('(mkdir) should have been called with...', () => {
      expect(fs.mkdir).toHaveBeenCalledWith('some/test/path', {
        recursive: true,
      });
    });

    it('(pathExists) should have been called with...', () => {
      expect(fs.pathExists).toHaveBeenCalledWith('some/test/path');
    });

    it('should have been called 1 time (mkdir)', () => {
      expect(fs.mkdir).toHaveBeenCalledTimes(1);
    });

    it('should have been called 2 times (pathExists)', () => {
      expect(fs.pathExists).toHaveBeenCalledTimes(2);
    });
  });
});
