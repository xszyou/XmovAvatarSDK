/** 获取签名 start */

function toUint8Array(wordArray: any) {  
  // Shortcuts
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes

  // Convert
  const u8 = new Uint8Array(sigBytes)
  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
  }
  return u8
}

function Uint8ArrayToString(fileData: Uint8Array) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }
  return dataString
}
// 签名函数示例
export function signCallback(secretKey: string, signStr: string) {
  // 检查CryptoJS是否可用
  if (!window.CryptoJSTest) {
    console.error('CryptoJS 未加载')
    throw new Error('CryptoJS 未加载')
  }
  
  try {
    const hash = window.CryptoJSTest.HmacSHA1(signStr, secretKey)
    const bytes = Uint8ArrayToString(toUint8Array(hash))
    return window.btoa(bytes)
  } catch (error) {
    console.error('签名生成失败:', error)
    throw error
  }
}

/** 获取签名 end */
