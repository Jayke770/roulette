const color = {
    light: () => {
        let letters = 'BCDEF'.split('')
        let color = '#'
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)]
        }
        return color
    },
    dark: () => {
        let color = "#"
        for (let i = 0; i < 3; i++)
            color += ("0" + Math.floor(Math.random() * Math.pow(16, 2) / 2).toString(16)).slice(-2)
        return color
    }
}
export default color