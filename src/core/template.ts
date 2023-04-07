export enum TextPosition {
    TopLeft = "Links boven",
    BottomLeft = "Links onder",
    TopRight = "Rechts boven",
    BottomRight = "Rechts onder",
    Center = "Midden",
}

const cssPosition = {
    [TextPosition.TopLeft]: 'top-left',
    [TextPosition.BottomLeft]: 'bottom-left',
    [TextPosition.TopRight]: 'top-right',
    [TextPosition.BottomRight]: 'bottom-right',
    [TextPosition.Center]: 'center',
}

export function positionCssClass(position: TextPosition): string {
    return cssPosition[position];
}

// voor meer karakters, zie https://www.webmasterresources.nl/webdesign/utf-html-code-speciale-karakters/
const htmlCharacterEncode = {
    "à": "&agrave;",
    "á": "&aacute;",
    "ä": "&auml;",
    "è": "&egrave;",
    "é": "&eacute;",
    "ë": "&euml;",
    "ï": "&iuml;",
    "ó": "&oacute;",
    "ö": "&ouml;",
    "ü": "&uuml;",
}

export function htmlEncode(rawString: string): string {
    return Object.entries(htmlCharacterEncode)
                 .reduce((encodedString, [char, encodedChar]) => encodedString.replace(new RegExp(char, 'g'), encodedChar), rawString)
}
