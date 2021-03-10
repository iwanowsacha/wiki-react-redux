
const INVALID_CHARS: {[key: string]: string} = {
    '/': '-fsl-',
    '<': '-ltn-',
    '>': '-gtn-',
    ':': '-scl-',
    '"': '-dqt-',
    '\\': '-bsl-',
    '|': '-vtb-',
    '?': '-qtm-',
    '*': '-astk-'
}

const REVERSE_INVALID_CHARS: {[key: string]: string} = {
    '-fsl-': '/',
    '-ltn-': '<',
    '-gtn-': '>',
    '-scl-': ':',
    '-dqt-': '"',
    '-bsl': '\\',
    '-vtb-': '|',
    '-qtm-': '?',
    '-astk-': '*'
}

const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g;
const reInvalidChars = /[<>:"/\\|?*]/g;
const reReverseInvalidChars = /(-fsl-)|(-ltn-)|(-gtn-)|(-scl-)|(-dqt-)|(-bsl-)|(-vtb-)|(-qtm-)|(-astk-)/g

export const sanitizeFilename = (filename: string) => {
    let sanitized = filename.replace(reControlChars, '');
    sanitized = sanitized.replace(reInvalidChars, ic => INVALID_CHARS[ic]);
    return sanitized;
}

export const unsanitizeFilename = (filename: string) => {
    let sanitized = filename.replace(reReverseInvalidChars, ric => REVERSE_INVALID_CHARS[ric]);
    return sanitized;
}