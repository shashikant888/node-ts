export const successResponse = (data: any, message?: string) => {
    return {
        success: true,
        message: message || '',
        data
    }
}

export const errorResponse = (message: string) => {
    return {
        success: false,
        message
    }
}
