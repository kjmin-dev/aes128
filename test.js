import colors from 'colors'
import { format } from 'util'


import AES128 from './lib/aes-128'
import Utils from './lib/utils'

/* 입력값과 키값의 길이가 16이 아니라면 랜덤스트링 할당 */
const { plainText, secret } = (function(plainText = '', secret = '') {
    if(plainText.length !== 16)
        plainText = Utils.GenerateBytes(8).toString('hex')
    if(secret.length !== 16)
        secret = Utils.GenerateBytes(8).toString('hex')
    else
        secret = Buffer.from(secret)
    return { plainText, secret }
}(process.argv[2], process.argv[3]))

process.stdout.write('\n\n')

const AES = new AES128(secret)

console.log(`plain text :`.green, `${plainText}`.green)
console.log(`key : `.red, `${secret}\n`.red)

/* */
AES.Encrypt(Utils.ConvertUTF8.toBytes(plainText), secret)
    .then(cipherText => {
        console.log(`encrypted text :`.green, `${cipherText}\n`.green)

        return AES.Decrypt(cipherText, secret)
    })
    .then(decryptedText => console.log(`decrypted text :`.green, `${decryptedText} \n`.green))
    .catch(err => console.error(err))
/* */