import { sanitizeFilename, unsanitizeFilename } from "./filenameSanitizer";

describe('filenameSanitizer', () => {
    const validString = "someValidString¿¡!---,.";
    const invalidString = "some<>invalid?/string\\:|*\"";
    const sanitizedFilename = "some-ltn--gtn-invalid-qtm--fsl-string-bsl--scl--vtb--astk--dqt-";

    describe('sanitizeFilename', () => {
        it('should replace invalid characters', () => {
            expect(sanitizeFilename(invalidString)).toBe(sanitizedFilename);
        });

        it('should leave valid string as is', () => {
            expect(sanitizeFilename(validString)).toBe(validString);
        });
    });

    describe('unsanitizeFilename', () => {
        it('should replace sanitized characters', () => {
            expect(unsanitizeFilename(sanitizedFilename)).toBe(invalidString);
        });

        it('should leave valid string as is', () => {
            expect(unsanitizeFilename(validString)).toBe(validString);
        });
    })
})