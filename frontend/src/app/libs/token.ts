let tokenGetter: (() => Promise<string | null>) | null = null;
const tokenSetter = (getter: () => Promise<string | null>) => {
  tokenGetter = getter;
  return tokenSetter;
};

export const get_access_token = () => {
  return tokenGetter;
};
export default tokenSetter;
