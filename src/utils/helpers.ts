/**
 * 节流函数 - 用于AnimatedTitle组件的鼠标跟踪
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * 转换存储单位函数 - 用于将获取到的文件大小转化单位
 */
export function renderSize(filesize: string): string {
    const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
    // 输入验证
    if (!filesize || filesize.trim() === '') {
        return '0 Bytes'
    }
    
    const srcsize = parseFloat(filesize)
    
    // 处理无效数字
    if (isNaN(srcsize) || srcsize < 0) {
        return '0 Bytes'
    }
    
    // 处理0字节的情况
    if (srcsize === 0) {
        return '0 Bytes'
    }
    
    const index = Math.floor(Math.log(srcsize) / Math.log(1024))
    const clampedIndex = Math.min(index, unitArr.length - 1) // 防止数组越界
    const size = (srcsize / Math.pow(1024, clampedIndex)).toFixed(1)
    
    return `${size} ${unitArr[clampedIndex]}`
}
