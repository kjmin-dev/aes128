import { randomBytes } from 'crypto'

function ConvertToInt32(bytes) {
    const result = []
    for (let i = 0; i < bytes.length; i += 4) {
        result.push(
            (bytes[i    ] << 24) |
            (bytes[i + 1] << 16) |
            (bytes[i + 2] <<  8) |
             bytes[i + 3]
        )
    }
    return result
}

function CheckInt(value) {
    return (parseInt(value) === value)
}

function CheckInts(arrayish) {
    if (!CheckInt(arrayish.length))
        return false

    for (let i = 0; i < arrayish.length; ++i) {
        if (!CheckInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255)
            return false
    }

    return true
}

function CoerceArray(arg, copy) {
    if (arg.buffer && ArrayBuffer.isView(arg) && arg.name === 'Uint8Array') {
        if (copy) {
            if (arg.slice) {
                arg = arg.slice()
            } else {
                arg = Array.prototype.slice.call(arg)
            }
        }
        return arg
    }
    /* 유효한 바이트 검사 */
    if (Array.isArray(arg)) {
        if (!CheckInts(arg)) {
            throw new Error('invalid array value: ' + arg)
        }
        return new Uint8Array(arg)
    }

    if (CheckInt(arg.length) && CheckInts(arg)) {
        return new Uint8Array(arg)
    }
    throw new Error('array-object error')
}

function CopyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
    if (sourceStart != null || sourceEnd != null) {
        if (sourceArray.slice) {
            sourceArray = sourceArray.slice(sourceStart, sourceEnd)
        } else {
            sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd)
        }
    }
    targetArray.set(sourceArray, targetStart)
}

const ConvertHex = {
    toBytes(text) {
        return Array.from(Buffer.from(text, 'hex'))
    },

    fromBytes(bytes) {
        return Buffer.from(bytes).toString('hex')
    }
}

const ConvertUTF8 = {
    toBytes(text) {
        return Buffer.from(text)
    },

    fromBytes(bytes) {
        return Buffer.from(bytes).toString('utf8')
    }
}

function GenerateBytes(size) {
    return randomBytes(size)
}

export default {
    ConvertToInt32,
    CheckInt,
    CheckInts,
    CoerceArray,
    ConvertHex,
    ConvertUTF8,
    CopyArray,
    GenerateBytes
}