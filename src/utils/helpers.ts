/**
 * 节流函数 - 用于AnimatedTitle组件的鼠标跟踪
 */
export function throttle<T extends (...args: any[]) => any>(
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
export function renderSize(filesize: string) {
    var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var index = 0
    var srcsize = parseFloat(filesize)
    index = Math.floor(Math.log(srcsize) / Math.log(1024))
    var size = (srcsize / Math.pow(1024, index)).toFixed(1)
    return size + ' ' + unitArr[index]
}
