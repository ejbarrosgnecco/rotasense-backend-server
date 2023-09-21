const generateStrongPassword = (): string => {
    let password: string = "";

    let characters = {
        0: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        1: "abcdefghijklmnopqrstuvwxyz",
        2: "1234567890",
        3: "{}()[]#:;^,.?!|&_@%"
    }

    for (let i = 0; i < 18; i++) {
        const characterType = Math.floor(Math.random() * 4);
        const characterIndex = Math.floor(Math.random() * characters[characterType].length + 1)
        password += characters[characterType].charAt(characterIndex)
    }

    return password;
}

export default generateStrongPassword