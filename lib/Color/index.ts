const color = {
    default: (): string => {
        const colors: string[] = ['#FE0002', '#6401CE', '#02D202', '#0000FE', '#FF5C03', '#FFE001', '#AAFF03', '#D900FF', '#6401CE', '#FF5C03', '#01FFFF', '#bae523', '#d11816', '#ab2087', '#fff605', '#13c0be', '#1ebf17', '#67079f', '#f3a90c', '#b8e528', '#3d0ba0', '#f5a80b', '#10c1bc', '#19c211', '#ee7e10', '#ee4d09', '#d11816', '#fff605', '#2e31f4', '#ab2087', '#ee7e10', '#f3a90c', '#ab2087', '#d11816', '#fff605', '#2f31f5', '#3d0ba0', '#b8e528', '#67079f', '#ee4d09', '#67079f', '#13c0be', '#ee7e10', '#3d0ba0', '#ec4c0b', '#23b91a', '#2f31f5']
        return colors[Math.floor(Math.random() * colors.length)]
    },
    light: (): string => {
        let letters = 'BCDEF'.split('')
        let color = "#"
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)]
        }
        return color
    },
    dark: (): string => {
        let color = "#"
        for (let i = 0; i < 3; i++)
            color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2)
        return color
    }
}
export default color