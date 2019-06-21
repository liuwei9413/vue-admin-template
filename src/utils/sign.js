import { getSnlist, sign } from '@/api/local'
import request from '@/utils/request'

export function recordSignature({ recordId }, data) {
  return request({
    url: `/v1/admin-manage/records/${recordId}/signature`,
    method: 'post',
    data
  })
}

export async function handleSign(signInfo) {
  // get snlist
  const snlistRes = await getSnlist()
  const serialnumber = snlistRes.data && snlistRes.data.serialnumber[0]

  // signature
  const signBody = Object.assign({}, signInfo, { plaintext: 'false' })
  const signatureRes = await sign({ sn: serialnumber }, signBody)

  return signatureRes
}
