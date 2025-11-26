import { ShopModel } from '@/models/shop.model'

export type PayLoadJWT = {
  iss: string
  dest: string
  aud: string
  sub: string
  jti: string
  sid: string
  sig: string
  shop: ShopModel
  url: string
}
