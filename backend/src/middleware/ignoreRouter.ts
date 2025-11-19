// middleware/authGuard.ts
import passport from '@/guards/passportJwt'
import Koa from 'koa'

const publicRoutes = ['/api/rules/metafield']

export const authGuard = async (ctx: Koa.Context, next: Koa.Next) => {
  // Nếu route nằm trong danh sách public thì bỏ qua auth
  if (publicRoutes.some((route) => ctx.path.startsWith(route))) {
    return next()
  }

  // Ngược lại, chạy passport
  return passport.authenticate('jwt', { session: false })(ctx, next)
}
