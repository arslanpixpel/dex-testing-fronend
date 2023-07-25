export const formatString = (s, ...args) => args.reduce((acc, arg) => acc.replace("{}", arg), s);
