declare module 'bbcode-parser' {
    interface BBCodeTag {
        render: (content: string, attr?: string) => string;
    }

    interface BBCodeTags {
        [key: string]: BBCodeTag;
    }

    interface BBCodeParserOptions {
        tags: BBCodeTags;
    }

    class BBCodeParser {
        constructor(options: BBCodeParserOptions);
        parse(text: string): string;
    }

    export default BBCodeParser;
}