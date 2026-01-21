export const getFields = <T extends Record<string, any>>(args: (keyof T)[]) => {
  return args.reduce(
    (acc, cur) => {
      acc[cur] = 1;
      return acc;
    },
    {} as Record<keyof T, 1>,
  );
};
