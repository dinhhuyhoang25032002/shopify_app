import { ShopDto } from 'src/dto/shop.dto.js'
import { ShopModel } from 'src/models/shop.model'

export const handleUpdateShopInfo = async (shopId: string, body: Partial<ShopDto>): Promise<boolean> => {
  const [affectedRows] = await ShopModel.update(body, {
    where: { shop: shopId }
  })

  return affectedRows > 0
}

export const handleCreateShop = async (body: ShopDto) => {
  console.log('body:', body)

  await ShopModel.upsert({
    ...body,
    status: 1
  })
}

export const deleteShopById = async (shopId: string): Promise<boolean> => {
  const affectedRows = await ShopModel.destroy({
    where: { shop: shopId }
  })

  return affectedRows > 0
}
