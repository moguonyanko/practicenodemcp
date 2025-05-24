/**
 * 逆ジオコーディングを行う関数を含むモジュール
 * @module reverse_geocoding
 */
import { requestJson } from "./requests";

const REV_GEOCODING_BASE = "https://nominatim.openstreetmap.org/reverse"
const USER_AGENT = "my-reverse-geocoding-app/1.0"

interface AddressResponse {
  address: Record<string, string>
}

const getAddress = async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    const pointsUrl = `${REV_GEOCODING_BASE}?lat=${latitude}&lon=${longitude}&format=json`
    const addressData = await requestJson<AddressResponse>(pointsUrl, USER_AGENT)

    return addressData.address
}

export { getAddress }
