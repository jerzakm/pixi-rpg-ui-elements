export const randomColor = (): string => {
    return ('0x'+Math.floor(Math.random()*16777215).toString(16));
}