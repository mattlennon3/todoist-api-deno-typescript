import Axios, { AxiosResponse, AxiosError } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import urljoin from 'url-join'
import { TodoistRequestError } from './types/errors'
import { HttpMethod } from './types/http'
import { v4 as uuidv4 } from 'uuid'
import axiosRetry from 'axios-retry'

const defaultHeaders = {
    'Content-Type': 'application/json',
}

function getAuthHeader(apiKey: string) {
    return `Bearer ${apiKey}`
}

function isNetworkError(error: AxiosError) {
    return Boolean(!error.response && error.code !== 'ECONNABORTED')
}

function getRetryDelay(retryCount: number) {
    return retryCount === 1 ? 0 : 500
}

function isAxiosError(error: unknown): error is AxiosError {
    return Boolean((error as AxiosError)?.isAxiosError)
}

function getTodoistRequestError(
    error: Error | AxiosError,
    originalStack?: Error,
): TodoistRequestError {
    const requestError = new TodoistRequestError(error.message)

    requestError.stack = isAxiosError(error) && originalStack ? originalStack.stack : error.stack

    if (isAxiosError(error) && error.response) {
        requestError.httpStatusCode = error.response.status
        requestError.responseData = error.response.data
    }

    return requestError
}

function getRequestConfiguration(apiToken?: string, requestId?: string) {
    const authHeader = apiToken ? { Authorization: getAuthHeader(apiToken) } : undefined
    const requestIdHeader = requestId ? { 'X-Request-Id': requestId } : undefined
    const headers = { ...defaultHeaders, ...authHeader, ...requestIdHeader }

    return { headers }
}

function getAxiosClient(apiToken?: string, requestId?: string) {
    const configuration = getRequestConfiguration(apiToken, requestId)
    const client = applyCaseMiddleware(Axios.create(configuration))

    axiosRetry(client, {
        retries: 3,
        retryCondition: isNetworkError,
        retryDelay: getRetryDelay,
    })

    return client
}

export function isSuccess(response: AxiosResponse): boolean {
    return response.status >= 200 && response.status < 300
}

export async function request<T extends unknown>(
    httpMethod: HttpMethod,
    baseUri: string,
    relativePath: string,
    apiToken?: string,
    payload?: unknown,
    requestId?: string,
): Promise<AxiosResponse<T>> {
    // axios loses the original stack when returning errors, for the sake of better reporting
    // we capture it here and reapply it to any thrown errors.
    // Ref: https://github.com/axios/axios/issues/2387
    const originalStack = new Error()

    try {
        if (httpMethod === 'POST' && !requestId) {
            requestId = uuidv4()
        }

        const axiosClient = getAxiosClient(apiToken, requestId)

        switch (httpMethod) {
            case 'GET':
                return await axiosClient.get<T>(urljoin(baseUri, relativePath), { params: payload })
            case 'POST':
                return await axiosClient.post<T>(urljoin(baseUri, relativePath), payload)
            case 'DELETE':
                return await axiosClient.delete<T>(urljoin(baseUri, relativePath))
        }
    } catch (error: unknown) {
        if (!isAxiosError(error) && !(error instanceof Error)) {
            throw new Error('An unknown error occurred during the request')
        }

        throw getTodoistRequestError(error, originalStack)
    }
}
