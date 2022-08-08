import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, req) => req.args[2]?.req?.user,
);
