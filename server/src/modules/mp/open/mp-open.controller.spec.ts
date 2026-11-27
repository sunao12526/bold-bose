import 'reflect-metadata';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';
import { KEEP_METADATA_KEY } from '../../../shared/decorators/keep.decorator';
import { MpOpenController } from './mp-open.controller';

describe('MpOpenController Metadata', () => {
  it('应该标记 @Public() 以绕过全局 JWT 鉴权守卫', () => {
    const isPublic = Reflect.getMetadata(IS_PUBLIC_KEY, MpOpenController);
    expect(isPublic).toBe(true);
  });

  it('应该标记 @Keep() 以确保响应不被 TransformInterceptor 包装', () => {
    const isKeep = Reflect.getMetadata(KEEP_METADATA_KEY, MpOpenController);
    expect(isKeep).toBe(true);
  });
});
