/**
 * 逆ジオコーディングを行う関数のテスト
 */

import { getAddress } from './reverse_geocoding'

describe('Reverse Geocoding Functions', () => {
  describe('getAddress', () => {
    test('逆ジオコーディングで住所が取得できる', async () => {
      const points = {
        latitude: 38.3405555555556,
        longitude: 141.1525
      }
      const expected = {
        "quarter": "宮戸",
        "city": "東松島市",
        "province": "宮城県",
        "ISO3166-2-lvl4": "JP-04",
        "postcode": "981-0412",
        "country": "日本",
        "country_code": "jp"
      }
      const actual = await getAddress(points)
      expect(actual).toEqual(expected)
    })
  })
})
