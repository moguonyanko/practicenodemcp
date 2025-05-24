/**
 * 逆ジオコーディングを行う関数を含むモジュール
 * @module reverse_geocoding
 */

/**
 * @name requestJson
 * @function
 * @param {string} url - リクエストを送るURL
 * @param {string} userAgent - User-Agentヘッダーに設定する値
 * @returns {Promise<T>} - レスポンスのJSONデータ
 * @throws {Error} - リクエストが失敗した場合
 * @template T - レスポンスのJSONデータの型
 * @description
 * この関数は、指定されたURLにGETリクエストを送り、レスポンスをJSONとして返します。
 * User-Agentヘッダーには、指定された値が設定されます。
 * リクエストが成功した場合、レスポンスのJSONデータが返されます。
 * リクエストが失敗した場合、エラーがスローされます。
 */
async function requestJson<T>(url: string, userAgent: string): Promise<T> {
  const headers = {
    "User-Agent": userAgent
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.error(`HTTP request error:${error}`)
    throw error
  }
}

export { requestJson }
